import { ethers } from 'ethers';
import sdk from './1-initialize-sdk.js';

const bundleDropModule = sdk.getBundleDropModule(
  '0x32Beb963A73B70eC4EE47f94b2D534e5E11b05EA'
);

const tokenModule = sdk.getTokenModule(
  '0x6578a34004a875d9913BcD4fDb439eDEF640A888'
);

(async () => {
  try {
    // Get addresses that own membership NFT
    const wallets = await bundleDropModule.getAllClaimerAddresses('0');

    if (wallets.length === 0) {
      console.log(`ℹ️ No members`);
      process.exit(0);
    }

    const airdropTargets = wallets.map((address) => {
      const randomAmount = Math.floor(
        Math.random() * (10000 - 1000 + 1) + 1000
      );
      console.log(`ℹ️ Airdropping ${randomAmount} $MUBS to ${address}`);
      const airdropTarget = {
        address,
        amount: ethers.utils.parseUnits(randomAmount.toString(), 18),
      };
      return airdropTarget;
    });

    console.log(`ℹ️ Commencing airdrop`);
    await tokenModule.transferBatch(airdropTargets);
    console.log(`✅ Airdropped to all members`);
  } catch (err) {
    console.error(`🛑 Failed to airdrop tokens: ${err}`);
  }
})();
