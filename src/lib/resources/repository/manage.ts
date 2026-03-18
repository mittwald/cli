/*
    Helper module to manage project repositories.
    Factored out in order to reuse the repository 
    setup logic in multiple commands,
    e.g. deploy and repository management commands,
    OR even in other programs, e.g. mStudio extensions
*/

import path from "path";
import { pathExists } from "../../../lib/util/fs/pathExists.js";
import fs from "fs/promises";
import { execSync } from "child_process";

// assmuning a very simple static page if no dockerfile is
// present, later this will become more complex, e.g. with buildpacks
const MW_DEFAULT_DOCKERFILE_CONTENT = `FROM nginx:alpine
COPY . /usr/share/nginx/html/
`;

async function runRailpack(projectRoot: string): Promise<string | null> {
    try {
        execSync('railpack prepare . --plan-out railpack-plan.json --info-out railpack-info.json', {
            cwd: projectRoot,
            stdio: 'pipe',
        });
        const planPath = path.join(projectRoot, 'railpack-plan.json');
        if (await pathExists(planPath)) {
            return planPath;
        }
    } catch {
        // railpack failed or not installed, will fall back to default Dockerfile
    }
    return null;
}

function extractPortsFromDockerfile(dockerfileContent: string): string[] {
    const portMappings: string[] = [];
    const containerPorts: Set<number> = new Set();
    const lines = dockerfileContent.split('\n');

    for (const line of lines) {
        const match = line.match(/^\s*EXPOSE\s+(.+)$/i);
        if (match) {
        const portSpec = match[1].trim();
        // Handle multiple ports on one line (e.g., "80 443")
        const portList = portSpec.split(/\s+/);
        for (const port of portList) {
            if (port) {
            // Extract just the port number (remove /udp if present)
            const portNum = parseInt(port.split('/')[0], 10);
            if (!isNaN(portNum) && !containerPorts.has(portNum)) {
                containerPorts.add(portNum);
            }
            }
        }
        }
    }

    // Convert container ports to host:container mappings
    // XXX: This is 1:1 mapping for now
    containerPorts.forEach(containerPort => {
        const protocol = '/tcp';
        let hostPort = containerPort;
        portMappings.push(`${hostPort}:${containerPort}${protocol}`);
    });

    return portMappings;
}

export async function checkRepository() {
    /*
        Check repository expected in current folder context.
    */
    const projectRoot = process.cwd();
    const dockerfilePath = path.join(projectRoot, "Dockerfile");
    let dockerfileContent: string;
    let dockerfileCreated = false;
    let railpackPlanPath: string | null = null;

    // 1. Check if Dockerfile exists
    if (await pathExists(dockerfilePath)) {
        // 1.1 Dockerfile is present, read it and skip railpack
        dockerfileContent = await fs.readFile(dockerfilePath, "utf-8");
    } else {
        // 1.2 No Dockerfile, try railpack for analysis
        railpackPlanPath = await runRailpack(projectRoot);

        // 1.3 Only create default Dockerfile if railpack failed
        if (railpackPlanPath === null) {
            dockerfileContent = MW_DEFAULT_DOCKERFILE_CONTENT;
            await fs.writeFile(dockerfilePath, dockerfileContent, "utf-8");
            dockerfileCreated = true;
        } else {
            // railpack succeeded, don't create default Dockerfile
            dockerfileContent = "";
        }
    }

    // Extract ports from the Dockerfile and create proper host:container mappings
    // If we created the default Dockerfile, we know it exposes port 80
    const ports = extractPortsFromDockerfile(dockerfileContent);
    if (ports.length === 0) {
        ports.push("80:80/tcp");
    }

    const repositoryData = {
        dockerfilePath,
        dockerfileContent,
        dockerfileCreated,
        buildContext: projectRoot,
        ports,
        railpackPlanPath,
    };
    return repositoryData;
}