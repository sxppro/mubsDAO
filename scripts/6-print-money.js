import { ethers } from 'ethers';
import sdk from './1-initialize-sdk.js';

const tokenModule = sdk.getTokenModule(
  '0x6578a34004a875d9913BcD4fDb439eDEF640A888'
);

(async () => {
  try {
    const maxSupply = 1_000_000;
    const maxSupply18Decimals = ethers.utils.parseUnits(
      maxSupply.toString(),
      18
    );
    await tokenModule.mint(maxSupply18Decimals);
    const totalSupply = await tokenModule.totalSupply();

    console.log(
      `ℹ️ There is currently ${ethers.utils.formatUnits(
        totalSupply,
        18
      )} $MUBS in circulation`
    );
  } catch (err) {
    console.error(`🛑 Failed to establish token supply: ${err}`);
  }
})();
