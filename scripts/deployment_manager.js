
const ERC20DeployScript = require("./ERC20.deploy")
const ERC721DeployScript = require("./ERC721.deploy")
//const MPDeployScript = require("./MarketPlace.deploy")

const main = async () => {
    await ERC20DeployScript.deploy()
    await ERC721DeployScript.deploy()
    //await MPDeployScript.deploy()
}

main()
