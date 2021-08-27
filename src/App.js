import { Token } from '@solana/spl-token';
import React ,{ useState , useEffect} from 'react'
import './App.css';

import TokenCreator from './components/token';
import Connect from './components/Wallet';


function App() {

const [ userAddress , setUserAddress ] = useState()

  return (
   <>
 <Connect/>
 <TokenCreator/>
   </>
  );
}

export default App;
