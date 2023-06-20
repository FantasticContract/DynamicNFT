# DynamicNFT

This project demonstrates a dynamic NFT which changes his uri depending on an external price feed. It comes with the main contract, a test for that contract, and a script that deploys that contract.

The contract uses Chainlink’s decentralized and cryptographically secured oracle network to get and track asset price data.  

Then, it will use the automations from the [Chainlink Keepers Network](https://docs.chain.link/chainlink-automation/introduction) to automate your NFT smart contract to update the NFTs according to the asset price data you're tracking.  

If the market price moves up, the smart contract will pick the NFT’s URI to point to the bullish image and the NFT will be dynamically updated.  

```shell
npx hardhat test
npx hardhat run scripts/deploy.js --network sepolia
```

## Deployed contracts on Sepolia
  https://sepolia.etherscan.io/address/0xeb85F8C65D8dC2a5477c8745ed17BA0E5B6C9251#code
  https://sepolia.etherscan.io/address/0xeb85f8c65d8dc2a5477c8745ed17ba0e5b6c9251#code