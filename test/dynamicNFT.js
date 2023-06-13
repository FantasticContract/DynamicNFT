const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");
const { ethers } = require("hardhat");

const TOKEN_ID_0 = 0;
const TOKEN_ID_1 = 1;
const INITIAL_ANSWER = 10012;
const INTERVAl = 10;
const DECIMAL = 8;

async function deployContracts() {
  [deployer, account1] = await ethers.getSigners();

  const ExampleExternalContract = await ethers.getContractFactory("MockV3Aggregator");
  const exampleExternalContract = await ExampleExternalContract.deploy(DECIMAL, INITIAL_ANSWER);

  const DynamicNFT = await ethers.getContractFactory("DynamicNFT");
  const dynamicNFTContract = await DynamicNFT.deploy(INTERVAl, exampleExternalContract.address);

  return { exampleExternalContract, dynamicNFTContract, deployer, account1 };
}

describe("Deployment", async () => {

    it("Should deploy ExampleExternalContract and set latestAnswer", async () => {
      const { exampleExternalContract } = await loadFixture(deployContracts);
      expect(await exampleExternalContract.latestAnswer()).to.equal(INITIAL_ANSWER);
    });
});

describe("Mint", async () => {
  it("should not mint token if ether value is not sufficient", async () => {
    const { dynamicNFTContract } = await loadFixture(deployContracts);
    return await expect(dynamicNFTContract.connect(account1).safeMint({value: ethers.utils.parseEther("0.09")}))
            .to.be.revertedWith('Ether value sent is not sufficient');
  });


  it("should send the correct NFT to the minter", async () => {
    const { dynamicNFTContract } = await loadFixture(deployContracts);
    await dynamicNFTContract.connect(account1).safeMint({value: ethers.utils.parseEther("0.1")});
    expect(await dynamicNFTContract.ownerOf(TOKEN_ID_0)).to.equal(account1.address);
    expect(await dynamicNFTContract.tokenURI(TOKEN_ID_0)).to.include("filename=gamer_bull.json");
    await expect(dynamicNFTContract.tokenURI(TOKEN_ID_1)).to.be.revertedWith('ERC721: invalid token ID');
  });
});

describe('Changing the URI', async () => {
  it("should change the URI to Bear when latesAnswer < currentPrice", async () => {
    const { exampleExternalContract, dynamicNFTContract, account1 } = await loadFixture(deployContracts);
    await dynamicNFTContract.connect(account1).safeMint({value: ethers.utils.parseEther("0.1")});

    expect(await dynamicNFTContract.tokenURI(TOKEN_ID_0)).to.include("filename=gamer_bull.json");
    await exampleExternalContract.updateAnswer(INITIAL_ANSWER - 1);
    expect(await exampleExternalContract.latestAnswer()).to.equal(INITIAL_ANSWER - 1);

    const lastTimeStamp =  await dynamicNFTContract.lastTimeStamp();
    await time.increaseTo(parseInt(lastTimeStamp) + INTERVAl);
    await dynamicNFTContract.performUpkeep(0);
    console.log(await dynamicNFTContract.tokenURI(TOKEN_ID_0))
    expect(await dynamicNFTContract.tokenURI(TOKEN_ID_0)).to.include("filename=beanie_bear.json");
  });
})