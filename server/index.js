const utils = require("ethereum-cryptography/utils");
const secp = require("ethereum-cryptography/secp256k1");
const sha = require("ethereum-cryptography/sha256");


const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "03ad197e2ab531d1a91caefda8b32bad08d7c9a04b4aa780c4f7d5623dc15df703": 100,
  "028cae7d377febc7c62963ea0998e02c01e5406764d678628dd0aecfe4c3cf56d7": 50,
  "02bc1bda07bc538f02bc38e64994de3ffc9dc08027907f81e1b42bd8d12dd1fb35": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { strTransaction, hashString, sigString } = req.body;
  console.log("Entrei..." + strTransaction + hashString);
  let transaction = JSON.parse(strTransaction);
  let signature = sigString;

  console.log("Transaction: "+ transaction);

  const computedHash = sha.sha256(utils.utf8ToBytes(strTransaction));

  console.log("Comp Hash: " + computedHash);

  if(computedHash.toString() !== hashString){
    res.status(403).send({message: "Hashes are different."});
  }
  
  const sender = transaction.sender;
  const recipient = transaction.recipient;
  const amount = transaction.amount;

  const isSigned = secp.secp256k1.verify(signature, computedHash, sender);

  if(!isSigned){
    res.status(403).send({message: "Transaction not accepted. Invalid credentials."});
  }

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
