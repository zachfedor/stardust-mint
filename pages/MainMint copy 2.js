import { useState, useEffect } from "react";
import { ethers, BigNumber } from "ethers";

//change this
// import OtherHomes from "./OtherHomes.json";
import {
  getTotalMinted,
  getMaxSupply,
  isStarlistState,
  isReservelistState,
  isPublicState,
  mintStarlist,
  mintReservelist,
  mintPublic
} from '../utils/interact';

//change this
// const OtherHomesAddress = "0x0ef656537Ba8F7C12E2F9bc433dD0D3b3B45858d";

const MainMint = ({ accounts, setAccounts }) => {
  // const [{ wallet, connecting }, connect, disconnect] = useConnectWallet()

  const [mintAmount, setMintAmount] = useState(1);
  const [totalMinted, setTotalMinted] = useState(0)
  const connectedWallet = Boolean(accounts[0]);

  const [maxSupply, setMaxSupply] = useState(0)
  const [maxMintAmount, setMaxMintAmount] = useState(0)

  const [isStarlist, setIsPrelist] = useState(false)
  const [isReservelist, setIsReservelist] = useState(false)
  const [isPublic, setIsPublic] = useState(false)
  const [paused, setIsPaused] = useState(false)

  const [status, setStatus] = useState(null)
  const [isMinting, setIsMinting] = useState(false)

  useEffect(() => {
    const init = async () => {
      setMaxSupply(await getMaxSupply(wallet?.provider))
      setTotalMinted(await getTotalMinted(wallet?.provider))

      setIsPublic(await isPublicState(wallet?.provider))
      setIsReservelist(await isReservelistState(wallet?.provider))
      setIsPrelist(await isStarlistState(wallet?.provider))

      setMaxMintAmount(
        isStarlist ? config.maxMintPerPrelist : isReservelist ? config.maxMintPerPresale : isPublic ? config.maxMintPerTx : "0"
      )
      if (isStarlist == false  && isReservelist == false && isPublic == false ) {
        setIsPaused(!paused);
      } else { paused == false}
    }
    init()
  }, [isStarlist, isReservelist, isPublic, paused])

  const starlistMintHandler = async () => {
    setIsMinting(true)
    const { success, status } = await mintStarlist(mintAmount)
    setStatus({
      success,
      message: status
    })
    setIsMinting(false)
  }

  const reservelistMintHandler = async () => {
    setIsMinting(true)
    // debugger
    const { success, status } = await mintReservelist(wallet.provider, mintAmount)
    setStatus({
      success,
      message: status
    })
    setIsMinting(false)
  }

  const publicMintHandler = async () => {
    setIsMinting(true)
    const { success, status } = await mintPublic(wallet.provider, mintAmount)
    setStatus({
      success,
      message: status
    })
    setIsMinting(false)
  }

  // async function handleMint() {
  //   if (window.ethereum) {
  //     //way for ethers to connect to blockchain
  //     const provider = new ethers.providers.Web3Provider(window.ethereum);
  //     //when making transaction signer
  //     const signer = provider.getSigner();
  //     const contract = new ethers.Contract(
  //       //change these
  //       OtherHomesAddress,
  //       OtherHomes.abi,
  //       signer
  //     );

  //     try {
  //       const response = await contract.mint(BigNumber.from(mintAmount), {
  //         value: ethers.utils.parseEther((0.04 * mintAmount).toString()),
  //       });
  //       console.log("response: ", response);
  //     } catch (err) {
  //       console.log("error: ", err);
  //     }
  //   }
  // }
  // when we click mint amount
  const handleDecrement = () => {
    if (mintAmount <= 1) return;
    setMintAmount(mintAmount - 1);
  };
  const handleIncrement = () => {
    //for max number of mints this case is 3
    if (mintAmount >= 3) return;
    setMintAmount(mintAmount + 1);
  };
  return (
    <div className="main-mint">
      {/* <h1>Stardust </h1>
      <p> mint your stardust</p> */}
      <div className="text-center mt-8">
        <div>
            {!connectedWallet ? (
            <button onClick={connectWallet}>Connect Wallet</button>
          ) : (
            <button onClick={disconnect}>Disconnect</button>
          )}
        </div>
      </div>
      {connectedWallet ? (
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
          <button
            className={` mint-button ${
              paused || isMinting
                ? 'bg-brand-gray cursor-not-allowed'
                : 'bg-gradient-to-br from-brand-pink to-brand-blue shadow-lg hover:shadow-pink-400/50'
            } font-hwt mt-12 w-full px-6 py-3 rounded-md text-2xl text-white  mx-4 tracking-wide uppercase`}
            disabled={paused || isMinting}
            onClick={isStarlist ? prelistMintHandler : isReservelist ? mintReservelistHandler : mintPublicHandler}
          >
            {isMinting ? 'Minting...' : isStarlist ? "Mint Starlist" : isReservelist ? "Mint Reservelist" : isPublic ? "Mint Public" : "Minting Soon"}
          </button>
          ) : (
            <button
            className={` mint-button ${
              paused || isMinting
                ? 'bg-brand-gray cursor-not-allowed'
                : 'bg-gradient-to-br from-brand-pink to-brand-blue shadow-lg hover:shadow-pink-400/50'
            } font-hwt mt-12 w-full px-6 py-3 rounded-md text-2xl text-white  mx-4 tracking-wide uppercase`}
            disabled={paused || isMinting}
            onClick={isStarlist ? prelistMintHandler : isReservelist ? mintReservelistHandler : mintPublicHandler}
          >
            {isMinting ? 'Minting...' : isStarlist ? "Mint Starlist" : isReservelist ? "Mint Reservelist" : isPublic ? "Mint Public" : "Minting Soon"}
          </button>
        </div>
      ) : (
        <p></p>
      )}
    </div>
  );
};

export default MainMint;
