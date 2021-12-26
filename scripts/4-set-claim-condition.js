import sdk from './1-initialize-sdk.js';

const bundleDrop = sdk.getBundleDropModule(
  '0x32Beb963A73B70eC4EE47f94b2D534e5E11b05EA'
);

(async () => {
  try {
    const claimConditionFactory = bundleDrop.getClaimConditionFactory();
    claimConditionFactory.newClaimPhase({
      startTime: new Date(),
      maxQuantity: 1_000,
      maxQuantityPerTransaction: 1,
    });

    await bundleDrop.setClaimCondition(0, claimConditionFactory);
    console.log(`✅ Successfully set claim condition`);
  } catch (err) {
    console.log(`❌ Failed to set claim condition`);
  }
})();
