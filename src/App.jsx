import { useState, useEffect, useMemo } from "react";
import { useWeb3 } from "@3rdweb/hooks";
import { ThirdwebSDK } from "@3rdweb/sdk"
import { Heading, Button, VStack, Text, useToast, Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react'
import { ethers } from 'ethers';

const sdk = new ThirdwebSDK("rinkeby");
const bundleDropModule = sdk.getBundleDropModule("0x32Beb963A73B70eC4EE47f94b2D534e5E11b05EA")
const tokenModule = sdk.getTokenModule("0x6578a34004a875d9913BcD4fDb439eDEF640A888")
const voteModule = sdk.getVoteModule("0xa0d7a869e723e1f94dce7c1ec73f5882ffbb9be7")

const App = () => {
  const { connectWallet, address, error, provider } = useWeb3();
  const signer = provider ? provider.getSigner() : undefined; // Required to sign transactions on-chain
  const toast = useToast()

  console.log(`👋 Address: ${address}`);

  // State
  const [hasClaimedNFT, setHasClaimedNFT] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [memberTokenAmounts, setMemberTokenAmounts] = useState({});
  const [memberAddresses, setMemberAddresses] = useState([]);

  /**
   * Utility to shorten user addresses
   */
  const shortenAddresses = (addr) => {
    return addr.substring(0, 6) + "..." + addr.substring(addr.length - 4);
  }

  const mintNFT = () => {
    setIsClaiming(true);
    bundleDropModule
      .claim("0", 1)
      .then(() => {
        setHasClaimedNFT(true);
        console.log(`✅ Successfully claimed: https://testnets.opensea.io/assets/${bundleDropModule.address}/0`);
      })
      .catch((err) => {
        console.error(`🛑 Failed to claim: ${err}`);
      })
      .finally(() => {
        setIsClaiming(false);
      })
  }

  /**
   * Combine memberTokenAmounts and memberAddresses into a single array
   */
  const memberList = useMemo(() => {
    return memberAddresses.map((address) => {
      return {
        address,
        tokenAmount: ethers.utils.formatUnits(memberTokenAmounts[address] || 0, 18)
      }
    })
  }, [memberTokenAmounts, memberAddresses])

  /**
   * Enable writing to blockchain
   */
  useEffect(() => {
    sdk.setProviderOrSigner(signer)
  }, [signer])

  /**
   * Checking for membership NFT
   */
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
          description: `${address.substring(0, 6)}...${address.substring(address.length - 4)}`,
          duration: 3500,
          isClosable: true
        })
      })
  }, [address, toast])
  
  /**
   * Retrieve all addresses with membership NFT
   */
  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }

    bundleDropModule
      .getAllClaimerAddresses('0')
      .then((addresses) => {
        console.log("ℹ️ Members: ", addresses);
        setMemberAddresses(addresses);
      })
      .catch((err) => {
        console.error(`🛑 Failed to get members: ${err}`);
      })
  }, [hasClaimedNFT])

  /**
   * Retrieve number of tokens held by each member
   */
  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }

    tokenModule
      .getAllHolderBalances()
      .then((amounts) => {
        console.log("ℹ️ Amounts: ", amounts);
        setMemberTokenAmounts(amounts)
      })
      .catch((err) => {
        console.error(`🛑 Failed to get token amounts: ${err}`);
      })
  }, [hasClaimedNFT])

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
        <VStack padding={8} spacing={4} direction="column" align="center"> 
          <Heading bgGradient="linear-gradient(135deg, rgb(235, 110, 52) 0%, rgb(235, 180, 52) 100%)" bgClip="text" size="3xl">MubsDAO</Heading>
          <div>
            <div>
              <Heading as="h2">Member List</Heading>
              <Table className="card" variant="simple" borderRadius={4}>
                <Thead>
                  <Tr>
                    <Th>Address</Th>
                    <Th>Amount</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {memberList.map((member) => {
                    return (
                      <Tr key={member.address}>
                        <Td>{shortenAddresses(member.address)}</Td>
                        <Td>{member.tokenAmount}</Td>
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
            </div>
          </div>
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
