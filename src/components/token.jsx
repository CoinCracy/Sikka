import React , {useState , useEffect} from 'react'
import { Connection,  clusterApiUrl , PublicKey} from "@solana/web3.js";
import Dashboard from './Dashboard';
import { useHistory } from 'react-router-dom'
// CSS 
import "../CSS/token.css"
//Utils
import { createNewToken , createTokenAccount, createAssociatedTokenAccount, mintToken } from '../lib/createUtils'
import { getNodeRpcURL, getTxExplorerURL, getNodeWsURL ,getAccountExplorerURL  } from '../lib/utils';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';

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
  const history = useHistory();
  const solanaNetwork = networks.devnet;
  const connection = new Connection(solanaNetwork.url);

  const getConnection = () => connection;

  useEffect(() => {

    return () => {
      
    }
  },[])
  
  const  dash = () => {
    let path = `Dashboard`; 
    history.push(path);
  }

async function createToken() { 

    let decimals = document.getElementById("decimals").value;
 
     try {
    const tokenInit = await createNewToken(null , props.provider.publicKey , props.provider.publicKey, decimals , true).then((data) =>
      {
      console.log(data)
      console.log(data.publicKey.toString())
      setMintAuthority(props.provider.publicKey)
      setTokenAddress(data.publicKey.toString())
      setStep(2)
      })

     } catch (error) {
       console.log(error)
     }
  
}

async function createTokenAcc() {
 try {
  await createAssociatedTokenAccount(null , true, tokenAddress , mintAuthorityAddress , true).then((data) => {
    console.log(data)
    setTokenAccountAddress(data)
    setStep(3) 
  })

  console.log(tokenAddress)
  const tokenAccounts = await connection.getTokenAccountsByOwner(new PublicKey(props.provider.publicKey.toString()) , {
    programId: TOKEN_PROGRAM_ID})
  console.log(tokenAccounts.value)
  console.log(tokenAddress)
 } catch (error) {
   console.log(error)
 }
}

async function InitializeMintTo() {

const tokenSupply = document.getElementById("token-supply").value
 const mintedTokens = await  mintToken( null , null , tokenAccountAddress , tokenSupply , true , true)
 console.log(mintedTokens)
 props.setToken({mintAddress : tokenAddress , accountAddress : tokenAccountAddress })
 setStep(4)
}


return (
<div id="create-token">

{step === 1 ? 
  <div className = "step" id="create-mint">
  <input id="decimals" placeholder= "Decimals" type="text"></input>
  <button onClick={ createToken } >Create Token </button>
  </div>
   :  
   <div className = "step" id="create-mint">
  <input disabled id="decimals" placeholder= "Decimals" type="text"></input>
  <button disabled onClick={ createToken } >Create Token </button>
  </div>
  }
  
  {step === 2 ? 
  <div className = "step" id="initialize-token-account">
  <button onClick={ createTokenAcc } > Initialize A Token Account </button>
  </div> :
  step >= 2 ? 
  <div className = "step" id="initialize-token-account">
  <button disabled onClick={ createTokenAcc } > Initialize A Token Account </button>
  </div> 
  : null }

  {step === 3 ? 
  <div className = "step" id="transfer-token">
 <input id="token-supply" placeholder= "Token Supply" type="text"></input>
  <button onClick={() =>  InitializeMintTo()} > Mint Tokens</button>
  </div> 
  :
   step >= 3 ? 
  <div className = "step"  id="transfer-token">
 <input disabled id="token-supply" placeholder= "Token Supply" type="text"></input>
  <button disabled onClick={() =>  InitializeMintTo()} > Mint Tokens</button>
  </div>
   :
  null}

{
  step === 4 ? 
  <>
  <button onClick={ dash }> Dashboard</button>
  </>
  : null
}


    </div>
)

}

export default TokenCreator