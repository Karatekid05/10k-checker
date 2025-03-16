# 10K Squad Whitelist Checker

A simple web application to check if a wallet address is whitelisted for the 10K Squad project.

## Features

- Beautiful UI matching the 10K Squad brand colors
- Simple wallet address checker
- Easy whitelist management through GitHub
- Responsive design

## How It Works

This is a completely static application that uses a JSON file to store the whitelist. When a user enters their wallet address, the application checks if it's in the whitelist and displays the result.

## Updating the Whitelist

To update the whitelist:

1. Prepare your CSV file with wallet addresses in the first column (one per row)
2. Convert the CSV to JSON using an online tool like [CSV to JSON Converter](https://www.convertcsv.com/csv-to-json.htm)
3. Update the `frontend/src/whitelist.json` file in the GitHub repository
4. Commit the changes
5. Vercel will automatically deploy the updated whitelist

## Development

To run the application locally:

```bash
cd frontend
npm install
npm run dev
```

The application will be available at `http://localhost:5173`

## Deployment

The application is deployed on Vercel at [https://10k-checker.vercel.app](https://10k-checker.vercel.app) 