const secp = require('ethereum-cryptography/secp256k1');
const { toHex, utf8ToBytes } = require("ethereum-cryptography/utils");
const { keccak256 } = require("ethereum-cryptography/keccak");

const privKey1 = secp.secp256k1.utils.randomPrivateKey();
const privKey2 = secp.secp256k1.utils.randomPrivateKey();
const privKey3 = secp.secp256k1.utils.randomPrivateKey();

const pubKey1 = secp.secp256k1.getPublicKey(privKey1);
const pubKey2 = secp.secp256k1.getPublicKey(privKey2);
const pubKey3 = secp.secp256k1.getPublicKey(privKey3);

const pk1Hash = keccak256(pubKey1.slice(1));
const pk2Hash = keccak256(pubKey2.slice(1));
const pk3Hash = keccak256(pubKey3.slice(1));

const addr1 = toHex(pk1Hash.slice(pk1Hash.length - 20));
const addr2 = toHex(pk2Hash.slice(pk2Hash.length - 20));
const addr3 = toHex(pk3Hash.slice(pk3Hash.length - 20));

console.log("Priv Key 1: " + toHex(privKey1));
console.log("Pub Key 1: " + toHex(pubKey1));
console.log("pkHash 1: " + toHex(pk1Hash));
console.log("Addr1: " + addr1);

console.log("Priv Key 2: " + toHex(privKey2));
console.log("Pub Key 2: " + toHex(pubKey2));
console.log("pkHash 2: " + toHex(pk2Hash));
console.log("Addr2: " + addr2);

console.log("Priv Key 3: " + toHex(privKey3));
console.log("Pub Key 3: " + toHex(pubKey3));
console.log("pkHash 3: " + toHex(pk3Hash));
console.log("Addr3: " + addr3);

