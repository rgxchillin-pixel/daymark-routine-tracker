# Daymark

Daymark is a responsive, browser based routine tracker. It has no build step or package installation requirement.

## Run it

Serve the folder from `localhost` or a secure (`https`) static host, then open the site in a modern browser. Without Firebase setup, routines, settings, and check-ins are stored in that browser's local storage. Follow [FIREBASE-SETUP.md](./FIREBASE-SETUP.md) to enable accounts and cross-device cloud sync.

Daymark is configured as an installable Progressive Web App. On a supported browser, open **Settings → Install Daymark**, or use the browser's **Install app** command. On iPhone or iPad, use **Share → Add to Home Screen**. The service worker caches the app shell for offline launch after the first successful visit; Google Fonts and account sign-in need an internet connection.

## Account sign-in setup

The account screen supports Google sign-in and email/password accounts through Firebase Authentication and syncs app data through Cloud Firestore. For a Google account, users should click **Continue with Google**; Daymark must never collect a Google password. The email/password option creates a separate Daymark password, even when the email address is Gmail.

To activate sign-in and cross-device sync:

1. Create a Firebase project and add a Web app.
2. In Firebase Authentication, enable **Google** and **Email/Password** providers.
3. Add the deployed site's domain under Authentication → Settings → Authorized domains.
4. Copy the Firebase Web app configuration into `firebase-config.js` as the value of `window.DAYMARK_FIREBASE_CONFIG`.
5. Create Firestore and publish the access rules in `firestore.rules`.

See [FIREBASE-SETUP.md](./FIREBASE-SETUP.md) for the full steps and the required authorized host names.

The Firebase web configuration and reCAPTCHA site key are public browser values; never add service-account credentials, reCAPTCHA secret keys, or private keys to this static site. Until configured, the UI explains that sign-in needs setup and users can continue using Daymark without an account. Firestore security rules are provided in `firestore.rules`.

## AI Routine Coach

The Coach uses Firebase AI Logic with Gemini Developer API. Complete the AI Logic and production App Check steps in [FIREBASE-SETUP.md](./FIREBASE-SETUP.md); the Coach stays in setup mode until the reCAPTCHA v3 site key is configured. Each user must opt in before Daymark sends their prompt and compact routine summary (routine names, schedules, and recent check-ins) to Google Gemini through Firebase. The app excludes profile name and email, does not send health or emergency prompts, and lets users turn off AI replies. Routine history and conversation storage follow the same local or Firebase account sync behavior as the rest of the app.

## Included

- A daily dashboard with progress, category filters, and one tap completed, not completed, and pending controls.
- A first visit welcome screen that asks for the user's name before opening the dashboard.
- Routine creation, editing, pause/resume, deletion, custom categories, scheduled days, time, icon, and description.
- A monthly calendar with daily completion history.
- Weekly progress, month to date completion, and routine streak summaries.
- An AI Routine Coach screen with quick prompts, routine-aware Gemini replies after user consent, saved conversation history, and suggested routines users review before adding. It falls back to local safety and setup guidance if Gemini is unavailable.
- Profile name, light and dark appearance, and JSON data export.
- Responsive desktop and mobile layouts, including bottom navigation.

## Files

- `index.html` — app shell and navigation.
- `styles.css` — responsive visual system, light and dark themes.
- `app.js` — application behavior, date calculations, and local persistence.
- `coach-ai.js` — Firebase AI Logic integration for Gemini, with App Check protection.
- `auth-ui.js` — account dialog and Firebase Authentication flows.
- `firebase-config.js` — public Firebase Web app config and reCAPTCHA v3 site key.
- `firebase-setup.html` and `FIREBASE-SETUP.md` — setup steps for accounts, cloud sync, Gemini, and App Check.
- `firestore.rules` — per-user database access rules to publish in Firebase.
- `manifest.json`, `daymark-icon.svg`, and the 192 px / 512 px PNG icons — install metadata and app icons.
- `service-worker.js` — offline cache for the app shell.

## Checks and limitations

The command line and browser preview checks could not be run in the provided environment: it has no JavaScript runtime configured, and the in-app browser blocks local `file:` pages. The application is therefore not runtime verified here. Use the browser's developer console if you want to inspect runtime errors after opening it.

Streaks count completed scheduled occurrences; a pending routine today does not break a streak, while a missed scheduled routine does. Past history uses the routine's current schedule, so changing a routine's days can change how unscheduled historical dates are interpreted. Health guidance is general and cannot diagnose or replace professional care. Gemini and cross-device sync require the Firebase setup described above.
