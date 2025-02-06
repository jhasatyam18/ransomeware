const { Client } = require('ssh2');
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const { exec } = require('child_process');

// List of remote hosts (Update this with your actual hosts and ports)
const remoteHosts = [
    { host: '13.234.29.82', port: 22 },
    { host: '198.244.129.76', port: 2023 },
    // Add more hosts as needed
];

const remoteUser = 'dmadmin';
const remotePassword = ''; // Consider using SSH keys instead
const remoteZipPath = `/home/dmadmin/build.zip`;
const remoteExtractPath = `/opt/dmservice/public`;

const localBuildDir = path.join(__dirname, 'build');
const localZipPath = path.join(__dirname, 'build.zip');

// Function to zip the build folder
function createZip() {
    return new Promise((resolve, reject) => {
        const output = fs.createWriteStream(localZipPath);
        const archive = archiver('zip', { zlib: { level: 9 } });

        output.on('close', () => {
            console.log(`✔ Zip created: ${localZipPath} (${archive.pointer()} bytes)`);
            resolve();
        });

        archive.on('error', (err) => reject(err));

        archive.pipe(output);
        archive.directory(localBuildDir, false);
        archive.finalize();
    });
}

// Function to copy zip file to a remote host
function copyZipToRemote(remoteHost, port) {
    return new Promise((resolve, reject) => {
        exec(`scp -P ${port} ${localZipPath} ${remoteUser}@${remoteHost}:${remoteZipPath}`, (err, stdout, stderr) => {
            if (err) {
                console.error(`❌ Error copying file to ${remoteHost}: ${stderr}`);
                reject(err);
            } else {
                console.log(`✔ File copied to ${remoteUser}@${remoteHost}:${remoteZipPath}`);
                resolve();
            }
        });
    });
}

// Function to execute remote commands as root
function executeRemoteCommands(remoteHost, port) {
    return new Promise((resolve, reject) => {
        const conn = new Client();
        conn
            .on('ready', () => {
                console.log(`✔ SSH Connection established to ${remoteHost}`);

                // Run commands with sudo
                const remoteCommands = `
                    sudo -i <<EOF
                    cd ${remoteExtractPath}
                    rm -rf *
                    mv ${remoteZipPath} .
                    unzip build.zip
                    rm build.zip
                    EOF
                `;

                conn.exec(remoteCommands, (err, stream) => {
                    if (err) reject(err);
                    stream
                        .on('close', (code, signal) => {
                            console.log(`✔ Deployment complete on ${remoteHost}`);
                            conn.end();
                            resolve();
                        })
                        .on('data', (data) => console.log(`STDOUT (${remoteHost}): ${data}`))
                        .stderr.on('data', (data) => console.error(`STDERR (${remoteHost}): ${data}`));
                });
            })
            .connect({
                host: remoteHost,
                port: port,
                username: remoteUser,
                password: remotePassword, // Prefer SSH keys instead
            });
    });
}

// Function to deploy on multiple hosts
async function deployToHosts() {
    try {
        console.log('📁 Creating ZIP...');
        await createZip();

        for (const { host, port } of remoteHosts) {
            console.log(`🚀 Copying ZIP to ${host}...`);
            await copyZipToRemote(host, port);
            
            console.log(`🔧 Executing remote commands on ${host}...`);
            await executeRemoteCommands(host, port);
        }

        console.log('✅ Deployment completed successfully on all hosts!');
    } catch (error) {
        console.error('❌ Deployment failed:', error);
    }
}

// Run the deployment process
deployToHosts();
