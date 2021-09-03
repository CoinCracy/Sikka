import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { Connection,  clusterApiUrl,  PublicKey} from "@solana/web3.js";
import { getMintPubkeyFromTokenAccountPubkey} from "../lib/createUtils"


const getProvider = () => {
    if ("solana" in window) {
      const provider = (window).solana;
      if (provider.isPhantom) {
        return provider;
      }
    }
    // window.open("https://phantom.app/", "_blank");
  };
  

function Dashboard(props) {

    const provider = getProvider()
const tokenAddressArray = []    
const [tokenData , setTokenData] = useState([]) 


const networks = {
    mainnet: { url: "https://solana-api.projectserum.com", displayName: "Mainnet Beta" },
    devnet: { url: clusterApiUrl("devnet"), displayName: "Devnet" },
    testnet: { url: clusterApiUrl("testnet"), displayName: "Testnet" },
  };
  
  const solanaNetwork = networks.devnet;
  const connection = new Connection(solanaNetwork.url);
 

useEffect(() => {

async function listToken() {
    const tokenAccounts = await connection.getTokenAccountsByOwner(new PublicKey(provider.publicKey.toString()) , {
        programId: TOKEN_PROGRAM_ID
    })

    for ( var i = 0 ; i < tokenAccounts.value.length ; i++ ) {

        const tokenAccountAddress = tokenAccounts.value[i].pubkey.toString()
        const mint =  await getMintPubkeyFromTokenAccountPubkey(new PublicKey(tokenAccountAddress))
        console.log(mint.toString())
        const tokenAccountBalance = await  connection.getTokenAccountBalance(new PublicKey(tokenAccountAddress))
        console.log(tokenAccountBalance.value.amount)
        const totalSupply = await connection.getTokenSupply(mint)
        console.log(totalSupply.value.amount)

        setTokenData(prevTokenData => {
            const newTokenData = [...prevTokenData , {
                    id : prevTokenData.length++,
                    account : tokenAccountAddress,
                    balance : tokenAccountBalance.value.amount,
                    mint : mint.toString(),
                   supply : totalSupply.value.amount
                  }]
            return newTokenData
          })        
        
    }
     
        
  
}

    listToken()


} , [])




return (
    <>
    <hr></hr>
<h1  > Dashboard </h1>
    </>
)
}

export default Dashboard