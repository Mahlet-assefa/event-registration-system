# Setup Guide

## Prerequisites
- Node.js (v14+)
- npm

## Installation

1. Install Server Dependencies:
   ```bash
   cd src/server
   npm install
   ```

2. Install Client Dependencies:
   ```bash
   cd src/client
   npm install
   ```

## Running the Application

1. Start the Backend Server:
   ```bash
   cd src/server
   npm start (or node index.js)
   ```
   Server runs on `http://localhost:3000`.

2. Start the Frontend Application:
   ```bash
   cd src/client
   npm run dev
   ```
   Client runs usually on `http://localhost:5173`.

## Architecture
- **Frontend**: React, Vite, TailwindCSS
- **Backend**: Node.js, Express
- **Database**: JSON files in `/data` directory
