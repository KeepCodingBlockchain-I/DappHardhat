//IMPORTANE
//Para la resolucion de la practica es necesario utilizar la funcion transferFrom tanto del ERC20 como del ERC721.
//Porque quien va a realizar las llamas de transferencia (transferFrom) va a ser el contrato del MarketPlace
//Por este motivo cuando desarrolleis los test primero teneis que hacer una llamada al metodo approve
//  para autorizar el contrato de MarketPlace a transferir los tokens ERC20 y ERC721.

const { expect } = require("chai");

describe("MarketPlace test suit", function(){
    let deployedERC20Contract, deployedERC721Contract, deployedMyMarketPlaceContract
    let signer, otherAccount

    it("Deploy ERC20 Contract", async function(){
        const ERC20Contract = await ethers.getContractFactory("MyCoin")
        deployedERC20Contract = await ERC20Contract.deploy(5000,2)
        await deployedERC20Contract.waitForDeployment()

        console.log(deployedERC20Contract.target)
    })

    it("Deploy ERC721 Contract", async function(){
        const ERC721Contract = await ethers.getContractFactory("MyNFTCollection")
        deployedERC721Contract = await ERC721Contract.deploy("NewYearsDraw","JRG")
        await deployedERC721Contract.waitForDeployment()

        console.log(deployedERC721Contract.target)
    })

    it("Deploy MarketPlace Contract", async function(){
        const MyMarketPlaceContract = await ethers.getContractFactory("MyMarketPlace")
        deployedMyMarketPlaceContract = await MyMarketPlaceContract.deploy(deployedERC20Contract.target, deployedERC721Contract.target)
        await deployedMyMarketPlaceContract.waitForDeployment()

        console.log(deployedMyMarketPlaceContract.target)
    })

    it("Accounts of this contract", async function(){
        [signer, otherAccount] = ethers.getSigners()
        console.log(signer.address)
        console.log(otherAccount.address)
    })

    
})