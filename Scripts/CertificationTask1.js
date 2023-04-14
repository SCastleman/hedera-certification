const {
  Client,
  AccountCreateTransaction,
  Hbar,
  Key,
  PrivateKey
} = require("@hashgraph/sdk");
require('dotenv').config({ path: '../.env' });
const myAccountId = process.env.MY_ACCOUNT_ID
const myPrivateKey = process.env.MY_PRIVATE_KEY

async function createAccount(num) {
  // Setting up a client connected to testnet
  const client = Client.forTestnet();
  client.setOperator(myAccountId, myPrivateKey);

  // Generating a new key for the account we're about to create
  const key = await PrivateKey.generateED25519Async();
  const pubKey = key.publicKey

  // Here we create the transaction object which we will execute shortly. 
  // We set the public key as generated above, and provide an initial balance of 10 HBAR
  const transaction = new AccountCreateTransaction()
      .setKey(pubKey)
      .setInitialBalance(new Hbar(10))

  // Finally, we execute the transaction and get the receipts
  const txResponse = await transaction.execute(client)
  const receipt = await txResponse.getReceipt(client)

  const newAccountId = receipt.accountId

  // With the newly created account, we construct a string with the three
  // important pieces of information: account number, public key, and private key.
  // These will be logged in an easy to read format.
  let returnString = ""
  returnString += `Account number ${num} account ID: ${newAccountId} \n` 
  returnString += `Acocunt number ${num} public key: ${pubKey} \n`
  returnString += `Acocunt number ${num} private key: ${key} \n`

return returnString
}

// Here we actually execute the above create account method, inside a loop
// so we can generate the appropriate account numbers. Each loop creates one
// account, and once done, emits the details that were constructed and returned
// in the account creation method.
for (let i = 1; i < 6; i++) {
  createAccount(i).then(res => console.log(res))
}
