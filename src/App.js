import { Token } from '@solana/spl-token';
import React ,{ useState , useEffect} from 'react'
import './App.css';
import {BrowserRouter as Router, Redirect,  Switch, Route,Link} from "react-router-dom";

import TokenCreator from './components/token.jsx';
import Connect from './components/Wallet';
import Dashboard from './components/Dashboard.jsx';
import TokenDashboard from './components/tokenDashboard';

function App() {

const [ provider, setProvider ] = useState() 
const [token , setToken ] = useState({ mintAddress : null , accountAddress : null })

  return (
   <>
<Router>
<Connect setProvider = {setProvider}/>

 <Route exact path='/' >
 <TokenCreator setToken=  {setToken} provider = {provider}/>
 </Route>
 
 <Route exact path='/Dashboard'>
 <Dashboard provider = {provider} />
 </Route>

 <Route exact path='/Dashboard/:id'>
<TokenDashboard/>
 </Route>
 </Router>
   </>
  );
}

export default App;
