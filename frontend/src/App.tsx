import { useState } from 'react'
import { ChakraProvider, Box, VStack, Input, Button, Text, Container, Heading, useToast, Flex } from '@chakra-ui/react'
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
      <Flex
        direction="column"
        minH="100vh"
        w="100%"
        bg={theme.colors.brand.background}
        overflow="hidden"
      >
        <Flex
          direction={{ base: "column", md: "row" }}
          minH="100vh"
          w="100%"
        >
          {/* Left side - Fixed width on desktop, full width on mobile */}
          <Flex
            direction="column"
            w={{ base: "100%", md: "370px" }}
            minH={{ base: "auto", md: "100vh" }}
            p={6}
            borderRight={{ base: "none", md: "1px solid rgba(255,255,255,0.1)" }}
          >
            <Box textAlign="center" color="white" mb={8}>
              <Heading size="2xl" mb={4}>The 10K Squad</Heading>
              <Text fontSize="xl">Whitelist Checker</Text>
              <Text fontSize="sm" mt={2}>Total addresses: {whitelist.length}</Text>
            </Box>

            {/* Space for artwork */}
            <Box
              h={{ base: "150px", md: "200px" }}
              bg="rgba(255,255,255,0.1)"
              borderRadius="lg"
              mb={8}
              display="flex"
              justifyContent="center"
              alignItems="center"
              overflow="hidden"
            >
              <Text color="white" fontSize="lg">Your artwork will go here</Text>
            </Box>

            <Box
              bg="white"
              p={6}
              borderRadius="lg"
              boxShadow="xl"
              mt="auto"
              mb={{ base: 6, md: 0 }}
            >
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
          </Flex>

          {/* Right side - Flexible width on desktop, hidden on mobile */}
          <Flex
            flex={1}
            display={{ base: "none", md: "flex" }}
            justifyContent="center"
            alignItems="center"
            p={8}
          >
            {/* You can add additional content here for desktop view */}
          </Flex>
        </Flex>
      </Flex>
    </ChakraProvider>
  )
}

export default App
