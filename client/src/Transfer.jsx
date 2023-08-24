import { useState } from "react";
import server from "./server";
import * as secp from "ethereum-cryptography/secp256k1";
import * as utils from "ethereum-cryptography/utils";
import * as sha from "ethereum-cryptography/sha256";

BigInt.prototype.toJSON = function() { return this.toString() };

function Transfer({ address, setBalance }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [privKey, setPrivKey] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();
    let transaction = {
      sender: address,
      amount: parseInt(sendAmount),
      recipient,
    };
    let strTransaction = JSON.stringify(transaction);
    let transactionHash = sha.sha256(utils.utf8ToBytes(strTransaction));
    let hashString = transactionHash.toString();
    let signature = secp.secp256k1.sign(transactionHash, privKey);
    let sigString = signature.toCompactHex();

    console.log("Transaction Hash: " + transactionHash);

    try {
      const {
        data: { balance },
      } = await server.post(`send`, {
        strTransaction,
        hashString,
        sigString
      });
      setBalance(balance);
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <label>
        Private Key (Should require signature from Wallet software)
        <input
          placeholder="Your private key..."
          value={privKey}
          onChange={setValue(setPrivKey)}
          ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
