const hre = require("hardhat");

let deployedERC721Contract
let contractAddress

async function deploy(){
    console.log("ERC721 deployment has just started...")

    const ERC721Contract = await ethers.getContractFactory("MyNFTCollection")
    deployedERC721Contract = await ERC721Contract.deploy("NewYearsDraw","JRJ")
    await deployedERC721Contract.waitForDeployment()
    contractAddress = deployedERC721Contract.target
    
    console.log("...ERC20 constract has been deployed to: " + contractAddress)
}

async function verify(){}

async function getContractAddress(){
    return contractAddress
}

module.exports = {deploy,verify,getContractAddress}