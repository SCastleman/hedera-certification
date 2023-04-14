const dotenv = require("dotenv");
dotenv.config();
const fs = require("fs/promises");

const {
    Client,
    TransferTransaction,
    ScheduleCreateTransaction,
    Hbar,
    PrivateKey,
    ScheduleInfoQuery,
    AccountId,
    TransactionReceiptQuery,
    ScheduleId,
    Timestamp
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

    //Create a transaction to schedule
    const transaction = new TransferTransaction()
        .addHbarTransfer(account1Id , Hbar.fromTinybars(-100))
        .addHbarTransfer(account2Id, Hbar.fromTinybars(100))

    //Schedule a transaction
    const scheduleTransaction = await new ScheduleCreateTransaction()
        .setScheduledTransaction(transaction)
        .setScheduleMemo("Scheduled TX testing" + (Math.floor(Math.random() * 100)))
        .setAdminKey(PrivateKey.fromString(account1PrivateKey))
        .execute(client);

    //Get the receipt of the transaction
    const receipt = await scheduleTransaction.getReceipt(client);

    //Get the schedule ID
    const scheduleId = receipt.scheduleId;
    console.log("The schedule ID is " +scheduleId);

    //Get the scheduled transaction ID
    const scheduledTxId = receipt.scheduledTransactionId;
    console.log("The scheduled transaction ID is " +scheduledTxId);

    console.log("Status:", receipt.status.toString());

    //Create the query
    const query = new ScheduleInfoQuery()
    .setScheduleId(scheduleId);

    //Sign with the client operator private key and submit the query request to a node in a Hedera network
    const info = await query.execute(client);
    console.log("The scheduledId you queried for is: ", new ScheduleId(info.scheduleId).toString());
    console.log("The memo for it is: ", info.scheduleMemo);
    console.log("It was created by: ", new AccountId(info.creatorAccountId).toString());
    console.log("It was payed by: ", new AccountId(info.payerAccountId).toString());
    console.log("The expiration time of the scheduled tx is: ", new Timestamp(info.expirationTime).toDate());
    if(new Timestamp(info.executed).toDate().getTime() === new Date("1970-01-01T00:00:00.000Z").getTime()) {
        console.log("The transaction has not been executed yet. (for the cert)");
    } else {
        console.log("The time of execution of the scheduled tx is: ", new Timestamp(info.executed).toDate());
    }

    // let notWorkingReceipt;
    // try {
    //     notWorkingReceipt = await transaction.execute(client);
    // }
    // catch (e) {
    //     console.error(e);
    // }

    // // Get the transaction consensus status
    // const transactionStatus = notWorkingReceipt.status;
    // console.log(notWorkingReceipt);

    

    // const transReceipt = await (new TransactionReceiptQuery())
    // .setTransactionId(scheduledTxId)
    // .execute(client)

    // console.log(transReceipt.status.toString());    


    process.exit();
}

main();



