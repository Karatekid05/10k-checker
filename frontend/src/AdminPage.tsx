import { Box, VStack, Text, Heading, Link, Code, OrderedList, ListItem, Tabs, TabList, TabPanels, Tab, TabPanel, Button, Flex } from '@chakra-ui/react';
import whitelist from './whitelist.json';

function AdminPage() {
    return (
        <Flex
            direction="column"
            minH="100vh"
            w="100%"
            bg="#4B0082"
            overflow="hidden"
        >
            <Flex
                direction="column"
                minH="100vh"
                w="100%"
                p={{ base: 4, md: 10 }}
            >
                <Box textAlign="center" color="white" mb={{ base: 4, md: 8 }}>
                    <Heading size={{ base: "lg", md: "xl" }}>Admin Instructions</Heading>
                    <Text mt={2}>How to Update the Whitelist</Text>
                    <Text mt={2} fontSize="lg">Current Whitelist Size: {whitelist.length} addresses</Text>
                </Box>

                <Box
                    bg="white"
                    p={{ base: 4, md: 8 }}
                    borderRadius="lg"
                    w="full"
                    flex="1"
                    overflowY="auto"
                >
                    <Tabs colorScheme="pink" variant="enclosed" size={{ base: "sm", md: "md" }}>
                        <TabList overflowX="auto" flexWrap={{ base: "nowrap", md: "wrap" }}>
                            <Tab whiteSpace="nowrap">Basic Instructions</Tab>
                            <Tab whiteSpace="nowrap">Multiple CSV Files</Tab>
                            <Tab whiteSpace="nowrap">Current Format</Tab>
                        </TabList>

                        <TabPanels>
                            <TabPanel>
                                <VStack spacing={{ base: 4, md: 6 }} align="start">
                                    <Text fontSize={{ base: "md", md: "lg" }} fontWeight="bold">
                                        To update the whitelist, follow these steps:
                                    </Text>

                                    <OrderedList spacing={{ base: 2, md: 4 }} pl={4}>
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
                                </VStack>
                            </TabPanel>

                            <TabPanel>
                                <VStack spacing={{ base: 4, md: 6 }} align="start">
                                    <Text fontSize={{ base: "md", md: "lg" }} fontWeight="bold">
                                        Working with Multiple CSV Files:
                                    </Text>

                                    <Text>
                                        If you have multiple CSV files, you have two options:
                                    </Text>

                                    <Box p={4} bg="gray.50" borderRadius="md" w="full">
                                        <Text fontWeight="bold">Option 1: Combine CSV files first (Recommended)</Text>
                                        <OrderedList spacing={2} mt={2} pl={4}>
                                            <ListItem>Combine all your CSV files into one large CSV file</ListItem>
                                            <ListItem>Use a tool like Excel or Google Sheets to merge them</ListItem>
                                            <ListItem>Remove any duplicate addresses</ListItem>
                                            <ListItem>Convert the combined CSV to JSON</ListItem>
                                            <ListItem>Update whitelist.json with the combined data</ListItem>
                                        </OrderedList>
                                    </Box>

                                    <Box p={4} bg="gray.50" borderRadius="md" w="full">
                                        <Text fontWeight="bold">Option 2: Convert each CSV separately</Text>
                                        <OrderedList spacing={2} mt={2} pl={4}>
                                            <ListItem>Convert each CSV file to JSON separately</ListItem>
                                            <ListItem>Download the current whitelist.json</ListItem>
                                            <ListItem>Combine all JSON arrays (current + new ones)</ListItem>
                                            <ListItem>Remove any duplicate addresses</ListItem>
                                            <ListItem>Update whitelist.json with the combined data</ListItem>
                                        </OrderedList>
                                    </Box>
                                </VStack>
                            </TabPanel>

                            <TabPanel>
                                <VStack spacing={{ base: 4, md: 6 }} align="start">
                                    <Text fontSize={{ base: "md", md: "lg" }} fontWeight="bold">
                                        Current Whitelist Format:
                                    </Text>

                                    <Text>
                                        The current whitelist is using a format where each address is in an array with an empty string:
                                    </Text>

                                    <Box p={4} bg="gray.100" borderRadius="md" w="full" overflowX="auto">
                                        <Text fontWeight="bold">Current format:</Text>
                                        <Code p={2} mt={2} display="block" whiteSpace="pre" fontSize={{ base: "xs", md: "sm" }}>
                                            {`[
  ["0x123456789abcdef0123456789abcdef01234567", ""],
  ["0xabcdef0123456789abcdef0123456789abcdef01", ""]
]`}
                                        </Code>
                                    </Box>

                                    <Text>
                                        When converting your CSV, you can either:
                                    </Text>

                                    <Box p={4} bg="gray.50" borderRadius="md" w="full">
                                        <Text fontWeight="bold">Option 1: Match the current format</Text>
                                        <Text mt={2}>Make sure your CSV has two columns, with the second column empty:</Text>
                                        <Code p={2} mt={2} display="block" whiteSpace="pre" fontSize={{ base: "xs", md: "sm" }}>
                                            {`0x123456789abcdef0123456789abcdef01234567,
0xabcdef0123456789abcdef0123456789abcdef01,`}
                                        </Code>
                                    </Box>

                                    <Box p={4} bg="gray.50" borderRadius="md" w="full">
                                        <Text fontWeight="bold">Option 2: Use simple format (also supported)</Text>
                                        <Text mt={2}>You can also use a simpler format with just the addresses:</Text>
                                        <Code p={2} mt={2} display="block" whiteSpace="pre" fontSize={{ base: "xs", md: "sm" }}>
                                            {`[
  "0x123456789abcdef0123456789abcdef01234567",
  "0xabcdef0123456789abcdef0123456789abcdef01"
]`}
                                        </Code>
                                        <Text mt={2}>The app supports both formats.</Text>
                                    </Box>
                                </VStack>
                            </TabPanel>
                        </TabPanels>
                    </Tabs>

                    <Box mt={6} textAlign="center">
                        <Link href="/" _hover={{ textDecoration: 'none' }}>
                            <Button colorScheme="pink" size={{ base: "md", md: "lg" }}>
                                Return to Whitelist Checker
                            </Button>
                        </Link>
                    </Box>
                </Box>
            </Flex>
        </Flex>
    );
}

export default AdminPage; 