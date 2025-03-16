import { Box, VStack, Text, Heading, Link, Code, OrderedList, ListItem } from '@chakra-ui/react';
import whitelist from './whitelist.json';

function AdminPage() {
    return (
        <Box minH="100vh" bg="#4B0082" py={10}>
            <VStack spacing={8} maxW="container.md" mx="auto" px={4}>
                <Box textAlign="center" color="white">
                    <Heading size="xl">Admin Instructions</Heading>
                    <Text mt={2}>How to Update the Whitelist</Text>
                    <Text mt={2} fontSize="lg">Current Whitelist Size: {whitelist.length} addresses</Text>
                </Box>

                <Box bg="white" p={8} borderRadius="lg" w="full">
                    <VStack spacing={6} align="start">
                        <Text fontSize="lg" fontWeight="bold">
                            To update the whitelist, follow these steps:
                        </Text>

                        <OrderedList spacing={4} pl={4}>
                            <ListItem>
                                <Text fontWeight="bold">Prepare your CSV file</Text>
                                <Text>Create a CSV file with wallet addresses in the first column (one per row)</Text>
                            </ListItem>

                            <ListItem>
                                <Text fontWeight="bold">Convert CSV to JSON</Text>
                                <Text>Use an online tool like <Link color="blue.500" href="https://www.convertcsv.com/csv-to-json.htm" isExternal>CSV to JSON Converter</Link></Text>
                                <Text mt={1}>Make sure to select "Array" format, not "Object"</Text>
                            </ListItem>

                            <ListItem>
                                <Text fontWeight="bold">Update the whitelist.json file</Text>
                                <Text>Go to your GitHub repository at:</Text>
                                <Link color="blue.500" href="https://github.com/Karatekid05/10k-checker" isExternal>
                                    github.com/Karatekid05/10k-checker
                                </Link>
                                <Text mt={2}>Navigate to <Code>frontend/src/whitelist.json</Code></Text>
                                <Text>Click the edit button (pencil icon)</Text>
                                <Text>Paste your JSON array</Text>
                                <Text>Commit the changes</Text>
                            </ListItem>

                            <ListItem>
                                <Text fontWeight="bold">Wait for deployment</Text>
                                <Text>Vercel will automatically deploy the updated whitelist (usually takes 1-2 minutes)</Text>
                            </ListItem>
                        </OrderedList>

                        <Box mt={4} p={4} bg="gray.100" borderRadius="md" w="full">
                            <Text fontWeight="bold">Example JSON format:</Text>
                            <Code p={2} mt={2} display="block" whiteSpace="pre" overflowX="auto">
                                {`[
  "0x123456789abcdef0123456789abcdef012345678",
  "0xabcdef0123456789abcdef0123456789abcdef01",
  "0x0123456789abcdef0123456789abcdef01234567"
]`}
                            </Code>
                        </Box>
                    </VStack>
                </Box>
            </VStack>
        </Box>
    );
}

export default AdminPage; 