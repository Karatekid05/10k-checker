import { useState, useEffect } from 'react'
import { ChakraProvider, Box, VStack, Input, Button, Text, Heading, useToast, Image } from '@chakra-ui/react'
import AdminPage from './AdminPage'
import whitelist from './whitelist.json'
import { checkWhitelistPhase, getWhitelistMessage, PHASE_1_SIZE, PHASE_2_SIZE } from './whitelistPhases'

// Brand colors from the website
const theme = {
  colors: {
    brand: {
      purple: '#4B0082',
      pink: '#FF69B4',
      background: '#4B0082',
    },
  },
}

function App() {
  // Check if we're on the admin page
  const isAdminPage = window.location.pathname === '/admin'

  if (isAdminPage) {
    return (
      <ChakraProvider>
        <AdminPage />
      </ChakraProvider>
    )
  }

  const [walletAddress, setWalletAddress] = useState('')
  const [isChecking, setIsChecking] = useState(false)
  const [debugInfo, setDebugInfo] = useState('')
  const toast = useToast()

  // Function to help debug specific wallet addresses
  useEffect(() => {
    const checkSpecificAddress = async () => {
      const testAddress = '0xB935979B27912f8453760f55E4fCE4A7b5674150';
      const normalizedAddress = testAddress.toLowerCase().trim();

      // Check if the address is in the whitelist
      const index = whitelist.findIndex((item: any) => {
        if (Array.isArray(item)) {
          return item[0].toLowerCase() === normalizedAddress;
        }
        return typeof item === 'string' && item.toLowerCase() === normalizedAddress;
      });

      const phase = checkWhitelistPhase(testAddress);

      setDebugInfo(`Test address ${testAddress} is at index ${index}, phase: ${phase}`);
      console.log(`Test address ${testAddress} is at index ${index}, phase: ${phase}`);
      console.log(`PHASE_1_SIZE: ${PHASE_1_SIZE}, PHASE_2_SIZE: ${PHASE_2_SIZE}`);
      console.log(`whitelist length: ${whitelist.length}`);
    };

    checkSpecificAddress();
  }, []);

  const checkWallet = async () => {
    if (!walletAddress) {
      toast({
        title: 'Error',
        description: 'Please enter a wallet address',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    setIsChecking(true)

    // Log the whitelist structure for debugging
    console.log(`Whitelist type: ${typeof whitelist}`);
    console.log(`Whitelist length: ${whitelist.length}`);
    if (whitelist.length > 0) {
      console.log(`First item type: ${typeof whitelist[0]}`);
      console.log(`First item: ${JSON.stringify(whitelist[0])}`);
    }

    // Check which phase the wallet belongs to
    const phase = checkWhitelistPhase(walletAddress)
    const message = getWhitelistMessage(walletAddress)
    const isWhitelisted = phase !== null

    toast({
      title: isWhitelisted ? 'Congratulations!' : 'Not Found',
      description: isWhitelisted
        ? message
        : 'Your wallet is not on the whitelist.',
      status: isWhitelisted ? 'success' : 'info',
      duration: 5000,
      isClosable: true,
    })

    setIsChecking(false)
  }

  return (
    <ChakraProvider>
      <Box
        minH="100vh"
        w="100%"
        bg={theme.colors.brand.background}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Box
          w={{ base: "90%", sm: "400px" }}
          maxW="400px"
          bg="rgba(255,255,255,0.05)"
          borderRadius="xl"
          overflow="hidden"
          boxShadow="0 4px 30px rgba(0, 0, 0, 0.1)"
          backdropFilter="blur(5px)"
          border="1px solid rgba(255, 255, 255, 0.1)"
        >
          <VStack spacing={6} p={6}>
            <Box textAlign="center" color="white">
              <Heading size="xl" mb={2}>The 10K Squad</Heading>
              <Text fontSize="lg">Whitelist Checker</Text>
              <Text fontSize="sm" mt={1}>Total addresses: {whitelist.length}</Text>
              <Text fontSize="xs" mt={1}>Phase 1: {PHASE_1_SIZE} addresses | Phase 2: {PHASE_2_SIZE} addresses</Text>
            </Box>

            {/* Add debug info for development */}
            {debugInfo && (
              <Text fontSize="xs" color="white" mt={2} opacity={0.8}>
                Debug: {debugInfo}
              </Text>
            )}

            {/* Space for artwork */}
            <Box
              h="180px"
              w="100%"
              bg="rgba(255,255,255,0.1)"
              borderRadius="lg"
              display="flex"
              justifyContent="center"
              alignItems="center"
              overflow="hidden"
            >
              <Image
                src="/banner_10k.jpeg"
                alt="The 10K Squad Artwork"
                objectFit="cover"
                maxH="100%"
              />
            </Box>

            <Box
              bg="white"
              p={5}
              borderRadius="lg"
              boxShadow="md"
              w="100%"
            >
              <VStack spacing={4}>
                <Input
                  placeholder="Enter your EVM wallet address"
                  size="md"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                />
                <Button
                  size="md"
                  width="full"
                  bg={theme.colors.brand.pink}
                  color="white"
                  _hover={{ opacity: 0.9 }}
                  isLoading={isChecking}
                  onClick={checkWallet}
                >
                  Check Whitelist Status
                </Button>
              </VStack>
            </Box>
          </VStack>
        </Box>
      </Box>
    </ChakraProvider>
  )
}

export default App
