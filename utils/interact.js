import { ethers } from "ethers";
import { config } from '../dapp.config'

// const Web3 = require( 'web3' );
const provider = new ethers.providers.JsonRpcProvider(url);

// const { createAlchemyWeb3 } = require('@alch/alchemy-web3')
const { MerkleTree } = require('merkletreejs')
const keccak256 = require('keccak256')
const starlist = require('../scripts/starlist.js')
const url = process.env.NEXT_PUBLIC_INFURA_KEY;
// const alchemyWeb3 = createAlchemyWeb3(process.env.NEXT_PUBLIC_ALCHEMY_RPC_URL) // may need


const contract = require('../artifacts/contracts/StardustGeneration.sol/StardustGeneration.json')
// const nftContract = new web3.eth.Contract(contract.abi, config.contractAddress)

// Calculate merkle root from the starlist array
const leafNodes = starlist.map((addr) => keccak256(addr))
const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true })
const root = merkleTree.getRoot()

export const getTotalMinted = async (provider) => {
  // let web3;

  if (provider) {
    
    const web3Modal = new Web3Modal({
    network: "rinkeby", // optional
    cacheProvider: true, // optional
    providerOptions // required
    });

// const instance = await web3Modal.connect();

// const provider = new ethers.providers.Web3Provider(instance);
// const signer = provider.getSigner();
  } else {
    // web3 = alchemyWeb3;
  }
  const nftContract = new web3.eth.Contract(contract.abi, config.contractAddress);
  const totalMinted = await nftContract.methods.totalSupply().call()
  return totalMinted
}

export const getMaxSupply = async (provider) => {
  // let web3;

  if (provider) {
    web3 = new Web3( provider );
  } else {
    // web3 = alchemyWeb3;
    
  }
  const nftContract = new web3.eth.Contract(contract.abi, config.contractAddress);
  const maxSupply = await nftContract.methods.MAX_SUPPLY().call()
  return maxSupply;

}

export const isStarlistState = async (provider) => {
  // let web3;

  if (provider) {
    web3 = new Web3( provider );
  } else {
    // web3 = alchemyWeb3;
    
  }
  const nftContract = new web3.eth.Contract(contract.abi, config.contractAddress);
  const prelistBool = await nftContract.methods.prelistOpen().call()
  return prelistBool
}

export const isReservelistState = async (provider) => {
  // let web3;

  if (provider) {
    web3 = new Web3( provider );
  } else {
    // web3 = alchemyWeb3;
    
  }
  const nftContract = new web3.eth.Contract(contract.abi, config.contractAddress);
  const starlistBool = await nftContract.methods.starlistOpen().call()
  return starlistBool
}

export const isPublicState = async (provider) => {
  // let web3;

  if (provider) {
    web3 = new Web3( provider );
  } else {
    // web3 = alchemyWeb3;
  }

  const nftContract = new web3.eth.Contract(contract.abi, config.contractAddress);

  const publicBool = await nftContract.methods.publicOpen().call()
  return publicBool
}

export const getCost = async (provider) => {
  // let web3;

  if (provider) {
    web3 = new Web3( provider );
  } else {
    // web3 = alchemyWeb3;
    
  }
  const nftContract = new web3.eth.Contract(contract.abi, config.contractAddress);

  const cost = await nftContract.methods.cost().call()
  return cost
}

export const mintStarlist = async (mintAmount) => {
  if (!window.ethereum.selectedAddress) {
    return {
      success: false,
      status: 'To be able to mint, you need to connect your wallet'
    }
  }

  const leaf = keccak256(window.ethereum.selectedAddress)
  const proof = merkleTree.getHexProof(leaf)

  // Verify Merkle Proof
  const isValid = merkleTree.verify(proof, leaf, root)

  if (!isValid) {
    return {
      success: false,
      status: 'Invalid Merkle Proof - You are not on the starlist'
    }
  }

  // avoid replay attacks
  const nonce = await provider.getTransactionCount(
    window.ethereum.selectedAddress,
    'latest'
  )

  // Set up our Ethereum transaction
  const tx = {
    to: config.contractAddress,
    from: window.ethereum.selectedAddress,
    value: parseInt(
      web3.utils.toWei(String(config.cost * mintAmount), 'ether')
    ).toString(16), // hex
    data: nftContract.methods
      .mintStarlist(window.ethereum.selectedAddress, proof, mintAmount) // window.ethereum.selectedAddress as third param?
      .encodeABI(),
    nonce: nonce.toString(16)
  }

  try {
    const txHash = await window.ethereum.request({
      method: 'eth_sendTransaction',
      params: [tx]
    })

    return {
      success: true,
      status: (
        <a href={`https://etherscan.io/tx/${txHash}`} target="_blank">
          <p>✅ Check out your transaction on Etherscan:</p>
          <p>{`https://etherscan.io/tx/${txHash}`}</p>
        </a>
      )
    }
  } catch (error) {
    return {
      success: false,
      status: `😞 Oh my, something went wrong: ` + error.message
    }
  }
}

export const mintReservelist = async (provider, mintAmount) => {
	const web3 = new Web3( provider );
	const accounts = await web3.eth.getAccounts();
  if (!accounts.length) {
    return {
      success: false,
      status: 'To be able to mint, you need to connect your wallet'
    }
  }

	//either:
	const nftContract = new web3.eth.Contract(contract.abi, config.contractAddress);
	//or:

	const valueBN = Web3.utils.toBN( Web3.utils.toWei(`${config.cost}`) )
		.mul( Web3.utils.toBN( `${mintAmount}` ) );
    console.log(valueBN.toString());

  // const valueBN =  parseInt(
  //     web3.utils.toWei(String(config.cost * mintAmount), 'ether')
  //   ).toString(16)
		
	try{
  		await nftContract.methods.mintPresale( mintAmount ).estimateGas({
			from: accounts[0],
			value: valueBN.toString()
		});
    await nftContract.methods.mintPresale( mintAmount ).send({
			from: accounts[0],
			value: valueBN.toString()
		});

    return {
      success: true,
      status: (
        <a href={`https://etherscan.io/tx/${txHash}`} target="_blank">
          <p>✅ Check out your transaction on Etherscan:</p>
          <p>{`https://etherscan.io/tx/${txHash}`}</p>
        </a>
      )
    }
  } catch (error) {
    return {
      success: false,
      status: `😞 Oh my, there's an err: ` + error.message
    }
  }
};



export const mintPublic = async (provider, mintAmount) => {
  const web3 = new Web3( provider );
	const accounts = await web3.eth.getAccounts();

  if (!accounts.length) {
    return {
      success: false,
      status: 'To be able to mint, you need to connect your wallet'
    }
  }
	const nftContract = new web3.eth.Contract(contract.abi, config.contractAddress);

	const valueBN = Web3.utils.toBN( Web3.utils.toWei(`${config.cost}`) )
		.mul( Web3.utils.toBN( `${mintAmount}` ) );
    console.log(valueBN.toString());
		

  try {
    await nftContract.methods.mint( mintAmount ).estimateGas({
			from: accounts[0],
			value: valueBN.toString()
		});
    await nftContract.methods.mint( mintAmount ).send({
			from: accounts[0],
			value: valueBN.toString()
    });

    return {
      success: true,
      status: (
        <a href={`https://etherscan.io/tx/${txHash}`} target="_blank">
          <p>✅  Check out your transaction on Etherscan:</p>
          <p>{`https://etherscan.io/tx/${txHash}`}</p>
        </a>
      )
    }
  } catch (error) {
    return {
      success: false,
      status: `😞  Oh my, something went wrong` + error.message
    }
  }
}


