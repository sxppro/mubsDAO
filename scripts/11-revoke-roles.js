import sdk from './1-initialize-sdk.js';

const tokenModule = sdk.getTokenModule(
  '0x6578a34004a875d9913BcD4fDb439eDEF640A888'
);

(async () => {
  try {
    console.log('ℹ️ Roles: ', await tokenModule.getAllRoleMembers());
    await tokenModule.revokeAllRolesFromAddress(process.env.WALLET_ADDRESS);
    console.log(
      'ℹ️ Roles (after revocation): ',
      await tokenModule.getAllRoleMembers()
    );
  } catch (err) {
    console.error(err);
  }
})();
