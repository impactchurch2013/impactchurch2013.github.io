# Refactor Smoke Checklist

Run this checklist after each small refactor slice.

## Auth
- Load the site and confirm the login screen appears.
- Click Google sign-in and confirm successful login.
- Confirm logout returns to the login screen.
- Refresh the page and confirm auth persistence still works.
- Sign in with password using an invited email and confirm successful login.
- Try password sign-in with a wrong password and confirm friendly error feedback.
- Create a password account with an invited email and confirm account is created.
- Try creating a password account with a non-invited email and confirm it is blocked.
- Trigger reset password for an existing email and confirm reset email flow.
- If an email is Google-only, confirm UI message directs user to Google sign-in.

## Directory
- Confirm member cards render on initial load.
- Use search and confirm results filter correctly.
- Open a member profile and confirm details load.
- Navigate household members in the profile sheet (if applicable).

## Admin And Editor
- Confirm admin/editor controls render for authorized users.
- Open edit member flow and save a safe test change path (or dry-run check).
- Confirm pending changes count updates correctly.
- Open pending changes sheet and verify list loads.

## Media
- Open photo viewer from a member profile image.
- Upload/replace a photo in edit flow and confirm preview/upload behavior.
- Confirm fallback image appears when member image is missing.

## UI Overlays
- Open and close onboarding sheet.
- Open and close member select and edit sheets.
- Open and close admin email and invite modals.

## Console
- Confirm there are no new JavaScript errors after the slice.
- Confirm there are no Firebase initialization/auth errors.
