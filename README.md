# Ethereum's transactions tracker

A ETH's transaction crawler. Features:
  - Get and store raw transaction from blockchain. 
  - Process then store processed raw transaction.

### Specifications
Using **two** mongodb databases.
- Database name: `full-txs`. Collection: `eth` to store raw transactions.
- Database name: `short-txs`. Collection: `eth` to store processed transactions (short-detail version of transction).

### Installation
Create `.env` as provided `.env.example` file.

Install the dependencies and devDependencies and start the server.

```sh
$ cd eth-txs
$ npm install
$ npm start
```

