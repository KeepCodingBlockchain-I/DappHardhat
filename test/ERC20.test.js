const { expect } = require("chai");

describe("ERC20 Test Suite", function(){

    let deployedERC20Contract

    let signer, otherAccount

    it("Deploy Contract", async function(){
        const ERC20Contract = await ethers.getContractFactory("MyCoin")
        deployedERC20Contract = await ERC20Contract.deploy(5000,2)
        await deployedERC20Contract.waitForDeployment()
        console.log(deployedERC20Contract.target)
    })

    it("Get Signers", async function(){
        [signer,otherAccount] = await ethers.getSigners()  //treure wallets
        console.log(signer.address)
        console.log(otherAccount.address)
    })

    it("Check balance", async function(){
        const balance = await deployedERC20Contract.getBalance(signer.address)
        expect(balance).to.equal(5000)  //esperamos que sea 5000

        const balance2 = await deployedERC20Contract.getBalance(otherAccount.address)
        expect(balance2).to.equal(0)
    })

    it("Check transfer", async function(){
        const result = await deployedERC20Contract.doTransfer(otherAccount.address,3000)
        console.log(result)

        const balance = await deployedERC20Contract.getBalance(signer.address)
        expect(balance).to.equal(2000)

        const balance2 = await deployedERC20Contract.getBalance(otherAccount.address)
        expect(balance2).to.equal(3000)
    })

    it("Check mint", async function(){
        //Testeamos balance inicial
        //Testeamos que ha sucedido el mint
        //Testeamos que "reciver" ha recibido los tokens

        const balancePrevio = await deployedERC20Contract.getBalance(otherAccount.address)
        expect(balancePrevio).to.equal(3000)

        await deployedERC20Contract.mintNewTokens(10000,otherAccount.address)
    
        const balanceFinal = await deployedERC20Contract.getBalance(otherAccount.address)
        expect(balanceFinal).to.equal(13000)
    })
})