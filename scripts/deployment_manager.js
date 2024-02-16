
const ERC20DeployScript = require("./ERC20.deploy")
const ERC721DeployScript = require("./ERC721.deploy")
const MPDeployScript = require("./MarketPlace.deploy")

const main = async () => {

    await ERC20DeployScript.deploy()
    const MyCoinContractAddress = ERC20DeployScript.getContractAddress()

    await ERC721DeployScript.deploy()
    const MyNFTContractAdress = ERC721DeployScript.getContractAddress()

    await MPDeployScript.deploy(MyCoinContractAddress, MyNFTContractAdress)
}

main()
