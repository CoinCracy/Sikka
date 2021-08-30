import React , {useState} from 'react'
import { Connection,  clusterApiUrl } from "@solana/web3.js";


// CSS 
import "../CSS/token.css"
//Utils
import { createNewToken , createTokenAccount, getMintPubkeyFromTokenAccountPubkey ,InitializeMintTo, mintToken } from '../lib/createUtils'
import { getNodeRpcURL, getTxExplorerURL, getNodeWsURL ,getAccountExplorerURL  } from '../lib/utils';

function TokenCreator(props) {

  const [loading ,  setLoading] = useState()
  const [step , setStep ] = useState(1)
  const [tokenAddress , setTokenAddress ] =  useState()
  const [tokenAccountAddress , setTokenAccountAddress ] = useState()
  const [mintAuthorityAddress , setMintAuthority ] = useState()


  const networks = {
    mainnet: { url: "https://solana-api.projectserum.com", displayName: "Mainnet Beta" },
    devnet: { url: clusterApiUrl("devnet"), displayName: "Devnet" },
    testnet: { url: clusterApiUrl("testnet"), displayName: "Testnet" },
  };
  
  const solanaNetwork = networks.devnet;
  const connection = new Connection(solanaNetwork.url);

  const getConnection = () => connection;

 

async function createToken(props) { 

    let mintAuthority = document.getElementById("mintAuthority").value;
    let freezeAuthority = document.getElementById("freezeAuthority").value;
    let decimals = document.getElementById("decimals").value;
 
     try {
    const tokenInit = await createNewToken(null , mintAuthority , freezeAuthority , decimals , true).then((data) =>
      {
      console.log(data)
      console.log(data.publicKey.toString())
      setMintAuthority(mintAuthority)
      setTokenAddress(data.publicKey.toString())
      setStep(2)
      })
    console.log(tokenInit)
     } catch (error) {
       console.log(error)
     }
  
}


async function createTokenAcc() {
 try {
  await createTokenAccount(null , tokenAddress , mintAuthorityAddress , true).then((data) => {
    console.log(data.publicKey.toString())
    setTokenAccountAddress(data.publicKey.toString())

    setStep(3) 
  })
 } catch (error) {
   console.log(error)
 }
}

async function InitializeMintTo() {

const tokenSupply = document.getElementById("token-supply").value
 const mintedTokens = await  mintToken( null , null , tokenAccountAddress , tokenSupply , true , true)
 console.log(mintedTokens)
}

return (
<div id="create-token">

  <div id="create-mint">
  <input id= "mintAuthority" placeholder= "Mint Authority"   type="text"></input>
  <input id="freezeAuthority" placeholder= "Freeze Authority" type="text"></input>
  <input id="decimals" placeholder= "Decimals" type="text"></input>
  <button onClick={ createToken } >Create Token </button>
  </div> 
  {step >= 2 ? 
  <div id="initialize-token-account">
  <button onClick={ createTokenAcc } > Initialize A Token Account </button>
  </div> 
  : null }

  {step >= 3 ? 
  <div id="transfer-token">
 <input id="token-supply" placeholder= "Token Supply" type="text"></input>
  <button onClick={() =>  InitializeMintTo()} > Mint Tokens</button>
  </div> 
  : 
  null}

    </div>
)

}

export default TokenCreator