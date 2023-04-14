const dotenv = require("dotenv");
dotenv.config();
const fs = require("fs/promises");

const {
    Client,
    ContractCreateFlow,
    PrivateKey
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
    const contractString = await fs.readFile("./artifacts/2_smart_contract/contracts/certificationC3.sol/CertificationC1.json");
    console.log(contractString);
    let contract = JSON.parse(contractString);
    const bytecode = contract.bytecode;


    //Create the transaction
    const contractCreate = new ContractCreateFlow()
        .setGas(100000)
        .setAdminKey(PrivateKey.fromString(account2PrivateKey))
        .setBytecode(bytecode);

    //Sign the transaction with the client operator key and submit to a Hedera network
    const txResponse = contractCreate.execute(client);

    //Get the receipt of the transaction
    const receipt = (await txResponse).getReceipt(client);

    //Get the new contract ID
    const newContractId = (await receipt).contractId;
        
    console.log("The new contract ID is " +newContractId);

    process.exit();
}

main();



