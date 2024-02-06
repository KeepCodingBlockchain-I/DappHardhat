
const ERC20DeploymentScript = require("./ERC20.deploy")

const deploy = async () => {
    await ERC20DeploymentScript.deploy().catch( (error) => {
        console.error(error);
        process.exitCode = 1;
    })
}

deploy()