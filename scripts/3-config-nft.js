import sdk from './1-initialize-sdk.js';
import { readFileSync } from 'fs';

const bundleDrop = sdk.getBundleDropModule(
  '0x32Beb963A73B70eC4EE47f94b2D534e5E11b05EA'
);

(async () => {
  try {
    await bundleDrop.createBatch([
      {
        name: 'MUBS Tricube',
        description: 'This NFT provides you access to MubsDAO',
        image: readFileSync('scripts/assets/Logo.png'),
      },
    ]);
    console.log(`✅ Successfully created a new NFT in the drop`);
  } catch (err) {
    console.error(`❌ Failed to create new NFT in the drop`);
  }
})();
