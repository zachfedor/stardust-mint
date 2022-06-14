import Web3Modal from "web3modal";
import { useState, useEffect } from "react";
import { ethers, BigNumber } from "ethers";
import WalletConnectProvider from "@walletconnect/web3-provider";
import CoinbaseWalletSDK from "@coinbase/wallet-sdk";

import stardustGeneration from "../artifacts/contracts/StardustGeneration.sol/StardustGeneration";
const contractAddress = "0x8955a961EbF558E1838adE37A27D938920c8ecf3";

const { MerkleTree } = require('merkletreejs')
const keccak256 = require('keccak256')
const starlist = require('../scripts/starlist.js')

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

  const [account, setAccount] = useState();
  const [error, setError] = useState("");
  const [chainId, setChainId] = useState();
  const [network, setNetwork] = useState();

  let web3Modal
  if (typeof window !== 'undefined') {
    web3Modal = new Web3Modal({
      network: 'rinkeby', // optional
      cacheProvider: true,
      providerOptions, // required
    })
  }

  useEffect(() => {
    if (provider !== "undefined") {
      setHasMetamask(true);
    }
  });

	const connectWallet = async () => {
		try {
			const { ethereum } = window

			if (!ethereum) {
				console.log('Metamask not detected')
				return
			}
			let chainId = await ethereum.request({ method: 'eth_chainId'})
			console.log('Connected to chain:' + chainId)

			const rinkebyChainId = '0x4'
      const web3ModalProvider = await web3Modal.connect();
			if (chainId !== rinkebyChainId) {
				alert('You are not connected to the Rinkeby Testnet!')
				return
			}
			const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
      const provider = new ethers.providers.Web3Provider(web3ModalProvider);
      setSigner(provider.getSigner());
			console.log('Found account', accounts[0])
			setAccount(accounts[0])
      setIsConnected(true)
		} catch (error) {
			console.log('Error connecting to metamask', error)
		}
	}

	// Checks if wallet is connected to the correct network
	const checkCorrectNetwork = async () => {
		const { ethereum } = window
		let chainId = await ethereum.request({ method: 'eth_chainId' })
		console.log('Connected to chain:' + chainId)

		const rinkebyChainId = '0x4'

		if (chainId !== rinkebyChainId) {
			setCorrectNetwork(false)
		} else {
			setCorrectNetwork(true)
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
    setChainId();
    setSigner();
    setNetwork("");
  };

  async function handleStarlistMint() {
    if (typeof window.ethereum !== "undefined") {
      const contract = new ethers.Contract(contractAddress, stardustGeneration.abi, signer);

      const leafs = starlist.map(addr => keccak256(addr));
      const merkleTree = new MerkleTree(leafs, keccak256, {sortPairs: true});
      const proof = merkleTree.getHexProof(keccak256(account));

      try {
        const response = await contract.mintStarlist(proof, BigNumber.from(mintAmount), {
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

  async function handleReservelistMint() {
    if (typeof window.ethereum !== "undefined") {
      const contract = new ethers.Contract(contractAddress, stardustGeneration.abi, signer);

      const leafs = starlist.map(addr => keccak256(addr));
      const merkleTree = new MerkleTree(leafs, keccak256, {sortPairs: true});
      const proof = merkleTree.getHexProof(keccak256(account));

      try {
        const response = await contract.mintReservelist(proof, BigNumber.from(mintAmount), {
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
              <button onClick={handleDisconnect}>Disconnect Wallet</button>
            ) : (
              <button onClick={connectWallet}>Connect Wallet</button>
            )
          ) : (
            "Please install metamask"
          )}
          </div>
        </div>
        <div className="main-mint">
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
            <button className="mint-button" onClick={handleStarlistMint}>
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