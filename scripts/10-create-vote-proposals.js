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
    const amount = 100_000;
    await tokenModule.delegateTo(process.env.WALLET_ADDRESS);
    await voteModule.propose(
      'The DAO should mint an additional ' + amount + ' tokens in the treasury',
      [
        {
          nativeTokenValue: 0,
          transactionData: tokenModule.contract.interface.encodeFunctionData(
            // Minting to the vote module, acting as our treasury
            'mint',
            [voteModule.address, ethers.utils.parseUnits(amount.toString(), 18)]
          ),
          // Token module actually executes the mint
          toAddress: tokenModule.address,
        },
      ]
    );
    console.log(`✅ Successfully created proposal to mint tokens`);
  } catch (err) {
    console.error('🛑 Failed to create proposal: ', err);
  }

  try {
    const amount = 1_000;
    await tokenModule.delegateTo(process.env.WALLET_ADDRESS);
    await voteModule.propose(
      'The DAO should transfer' +
        amount +
        ' tokens to ' +
        process.env.WALLET_ADDRESS,
      [
        {
          nativeTokenValue: 0,
          transactionData: tokenModule.contract.interface.encodeFunctionData(
            // Transfer to the designated address, from the treasury
            'transfer',
            [
              process.env.WALLET_ADDRESS,
              ethers.utils.parseUnits(amount.toString(), 18),
            ]
          ),
          // Token module actually executes the mint
          toAddress: tokenModule.address,
        },
      ]
    );
    console.log(`✅ Successfully created proposal to transfer tokens`);
  } catch (err) {
    console.error('🛑 Failed to create proposal: ', err);
  }
})();
