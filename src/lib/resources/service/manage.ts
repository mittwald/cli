/*
    Helper module to manage project services,
    mostly spin up services from give image and meta data
*/

import { RepositoryData } from "../repository/types.js";

import {
    MittwaldAPIV2Client,
    assertStatus,
} from "@mittwald/api-client";

import {
    waitUntil
} from "../../../lib/wait.js";

import Duration from "../../../lib/units/Duration.js";

import { DeployRes } from "./types.js";


export async function deployService(apiClient: MittwaldAPIV2Client,
                                    projectId: string,
                                    repositoryData: RepositoryData,
                                    timeout: Duration) {

    let existing: boolean = false;
    const serviceName = `app-${projectId}`;
    const servicesResp = await apiClient.container.listServices({
        projectId,
    });
    assertStatus(servicesResp, 200);

    const appService = servicesResp.data.find(
        svc => svc.serviceName === serviceName
    );

    if (appService) {
        existing = true;
    }

    const stackId = projectId;
    let deployedServiceId: string = "";

    const serviceRequest = {
        image: repositoryData.imageName!,
        description: "Deployed application",
        ports: repositoryData.ports,
    };

    const updateResp = await apiClient.container.updateStack({
        stackId,
        data: {
            services: {
                [serviceName]: serviceRequest
            }
        },
    });
    assertStatus(updateResp, 200);

    const services = updateResp.data.services;
    if (!services) {
        throw new Error("Failed to update services");
    }

    const service = services.find(svc => svc.serviceName === serviceName);
    if (!service) {
        throw new Error("Failed to deploy service: Service not found in response");
    }

    const serviceId = service.id;
    if (existing) {
        const recreateResp = await apiClient.container.recreateService({
            stackId,
            serviceId,
        });
        assertStatus(recreateResp, 204);
    }

    await waitUntil(async () => {
        try {
            const servicesResp = await apiClient.container.listServices({
                projectId,
            });
            assertStatus(servicesResp, 200);
            const services = servicesResp.data;

            const deployedSvc = services.find(
                svc => svc.serviceName === serviceName
            );

            if (!deployedSvc) {
                return null;
            }

            if (deployedSvc.status === "running") {
                deployedServiceId = deployedSvc.id;
                return true;
            }
            return null;
        } catch (error) {
            return null;
        }
    }, timeout);

    return {
        deployedServiceId,
        serviceName,
    } as DeployRes;
}
