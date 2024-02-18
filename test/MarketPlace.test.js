//IMPORTANE
//Para la resolucion de la practica es necesario utilizar la funcion transferFrom tanto del ERC20 como del ERC721.
//Porque quien va a realizar las llamas de transferencia (transferFrom) va a ser el contrato del MarketPlace
//Por este motivo cuando desarrolleis los test primero teneis que hacer una llamada al metodo approve
//  para autorizar el contrato de MarketPlace a transferir los tokens ERC20 y ERC721.

const { expect } = require("chai");

describe("MarketPlace test suit", function(){
    let deployedERC20Contract, deployedERC721Contract, deployedMyMarketPlaceContract
    let signer, otherAccount

    //test to check the ERC20 deployment
    it("Deploy ERC20 Contract", async function(){
        const ERC20Contract = await ethers.getContractFactory("MyCoin")
        deployedERC20Contract = await ERC20Contract.deploy(5000,2)
        await deployedERC20Contract.waitForDeployment()

        console.log(deployedERC20Contract.target)
    })

    //test to check the ERC721 deployment
    it("Deploy ERC721 Contract", async function(){
        const ERC721Contract = await ethers.getContractFactory("MyNFTCollection")
        deployedERC721Contract = await ERC721Contract.deploy("NewYearsDraw","JRG")
        await deployedERC721Contract.waitForDeployment()

        console.log(deployedERC721Contract.target)
    })

    //test to check the MarketPlace deployment
    it("Deploy MarketPlace Contract", async function(){
        const MyMarketPlaceContract = await ethers.getContractFactory("MyMarketPlace")
        deployedMyMarketPlaceContract = await MyMarketPlaceContract.deploy(deployedERC20Contract.target, deployedERC721Contract.target)
        await deployedMyMarketPlaceContract.waitForDeployment()

        console.log(deployedMyMarketPlaceContract.target)
    })

    //test to check we get correctly the signers
    it("Accounts of this contract", async function(){
        [signer, otherAccount] = await ethers.getSigners()
        console.log(signer.address)
        console.log(otherAccount.address)
    })

    /*FUNCTION TESTS*/

    //test to check the creation of a sale (cration of a sale and calling getSale)
    it("Creating a new sale", async function(){

        //minteamos token 1
        await deployedERC721Contract.connect(signer).mintNewToken()
        await deployedERC721Contract.connect(signer).approve(deployedMyMarketPlaceContract.target, 1) //revisar

        await deployedMyMarketPlaceContract.connect(signer).createSale(1, 10)   //tokenId=1, price=100, but saleId is 0 (first one)
        const saleChecked = await deployedMyMarketPlaceContract.getSale(0)  //funcion getter
        expect (saleChecked[0]).to.equal(signer.address)
        expect (saleChecked[1]).to.equal(0)
        expect (saleChecked[2]).to.equal(1)
        expect (saleChecked[3]).to.equal(10)
        expect (saleChecked[4]).to.equal(0)

        await deployedERC721Contract.connect(signer).mintNewToken()
        await deployedERC721Contract.connect(signer).approve(deployedMyMarketPlaceContract.target, 2)

        // we check another time, to see the increment function also works
        await deployedMyMarketPlaceContract.createSale(2,20)
        const saleChecked2 = await deployedMyMarketPlaceContract.getSale(1)
        expect (saleChecked2[0]).to.equal(signer.address)
        expect (saleChecked2[1]).to.equal(1)
        expect (saleChecked2[2]).to.equal(2)
        expect (saleChecked2[3]).to.equal(20)
        expect (saleChecked2[4]).to.equal(0)
    })

    //test to check a purchase of a NFT, we test also if balances move
    it("Creating a purchase", async function(){

        await deployedERC721Contract.connect(otherAccount).mintNewToken()
       
        await deployedERC721Contract.connect(otherAccount).approve(deployedMyMarketPlaceContract.target, 3)
        await deployedERC20Contract.connect(signer).approve(deployedMyMarketPlaceContract.target, 10)
        //remirar los approve
        await deployedMyMarketPlaceContract.connect(otherAccount).createSale(3, 10)

        const balance = await deployedERC20Contract.getBalance(signer.address)
        expect(balance).to.equal(5000)

        await deployedMyMarketPlaceContract.connect(signer).buySale(2) //idSale

        //we check the balance is 4990 due he payed 1000 for the nft
        const balance2 = await deployedERC20Contract.getBalance(signer.address)
        expect(balance2).to.equal(4990)

        //we check the nft is in his/her wallet
        const nftBalance = await deployedERC721Contract.ownerOfToken(3)
        expect (nftBalance).to.equal(signer)
    })

    it("Test the cancellation", async function(){
        //new sale
        await deployedERC721Contract.connect(signer).mintNewToken();
        await deployedERC721Contract.connect(signer).approve(deployedMyMarketPlaceContract.target, 4);
        await deployedMyMarketPlaceContract.connect(signer).createSale(4, 1); // tokenId=4, price=1, pero saleId es 3
    
        //we check the new sale (3)
        const saleChecked = await deployedMyMarketPlaceContract.getSale(3);
        expect(saleChecked[0]).to.equal(signer.address);
        expect(saleChecked[1]).to.equal(3);
        expect(saleChecked[2]).to.equal(4);
        expect(saleChecked[3]).to.equal(1);
        expect(saleChecked[4]).to.equal(0);
    
        //we cancel the sale
        await deployedMyMarketPlaceContract.connect(signer).cancelSale(3);
    
        //we get the new sale and we expect to be cancelled
        const saleCheckedAfterCancellation = await deployedMyMarketPlaceContract.getSale(3);
        expect(saleCheckedAfterCancellation[4]).to.equal(2);
    });
})