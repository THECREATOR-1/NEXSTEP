# NEXSTEP

NEXSTEP is a modern student platform for tracking academic progress, college planning, and career development.

## Setup

1. Copy `.env.example` to `.env`
2. Run `npm install`
3. Run `npm run dev`

## Firebase Configuration

To enable real authentication and database features, you must supply Firebase credentials in your `.env` file.
You can get these values from the Firebase Console -> Project Settings -> General -> Your apps -> SDK setup and configuration.

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

These values are required to use the real Firebase Auth SDK and Firestore database. Without them, the application will display a "Configuration Required" message on the login screen.

### Authorized Domains

For Google Sign-In and standard Authentication to work in the AI Studio preview environment, you MUST add the preview domains to your Firebase Authorized Domains list:

1. Go to Firebase Console -> Authentication -> Settings -> Authorized domains
2. Click "Add domain"
3. Add the following Google AI Studio preview hostnames:
   - `ais-dev-zskbby3ix6ylm3mp5gs3jl-416085644191.asia-east1.run.app`
   - `ais-pre-zskbby3ix6ylm3mp5gs3jl-416085644191.asia-east1.run.app`

If you encounter the `auth/unauthorized-domain` error during login, this step was likely missed.
