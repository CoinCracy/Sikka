import { useState, useEffect } from "react";
import {
  Connection,
  PublicKey,
  Transaction,
  clusterApiUrl,
  SystemProgram
} from "@solana/web3.js";
import "../CSS/connect.css"


type DisplayEncoding = "utf8" | "hex";
type PhantomEvent = "disconnect" | "connect";
type PhantomRequestMethod =
  | "connect"
  | "disconnect"
  | "signTransaction"
  | "signAllTransactions"
  | "signMessage";

interface ConnectOpts {
  onlyIfTrusted: boolean;
}

interface PhantomProvider {
  publicKey: PublicKey | null;
  isConnected: boolean | null;
  autoApprove: boolean | null;
  signTransaction: (transaction: Transaction) => Promise<Transaction>;
  signAllTransactions: (transactions: Transaction[]) => Promise<Transaction[]>;
  signMessage: (
    message: Uint8Array | string,
    display?: DisplayEncoding
  ) => Promise<any>;
  connect: (opts?: Partial<ConnectOpts>) => Promise<void>;
  disconnect: () => Promise<void>;
  on: (event: PhantomEvent, handler: (args: any) => void) => void;
  request: (method: PhantomRequestMethod, params: any) => Promise<any>;
}

// Get The Solana Provider 
const getProvider = (): PhantomProvider | undefined => {
  if ("solana" in window) {
    const provider = (window as any).solana;
    if (provider.isPhantom) {
      return provider;
    }
  }
  window.open("https://phantom.app/", "_blank");
};


const NETWORK = clusterApiUrl("devnet");

export default function Connect(props : any) {

  const provider = getProvider();
  
  const [logs, setLogs] = useState<string[]>([]);
  const addLog = (log: string) => setLogs([...logs, log]);

  const connection = new Connection(NETWORK);
  
  const [, setConnected] = useState<boolean>(false);

  useEffect(() => {
    if (provider) {
      provider.on("connect", () => {
        setConnected(true);
        props.setProvider(provider)
      });
      provider.on("disconnect", () => {
        setConnected(false);
      });
      // try to eagerly connect
      provider.connect()
      return () => {
        provider.disconnect();
      };
    }
  }, [provider]);
  
  if (!provider) {
    return <h2>Could not find a provider</h2>;
  }

  const createTransferTransaction = async () => {
    if (!provider.publicKey) {
      return;
    }
    let transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: provider.publicKey,
        toPubkey: provider.publicKey,
        lamports: 100
      })
    );
    transaction.feePayer = provider.publicKey;
    addLog("Getting recent blockhash");
    (transaction as any).recentBlockhash = (
      await connection.getRecentBlockhash()
    ).blockhash;
    return transaction;
  };

  const sendTransaction = async () => {
    const transaction = await createTransferTransaction();
    if (transaction) {
      try {
        let signed = await provider.signTransaction(transaction);
        addLog("Got signature, submitting transaction");
        let signature = await connection.sendRawTransaction(signed.serialize());
        addLog(
          "Submitted transaction " + signature + ", awaiting confirmation"
        );
        await connection.confirmTransaction(signature);
        addLog("Transaction " + signature + " confirmed");
      } catch (e) {
        console.warn(e);
        addLog("Error");
      }
    }
  };

  const signMultipleTransactions = async (onlyFirst: boolean = false) => {
    const [transaction1, transaction2] = await Promise.all([
      createTransferTransaction(),
      createTransferTransaction()
    ]);
    if (transaction1 && transaction2) {
      let signature;
      if (onlyFirst) {
        signature = await provider.signAllTransactions([transaction1]);
      } else {
        signature = await provider.signAllTransactions([
          transaction1,
          transaction2
        ]);
      }
      addLog("Signature " + signature);
    }
  };

  const signMessage = async (message: string) => {
    const data = new TextEncoder().encode(message);
    await provider.signMessage(data);
    addLog("Message signed");
  };

  return (
    <div id="connect-button">
      <main>
        {provider && provider.publicKey ? (
          <>
            <div className ="connect-button" onClick={() => provider.disconnect()}> 
            {provider.publicKey?.toBase58().slice(0,5)}... {provider.publicKey?.toBase58().slice(-5)}
            </div>
            {/* <div>autoApprove: {provider.autoApprove ? "true" : "false"} </div> */}
            {/* <button onClick={() => provider.disconnect()}>Disconnect</button> */}
          </>
        ) : (
          <>
            <div className ="connect-button" onClick={() => provider.connect()}>
              Connect
            </div>
          </>
        )}
      </main>
    </div>
  );
}