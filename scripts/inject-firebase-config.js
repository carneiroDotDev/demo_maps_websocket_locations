import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// A fun overengineering way to inject the firebase config into
// the service worker
// To be reviewed before any kind of deploy
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the service worker template
const swPath = path.join(__dirname, "../public/firebase-messaging-sw.js");
let swContent = fs.readFileSync(swPath, "utf8");

// Replace placeholders with actual values from environment variables
const replacements = {
  YOUR_API_KEY: process.env.VITE_FIREBASE_API_KEY,
  YOUR_AUTH_DOMAIN: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  YOUR_PROJECT_ID: process.env.VITE_FIREBASE_PROJECT_ID,
  YOUR_STORAGE_BUCKET: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  YOUR_MESSAGING_SENDER_ID: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  YOUR_APP_ID: process.env.VITE_FIREBASE_APP_ID,
  YOUR_MEASUREMENT_ID: process.env.VITE_FIREBASE_MEASUREMENT_ID,
};

Object.entries(replacements).forEach(([placeholder, value]) => {
  if (!value) {
    console.warn(`Warning: ${placeholder} environment variable is not set`);
    return;
  }
  swContent = swContent.replace(placeholder, value);
});

// Write the modified service worker to the build directory
const buildDir = path.join(__dirname, "../dist");
if (!fs.existsSync(buildDir)) {
  fs.mkdirSync(buildDir, { recursive: true });
}

fs.writeFileSync(path.join(buildDir, "firebase-messaging-sw.js"), swContent);
console.log("Firebase configuration injected into service worker");
