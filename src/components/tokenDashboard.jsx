import React, { useEffect, useState } from "react";
import {useParams} from 'react-router-dom'
import TransferModal from './Utility/Transfer' 


const getProvider = () => {
    if ("solana" in window) {
      const provider = (window).solana;
      if (provider.isPhantom) {
        return provider;
      }
    }
  };
  
  


function TokenDashboard(props) {

    const provider = getProvider();

    const { id } = useParams();

    useEffect(()=> {

    })
return (
    <div>
        <h1>Hello</h1>
        <TransferModal provider={provider} mintAddress = { id }/>
    </div>
)
}

export default TokenDashboard