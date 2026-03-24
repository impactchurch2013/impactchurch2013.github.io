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

## Entry Routing (Sprint 6)
- Open `login.html` and confirm it redirects to the current runtime with `entry=login` and no `loginMode` param when not in standalone mode.
- Open `directory.html` and confirm it redirects to the current runtime with `entry=directory` and no `directoryMode` param when not in standalone mode.
- Open `login.html?loginMode=standalone` and confirm standalone diagnostics shell renders without redirect.
- Open `directory.html?directoryMode=standalone` and confirm standalone diagnostics shell renders without redirect.
- While signed out, confirm canonical URL sync points to `login.html` without transitional params.
- While signed in, confirm canonical URL sync points to `directory.html` without transitional params.

### Sprint 6 Quick Run Order
- Start signed out in a fresh tab and open `login.html`.
- Verify legacy redirect and URL cleanup, then sign in and confirm canonical switch to `directory.html`.
- Sign out and confirm canonical switch back to `login.html`.
- In a new tab, open `login.html?loginMode=standalone` and verify standalone shell is preserved.
- In a new tab, open `directory.html?directoryMode=standalone` and verify standalone shell is preserved.
- End with one normal app reload on canonical `directory.html` while signed in.

## Sprint 7 Cutover And Rollback
- Verify default mode currently stays on legacy redirect behavior for both `login.html` and `directory.html`.
- Confirm rollback param `?entryLegacy=1` forces legacy redirect behavior even when standalone query params are present.
- Confirm `entryLegacy` is preserved through the redirect to `index.html` for rollback stability.
- Confirm canonical URL sync still strips transitional entry mode params (`entry`, `loginMode`, `directoryMode`).
