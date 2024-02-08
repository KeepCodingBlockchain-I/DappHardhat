const hre = require("hardhat");

let deployedERC20Contract
let contractAddress

async function deploy(){
    console.log("ERC20 deployemet has just started..")
    const ERC20Contract = await ethers.getContractFactory("MyCoin")
    deployedERC20Contract = await ERC20Contract.deploy(5000,2)
    await deployedERC20Contract.waitForDeployment()
    contractAddress = deployedERC20Contract.target
    console.log("...ERC20 constract has been deployed...")

}

async function verify(){}

async function getContractAddress(){}

module.exports = {deploy,verify,getContractAddress}