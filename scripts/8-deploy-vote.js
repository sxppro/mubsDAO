import sdk from './1-initialize-sdk.js';

const app = sdk.getAppModule('0x158E45143277e3f0DB0C726D24E45BBC8a55C18F');

/**
 * Deploy governance contract
 */
(async () => {
  try {
    const voteModule = await app.deployVoteModule({
      name: 'MubsDAO Proposals',
      votingTokenAddress: '0x6578a34004a875d9913BcD4fDb439eDEF640A888', // Governance token
      proposalStartWaitTimeInSeconds: 0,
      proposalVotingTimeInSeconds: 24 * 60 * 60,
      votingQuorumFraction: 0,
      minimumNumberOfTokensNeededToPropose: '0',
    });
    console.log(`✅ Deployed vote module to ${voteModule.address}`);
  } catch (err) {
    console.error('🛑 Failed to deploy vote module', err);
  }
})();
