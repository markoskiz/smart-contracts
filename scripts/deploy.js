const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("📦 Deploying with:", deployer.address);
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("💰 Balance:", ethers.formatEther(balance), "ETH");

  // Chainlink Sepolia VRF values:
  const vrfCoordinator = "0x8103B0A8A00be2DDC778e6e7eaa21791Cd364625";
  const keyHash = "0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c";
  const subscriptionId = 12379  ; // 👈 Replace with your real number

  const Raffle = await ethers.getContractFactory("ChainLinkCasino");
  const raffle = await Raffle.deploy(vrfCoordinator, keyHash, subscriptionId);

  await raffle.waitForDeployment();

  const address = await raffle.getAddress();
  console.log("✅ Contract deployed at:", address);
}

main().catch((err) => {
  console.error("❌ Deployment failed:", err);
  process.exit(1);
});
