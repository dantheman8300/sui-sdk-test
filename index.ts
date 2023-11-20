import { getFullnodeUrl, SuiClient } from '@mysten/sui.js/client';
import { Ed25519Keypair } from '@mysten/sui.js/keypairs/ed25519';
import { getFaucetHost, requestSuiFromFaucetV0 } from '@mysten/sui.js/faucet';
import { TransactionBlock } from '@mysten/sui.js/transactions';

var enc = new TextEncoder();
var denc = new TextDecoder();

const MY_ADDRESS = "0x9ace8f290ea7377baeff988d6193f0151173e5ddbc61dc009c059322529d0ba5" // address of the dummy account
const MY_KEY = "b6452de71699452d729fb758650dde029ab0c546e8a51a9e690138bca2a504b1" // This is a dummy account's private key

const bytes = Buffer.from(MY_KEY, "hex");
const array = Uint8Array.from(bytes);
const keypair = Ed25519Keypair.fromSecretKey(array);

// create a client connected to devnet
const suiClient = new SuiClient({ url: getFullnodeUrl('testnet') });

async function main() {

  const suiBefore = await suiClient.getBalance({
    owner: MY_ADDRESS,
  });

  // This can be used to ensure that the sender has enough SUI to transfer
  console.log("SUI before: ", suiBefore);

  const txb = new TransactionBlock();

  // create a new coin with balance 1_0000_0000, based on the coins used as gas payment
  // you can define any balance here
  //
  // The splitCoins function will split the gas coin into two coins, one with the amount
  // specified in the first argument, and the other with the remaining amount. Let me know if you 
  // have any questions about this.
  //
  // You could split the coin into more than two coins if you want to send to
  //
  // NOTE: 1 SUI = 1e9 MIST 
  const transferAmount = 1_0000_0000; // This is 0.1 SUI
  const [coin] = txb.splitCoins(txb.gas, [transferAmount]);
  
  // transfer the split coin to a specific address
  const receiverAddress = "0xe0a53019bcd10b5b64525a628fc5a3fc1eb2fb45c4ede653ee4af20b1123a7ba"
  txb.transferObjects([coin], receiverAddress);

  const txn = await suiClient.signAndExecuteTransactionBlock({ signer: keypair, transactionBlock: txb });
  
  await suiClient.waitForTransactionBlock(
    {
      digest: txn.digest, 
    }
  )

  // This unfortunately doesn't get as much information as I would like. Let me know if you want more
  // information about the transaction and I can find a way to get it!
  const res = await suiClient.getTransactionBlock({
    digest: txn.digest,
  });

  console.log("Transaction result: ", res);
  console.log(`View on explorer: https://testnet.suivision.xyz/txblock/${txn.digest}`)
}

main();