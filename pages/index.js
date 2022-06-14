// import { ethers } from 'ethers';
import { useState } from "react";
// import "../styles/App.css";
import MainMint from "./MainMint";
// import NavBar from "./NavBar";


// import img1 from "../public/images/background/background-button.png";

function App() {
  const [accounts, setAccounts] = useState([]);

  return (
    <div className="overlay">
      <div className="App">
        {/* <NavBar accounts={accounts} setAccounts={setAccounts} /> */}
        {/* <MainMint /> */}
        <MainMint accounts={accounts} setAccounts={setAccounts} />
      </div>
      <div className="background-box">
        {/* <img width="1500" src={img1}></img> */}
        <div className="mint-module"></div>
      </div>
    </div>
  );
}

export default App;

{
  /* <div className="App">
        <NavBar accounts={accounts} setAccounts={setAccounts} />
        <MainMint accounts={accounts} setAccounts={setAccounts} />
      </div> */
}
