const hre = require("hardhat");

let deployedERC20Contract
let contractAddress

async function deploy(){
    console.log("ERC20 deployment has just started...")

    const ERC20contract = await ethers.getContractFactory("MyCoin")
    deployedERC20Contract = await ERC20contract.deploy(5000,2)
    await deployedERC20Contract.waitForDeployment()
    contractAddress = deployedERC20Contract.target
    
    console.log("...ERC20 contract has been deployed: " + contractAddress)
}

async function verify(){}

async function getContractAddress(){
    return contractAddress
}
    
module.exports = {deploy,verify,getContractAddress}