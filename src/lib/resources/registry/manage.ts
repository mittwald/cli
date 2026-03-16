import {
    MittwaldAPIV2Client,
    assertStatus,
    MittwaldAPIV2,
} from "@mittwald/api-client";

import {
    generatePasswordWithSpecialChars
} from "../../../lib/util/password/generatePasswordWithSpecialChars.js";

import {
    waitFlags,
    waitUntil
} from "../../../lib/wait.js";

import Duration from "../../../lib/units/Duration.js";

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

    // 2. Generate random credentials
    username = `user_${Math.random().toString(36).slice(2, 10)}`;
    password = generatePasswordWithSpecialChars();

    // 3. Build registry URL: registry.p-XXXXXX.project.space
    const subdomain = `registry.${projectShortId}`;
    uri = `${subdomain}.project.space`;

    // 4. Create the registry container (service)
    const image = MW_REGISTRY_IMAGE;
    const serviceName = MW_REGISTRY_SERVICE_NAME;
    const environment = {
        REGISTRY_USER: username,
        REGISTRY_PASSWORD: password,
    };
    // Expose port 5000 (default for registry)
    const ports = MW_REGISTRY_PORTS;
    // Compose service request
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

    // 5. Wait for container to be running
    await waitUntil(async () => {
        try {
            const servicesResp = await apiClient.container.listServices(
                { projectId }
            );
            assertStatus(servicesResp, 200);
            const services = servicesResp.data;

            const regSvc = services.find(svc => svc.serviceName === serviceName);

            if (!regSvc) {
                // p.addInfo(`[DEBUG] Service '${serviceName}' not found yet. Available: ${services.map(s => s.serviceName).join(', ')}`);
                return null;
            }

            // p.addInfo(`[DEBUG] Service '${serviceName}' found with status: ${regSvc.status}`);

            if (regSvc.status === "running") {
                registryServiceId = regSvc.id;
                return true;
            }
            return null;
        } catch (error) {
            // p.addInfo(`[DEBUG] Error polling service status: ${error instanceof Error ? error.message : String(error)}`);
            return null;
        }
    }, timeout);

    // p.addInfo("Registry container is now running.");

    // 6. Create an ingress (virtual host) to expose the registry via domain
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
    // p.addInfo(`Created ingress for registry at ${uri}`);

    // 6.1 Wait for ingress to be ready (IPs assigned, TLS created)
    const ingressId = ingressResp.data.id;
    await waitUntil(async () => {
        try {
            const statusResp = await apiClient.domain.ingressGetIngress({
                ingressId,
            });

            if (statusResp.status !== 200) {
                // p.addInfo(`[DEBUG] Ingress status: ${statusResp.status}`);
                return null;
            }

            if (statusResp.data.ips?.v4?.length === 0) {
                // p.addInfo(`[DEBUG] Waiting for IPv4 assignment to ingress`);
                return null;
            }

            //if (statusResp.data.tls?.isCreated !== true) {
            if ((statusResp.data as any).tls?.isCreated !== true) {
                // p.addInfo(`[DEBUG] Waiting for TLS to be created for ingress`);
                return null;
            }

            return true;
        } catch (error) {
            // p.addInfo(`[DEBUG] Error polling ingress status: ${error instanceof Error ? error.message : String(error)}`);
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
    // p.addInfo(`[DEBUG] Waiting 2 minutes for DNS propagation...`);
    await new Promise(resolve => setTimeout(resolve, 2 * 60 * 1000));

    // p.addInfo(`Ingress is now ready with assigned IPs, bells and whistles`);

    // 7. Register the registry entry
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
    }
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

    // Check if an ingress exists for the registry service
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
    }
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
    let registryInfo;
    let created = false;

    const registry = await getProjectRegistry(apiClient, projectId);

    if (!registry) {
        registryInfo = await createProjectRegistry(
            apiClient,
            projectId,
            projectShortId,
            timeout,
        );
        created = true;
        // p.addInfo(`Created new registry at ${registryInfo.uri}`);
    } else {
        registryInfo = await checkProjectRegistry(
            apiClient,
            projectId,
            registry,
        );
        // p.addInfo(`Found existing registry at ${registryInfo.uri}`);
    }

    return {
        ...registryInfo,
        created,
    }
}