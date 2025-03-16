import { useState } from 'react'
import { ChakraProvider, Box, VStack, Input, Button, Text, Heading, useToast, Flex, Center } from '@chakra-ui/react'
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

    // Handle both formats: simple array of strings or array of arrays
    const isWhitelisted = whitelist.some((item: any) => {
      // If item is an array (like ["0x123...", ""]), check the first element
      if (Array.isArray(item)) {
        return item[0].toLowerCase() === normalizedAddress
      }
      // If item is a string, check directly
      return typeof item === 'string' && item.toLowerCase() === normalizedAddress
    })

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
            </Box>

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
              <Text color="white" fontSize="md">Your artwork will go here</Text>
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
