const dotenv = require("dotenv");
dotenv.config();
const fs = require("fs/promises");

const {
    Client,
    ContractDeleteTransaction,
    PrivateKey,
    ContractInfoQuery
} = require("@hashgraph/sdk");
require('dotenv').config({ path: '../../.env' })
const account2Id = process.env.ACCOUNT_2_ID
const account2PrivateKey = process.env.ACCOUNT_2_PRIVATE_KEY
const SMART_CONTRACT_ID = process.env.SMART_CONTRACT_ID

async function main() {
    // Create our connection to the Hedera network
    // The Hedera JS SDK makes this really easy!
    const client = Client.forTestnet();

    client.setOperator(account2Id, account2PrivateKey);

    //Delete the Contract
    const transaction = await new ContractDeleteTransaction()
    .setContractId(SMART_CONTRACT_ID)
    .setTransferAccountId(account2Id)
    .freezeWith(client);

    //Sign with the admin key on the contract
    const signTx = await transaction.sign(PrivateKey.fromString(account2PrivateKey));

    //Submit the transaction to a Hedera network

    //Sign the transaction with the client operator's private key and submit to a Hedera network
    const txResponse = await signTx.execute(client);

    //Get the receipt of the transaction
    const receipt = await txResponse.getReceipt(client);

    //Get the transaction consensus status
    const transactionStatus = receipt.status;

    console.log("The transaction consensus status is " + transactionStatus);


    process.exit();
}

main();



