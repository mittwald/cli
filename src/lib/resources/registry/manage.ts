/*
    Helper module to manage project registries.
    Factored out in order to reuse the registry
    setup logic in multiple commands,
    e.g. deploy and registry management commands,
    OR even in other programs, e.g. mStudio extensions
*/

import { spawnSync, execSync } from "child_process";

import {
    MittwaldAPIV2Client,
    assertStatus,
    MittwaldAPIV2,
} from "@mittwald/api-client";

import {
    generatePasswordWithSpecialChars
} from "../../../lib/util/password/generatePasswordWithSpecialChars.js";

import {
    waitUntil
} from "../../../lib/wait.js";

import Duration from "../../../lib/units/Duration.js";

import { RepositoryData } from "../repository/types.js";
import { RegistryData } from "./types.js";


// type shorthands
type Registry = MittwaldAPIV2.Components.Schemas.ContainerRegistry;

// registry service configuration
const MW_REGISTRY_SERVICE_NAME = "project-registry";
const MW_REGISTRY_IMAGE = "mittwald/registry:3";
const MW_REGISTRY_PORTS = ["5000:5000/tcp"];

export async function getProjectRegistry(apiClient: MittwaldAPIV2Client,
                                         projectId: string) {
    /*
        Fetch the registry information for the project using the
        API client. Default registries are identified by URI
    */

    const registriesResp = await apiClient.container.listRegistries(
        { projectId }
    );
    assertStatus(registriesResp, 200);
    const isDefaultRegistry = (r: Registry) => {
        const uri = r.uri || "";
        return (
            uri.includes("docker.io") ||
            uri.includes("ghcr.io") ||
            uri.includes("gitlab.com")
        );
    };
    let registry = registriesResp.data.find(
        r => !isDefaultRegistry(r)
    );

    return registry;
}

export async function createProjectRegistry(apiClient: MittwaldAPIV2Client,
                                            projectId: string,
                                            projectShortId: string,
                                            timeout: Duration) {
    /*
        Create a new registry for the project using the API client.
    */
    let username: string = "";
    let password: string = "";
    let uri: string = "";
    let registryServiceId: string = "";

    username = `user_${Math.random().toString(36).slice(2, 10)}`;
    password = generatePasswordWithSpecialChars();

    const subdomain = `registry.${projectShortId}`;
    uri = `${subdomain}.project.space`;

    const image = MW_REGISTRY_IMAGE;
    const serviceName = MW_REGISTRY_SERVICE_NAME;
    const environment = {
        REGISTRY_USER: username,
        REGISTRY_PASSWORD: password,
    };
    const ports = MW_REGISTRY_PORTS;
    const serviceRequest = {
        image,
        description: "Project private registry",
        environment,
        ports,
    };

    // Add service to stack (projectId is used as stackId)
    const stackId = projectId;
    const updateResp = await apiClient.container.updateStack({
        stackId,
        data: { services: { [serviceName]: serviceRequest } },
    });

    assertStatus(updateResp, 200);

    await waitUntil(async () => {
        try {
            const servicesResp = await apiClient.container.listServices(
                { projectId }
            );
            assertStatus(servicesResp, 200);
            const services = servicesResp.data;

            const regSvc = services.find(
                svc => svc.serviceName === serviceName
            );

            if (!regSvc) {
                return null;
            }

            if (regSvc.status === "running") {
                registryServiceId = regSvc.id;
                return true;
            }
            return null;
        } catch (error) {
            return null;
        }
    }, timeout);

    const ingressResp = await apiClient.domain.ingressCreateIngress({
        data: {
            projectId,
            hostname: uri,
            paths: [
                {
                    path: "/",
                    target: {
                        container: {
                            id: registryServiceId,
                            portProtocol: "5000/tcp",
                        },
                    },
                },
            ],
        },
    });
    assertStatus(ingressResp, 201);

    // XXX: Ingress waiting still flaky. Check!
    // XXX: Plus: Maybe even make this util function?
    const ingressId = ingressResp.data.id;
    await waitUntil(async () => {
        try {
            const statusResp = await apiClient.domain.ingressGetIngress({
                ingressId,
            });

            if (statusResp.status !== 200) {
                return null;
            }

            if (statusResp.data.ips?.v4?.length === 0) {
                return null;
            }

            if ((statusResp.data as any).tls?.isCreated !== true) {
                return null;
            }

            return true;
        } catch (error) {
            return null;
        }
    }, timeout);

    // Wait 2 minutes for DNS propagation and other settling
    // XXX: This whole ingress creation and waiting is a bit
    // of a black box and can be flaky, so adding extra wait
    // time to reduce chances of "registry not found" errors in next steps
    // XXX: Even better: The whole thing is marked in mStudio
    // to be flaky sometimes, too. The recommended time mentioned there
    // is 2 hours! This might be a breaking point in this sequence,
    // so this first step must be hardened to be idempotent, avoiding to
    // create multiple registries/domains in case of retries.
    await new Promise(resolve => setTimeout(resolve, 2 * 60 * 1000));

    const registryCreationPayload = {
        uri: uri,
        description: `Default registry for project ${projectId}`,
        credentials: { username, password },
    };
    const createResp = await apiClient.container.createRegistry({
        projectId,
        data: registryCreationPayload,
    });
    assertStatus(createResp, 201);

    const registry = createResp.data;

    return {
        username,
        password,
        uri,
        registryServiceId,
        registry,
    } as RegistryData;
}

