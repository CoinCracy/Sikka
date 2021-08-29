import { Token } from '@solana/spl-token';
import React ,{ useState , useEffect} from 'react'
import './App.css';

import TokenCreator from './components/token';
import Connect from './components/Wallet';


function App() {

const [ provider, setProvider ] = useState() 

  return (
   <>
 <Connect setProvider = {setProvider}/>
 <TokenCreator provider = {provider}/>
   </>
  );
}

export default App;
