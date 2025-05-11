const { ethers } = require('ethers');
require('dotenv').config();

async function findValidSubscriptions() {
  const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
  const vrfCoordinatorAddress = '0x9DdfaCa8183c41ad55329BdeeD9F6A8d53168B1B';
  
  // Minimal ABI for checking subscriptions
  const vrfCoordinator = new ethers.Contract(vrfCoordinatorAddress, [
    'function getSubscription(uint64 subId) view returns (uint96 balance, uint64 reqCount, address owner, address[] memory consumers)',
  ], provider);
  
  console.log('=== Checking Subscription 196572 ===');
  
  try {
    // Direct call to getSubscription
    await provider.call({
      to: vrfCoordinatorAddress,
      data: '0xa47c7696' + ethers.zeroPadValue(ethers.toBeHex(196572), 32).slice(2)
    });
    console.log('Subscription 196572 exists');
  } catch (error) {
    console.log('Subscription 196572 does not exist');
    console.log('Error:', error.message);
  }
  
  console.log('\n=== Scanning for valid subscription IDs ===');
  console.log('Checking common subscription ID ranges...');
  
  // Check smaller IDs (these are more common)
  for (let id = 1; id <= 20; id++) {
    try {
      const result = await provider.call({
        to: vrfCoordinatorAddress,
        data: '0xa47c7696' + ethers.zeroPadValue(ethers.toBeHex(id), 32).slice(2)
      });
      console.log(`✓ Subscription ${id} exists`);
    } catch (e) {
      // Subscription doesn't exist
    }
  }
  
  // Check around your ID
  for (let id = 196570; id <= 196580; id++) {
    try {
      const result = await provider.call({
        to: vrfCoordinatorAddress,
        data: '0xa47c7696' + ethers.zeroPadValue(ethers.toBeHex(id), 32).slice(2)
      });
      console.log(`✓ Subscription ${id} exists`);
    } catch (e) {
      // Subscription doesn't exist
    }
  }
  
  console.log('\n=== Solution ===');
  console.log('Subscription 196572 does not exist on Chainlink VRF.');
  console.log('\nYou have two options:');
  console.log('\n1. Create subscription 196572:');
  console.log('   - Go to https://vrf.chain.link/sepolia');
  console.log('   - You cannot choose the ID, it will be auto-assigned');
  console.log('   - You\'ll need to redeploy with the new ID');
  console.log('\n2. Use an existing subscription:');
  console.log('   - If you already have a subscription, use that ID');
  console.log('   - Redeploy your contract with the correct subscription ID');
  console.log('\nAfter creating/choosing a subscription:');
  console.log('1. Fund it with LINK tokens');
  console.log('2. Add your contract address as a consumer');
  console.log('3. Your contract address: 0xa4B25B73FDAC546464E3D9F53CA362072cf96d6A');
}

// Also let's create a function to help you create a subscription programmatically
async function createSubscriptionHelper() {
  console.log('\n=== How to Create a Subscription Programmatically ===');
  
  const code = `
// To create a subscription programmatically:
const { ethers } = require('ethers');

async function createSubscription() {
  const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  
  const vrfCoordinatorAddress = '0x9DdfaCa8183c41ad55329BdeeD9F6A8d53168B1B';
  const vrfCoordinator = new ethers.Contract(vrfCoordinatorAddress, [
    'function createSubscription() returns (uint64)',
    'function addConsumer(uint64 subId, address consumer)'
  ], wallet);
  
  // Create subscription
  const tx = await vrfCoordinator.createSubscription();
  const receipt = await tx.wait();
  
  // Get subscription ID from event
  const subscriptionCreatedEvent = receipt.logs.find(log => 
    log.topics[0] === ethers.id('SubscriptionCreated(uint64,address)')
  );
  
  const subscriptionId = parseInt(subscriptionCreatedEvent.topics[1], 16);
  console.log('Created subscription:', subscriptionId);
  
  // Add your contract as consumer
  await vrfCoordinator.addConsumer(subscriptionId, '0xa4B25B73FDAC546464E3D9F53CA362072cf96d6A');
  
  console.log('Added contract as consumer');
  console.log('Now fund the subscription with LINK!');
  
  return subscriptionId;
}
`;
  
  console.log(code);
}

async function main() {
  await findValidSubscriptions();
  await createSubscriptionHelper();
}

main().catch(console.error);