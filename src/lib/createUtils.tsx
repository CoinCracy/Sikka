import { Account, PublicKey, SystemProgram , Connection, clusterApiUrl} from "@solana/web3.js";
import {
  AuthorityType,
  MintLayout,
  Token,
  AccountLayout,
  TOKEN_PROGRAM_ID
} from "@solana/spl-token";
import { createAccount } from "./account";
import { UtilizeWallet, sendTxUsingExternalSignature } from "./Transaction";

const networks = {
  mainnet: { url: "https://solana-api.projectserum.com", displayName: "Mainnet Beta" },
  devnet: { url: clusterApiUrl("devnet"), displayName: "Devnet" },
  testnet: { url: clusterApiUrl("testnet"), displayName: "Testnet" },
};

const solanaNetwork = networks.devnet;
const connection = new Connection(solanaNetwork.url);
const getConnection = () => connection;

export const getMintPubkeyFromTokenAccountPubkey = async (
  tokenAccountPubkey: PublicKey
) => {
  try {
    const tokenMintData = (
      await getConnection().getParsedAccountInfo(
        tokenAccountPubkey,
        "singleGossip"
      )
    ).value!.data;
    //@ts-expect-error (doing the data parsing into steps so this ignore line is not moved around by formatting)
    const tokenMintAddress = tokenMintData.parsed.info.mint;

    return new PublicKey(tokenMintAddress);
  } catch (err) {
    throw new Error(
      "Error calculating mint address from token account. Are you sure you inserted a valid token account address"
    );
  }
};

export const createNewToken = async (
  feePayer: string,
  mintAuthority: string,
  freezeAuthority: string,
  decimals: number,
  signExternally: boolean
) => {
  const connection = getConnection();
  if (signExternally) {
    const wallet = await UtilizeWallet();
   
    const mintAccount = new Account();
    const createAccIx = SystemProgram.createAccount({
      //@ts-expect-error
      fromPubkey: wallet.publicKey,
      newAccountPubkey: mintAccount.publicKey,
      lamports: await connection.getMinimumBalanceForRentExemption(
        MintLayout.span,
        "singleGossip"
      ),
      space: MintLayout.span,
      programId: TOKEN_PROGRAM_ID
    });

    const initMintIx = Token.createInitMintInstruction(
      TOKEN_PROGRAM_ID,
      mintAccount.publicKey,
      decimals,
      new PublicKey(mintAuthority),
      freezeAuthority ? new PublicKey(freezeAuthority) : null
    );

    await sendTxUsingExternalSignature(
      [createAccIx, initMintIx],
      connection,
      null,
      [mintAccount],
      wallet
    ).then((d) => { console.log(d)});
    return mintAccount;
  } else {
    const token = await Token.createMint(
      getConnection(),
      await createAccount(feePayer),
      new PublicKey(mintAuthority),
      freezeAuthority ? new PublicKey(freezeAuthority) : null,
      decimals,
      TOKEN_PROGRAM_ID
    );
    return token;
  }
};

export const editToken = async (
  feePayer: string,
  tokenAddress: string,
  newAuthority: string,
  currentAuthority: string,
  authorityType: AuthorityType,
  feePayerSignsExternally: boolean,
  currentAuthoritySignsExternally: boolean
) => {
  const tokenPublicKey = new PublicKey(tokenAddress);
  const newAuthorityOrNull = newAuthority ? new PublicKey(newAuthority) : null;
  const connection = getConnection();
  if (feePayerSignsExternally || currentAuthoritySignsExternally) {
    const wallet = await UtilizeWallet();

    const currentAuthorityAccOrWallet = currentAuthoritySignsExternally
      ? wallet
      : await createAccount(currentAuthority);

    const ix = Token.createSetAuthorityInstruction(
      TOKEN_PROGRAM_ID,
      tokenPublicKey,
      newAuthorityOrNull,
      authorityType,
      //@ts-expect-error
      currentAuthorityAccOrWallet.publicKey,
    
      []
    );
    await sendTxUsingExternalSignature(
      [ix],
      connection,
      feePayerSignsExternally ? null : await createAccount(feePayer),
      //@ts-expect-error
      currentAuthoritySignsExternally ? [] : [currentAuthorityAccOrWallet],
      wallet
    );
  } else {
    const token = new Token(
      connection,
      tokenPublicKey,
      TOKEN_PROGRAM_ID,
      await createAccount(feePayer)
    );

    await token.setAuthority(
      tokenPublicKey,
      newAuthorityOrNull,
      authorityType,
      await createAccount(currentAuthority),
      []
    );
  }
};

export const createTokenAccount = async (
  feePayer: string,
  tokenMintAddress: string,
  owner: string,
  signExternally: boolean
) => {
  const tokenMintPubkey = new PublicKey(tokenMintAddress);
  const ownerPubkey = new PublicKey(owner);
  if (signExternally) {
    const wallet = await UtilizeWallet();

    const connection = getConnection();
  
    const balanceNeeded = await Token.getMinBalanceRentForExemptAccount(
      connection
    );
    const newAccount = new Account();
    const createAccIx = SystemProgram.createAccount({
        //@ts-expect-error
      fromPubkey: wallet.publicKey,
      newAccountPubkey: newAccount.publicKey,
      lamports: balanceNeeded,
      space: AccountLayout.span,
      programId: TOKEN_PROGRAM_ID
    });

    const createTokenAccountIx = Token.createInitAccountInstruction(
      TOKEN_PROGRAM_ID,
      tokenMintPubkey,
      newAccount.publicKey,
      ownerPubkey
    );

    await sendTxUsingExternalSignature(
      [createAccIx, createTokenAccountIx],
      connection,
      null,
      [newAccount],
      wallet
    );

    return newAccount;
  } else {
    const token = new Token(
      getConnection(),
      tokenMintPubkey,
      TOKEN_PROGRAM_ID,
      await createAccount(feePayer)
    );

    return (await token.createAccount(ownerPubkey)).toString();
  }
};