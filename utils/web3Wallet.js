import { ethers } from "ethers";
import Web3Modal from "web3modal";
import CoinbaseWalletSDK from "@coinbase/wallet-sdk";
import WalletConnect from "@walletconnect/web3-provider";

export const providerOptions = {
    coinbasewallet: {
      package: CoinbaseWalletSDK, 
      options: {
        appName: "Web 3 Modal Demo",
        infuraId: process.env.NEXT_PUBLIC_INFURA_KEY 
      }
    },
    walletconnect: {
      package: WalletConnect, 
      options: {
        infuraId: process.env.NEXT_PUBLIC_INFURA_KEY 
      } 
    }
}

export const networkParams = {
  "0x63564c40": {
    chainId: "0x63564c40",
    rpcUrls: ["https://api.harmony.one"],
    chainName: "Harmony Mainnet",
    nativeCurrency: { name: "ONE", decimals: 18, symbol: "ONE" },
    blockExplorerUrls: ["https://explorer.harmony.one"],
    iconUrls: ["https://harmonynews.one/wp-content/uploads/2019/11/slfdjs.png"]
  },
  "0xa4ec": {
    chainId: "0xa4ec",
    rpcUrls: ["https://forno.celo.org"],
    chainName: "Celo Mainnet",
    nativeCurrency: { name: "CELO", decimals: 18, symbol: "CELO" },
    blockExplorerUrl: ["https://explorer.celo.org"],
    iconUrls: [
      "https://celo.org/images/marketplace-icons/icon-celo-CELO-color-f.svg"
    ]
  }
};


// const web3Modal = new Web3Modal({
// //   network: "mainnet", // optional
// //   cacheProvider: true, // optional
// //   providerOptions // required

//   network: "rinkeby", // optional
//   cacheProvider: true, // optional
//   providerOptions // required
// });

// const instance = await web3Modal.connect();

// const provider = new ethers.providers.Web3Provider(instance);
// const signer = provider.getSigner();