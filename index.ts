import { getFullnodeUrl, SuiClient } from '@mysten/sui.js/client';
import { Ed25519Keypair } from '@mysten/sui.js/keypairs/ed25519';
import { getFaucetHost, requestSuiFromFaucetV0 } from '@mysten/sui.js/faucet';
import { TransactionBlock } from '@mysten/sui.js/transactions';

var enc = new TextEncoder();
var denc = new TextDecoder();

const MY_ADDRESS = "0x9ace8f290ea7377baeff988d6193f0151173e5ddbc61dc009c059322529d0ba5"
const MY_KEY = "b6452de71699452d729fb758650dde029ab0c546e8a51a9e690138bca2a504b1"

const bytes = Buffer.from(MY_KEY, "hex");
const array = Uint8Array.from(bytes);
const keypair = Ed25519Keypair.fromSecretKey(array);

// create a client connected to devnet
const suiClient = new SuiClient({ url: getFullnodeUrl('testnet') });

async function main() {

  const suiBefore = await suiClient.getBalance({
    owner: MY_ADDRESS,
  });

  console.log("SUI before: ", suiBefore);

  const txb = new TransactionBlock();

  // create a new coin with balance 100, based on the coins used as gas payment
  // you can define any balance here
  const [coin] = txb.splitCoins(txb.gas, [100000]);
  
  // transfer the split coin to a specific address
  txb.transferObjects([coin], '0xe0a53019bcd10b5b64525a628fc5a3fc1eb2fb45c4ede653ee4af20b1123a7ba');

  const res = await suiClient.signAndExecuteTransactionBlock({ signer: keypair, transactionBlock: txb });
  
  console.log("Transaction result: ", res);
}

main();