const {
  Client,
  AccountBalanceQuery,
  TransferTransaction,
  Hbar,
  PrivateKey,
  AccountId
} = require("@hashgraph/sdk");
require('dotenv').config({ path: '../../.env' })

const account1Id = process.env.ACCOUNT_1_ID
const account1PrivateKey = process.env.ACCOUNT_1_PRIVATE_KEY
const account2Id = process.env.ACCOUNT_2_ID
const account2PrivateKey = process.env.ACCOUNT_2_PRIVATE_KEY
const account3Id = process.env.ACCOUNT_3_ID
const account3PrivateKey = process.env.ACCOUNT_3_PRIVATE_KEY

const signerKey1 = signerKey1