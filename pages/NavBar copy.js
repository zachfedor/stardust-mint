import React, { useState } from "react";
import { ethers } from "ethers";
import { toHex, truncateAddress } from "../utils/format.js";



  const isConnected = Boolean(accounts[0]);
  // async function connectAccount() {
  //   if (window.ethereum) {
  //     const accounts = await window.ethereum.request({
  //       method: "eth_requestAccounts",
  //     });
  //     setAccounts(accounts);
  //   }
  // }

  // const connectWallet = async () => {
  //   try {
  //     const provider = await web3Modal.connect();
  //     const library = new ethers.providers.Web3Provider(provider);
  //     setProvider(provider);
  //     setLibrary(library);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  return (
    <div className="nav-bar">
      {isConnected ? (
        <p className="connected"> CONNECTED </p>
      ) : (
        // <button className="connect-button" onClick={connectAccount}>
        <div classname="with-address">
          <button className="connect-button" onClick={connectWallet}>
            DISCONNECT
          </button>
          <p>{`Account: ${truncateAddress(accounts[0])}`}</p>
        </div>
      )}
    </div>
  );
};

export default NavBar;
