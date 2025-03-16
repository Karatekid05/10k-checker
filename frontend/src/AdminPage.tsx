import { useState } from 'react';
import { Box, VStack, Input, Button, Text, useToast, Heading } from '@chakra-ui/react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

function AdminPage() {
    const [adminKey, setAdminKey] = useState('');
    const [files, setFiles] = useState<FileList | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const toast = useToast();

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
        try {
            // Upload each file sequentially
            for (let i = 0; i < files.length; i++) {
                const formData = new FormData();
                formData.append('file', files[i]);

                await axios.post(`${API_URL}/upload-whitelist`, formData, {
                    headers: {
                        'x-admin-key': adminKey,
                    },
                });

                toast({
                    title: 'Success',
                    description: `Uploaded ${files[i].name} successfully!`,
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
                </Box>

                <Box bg="white" p={8} borderRadius="lg" w="full">
                    <VStack spacing={4}>
                        <Input
                            type="password"
                            placeholder="Enter admin key"
                            value={adminKey}
                            onChange={(e) => setAdminKey(e.target.value)}
                        />

                        <Input
                            type="file"
                            accept=".csv"
                            multiple
                            onChange={(e) => setFiles(e.target.files)}
                            p={1}
                        />

                        <Button
                            colorScheme="pink"
                            width="full"
                            onClick={handleUpload}
                            isLoading={isUploading}
                        >
                            Upload CSV Files
                        </Button>

                        <Text fontSize="sm" color="gray.600">
                            CSV files should have a column named either "wallet" or "address"
                        </Text>
                    </VStack>
                </Box>
            </VStack>
        </Box>
    );
}

export default AdminPage; 