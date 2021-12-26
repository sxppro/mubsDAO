import { ThirdwebSDK } from '@3rdweb/sdk';
import ethers from 'ethers';
import dotenv from 'dotenv';

dotenv.config();

// Checking env variables
if (!process.env.PRIVATE_KEY || process.env.PRIVATE_KEY === '') {
  console.log('🛑 Private key not found');
}

if (!process.env.ALCHEMY_API_URL || process.env.ALCHEMY_API_URL === '') {
  console.log('🛑 Alchemy API not found');
}

if (!process.env.WALLET_ADDRESS || process.env.WALLET_ADDRESS === '') {
  console.log('🛑 Wallet address not found');
}

const sdk = new ThirdwebSDK(
  new ethers.Wallet(
    process.env.PRIVATE_KEY,
    ethers.getDefaultProvider(process.env.ALCHEMY_API_URL)
  )
);

// Immediately fetch project from Thirdweb
(async () => {
  try {
    const apps = await sdk.getApps();
    console.log(`App address: ${apps[0].address}`);
  } catch (err) {
    console.error(`Failed to fetch apps from SDK :: ${err}`);
    process.exit(1);
  }
})();

export default sdk;