export async function checkProjectRegistry(apiClient: MittwaldAPIV2Client,
                                           projectId: string,
                                           registry: Registry,) {
    /*
        Check existing registry for project. Check ingress and extract
        credentials from environment. Prepare registry usage.
    */

    const servicesResp = await apiClient.container.listServices({
        projectId,
    });
    assertStatus(servicesResp, 200);

    const registryService = servicesResp.data.find(
        svc => svc.serviceName === MW_REGISTRY_SERVICE_NAME
    );

    if (!registryService) {
        throw new Error(
            "Registry service not found. Unable to retrieve credentials."
        );
    }

    const registryServiceId = registryService.id;

    const serviceDetailsResp = await apiClient.container.getService({
        serviceId: registryServiceId,
        stackId: projectId,
    });
    assertStatus(serviceDetailsResp, 200);

    const service = serviceDetailsResp.data;
    const username = service.deployedState?.envs?.REGISTRY_USER ?? "";
    const password = service.deployedState?.envs?.REGISTRY_PASSWORD ?? "";

    if (!username || !password) {
        throw new Error(
            "Registry credentials not found in service environment variables."
        );
    }

    const uri = registry.uri || "";

    const ingressesResp = await apiClient.domain.ingressListIngresses({
        queryParameters: { projectId },
    });
    assertStatus(ingressesResp, 200);

    const registryIngress = ingressesResp.data.find((ingress) => {
        return ingress.paths?.some((path) => {
            const target = path.target as any;
            return (
                target?.container?.id === registryServiceId &&
                target?.container?.portProtocol === "5000/tcp"
            );
        });
    });

    if (!registryIngress) {
        throw new Error(
            "Registry ingress not found. Registry is not exposed via domain."
        );
    }

    return {
        username,
        password,
        uri,
        registryServiceId,
        registry,
    } as RegistryData;
}

export async function setupProjectRegistry(apiClient: MittwaldAPIV2Client,
                                           projectId: string,
                                           projectShortId: string,
                                           timeout: Duration) {
    /*
        Ensure a registry is available for the project.
        If it already exists, return its info.
        If not, create it and return the new info.
    */
    let registryInfo: RegistryData;

    const registry = await getProjectRegistry(apiClient, projectId);

    if (!registry) {
        registryInfo = await createProjectRegistry(
            apiClient,
            projectId,
            projectShortId,
            timeout,
        );
        registryInfo.created = true;
    } else {
        registryInfo = await checkProjectRegistry(
            apiClient,
            projectId,
            registry,
        );
        registryInfo.created = false;
    }

    return registryInfo;
}

export function checkDocker() {
    /*
        Check if Docker is installed and available in the system PATH.
        Throws an error with actionable guidance if Docker is not found.
    */
    try {
        execSync("docker --version", { stdio: "pipe" });
    } catch (error) {
        throw new Error(
            "Docker is not installed or not available in your PATH. " +
            "Please install Docker from https://www.docker.com/products/docker-desktop or " +
            "ensure it is properly installed and available in your system PATH."
        );
    }
}

export async function localDockerBuild(registryData: RegistryData,
                                       repositoryData: RepositoryData) {
    /*
        Build docker image from local reopsitory.
        Later down the line this might be called remotely
    */

    const registryHost = registryData.uri;
    const imageName = `${registryHost}/app-image:latest`;

    const buildResult = spawnSync('docker', [
        'build',
        '-t', imageName,
        '-f', repositoryData.dockerfilePath,
        repositoryData.buildContext,
    ], {
        cwd: repositoryData.buildContext,
        stdio: 'inherit',
    });

    if (buildResult.status !== 0) {
        throw new Error(`Docker build failed with status ${buildResult.status}`);
    }

    const inspectResult = spawnSync('docker', [
        'inspect',
        '--format={{.ID}}',
        imageName,
    ], {
        encoding: 'utf-8',
        stdio: ['pipe', 'pipe', 'pipe'],
    });

    if (inspectResult.status !== 0) {
        throw new Error(`Failed to inspect built image: ${inspectResult.stderr}`);
    }

    const imageId = inspectResult.stdout.trim();
    repositoryData.imageId = imageId;
    repositoryData.imageName = imageName;

    return repositoryData;
}

export async function localDockerPush(repositoryData: RepositoryData,
                                        registryData: RegistryData) {

    // XXX: removing protocoll shouldn't be needed
    const registryHost = registryData.uri.replace(/^https?:\/\//, '');
    const loginResult = spawnSync(
        'docker',
        [
            'login',
            registryHost,
            '-u', registryData.username,
            '-p', registryData.password,
        ],
        {
            stdio: 'inherit',
        }
    );

    if (loginResult.status !== 0) {
        throw new Error(`Docker login failed with status ${loginResult.status}`);
    }

    const pushResult = spawnSync(
        'docker',
        [
            'push',
            repositoryData.imageName!,
        ],
        {
            stdio: 'inherit',
        }
    );

    if (pushResult.status !== 0) {
        throw new Error(`Docker push failed with status ${pushResult.status}`);
    }

    return;
}