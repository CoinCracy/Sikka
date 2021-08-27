import React , {useState} from 'react'
import { Connection, PublicKey, SystemProgram, Transaction, Keypair, sendAndConfirmTransaction, clusterApiUrl } from "@solana/web3.js";
import { getNodeRpcURL, getTxExplorerURL, getNodeWsURL ,getAccountExplorerURL  } from '../lib/utils';
import {Token, TOKEN_PROGRAM_ID } from '@solana/spl-token' 

import { createNewToken , createTokenAccount } from '../lib/createUtils'

function TokenCreator(props) {
  const [loading ,  setLoading] = useState()

  const networks = {
    mainnet: { url: "https://solana-api.projectserum.com", displayName: "Mainnet Beta" },
    devnet: { url: clusterApiUrl("devnet"), displayName: "Devnet" },
    testnet: { url: clusterApiUrl("testnet"), displayName: "Testnet" },
  };
  
  const solanaNetwork = networks.devnet;
  const connection = new Connection(solanaNetwork.url);

  const getConnection = () => connection;


async function createToken() { 
  

    let mintAuthority = document.getElementById("mintAuthority").value;
    let freezeAuthority = document.getElementById("freezeAuthority").value;
     let decimals = document.getElementById("decimals").value;
 
     const tokenAddress = await createNewToken(null , mintAuthority , freezeAuthority , decimals , true)
  
   await createTokenAccount(null , tokenAddress , mintAuthority , true ).then((data) => {
     console.log(data)
   })
}

return (



    <>
  <input id= "feePayer" placeholder= "Fee Payer Address" type="text"></input>
  <input id= "mintAuthority" placeholder= "Mint Authority"   type="text"></input>
  <input id="freezeAuthority" placeholder= "Freeze Authority" type="text"></input>
  <input id="decimals" placeholder= "Decimals" type="text"></input>
  <button onClick={ createToken } >Create Token </button>

  <h1>Create Token Mint</h1>
  <input id= "TokenAdd" placeholder= "Token Address" type="text"></input>
  <input id= "RecieverAdd" placeholder= "RecieverAdd" type="text"></input>
  <button onClick={ createToken } > Mint Tokens</button>
    </>
)

}

export default TokenCreator