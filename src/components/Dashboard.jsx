import React, { useEffect, useState } from "react";
import { isUnparsedPrepend } from "typescript";


function Dashboard(props) {
const [tokenAddress , setTokenAddress] = useState() 

useEffect(() => {
setTokenAddress(props.token.mintAddress)
}, [])

return (
    <>
    <h1>{tokenAddress}</h1>
    </>
)
}

export default Dashboard