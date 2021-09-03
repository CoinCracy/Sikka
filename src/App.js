import { Token } from '@solana/spl-token';
import React ,{ useState , useEffect} from 'react'
import './App.css';
import {
  BrowserRouter as Router, Redirect,  Switch, Route,Link} from "react-router-dom";

import TokenCreator from './components/token.jsx';
import Connect from './components/Wallet';
import Dashboard from './components/Dashboard';
import 'semantic-ui-css/semantic.min.css';
function App() {

const [ provider, setProvider ] = useState() 
const [token , setToken ] = useState({ mintAddress : null , accountAddress : null })


if (token.mintAddress) {
 return (
  <Router>
      <Redirect to={"/Dasboard/" + token.mintAddress} />
      </Router>
 )
}


  return (
   <>
<Router>
<Connect setProvider = {setProvider}/>

 <Route path='/' >
 <TokenCreator setToken=  {setToken} provider = {provider}/>
 </Route>
 
 <Route exact path='/Dashboard/:id'>
 <Dashboard token = {token}  provider = {provider} />
 </Route>

 </Router>
   </>
  );
}

export default App;
