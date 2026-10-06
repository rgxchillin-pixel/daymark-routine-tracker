# Turn on Daymark accounts and cross-device sync

Daymark's account and cloud-sync code is ready, but it needs a Firebase project that you own. The Firebase web config is project identification, not a password. Never put a service-account JSON file, private key, or account password in this website.

## One-time Firebase setup

1. Sign in at [Firebase Console](https://console.firebase.google.com/) and create a project (or select an existing one).
2. In **Project settings → General**, add a **Web app**. Copy its Firebase configuration (`apiKey`, `authDomain`, `projectId`, `appId`, and any other fields shown).
3. In **Authentication → Sign-in method**, enable **Google** and **Email/Password**. Google sign-in uses Google's secure popup. Email/password creates a separate Daymark password, even if the address is Gmail.
4. In **Authentication → Settings → Authorized domains**, add `daymark-6.netlify.app` and `rgxchillin-pixel.github.io` (also add your own domain if you use one).
5. In **Firestore Database**, create a database. Open **Rules**, replace the starter rules with the contents of `firestore.rules`, and publish. These rules let a signed-in user access only their own `users/{uid}` document.
6. Open `firebase-config.js` and replace `null` with your web app configuration, preserving the `window.DAYMARK_FIREBASE_CONFIG = ...;` wrapper. Example:

```js
window.DAYMARK_FIREBASE_CONFIG = {
  apiKey: "your-web-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  appId: "your-web-app-id"
};
```

7. Publish the updated website files. Then sign in once while online. The app uploads the current local routines to that account the first time; later edits sync automatically and appear on other devices using that same account.

## Turn on the AI Routine Coach

Daymark uses Firebase AI Logic to call the Gemini Developer API from the website. Firebase AI Logic routes requests through Google's protected Firebase service; do not add a Gemini API key to the static website.

1. In the Firebase console, open **AI Logic** and choose **Get started**. Select **Gemini Developer API** and finish its setup for this project.
2. Open **App Check → Apps**, register the same Firebase Web app with **reCAPTCHA v3**, and register the production host names you serve Daymark from. Use the generated public **site key** (not a secret or debug token).
3. Add that site key to `window.DAYMARK_AI_CONFIG.recaptchaSiteKey` in `firebase-config.js`.
4. In **App Check → APIs**, make sure **Firebase AI Logic** is enforced only after its production App Check provider is registered and tested for each deployed host.
5. Publish `coach-ai.js`, the updated app files, and `firebase-config.js` to the site. The coach asks each user before sending a message and a compact summary of routine names, schedules, and recent check-ins to Gemini. It does not send the user's Daymark name or email. Users can turn AI replies off again from the Coach screen. Health and urgent-safety queries are handled locally and excluded from the Gemini request.

AI replies require internet access. Review Gemini Developer API quotas and any billing settings on the Firebase / Google Cloud project before sharing the feature widely. Do not include debug tokens or private keys in published files.

The first account on an existing browser adopts the routines already saved there. Each account has a separate local cache. Firebase configuration is public in a browser app; the Firestore rules are what protect user data. Review Firebase billing and usage settings in the Firebase console before broad public use.
