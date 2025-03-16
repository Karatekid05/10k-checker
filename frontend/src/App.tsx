import { useState } from 'react'
import { ChakraProvider, Box, VStack, Input, Button, Text, Container, Heading, useToast } from '@chakra-ui/react'
import AdminPage from './AdminPage'
import whitelist from './whitelist.json'

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
  const toast = useToast()

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
    
    // Check if the wallet is in the whitelist
    const normalizedAddress = walletAddress.toLowerCase().trim()
    const isWhitelisted = whitelist.some(address => 
      address.toLowerCase() === normalizedAddress
    )

    toast({
      title: isWhitelisted ? 'Congratulations!' : 'Not Found',
      description: isWhitelisted
        ? 'Your wallet is whitelisted!'
        : 'Your wallet is not on the whitelist.',
      status: isWhitelisted ? 'success' : 'info',
      duration: 5000,
      isClosable: true,
    })
    
    setIsChecking(false)
  }

  return (
    <ChakraProvider>
      <Box minH="100vh" bg={theme.colors.brand.background} py={10}>
        <Container maxW="container.md">
          <VStack spacing={8} align="stretch">
            <Box textAlign="center" color="white">
              <Heading size="2xl" mb={4}>The 10K Squad</Heading>
              <Text fontSize="xl">Whitelist Checker</Text>
            </Box>

            {/* Space for artwork */}
            <Box h="200px" bg="rgba(255,255,255,0.1)" borderRadius="lg" mb={8}>
              {/* Art will go here */}
            </Box>

            <Box bg="white" p={8} borderRadius="lg" boxShadow="xl">
              <VStack spacing={4}>
                <Input
                  placeholder="Enter your EVM wallet address"
                  size="lg"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                />
                <Button
                  size="lg"
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
        </Container>
      </Box>
    </ChakraProvider>
  )
}

export default App
