import { execSync, spawnSync } from "child_process";
import * as fs from "fs";
import * as path from "path";

// Utility to run a command with error checking
function runCmd(cmd: string[], options: {cwd?: string, stdio?: any} = {}) {
    try {
        execSync(cmd.join(' '), {
            cwd: options.cwd,
            stdio: options.stdio || 'inherit',
        });
    } catch (error: any) {
        console.error(`Error: Command '${cmd.join(' ')}' failed.`);
        if (error.stdout) console.error(error.stdout.toString());
        if (error.stderr) console.error(error.stderr.toString());
        process.exit(1);
    }
}

// Clone the git repository
function cloneRepo(gitUrl: string, targetDir: string) {
    if (fs.existsSync(targetDir)) {
        console.error(`Target directory ${targetDir} already exists.`);
        process.exit(1);
    }
    console.log(`Cloning repository ${gitUrl} into ${targetDir} ...`);
    runCmd(['git', 'clone', gitUrl, targetDir]);
}

// Create a basic Dockerfile if not exists
function createDockerfile(targetDir: string) {
    const dockerfilePath = path.join(targetDir, 'Dockerfile');
    if (fs.existsSync(dockerfilePath)) {
        console.log(`Dockerfile already exists at ${dockerfilePath}, not overwriting.`);
        return;
    }
    const content = `FROM nginx:alpine
COPY . /usr/share/nginx/html
`;
    fs.writeFileSync(dockerfilePath, content);
    console.log(`Created Dockerfile at ${dockerfilePath}`);
}

// Build the docker image
function buildDockerImage(targetDir: string, imageTag: string) {
    console.log(`Building docker image with tag '${imageTag}'...`);
    runCmd(['docker', 'build', '-t', imageTag, '.'], { cwd: targetDir });
}

// Run the docker container
function runDockerContainer(imageTag: string, port: number) {
    console.log("Running docker container...");
    runCmd([
        'docker', 'run', '-d',
        '-p', `${port}:80`,
        '--name', `${imageTag.replace(/[^a-zA-Z0-9_.-]/g, "")}_container`,
        imageTag
    ]);
    console.log(`Docker container running and serving on http://localhost:${port}`);
}
