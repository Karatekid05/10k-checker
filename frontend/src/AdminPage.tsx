import { useState, useEffect } from 'react';
import { Box, VStack, Input, Button, Text, useToast, Heading, List, ListItem, ListIcon } from '@chakra-ui/react';
import { CheckCircleIcon } from '@chakra-ui/icons';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

function AdminPage() {
    const [adminKey, setAdminKey] = useState('');
    const [files, setFiles] = useState<FileList | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [totalAddresses, setTotalAddresses] = useState(0);
    const [uploadResults, setUploadResults] = useState<Array<{ file: string, added: number }>>([]);
    const toast = useToast();

    useEffect(() => {
        // Get initial stats
        axios.get(`${API_URL}/stats`)
            .then(response => setTotalAddresses(response.data.totalAddresses))
            .catch(console.error);
    }, []);

    const handleUpload = async () => {
        if (!files || files.length === 0) {
            toast({
                title: 'Error',
                description: 'Please select CSV files to upload',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        setIsUploading(true);
        setUploadResults([]);
        try {
            // Upload each file sequentially
            for (let i = 0; i < files.length; i++) {
                const formData = new FormData();
                formData.append('file', files[i]);

                const response = await axios.post(`${API_URL}/upload-whitelist`, formData, {
                    headers: {
                        'x-admin-key': adminKey,
                    },
                });

                setUploadResults(prev => [...prev, {
                    file: files[i].name,
                    added: response.data.addressesAdded
                }]);
                setTotalAddresses(response.data.totalAddresses);

                toast({
                    title: 'Success',
                    description: `Added ${response.data.addressesAdded} addresses from ${files[i].name}`,
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to upload CSV file. Please check your admin key.',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
        setIsUploading(false);
    };

    return (
        <Box minH="100vh" bg="#4B0082" py={10}>
            <VStack spacing={8} maxW="container.sm" mx="auto" px={4}>
                <Box textAlign="center" color="white">
                    <Heading size="xl">Admin Panel</Heading>
                    <Text mt={2}>Upload Whitelist CSV Files</Text>
                    <Text mt={2} fontSize="lg">Total Addresses: {totalAddresses}</Text>
                </Box>

                <Box bg="white" p={8} borderRadius="lg" w="full">
                    <VStack spacing={4}>
                        <Input
                            type="password"
                            placeholder="Enter admin key"
                            value={adminKey}
                            onChange={(e) => setAdminKey(e.target.value)}
                        />

                        <Box w="full">
                            <Text mb={2} fontWeight="bold">CSV File Requirements:</Text>
                            <Text fontSize="sm" color="gray.600" mb={4}>
                                • Each wallet address should be in Column A (first column)<br />
                                • One address per row<br />
                                • Addresses must start with "0x"<br />
                                • Headers are optional
                            </Text>
                            <Input
                                type="file"
                                accept=".csv"
                                multiple
                                onChange={(e) => setFiles(e.target.files)}
                                p={1}
                            />
                        </Box>

                        <Button
                            colorScheme="pink"
                            width="full"
                            onClick={handleUpload}
                            isLoading={isUploading}
                        >
                            Upload CSV Files
                        </Button>

                        {uploadResults.length > 0 && (
                            <Box w="full" mt={4}>
                                <Text fontWeight="bold" mb={2}>Upload Results:</Text>
                                <List spacing={2}>
                                    {uploadResults.map((result, index) => (
                                        <ListItem key={index}>
                                            <ListIcon as={CheckCircleIcon} color="green.500" />
                                            {result.file}: Added {result.added} addresses
                                        </ListItem>
                                    ))}
                                </List>
                            </Box>
                        )}
                    </VStack>
                </Box>
            </VStack>
        </Box>
    );
}

export default AdminPage; 