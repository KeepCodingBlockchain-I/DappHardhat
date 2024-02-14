const { expect } = require("chai");

describe("MarketPlace Test Suite", function(){

    let deployedMarketPlaceContract

    let signer, otherAccount

    it("Deploy Contract", async function(){
        const marketPlaceContract = await ethers.getContractFactory("MyMarketPlace")
        deployedMarketPlaceContract = await marketPlaceContract.deploy("","")
        await deployedMarketPlaceContract.waitForDeployment()
        console.log(deployedMarketPlaceContract.target)
    })

    it("Get Signers", async function(){
        [signer,otherAccount] = await ethers.getSigners()
        console.log(signer.address)
        console.log(otherAccount.address)
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
        expect(deployedMarketPlaceContract.Sale.status).to.equal(true, "The status of the sale is not correct"); 
    })

}) 