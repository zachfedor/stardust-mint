// // import { useEffect, useState } from "react";
// // // import { networkParams } from "./networks";
// // import { toHex, truncateAddress } from "../utils/format.js";
// // import { ethers } from "ethers";
// // import Web3Modal from "web3modal";
// // import { providerOptions, networkParams } from "../utils/web3Wallet.js";


// import Web3Modal from "web3modal";
// import CoinbaseWalletSDK from "@coinbase/wallet-sdk";
// import WalletConnect from "@walletconnect/web3-provider";
// import { useRef, useEffect, useState } from "react";
// import { providers } from "ethers";

// export default function NavBar() {
//   const [connectedWallet, setConnectedWallet] = useState(false);
//   const web3ModalRef = useRef(); // return the object with key named current

//   // providers and signer  =>
//   // providers is used for to get data from sc
//   // signer is used for to sign data / set the data to sc

//   const getSignerOrProvider = async (needSigner = false) => {
//     const provider = await web3ModalRef.current.connect();
//     const web3Provider = new providers.Web3Provider(provider);
//     const { chainId } = await web3Provider.getNetwork();
//     if (chainId !== 4) {
//       alert("USE RINKEBY NETWORK");
//       throw new Error("Change network to Rinkeby");
//     }
//     if (needSigner) {
//       const signer = web3Provider.getSigner();
//       return signer;
//     }
//     return provider;
//   };

//   const connectWallet = async () => {
//     try {
//       await getSignerOrProvider();
//       setConnectedWallet(true);
//     } catch (error) {
//       console.log(" error", error);
//     }
//   };
  
//   const disconnect = async () => {
//     await web3Modal.clearCachedProvider();
//     refreshState();
//   };

//   useEffect(() => {
//     web3ModalRef.current = new Web3Modal({
//       network: "rinkeby",
//       providerOptions: {
//         coinbasewallet: {
//           package: CoinbaseWalletSDK, 
//           options: {
//             appName: "Web 3 Modal Demo",
//             infuraId: process.env.NEXT_PUBLIC_INFURA_KEY 
//           }
//         },
//         walletconnect: {
//           package: WalletConnect, 
//           options: {
//             infuraId: process.env.NEXT_PUBLIC_INFURA_KEY 
//           } 
//         }
//       },
//     });
//   }, []);

//   return (
//     <>
//       <div className="text-center mt-8">
//         <div>
//            {!connectedWallet ? (
//             <button onClick={connectWallet}>Connect Wallet</button>
//           ) : (
//             <button onClick={disconnect}>Disconnect</button>
//           )}
//         </div>
//       </div>
//     </>
//   );
// }



// // const web3Modal = new Web3Modal({
// //   //   network: "mainnet", // optional
// //   //   cacheProvider: true, // optional
// //   //   providerOptions // required
  
// //     network: "rinkeby", // optional
// //     cacheProvider: true, // optional
// //     providerOptions // required
// //   });
  
// //   const instance = await web3Modal.connect();
  
// //   const provider = new ethers.providers.Web3Provider(instance);
// //   const signer = provider.getSigner();

// // export default function NavBar() {
// //   const [provider, setProvider] = useState();
// //   const [library, setLibrary] = useState();
// //   const [account, setAccount] = useState();
// //   const [signature, setSignature] = useState("");
// //   const [error, setError] = useState("");
// //   const [chainId, setChainId] = useState();
// //   const [network, setNetwork] = useState();
// //   const [message, setMessage] = useState("");
// //   const [signedMessage, setSignedMessage] = useState("");
// //   const [verified, setVerified] = useState();
  

// //   const connectWallet = async () => {
// //     try {
// //       const provider = await web3Modal.connect();
// //       const library = new ethers.providers.Web3Provider(provider);
// //       const accounts = await library.listAccounts();
// //       const network = await library.getNetwork();
// //       setProvider(provider);
// //       setLibrary(library);
// //       if (accounts) setAccount(accounts[0]);
// //       setChainId(network.chainId);
// //     } catch (error) {
// //       setError(error);
// //     }
// //   };

// //   const handleNetwork = (e) => {
// //     const id = e.target.value;
// //     setNetwork(Number(id));
// //   };

// //   const handleInput = (e) => {
// //     const msg = e.target.value;
// //     setMessage(msg);
// //   };

// //   const switchNetwork = async () => {
// //     try {
// //       await library.provider.request({
// //         method: "wallet_switchEthereumChain",
// //         params: [{ chainId: toHex(network) }]
// //       });
// //     } catch (switchError) {
// //       if (switchError.code === 4902) {
// //         try {
// //           await library.provider.request({
// //             method: "wallet_addEthereumChain",
// //             params: [networkParams[toHex(network)]]
// //           });
// //         } catch (error) {
// //           setError(error);
// //         }
// //       }
// //     }
// //   };

// //   const signMessage = async () => {
// //     if (!library) return;
// //     try {
// //       const signature = await library.provider.request({
// //         method: "personal_sign",
// //         params: [message, account]
// //       });
// //       setSignedMessage(message);
// //       setSignature(signature);
// //     } catch (error) {
// //       setError(error);
// //     }
// //   };

// //   const verifyMessage = async () => {
// //     if (!library) return;
// //     try {
// //       const verify = await library.provider.request({
// //         method: "personal_ecRecover",
// //         params: [signedMessage, signature]
// //       });
// //       setVerified(verify === account.toLowerCase());
// //     } catch (error) {
// //       setError(error);
// //     }
// //   };

// //   const refreshState = () => {
// //     setAccount();
// //     setChainId();
// //     setNetwork("");
// //     setMessage("");
// //     setSignature("");
// //     setVerified(undefined);
// //   };

// //   const disconnect = async () => {
// //     await web3Modal.clearCachedProvider();
// //     refreshState();
// //   };

// //   useEffect(() => {
// //     if (web3Modal.cachedProvider) {
// //       connectWallet();
// //     }
// //   }, []);

// //   useEffect(() => {
    
// //     if (provider?.on) {
// //       const handleAccountsChanged = (accounts) => {
// //         console.log("accountsChanged", accounts);
// //         if (accounts) setAccount(accounts[0]);
// //       };

// //       const handleChainChanged = (_hexChainId) => {
// //         setChainId(_hexChainId);
// //       };

// //       const handleDisconnect = () => {
// //         console.log("disconnect", error);
// //         disconnect();
// //       };

// //       provider.on("accountsChanged", handleAccountsChanged);
// //       provider.on("chainChanged", handleChainChanged);
// //       provider.on("disconnect", handleDisconnect);

// //       return () => {
// //         if (provider.removeListener) {
// //           provider.removeListener("accountsChanged", handleAccountsChanged);
// //           provider.removeListener("chainChanged", handleChainChanged);
// //           provider.removeListener("disconnect", handleDisconnect);
// //         }
// //       };
// //     }
// //   }, [provider]);

// //   return (
// //     <>
// //         <div>
// //           {!account ? (
// //             <Button onClick={connectWallet}>Connect Wallet</Button>
// //           ) : (
// //             <Button onClick={disconnect}>Disconnect</Button>
// //           )}
// //         </div>

// //           <div label={account} placement="right">
// //             <p>{`Account: ${truncateAddress(account)}`}</p>
// //           </div>
// //           <p>{`Network ID: ${chainId ? chainId : "No Network"}`}</p>
// //         </div>
       
// //     </>
// //   );
// // }
