import { useState, useEffect, useMemo } from "react";
import { useWeb3 } from "@3rdweb/hooks";
import { ThirdwebSDK } from "@3rdweb/sdk"
import { Flex, Heading, Button } from '@chakra-ui/react'

const sdk = new ThirdwebSDK("rinkeby");
const bundleDropModule = sdk.getBundleDropModule("0x32Beb963A73B70eC4EE47f94b2D534e5E11b05EA")

const App = () => {
  const { connectWallet, address, error, provider } = useWeb3();
  const signer = provider ? provider.getSigner() : undefined; // Required to sign transactions on-chain
  

  console.log(`👋 Address: ${address}`);

  // State
  const [hasClaimedNFT, setHasClaimedNFT] = useState(false);

  useEffect(() => {
    if (!address) {
      return;
    }

    return bundleDropModule
      // Check if user owns a token with ID 0
      .balanceOf(address, "0")
      .then((balance) => {
        // balance > 0
        if (balance.gt(0)) {
          setHasClaimedNFT(true);
          console.log(`✅ Membership NFT`);
        } else {
          setHasClaimedNFT(false);
          console.log(`❌ Membership NFT`);
        }
      })
      .catch((err) => {
        setHasClaimedNFT(false);
        console.log(`🛑 Failed to check for membership NFT: ${err}`);
      })
  }, [address])

  if (!address) {
    return (
      <div className="landing">
        <Heading>Welcome to MubsDAO</Heading>
        <Button className="btn-hero" onClick={() => connectWallet("injected")}>Connect Wallet</Button>
      </div>
    )
  }

  return (
    <div className="landing"> 
      <Heading>Wallet Connected</Heading>
    </div>
  );
};

export default App;
