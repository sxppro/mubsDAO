import { ethers } from 'ethers';
import sdk from './1-initialize-sdk.js';
import { readFileSync } from 'fs';

const app = sdk.getAppModule('0x158E45143277e3f0DB0C726D24E45BBC8a55C18F');

(async () => {
  try {
    const bundleDropModule = await app.deployBundleDropModule({
      // Collection name & desc
      name: 'MUBS Membership',
      description: 'Membership Token for members of MUBS',
      // Membership image
      image: readFileSync('scripts/assets/Logo.png'),
      // Address for proceeds of sales
      primarySaleRecipientAddress: ethers.constants.AddressZero,
    });
    console.log(
      `✅ Deployed Bundle Drop module to ${bundleDropModule.address}`
    );
    console.log(
      `ℹ️ Bundle Drop Metadata: ${await bundleDropModule.getMetadata()}`
    );
  } catch (err) {
    console.log(`❌ Failed to deploy Bundle Drop module: ${err}`);
  }
})();
