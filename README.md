# Daymark

Daymark is a responsive, browser based routine tracker. It has no build step or package installation requirement.

## Run it

Serve the folder from `localhost` or a secure (`https`) static host, then open the site in a modern browser. Your routines, settings, and check-ins are stored in that browser's local storage. To use it from multiple devices, add a backend and account system; this version keeps data on the current device.

Daymark is configured as an installable Progressive Web App. On a supported browser, open **Settings → Install Daymark**, or use the browser's **Install app** command. On iPhone or iPad, use **Share → Add to Home Screen**. The service worker caches the app shell for offline launch after the first successful visit; Google Fonts and account sign-in need an internet connection.

## Account sign-in setup

The account screen supports Google sign-in and email/password accounts through Firebase Authentication. For a Google account, users should click **Continue with Google**; Daymark must never collect a Google password. The email/password option creates a separate Daymark password, even when the email address is Gmail.

To enable the buttons:

1. Create a Firebase project and add a Web app.
2. In Firebase Authentication, enable **Google** and **Email/Password** providers.
3. Add the deployed site's domain under Authentication → Settings → Authorized domains.
4. Copy the Firebase Web app configuration into `firebase-config.js` as the value of `window.DAYMARK_FIREBASE_CONFIG`.

The Firebase web configuration is intended to be public; never add service-account credentials or private keys to this static site. Until configured, the UI explains that sign-in needs setup and users can continue using Daymark without an account. Signing in does not sync routines between devices: routines and history still stay in browser storage on the current device.

## Included

- A daily dashboard with progress, category filters, and one tap completed, not completed, and pending controls.
- A first visit welcome screen that asks for the user's name before opening the dashboard.
- Routine creation, editing, pause/resume, deletion, custom categories, scheduled days, time, icon, and description.
- A monthly calendar with daily completion history.
- Weekly progress, month to date completion, and routine streak summaries.
- Profile name, light and dark appearance, and JSON data export.
- Responsive desktop and mobile layouts, including bottom navigation.

## Files

- `index.html` — app shell and navigation.
- `styles.css` — responsive visual system, light and dark themes.
- `app.js` — application behavior, date calculations, and local persistence.
- `auth-ui.js` — account dialog and Firebase Authentication flows.
- `firebase-config.js` — Firebase web configuration placeholder; fill this in to enable authentication.
- `manifest.json`, `daymark-icon.svg`, and the 192 px / 512 px PNG icons — install metadata and app icons.
- `service-worker.js` — offline cache for the app shell.

## Checks and limitations

The command line and browser preview checks could not be run in the provided environment: it has no JavaScript runtime configured, and the in-app browser blocks local `file:` pages. The application is therefore not runtime verified here. Use the browser's developer console if you want to inspect runtime errors after opening it.

Streaks count completed scheduled occurrences; a pending routine today does not break a streak, while a missed scheduled routine does. Past history uses the routine's current schedule, so changing a routine's days can change how unscheduled historical dates are interpreted. Browser notifications and cloud sync are not included.
