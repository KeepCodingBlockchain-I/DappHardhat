// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

//Imports
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IMyCoin} from "../ERC20/IMyCoin.sol";
import {IMyNFTCollection} from "../ERC721/IMyNFTCollection.sol";
//importamos la interfaz de los dos otros contratos

/**
 * @title 
 * @author 
 * @notice 
 * @notice 
 * @dev 
 */
contract MyMarketPlace is Ownable{

    /**
     * -----------------------------------------------------------------------------------------------------
     *                                      ATRIBUTOS
     * -----------------------------------------------------------------------------------------------------
     */

    //Referencia al contrato MyCoin
    IMyCoin MyCoinContract;
    //Referencia al contrato MyNFTCollection
    IMyNFTCollection MyNFTCollectionContract;

    //Contador para los id de las Sales
    uint256 public saleIdCounter = 0;

    //Estados posibles de una venta
    //https://docs.soliditylang.org/en/v0.8.19/types.html#enums
    enum SaleStatus {
        //Cuando se crea una venta el estado es Open
        Open,
        //Cuando se compra una venta el estado es Executed
        Executed,
        //Cuando se cancela una venta el estado es Cancelled
        Cancelled
    }

    //Contiene toda la informacion de una venta
    struct Sale{
        //Propietario del token y de la venta
        address owner;
        //ID de la venta
        uint256 saleId;
        //Id del token ERC721 (NFT)
        uint256 tokenId;
        //Cantidad de tokens ERC20 que tiene que pagar el comprador
        uint256 price;
        //Estado de la venta
        SaleStatus status;
    }

    //Relaciona el id de la venta con el objeto Sale que contiene la informacion
    mapping(uint256 => Sale) public sales;



    /**
     * -----------------------------------------------------------------------------------------------------
     *                                      CONSTRUCTOR
     * -----------------------------------------------------------------------------------------------------
     */

    /**
     * Inicializa las referencias a los contratos. 
     * @dev Se pasan por parametro en la funcion deploy.
     * @param _ERC20Address address del contrato ERC20.
     * @param _ERC721Address address del contrato ERC721
     */
    constructor(address _ERC20Address, address _ERC721Address){
        MyCoinContract = IMyCoin(_ERC20Address);
        MyNFTCollectionContract = IMyNFTCollection(_ERC721Address);
    }

    /**
     * -----------------------------------------------------------------------------------------------------
     *                                      ERRORS
     * -----------------------------------------------------------------------------------------------------
     */

    //error StatusOff()
    //error PriceToHigh()
    //error 

    /**
     * Los errores son lanzados mediante la instruccion revert, normalmente despues de comprobar una condicion.
     * El nombre del error explica cual es el motivo por el se ha revertido la transaccion. 
     * Para mas informacion, buscar la condicion en la que se lanza el error.
     */

    /**
     * -----------------------------------------------------------------------------------------------------
     *                                      MODIFIERS
     * -----------------------------------------------------------------------------------------------------
     */

    /**
     * -----------------------------------------------------------------------------------------------------
     *                                      EVENTS
     * -----------------------------------------------------------------------------------------------------
     */

    /**
     * -----------------------------------------------------------------------------------------------------
     *                                      FUNCIONES
     * -----------------------------------------------------------------------------------------------------
     */

    /**
     * Incrementa el valor del contador de id de ventas.
     * Es necesario llamarlo justo antes de crear una venta nueva para obtener el id de la venta.
     * Tomad como ejemplo de uso MyNFTCollection.
     */
    function incrementCounter() internal returns(uint256){
        saleIdCounter++;
        return saleIdCounter;
    }

    //IMPORTANE
    //Para la resolucion de la practica es necesario utilizar la funcion transferFrom tanto del ERC20 como del ERC721.
    //Porque quien va a realizar las llamadas de transferencia (transferFrom) va a ser el contrato del MarketPlace
    
    function createSale(uint256 _tokenId, uint256 _price) public /*onlyOwner()*/{
        
        Sale memory newSale = Sale({
            owner: msg.sender,
            saleId: saleIdCounter,
            tokenId: _tokenId,
            price: _price,
            status: SaleStatus.Open
        });   //es correcto así?
        
        sales[saleIdCounter] = newSale; //variable que contiene la info del mapping con el id de esta venta
        //actualizamos el struct Sale
    
       require(newSale.status == SaleStatus.Open, "Sale is currently not open");

        //llamamos funcion transferFrom del contrato NFT
        MyNFTCollectionContract.transferFrom(msg.sender, address(this), _tokenId);
        incrementCounter(); //incrementamos el contador de ventas
    }

    function buySale(uint256 _saleId) public {

        Sale storage
        //revisar logica
        sale = sales[_saleId];

        require(MyCoinContract.balanceOf(msg.sender) >= sale.price, "You don't have enought tokens");
        require(sale.status == SaleStatus.Open, "Sale is currently not open");

        MyNFTCollectionContract.transferFrom(address(this), msg.sender, sale.tokenId);   
        MyCoinContract.transferFrom(msg.sender, sale.owner, sale.price);

        SaleStatus status;
        status = SaleStatus.Executed;
    }

    function cancelSale(uint256 _saleId) public {

        Sale storage sale = sales[_saleId];

        require(sale.status == SaleStatus.Open, "This sale is already cancelled");

        //we update to "Cancelled"
        sale.status = SaleStatus.Cancelled;

        //Transfer back the NFT
        MyNFTCollectionContract.transferFrom(address(this), sale.owner, sale.tokenId);
    }

    function getSale(uint256 _saleId) public view returns(Sale memory){

        Sale memory
        sale = sales[_saleId];

        require(_saleId >= 0, "IDs cant be negatives");
        require(sale.saleId == _saleId, "Id not found");  

        return sale;
    }                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  
}