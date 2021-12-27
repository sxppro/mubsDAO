import sdk from './1-initialize-sdk.js';

const app = sdk.getAppModule('0x158E45143277e3f0DB0C726D24E45BBC8a55C18F');

(async () => {
  try {
    const tokenModule = await app.deployTokenModule({
      name: 'MUBS Governance Token',
      symbol: 'MUBS',
    });
    console.log(`✅ Deployed token module to: ${tokenModule.address}`);
  } catch (err) {
    console.error(`🛑 Failed to deploy token module: ${err}`);
  }
})();
