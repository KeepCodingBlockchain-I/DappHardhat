const { expect } = require("chai");

describe("MarketPlace Test Suite", function(){

    let deployedMarketPlaceContract

    let signer, otherAccount, tokenContractAddress, ownerAddress

    it("Deploy Contract", async function(){
        const marketPlaceContract = await ethers.getContractFactory("MyMarketPlace")
        deployedMarketPlaceContract = await marketPlaceContract.deploy("","")
        await deployedMarketPlaceContract.waitForDeployment()
        console.log(deployedMarketPlaceContract.target)
        const amount = 100
        //Llama al método "approve" en el contrato desplegado para autorizar la direccion
        //tokenContractAddress que pueda hacer transferencias.
        await deployedMarketPlaceContract.approve(tokenContractAddress, amount);
        //Verifica que la aprobación se haya realizado correctamente
        const approvalStatus = await deployedMarketPlaceContract.allowance(
        ownerAddress,
        tokenContractAddress);
        //Verifica que la direccion del contrato marketplace es la direccion autorizada
        expect(approvalStatus).to.equal(tokenContractAddress, "This is not the authorized address to make the transfer");
    });


    it("Get Signers", async function(){
        [signer,otherAccount,tokenContractAddress, ownerAddress] = await ethers.getSigners()
        console.log(signer.address)
        console.log(otherAccount.address)
        console.log(tokenContractAddress.address)
        console.log(ownerAddress.address)
    })

    it("Should allow the owner to create a sale", async function(){
        const tokenId = 1; // ID del token
        const price = 100; // Precio de la venta
        //Comprobar el estado inicial -> llamando a la funcion createSale y creando la venta
        const createSale = await deployedMarketPlaceContract.createSale(tokenId,price)
        //Verifica que la venta se haya creado correctamente y la buscamos en el mapping
        const sale = await deployedMarketPlaceContract.sales(tokenId);
        //Comprobar el estado final  -> si el dueño de la venta es el correcto.
        expect(deployedMarketPlaceContract.Sale.owner).to.equal(await ethers.getSigner().getAddress(), "The owner of the sale is not correct");
        //Comprobar el estado final  -> si el precio de la venta es el correcto.
        expect(deployedMarketPlaceContract.Sale.price).to.equal(price, "The sale price is not correct");
        //Comprobar el estado final  -> si el estatus de la venta es el correcto, debe estar Open pa"El precio de la venta no es correcto"ra crear la venta
        expect(deployedMarketPlaceContract.Sale.status).to.equal("Open"); 
    })

    it("should execute the buySale function correctly", async function () {
        //Crea una venta de prueba
        const saleId = 1; // ID de la venta
        const price = 100; // Precio en MyCoin
        const buyer = await ethers.getSigner(); // Dirección del comprador (este contrato de prueba)
        // Agrega la venta a la structura Sales en el contrato MyMarketPlace
        await deployedMarketPlaceContract.Sale(saleId, price);
        //Realiza la compra
        await deployedMarketPlaceContract.buySale(saleId);
        //Verifica que el estado de la venta sea "Executed"
        expect(await deployedMarketPlaceContract.getSale(saleId)).to.equal("Executed");
        //Verifica que el balance del comprador se haya reducido
        const buyerBalance = await deployedMarketPlaceContract.getBalance(buyer.address);
        expect(buyerBalance).to.be.at.most(0);
    });



}) 