// import Head from "next/head";
// import Image from "next/image";
// import styles from "../styles/MainMint.module.css";
import { toHex, truncateAddress } from "../utils/format.js";
import Web3Modal from "web3modal";
import { useState, useEffect } from "react";
import { ethers, BigNumber } from "ethers";
import WalletConnectProvider from "@walletconnect/web3-provider";
import CoinbaseWalletSDK from "@coinbase/wallet-sdk";

import stardustGeneration from "../artifacts/contracts/StardustGeneration.sol/StardustGeneration";
const contractAddress = "0x3A6E628f8b6c83cB409c2c67cC42ceeCBA219046";


let web3Modal;

const providerOptions = {
  coinbasewallet: {
    package: CoinbaseWalletSDK, 
    options: {
      appName: "Stardust Generation",
      infuraId: process.env.NEXT_PUBLIC_INFURA_KEY 
    }
  },
  walletconnect: {
    package: WalletConnectProvider, // required
    options: {
      rpc: { 42: process.env.NEXT_PUBLIC_RPC_URL }, // required
    },
  },
};


export default function MainMint() {
  const [mintAmount, setMintAmount] = useState(1);
  const [isConnected, setIsConnected] = useState(false);
  const [hasMetamask, setHasMetamask] = useState(false);
  const [signer, setSigner] = useState(undefined);

  const [provider, setProvider] = useState();

  // const [library, setLibrary] = useState();
  const [account, setAccount] = useState();
  const [error, setError] = useState("");
  // const [chainId, setChainId] = useState();
  const [network, setNetwork] = useState();

  if (typeof window !== "undefined") {
    web3Modal = new Web3Modal({
      cacheProvider: false,
      providerOptions, // required
    });
  }

  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      setHasMetamask(true);
    }
  });

  async function connectWallet() {
    if (typeof window.ethereum !== "undefined") {
      try {
        const web3ModalProvider = await web3Modal.connect();
        setIsConnected(true);
        const provider = new ethers.providers.Web3Provider(web3ModalProvider);
        setSigner(provider.getSigner());
        setProvider(provider);
        setChainId(network.chainId);
      } catch (e) {
        console.log(e);
      }
    } else {
      setIsConnected(false);
    }
  }

  const handleDisconnect = async () => {
    await web3Modal.clearCachedProvider();
    refreshState();
  };
    // when we click mint amount
  const handleDecrement = () => {
    if (mintAmount <= 1) return;
    setMintAmount(mintAmount - 1);
  };
  const handleIncrement = () => {
    //for max number of mints this case is 3
    if (mintAmount >= 7) return;
    setMintAmount(mintAmount + 1);
  };

  const refreshState = () => {
    setAccount();
    // setChainId();
    setNetwork("");
  };

  async function handlePublicMint() {
    if (typeof window.ethereum !== "undefined") {
      const contract = new ethers.Contract(contractAddress, stardustGeneration.abi, signer);
      try {
        const response = await contract.mintPublic(BigNumber.from(mintAmount), {
          value: ethers.utils.parseEther((0.04 * mintAmount).toString()),
        });
        console.log("response: ", response);
      } catch (err) {
        console.log("error: ", err);
      }
    } else {
      console.log("Please install MetaMask");
    }
  }
    

  return (
    // <div className="main-mint">
    //   {hasMetamask ? (
    //     isConnected ? (
    //       <button onClick={disconnectWallet}>Disconnect</button>
    //     ) : (
    //       <button onClick={connectWallet}>Connect Wallet</button>
    //     )
    //   ) : (
    //     "Please install metamask"
    //   )}

  
    // </div>
    <>
        <div className="text-center mt-8">
          <div>
          {hasMetamask ? (
            isConnected ? (
              <button>Connected</button>
            ) : (
              <button onClick={connectWallet}>Connect Wallet</button>
            )
          ) : (
            "Please install metamask"
          )}
          </div>
        </div>
        <div className="main-mint">
        {/* <h1>Stardust </h1>
        <p> mint your stardust</p> */}
        {isConnected ? (
          <div>
            <div className="counter">
              <button
                className="decrement-btn"
                onClick={handleDecrement}
              ></button>
              <input className="input" type="number" value={mintAmount} />
              <button
                className="increment-btn"
                onClick={handleIncrement}
              ></button>
            </div>
            <button className="mint-button" onClick={handlePublicMint}>
              {" "}
              MINT
            </button>
          </div>
        ) : (
          <p></p>
        )}
      </div>
    </>
  );
}

// // import { useEffect, useState } from "react";
// // // import { networkParams } from "./networks";
// // import { toHex, truncateAddress } from "../utils/format.js";
// // import { providerOptions, networkParams } from "../utils/web3Wallet.js";

// import { ethers, BigNumber, providers } from "ethers";
// import Web3Modal from "web3modal";
// import CoinbaseWalletSDK from "@coinbase/wallet-sdk";
// import WalletConnect from "@walletconnect/web3-provider";
// import { useRef, useEffect, useState } from "react";
// // import { providers } from "ethers";
// // import config from "../dapp.config.js";
// import StardustGeneration from "../artifacts/contracts/StardustGeneration.sol/StardustGeneration.json";

// const stardustAddress = "0x3A6E628f8b6c83cB409c2c67cC42ceeCBA219046";

// export default function MainMint() {
//   const [connectedWallet, setConnectedWallet] = useState(false);
//   const [mintAmount, setMintAmount] = useState(1);
//   const web3ModalRef = useRef(); // return the object with key named current

//   // providers and signer  =>
//   // providers is used for to get data from sc
//   // signer is used for to sign data / set the data to sc

//   const getSignerOrProvider = async (needSigner = false) => {
//     const provider = await web3ModalRef.current.connect();
//     const web3Provider = new providers.Web3Provider(provider);
//     const { chainId } = await web3Provider.getNetwork();
//     if (chainId !== 4) {
//       alert("USE RINKEEBY NETWORK");
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
//             appName: "Stardust Generation",
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

//   // when we click mint amount
//   const handleDecrement = () => {
//     if (mintAmount <= 1) return;
//     setMintAmount(mintAmount - 1);
//   };
//   const handleIncrement = () => {
//     //for max number of mints this case is 3
//     if (mintAmount >= 7) return;
//     setMintAmount(mintAmount + 1);
//   };

//   async function handlePublicMint() {
//     if (connectedWallet) {
//       //way for ethers to connect to blockchain
//       const provider = new ethers.providers.Web3Provider(window.ethereum);
//       //when making transaction signer
//       const signer = provider.getSigner();
//       const contract = new ethers.Contract(
//         //change these
//         stardustAddress,
//         StardustGeneration.abi,
//         signer
//       );

//       try {
//         const response = await contract.PublicMint(BigNumber.from(mintAmount), {
//           value: ethers.utils.parseEther((0.04 * mintAmount).toString()),
//         });
//         console.log("response: ", response);
//       } catch (err) {
//         console.log("error: ", err);
//       }
//     }
//   }

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
//       <div className="main-mint">
//       {/* <h1>Stardust </h1>
//       <p> mint your stardust</p> */}
//       {connectedWallet ? (
//         <div>
//           <div className="counter">
//             <button
//               className="decrement-btn"
//               onClick={handleDecrement}
//             ></button>
//             <input className="input" type="number" value={mintAmount} />
//             <button
//               className="increment-btn"
//               onClick={handleIncrement}
//             ></button>
//           </div>
//           <button className="mint-button" onClick={handlePublicMint}>
//             {" "}
//             MINT
//           </button>
//         </div>
//       ) : (
//         <p></p>
//       )}
//     </div>
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
