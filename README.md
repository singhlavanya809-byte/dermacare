# DermaSense

DermaSense is a full-stack Next.js skin-wellness application for educational AI-generated observations, private analysis history, journaling, ingredient education, and environmental context. It is not a medical diagnosis tool.

## Features

- Firebase email/password authentication with persistent sessions
- User-scoped Firestore analysis history and journal entries
- Gemini-powered educational skin analysis with optional image input
- Zod request validation and safe Demo Mode fallback
- OpenWeather environmental context on the dashboard
- Six-stage analysis flow with validation, loading, save, and error states
- Searchable Derma Care, Products, and Ingredients pages
- Dermatologist guidance without fabricated doctors, clinics, addresses, or locations
- Persistent light/dark mode
- Responsive Next.js App Router UI suitable for Vercel

## Stack

Next.js 16, React, TypeScript, Tailwind CSS, Firebase Authentication, Cloud Firestore, Gemini API, OpenWeather API, Recharts, Framer Motion, Zod, and Lucide icons.

## Environment Variables

Create `.env.local` locally or add these variables in Vercel Project Settings. Never commit real values.

```env
GEMINI_API_KEY=your-gemini-key
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-web-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-firebase-app-id
OPENWEATHER_API_KEY=your-openweather-key
```

`GEMINI_API_KEY` and `OPENWEATHER_API_KEY` are server-side secrets. Firebase web configuration values are intended for browser initialization, but access is still protected by Authentication and Firestore rules.

## Firebase Setup

1. Create or select the Firebase project.
2. Enable Authentication > Sign-in method > Email/Password.
3. Create the Firestore database.
4. Add the Firebase web-app configuration values to `.env.local`.
5. Publish the rules:

```bash
firebase login
firebase use dermacare-ac9c1
firebase deploy --only firestore:rules
```

Private data is stored under:

```text
users/{authenticatedUid}/analyses/{analysisId}
users/{authenticatedUid}/journal/{entryId}
```

The rules allow access only when `request.auth.uid` matches the `{authenticatedUid}` path segment.

## Gemini Setup

Add `GEMINI_API_KEY` to the environment used by the server. The API route validates questionnaire input, forwards supported image data as Gemini inline image content, normalizes the structured response, and returns an educational fallback when the key or upstream service is unavailable.

## OpenWeather Setup

Add `OPENWEATHER_API_KEY` to the server environment. The dashboard displays temperature, humidity, and weather condition. If the key is missing or the request fails, the UI labels the fallback as Demo Mode.

## Local Development

```bash
npm install
npm run dev
```

Open <http://localhost:3000>.

## Validation

```bash
npm run build
npm run lint
```

The production build is the required deployment check. Lint may report legacy issues in untouched UI files; fix any new errors before deploying.

## Vercel Deployment

1. Push the repository to GitHub.
2. Import it into Vercel.
3. Add every variable from the Environment Variables section to the Preview and Production environments.
4. Deploy.
5. In Firebase Console, add the deployed Vercel hostname under Authentication > Settings > Authorized domains.
6. Confirm Firestore rules are published with the Firebase CLI.

No API route depends on a localhost URL. The frontend calls same-origin `/api/*` routes.

## Security Notes

- Do not commit `.env.local`; it is ignored by `.gitignore`.
- Do not add secret keys to `NEXT_PUBLIC_*` variables.
- Firestore is never publicly readable or writable.
- Analysis and journal writes use the live Firebase Auth user UID on the client.
- Server-only Gemini and OpenWeather keys are never returned to the browser.
- Uploaded images are sent for analysis but are not persisted as raw image data; saved records contain only an image-presence flag.
- AI output is educational and does not replace professional medical advice.

## Demo Flow

Sign up, open the dashboard, start a skin analysis, upload an image, complete the questionnaire, review the Gemini result, save it, and return to the dashboard to view private history. Add a journal entry, switch themes, and review weather and safety guidance.
