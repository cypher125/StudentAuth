# Face Recognition System Frontend Installation Guide

This document provides detailed instructions for setting up the Face Recognition System (FRS) frontend on various platforms.

## Prerequisites

Before installing the FRS frontend, ensure you have the following prerequisites:

- Node.js 18.x or higher
- npm 9.x or higher
- Git (for cloning the repository)
- A modern web browser (Chrome, Firefox, Edge, etc.)

## Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/face-recognition-system.git
cd face-recognition-system/frontend
```

## Step 2: Install Dependencies

Install all required packages using npm:

```bash
npm install
```

## Step 3: Configure Environment Variables

Create a `.env.local` file in the frontend directory with the following content:

```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

Adjust the URL if your backend is running on a different host or port.

## Step 4: Run the Development Server

Start the Next.js development server:

```bash
npm run dev
```

The frontend will be accessible at `http://localhost:3000`.

## Step 5: Verify Installation

To verify the installation:

1. Open `http://localhost:3000` in your web browser
2. Ensure the login page loads correctly
3. If the backend server is running, try logging in with valid credentials

## Building for Production

To create a production build:

```bash
npm run build
```

To run the production build locally:

```bash
npm run start
```

## Environment-Specific Configuration

The frontend supports different environments through `.env` files:

- `.env.local` - Local development settings (not committed to Git)
- `.env.development` - Development settings
- `.env.production` - Production settings
- `.env.android` - Settings for Android app development

Example production environment file (`.env.production`):

```
NEXT_PUBLIC_API_URL=https://api.yourproductionsite.com/api
```

### For Android Development

When developing for Android, use the `.env.android` file, which includes special settings for connecting to your backend:

```
# Copy the Android environment file
cp .env.android .env.local
```

Key Android settings:
- Uses `10.0.2.2` as the special IP that Android emulators use to connect to the host machine
- Camera settings optimized for mobile devices

To build for Android with specific environment:

```bash
# Set the environment to use Android settings
npm run build -- --env=android

# Or run the development server with Android settings
npm run dev -- --env=android
```

## Troubleshooting Common Issues

### Camera Access Issues

If you encounter problems with camera access:

- Ensure your browser has permission to access the camera
- Use HTTPS in production (camera access is restricted on non-secure origins)
- Check browser console for specific error messages

### Authentication Issues

If you encounter problems with authentication:

- Ensure the backend server is running
- Verify the `NEXT_PUBLIC_API_URL` is correctly set
- Check that CORS is properly configured on the backend

## Deployment Options

### Vercel (Recommended)

Deploying to Vercel:

1. Push your code to a Git repository (GitHub, GitLab, BitBucket)
2. Import your project in the Vercel dashboard
3. Configure your environment variables
4. Deploy

### Other Hosting Options

#### Static Export

Next.js can export a static website for hosting on any static host:

```bash
npm run build
npm run export
```

The static files will be generated in the `out` directory.

#### Docker Deployment

Create a `Dockerfile` in the frontend directory:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

ENV NODE_ENV production

EXPOSE 3000

CMD ["npm", "start"]
```

Build and run the Docker image:

```bash
docker build -t frs-frontend .
docker run -p 3000:3000 frs-frontend
```

## Browser Compatibility

The application is tested and supported on:

- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Edge (latest 2 versions)
- Safari (latest 2 versions)

For older browsers, you may need to configure polyfills or use a compatibility build.

## Updating the System

To update the system:

1. Pull the latest changes:
   ```bash
   git pull origin main
   ```
   
2. Update dependencies:
   ```bash
   npm install
   ```
   
3. Rebuild the application:
   ```bash
   npm run build
   ```
   
4. Restart the server