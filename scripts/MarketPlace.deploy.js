const hre = require("hardhat");

let deployedERC20Contract, deployedERC721Contract, deployedMyMarketPlaceContract
let contractAddress

async function deploy(deployedERC20Contract, deployedERC721Contract){
    console.log("MyMarketPlace deployment just started...")

    const MyMarketPlaceContract = await ethers.getContractFactory("MyMarketPlace")
    deployedMyMarketPlaceContract = await MyMarketPlaceContract.deploy(deployedERC20Contract, deployedERC721Contract) 
    await deployedMyMarketPlaceContract.waitForDeployment()
    contractAddress = deployedMyMarketPlaceContract.target

    console.log("...MyMarketPlace contract has been deployed to: " + contractAddress)
    console.log(contractAddress.address)
}

async function verify(){}

async function getContractAddress(){
    return contractAddress
}

module.exports = {deploy,verify,getContractAddress}