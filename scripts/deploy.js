const hre = require("hardhat");

const INITIAL_ANSWER = 10012;
const INTERVAl = 10;
const DECIMAL = 8;

async function main() {
  const ExampleExternalContract = await ethers.getContractFactory("MockV3Aggregator");
  const exampleExternalContract = await ExampleExternalContract.deploy(DECIMAL, INITIAL_ANSWER);

  const MyContract = await hre.ethers.getContractFactory("DynamicNFT");
  const myContract = await MyContract.deploy(INTERVAl, exampleExternalContract.address);
  
  await myContract.deployed();

  console.log("MockV3Aggregator deployed to:", exampleExternalContract.address);
  console.log("DynamicNFT deployed to:", myContract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });