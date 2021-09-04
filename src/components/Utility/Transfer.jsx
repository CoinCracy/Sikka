import React from "react";
import {
  transferTokens,
  createAssociatedTokenAccount,
  findAssociatedTokenAccountPublicKey,
} from "../../lib/createUtils";
import "../../CSS/transfer.scss"

function TransferModal(props) {
  async function transfer(amount, receiver) {
    console.log(receiver);
    const associatedTokenAccount = await createAssociatedTokenAccount(
      null,
      true,
      props.mintAddress,
      props.provider.publicKey.toString()
    );
    const sourceAddress = await findAssociatedTokenAccountPublicKey(
      props.provider.publicKey.toString(),
      props.mintAddress
    );

    await transferTokens(
      null,
      sourceAddress,
      props.mintAddress,
      associatedTokenAccount,
      null,
      amount,
      true,
      true
    ).then((data) => {
      console.log(data);
    });
  }

  return (
    <div className="transfer-modal">
      <label className="label" htmlFor="#amount">Amount</label>
      <input  className ="decimals" type="text" id="amount"></input>

      <label className="label"  htmlFor="#recipient">Receiver</label>
      <input  className ="decimals" type="text" id="recipient"></input>

      <button
         className = "transfer-button" 
        onClick={() =>
          transfer(
            document.getElementById("amount").value,
            document.getElementById("recipient").value
          )
        }
      >
        Transfer
      </button>
    </div>
  );
}

export default TransferModal;
