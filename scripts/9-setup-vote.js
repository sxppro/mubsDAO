import { ethers } from 'ethers';
import sdk from './1-initialize-sdk.js';

const voteModule = sdk.getVoteModule(
  '0xa0d7a869e723e1f94dce7c1ec73f5882ffbb9be7'
);
const tokenModule = sdk.getTokenModule(
  '0x6578a34004a875d9913BcD4fDb439eDEF640A888'
);

(async () => {
  try {
    await tokenModule.grantRole('minter', voteModule.address);
    console.log(`✅ Granted vote module permissions to access token module`);
  } catch (err) {
    console.error('🛑 Failed to grant vote module access to token module', err);
    process.exit(1);
  }

  try {
    const ownedTokenBalance = await tokenModule.balanceOf(
      process.env.WALLET_ADDRESS
    );
    const ownedAmount = ethers.BigNumber.from(ownedTokenBalance.value);
    const percent90 = ownedAmount.div(100).mul(90);

    await tokenModule.transfer(voteModule.address, percent90);

    console.log(`✅ Successfully transferred tokens to vote module`);
  } catch (err) {
    console.error('🛑 Failed to transfer tokens to vote module', err);
  }
})();
