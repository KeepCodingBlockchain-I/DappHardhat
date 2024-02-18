let address, provider, signer, contractRead, contractWrite

const connectMetamask = async () => {
    // A Web3Provider wraps a standard Web3 provider, which is
    // what MetaMask injects as window.ethereum into each page
    provider = new ethers.providers.Web3Provider(window.ethereum)

    // MetaMask requires requesting permission to connect users accounts
    await provider.send("eth_requestAccounts", []);

    // The MetaMask plugin also allows signing transactions to
    // send ether and pay to change state within the blockchain.
    // For this, you need the account signer...
    signer = provider.getSigner()

    address = await signer.getAddress()
    
    console.log(address)
}

const getNativeBalance = async () => {
    console.log("")
    console.log("getNativeBalance")
    console.log("")

    const balance = await provider.getBalance(address)
    const formattedBalance = ethers.utils.formatEther(balance)

    console.log(balance)
    console.log(formattedBalance)
}

const getNetwork = async () => {
    console.log("")
    console.log("getNetwork")
    console.log("")

    const network = await provider.getNetwork();

    console.log(network)
}

//Para crear una instancia de un contrato y poder atacarlo son necesarias tres partes
// 1- Provider/Signer, porque necesitamos una conexion con la blockchain
// 2- Contract Address, porque una referencia de donde atacar en la blockchain
// 3- Contract ABI (Application Binary Interface), porque necesitamos lo que puede hacer el contrato

let contractAddress = "0x318e8252efa3fd7729d07adbe75201fa0d761349"  //contrato del MarketPlace

import ContractABI from "../../artifacts/contracts/MarketPlace/MyMarketPlace.sol/MyMarketPlace.json" assert {type: "json"}
const ContractInterface = new ethers.utils.Interface(ContractABI.abi)
const ContractABIFormatted = ContractInterface.format(ethers.utils.FormatTypes.full)

const getMyCoinBalance = async () => {
    contractRead = new ethers.Contract(contractAddress,ContractABIFormatted,provider)
    const balance = await contractRead.getBalance(address)
    console.log(balance)

    const decimals = await contractRead.decimals()
    const formattedBalance = ethers.utils.formatUnits(balance,decimals)

    console.log(formattedBalance)

}

const createSale = async () => {
    contractWrite = new ethers.Contract(contractAddress,ContractABIFormatted,signer)

    await tx.wait()
    console.log(tx)
    alert("Transaccion Realizada Correctamente")
}

const creatingSale = document.getElementById("CreateSale")
creatingSale.addEventListener("click", async () => {
    await createSale()
})

const buyingNFT = async () => {
    contractWrite = new ethers.Contract(contractAddress,ContractABIFormatted,signer)

    await tx.wait()
    console.log(tx)
    alert("Transaccion Realizada Correctamente")
}

const buyNFT = document.getElementById("BuyNFT")
buyNFT.addEventListener("click", async () => {
    await buyingNFT()
})

const metamaskButton = document.getElementById("CreateSale")
metamaskButton.addEventListener("click", async () =>{
    await connectMetamask()
    await getNativeBalance()
    await getNetwork()
    await createSale()
})