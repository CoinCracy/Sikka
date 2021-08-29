import React , {useState} from 'react'
import { Connection, PublicKey, SystemProgram, Transaction, Keypair, sendAndConfirmTransaction, clusterApiUrl } from "@solana/web3.js";
import { getNodeRpcURL, getTxExplorerURL, getNodeWsURL ,getAccountExplorerURL  } from '../lib/utils';
import {Token, TOKEN_PROGRAM_ID } from '@solana/spl-token' 

import { createNewToken , createTokenAccount, getMintPubkeyFromTokenAccountPubkey } from '../lib/createUtils'

import { createAccount } from "../lib/account";
import { setSyntheticTrailingComments } from 'typescript';


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
  
  let feePayer =  document.getElementById("feePayer").value;
    let mintAuthority = document.getElementById("mintAuthority").value;
    let freezeAuthority = document.getElementById("freezeAuthority").value;
    let decimals = document.getElementById("decimals").value;
 
     try {
      createNewToken(feePayer , mintAuthority , freezeAuthority , decimals , true).then((data) =>
      {
      console.log(data.publicKey.toString())
      setMintAuthority(mintAuthority)
      setTokenAddress(data.publicKey.toString())
      setStep(2)
      })
     } catch (error) {
       console.log(error)
     }
  
}

async function createTokenAcc() {
 try {
  await createTokenAccount(null , tokenAddress , mintAuthorityAddress , true).then((data) => {
    console.log(data.publicKey.toString)
    setTokenAccountAddress(data.publicKey)
    setStep(3) 
  })
 } catch (error) {
   console.log(error)
 }
}

async function mintToken(accountAddress) {

  const mint = (
    await getConnection().getParsedAccountInfo(
      tokenAccountAddress,
      "singleGossip"
    )
  ).value.data
console.log(mint)
  await mint.mintTo(
    tokenAddress,
    tokenAccountAddress,
    [],
    1000000000,
 );

  // Add A token transfer instructions to transaction

  var transaction = new Transaction().add(
    Token.createTransferInstruction(
      TOKEN_PROGRAM_ID,
     tokenAddress,
     tokenAccountAddress,
     props.provider.publicKey,
      [],
      1,
    ),
  );
  transaction.feePayer = props.provider.publicKey;
  (transaction).recentBlockhash = (
    await connection.getRecentBlockhash()
  ).blockhash;

  // Sign transaction, broadcast, and confirm
  var signature = await props.provider.signTransaction(transaction)
  console.log('SIGNATURE', signature);
}

return (



    <>
{step === 1 ? 
<div>
<input id= "feePayer" placeholder= "Fee Payer Address" type="text"></input>
  <input id= "mintAuthority" placeholder= "Mint Authority"   type="text"></input>
  <input id="freezeAuthority" placeholder= "Freeze Authority" type="text"></input>
  <input id="decimals" placeholder= "Decimals" type="text"></input>
  <button onClick={ createToken } >Create Token </button>
  </div> : 
  step === 2 ? 
  <div>
  <button onClick={ createTokenAcc } > Initialize A Token Account </button>
  </div> 
  : 
  step === 3 ? 
  <div>
 <h1>Transfer tokens to your account </h1>
  <input id= "TokenAdd" placeholder= "Token Address" type="text"></input>
  <input id= "RecieverAdd" placeholder= "RecieverAdd" type="text"></input>
  <button onClick={() =>  mintToken(document.getElementById("RecieverAdd").value) } > Mint Tokens</button>
  </div> 
  : 
  <h1>Congratulations you have successfully created your token!</h1>
}
 
    </>
)

}

export default TokenCreator