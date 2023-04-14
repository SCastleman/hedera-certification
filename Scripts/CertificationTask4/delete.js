const dotenv = require("dotenv");
dotenv.config();
const fs = require("fs/promises");

const {
    Client,
    ScheduleDeleteTransaction,
    ScheduleInfoQuery,
    PrivateKey
} = require("@hashgraph/sdk");

require('dotenv').config({ path: '../../.env' });
const account1Id = process.env.ACCOUNT_1_ID
const account1PrivateKey = process.env.ACCOUNT_1_PRIVATE_KEY

const account2Id = process.env.ACCOUNT_2_ID
const account2PrivateKey = process.env.ACCOUNT_2_PRIVATE_KEY

const SCHEDULE_ID = process.env['SCHEDULE_ID'];

async function main() {
    // Create our connection to the Hedera network
    // The Hedera JS SDK makes this really easy!
    const client = Client.forTestnet();

    client.setOperator(account1Id, account1PrivateKey);

    //Create the query
    const query = new ScheduleInfoQuery()
    .setScheduleId(SCHEDULE_ID);

    //Sign with the client operator private key and submit the query request to a node in a Hedera network
    const info = await query.execute(client);
    console.log(info);

    //Create the transaction and sign with the admin key
    const transaction = await new ScheduleDeleteTransaction()
        .setScheduleId(SCHEDULE_ID)
        .freezeWith(client)
        .sign(PrivateKey.fromString(account1PrivateKey));

    //Sign with the operator key and submit to a Hedera network
    const txResponse = await transaction.execute(client);

    //Get the transaction receipt
    const receipt = await txResponse.getReceipt(client);

    //Get the transaction status
    const transactionStatus = receipt.status;
    console.log("The transaction consensus status is " +transactionStatus);
    


    process.exit();
}

main();



