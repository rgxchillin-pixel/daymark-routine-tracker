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

The first account on an existing browser adopts the routines already saved there. Each account has a separate local cache. Firebase configuration is public in a browser app; the Firestore rules are what protect user data. Review Firebase billing and usage settings in the Firebase console before broad public use.
