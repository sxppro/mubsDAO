import { useState, useEffect, useMemo } from "react";
import { useWeb3 } from "@3rdweb/hooks";
import { ThirdwebSDK } from "@3rdweb/sdk"
import { Flex, Heading, Button, VStack, Text, useToast } from '@chakra-ui/react'

const sdk = new ThirdwebSDK("rinkeby");
const bundleDropModule = sdk.getBundleDropModule("0x32Beb963A73B70eC4EE47f94b2D534e5E11b05EA")

const App = () => {
  const { connectWallet, address, error, provider } = useWeb3();
  const signer = provider ? provider.getSigner() : undefined; // Required to sign transactions on-chain
  const toast = useToast()

  console.log(`👋 Address: ${address}`);

  // State
  const [hasClaimedNFT, setHasClaimedNFT] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);

  const mintNFT = () => {
    setIsClaiming(true);
    bundleDropModule
      .claim("0", 1)
      .then(() => {
        setIsClaiming(false);
        setHasClaimedNFT(true);
        console.log(`✅ Successfully claimed: https://testnets.opensea.io/assets/${bundleDropModule.address}/0`);
      })
      .catch((err) => {
        console.error(`🛑 Failed to claim: ${err}`);
        setIsClaiming(false);
      })
  }

  useEffect(() => {
    sdk.setProviderOrSigner(signer)
  }, [signer])

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
      .finally(() => {
        toast({
          title: "Wallet connected",
          description: `${address.slice(0, 5)}...${address.slice(-3)}`,
          duration: 3500,
          isClosable: true
        })
      })
  }, [address])

  // Rendering

  if (!address) {
    return (
      <div className="landing">
        <VStack padding={8} spacing={4}>
          <Heading bgGradient="linear-gradient(135deg, rgb(164, 66, 245) 0%, rgb(245, 66, 239) 100%)" bgClip="text" size="3xl">Welcome to MubsDAO</Heading>
          <Button className="btn-hero" onClick={() => connectWallet("injected")}>Connect Wallet</Button>
        </VStack>
      </div>
    )
  }

  if (hasClaimedNFT) {
    return (
      <div className="member-page">
        <VStack padding={8} spacing={4}> 
          <Heading bgGradient="linear-gradient(135deg, rgb(235, 110, 52) 0%, rgb(235, 180, 52) 100%)" bgClip="text" size="3xl">MubsDAO</Heading>
          <Text>Welcome to MUBS!</Text>
        </VStack>
      </div>
    )
  }

  return (
    <div className="landing"> 
      <VStack padding={8} spacing={4}>    
        <Heading bgGradient="linear-gradient(135deg, rgb(255, 204, 51) 0%, rgb(226, 51, 255) 100%)" bgClip="text" size="3xl">MubsDAO Membership</Heading>
        <Button isLoading={isClaiming} loadingText="Minting" onClick={() => mintNFT()}>Become a member</Button>
      </VStack>
    </div>
  );
};

export default App;
