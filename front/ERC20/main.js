let address, provider ,signer, contractRead, contractWrite

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

//Para crear una instancia de un contrato y poder atacarlo son necesarias 3 partes:
// 1- Provider/Signer, porque necesitamos una conexion con la blockchain 
// 2- Contract Address , porque una referencia de donde atacar en la blockchain
// 3- Contract ABI (Application Binary Interface), porque necesitamos lo que puede hacer el contrato

let contractAddress = "0xACAb9b7c0BCcaDbE0240D2bEECd84Ecb43BCa214"

import ContractABI from "../../artifacts/contracts/ERC20/MyCoin.sol/MyCoin.json" assert {type: "json"}
const ContractInterface = new ethers.utils.Interface(ContractABI.abi)
const ContractABIFromatted = ContractInterface.format(ethers.utils.FormatTypes.full)

const getMyCoinBalance = async () => {

    console.log("")
    console.log("getMyCoinBalance")
    console.log("")

    contractRead = new ethers.Contract(contractAddress,ContractABIFromatted,provider)
    const balance = await contractRead.getBalance(address)
    console.log(balance)

    const decimals = await contractRead.decimals()
    const formatedBalance = ethers.utils.formatUnits(balance,decimals)
    console.log(formatedBalance)

}

const transferMyCoin = async () => {

    contractWrite = new ethers.Contract(contractAddress,ContractABIFromatted,signer)
    const decimals = await contractWrite.decimals()
    const amount = ethers.utils.parseUnits("5.0",decimals)
    const tx = await contractWrite.doTransfer(
        "0x2ee70D53E8D5C9b28e7997639B510DF95382b1c6", 
        amount
    )
    
    await tx.wait()
    console.log(tx)
    alert("Transaccion Realizada Correctamente")
}

const transferMycoin = document.getElementById("transferMycoin")
transferMycoin.addEventListener("click", async () => {
    await transferMyCoin()
})


const metamaskButton = document.getElementById("metamaskButton")
metamaskButton.addEventListener("click", async () =>{
    console.log("Hola, soy el boton Connect Metamask y esta es tu address:")
    await connectMetamask()
    await getNativeBalance()
    await getNetwork()
    await getMyCoinBalance()
})