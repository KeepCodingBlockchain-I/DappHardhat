const connectMetamask = async () => {
    // Un Web3Provider envuelve un proveedor Web3 estándar, que es
 // lo que MetaMask inyecta como window.ethereum en cada página
 const provider = new ethers.providers.Web3Provider(window.ethereum)

 // MetaMask requiere solicitar permiso para conectar las cuentas de los usuarios
 await provider.send("eth_requestAccounts", []);

// El complemento MetaMask también permite firmar transacciones para
 // enviar ether y pagar para cambiar el estado dentro de la cadena de bloques.
// Para esto, necesita el firmante de la cuenta...
 const signer = provider.getSigner()

 const address = await signer.getAddress()

 console.log(address)

}

const metamaskButton = document.getElementById("metamaskButton")
metamaskButton.addEventListener("click", async () => {
    console.log("Hola, soy el boton connect Metamask y esta es tu address:")
    await connectMetamask()
})