# Church Directory — Current Progress

## Project overview

The Church Directory is a **digital member directory** for a church. Users can:

- **Log in** (authentication)
- **View profiles** of other members
- See content **based on role** — e.g. admins can see and edit more detail than regular members
- Use **Firebase** for authentication state (logged in / logged out) and appropriate screens for each state

---

## Technologies

| Area | Choice |
|------|--------|
| **Auth & data** | Firebase (Authentication + **Firestore**) |
| **Front end** | HTML, CSS, JavaScript |
| **Hosting** | GitHub Pages |
| **Profiles** | Firestore for church directory user / member profile data |

---

## What’s done so far

### Firebase integration

- Firebase initialized with `firebaseConfig`
- **`getAuth()`** for Authentication; **`getFirestore()`** for reading/writing data
- Auth and Firestore set up for login and storing user data

### Authentication

- **Google** sign-in provider
- **`signInWithRedirect`** for the login flow
- **`getRedirectResult()`** outlined to handle the post-redirect auth result

### UI

- **Auth-state-driven UI**: login screen when logged out; directory when logged in
- Login, logout, and directory visibility tied to authentication state

### Persistence & debugging

- **Persistence** considered so auth state survives page reloads
- **Console logging** for auth status, data flow, and Firebase initialization (e.g. logged-in user email)

---

## What’s left to do

### Redirect flow

- Confirm **`getRedirectResult()`** is in the right place and works end-to-end
- After redirect, ensure the **directory UI** shows reliably on successful login

### Persistence

- Apply **`setPersistence()`** (or equivalent) so session behavior is correct across reloads

### Directory & profiles from Firestore

- After login, **populate the directory** from Firestore (not only local/static data)
- **Member profiles** loaded and displayed from Firestore for authenticated users

### Admin roles & permissions

- Restrict **editing** and **sensitive fields** to admins
- Likely: store a **role** (e.g. `admin`) in Firestore and check it after login

### Error handling

- Clear errors for **auth** and **Firestore** (sign-in, reads, writes)

### UI polish

- Smooth UX; clear **logged in vs logged out** state
- Any missing pieces: **logout**, **error messages**, etc.

### Testing

- End-to-end: sign in, sign out, data loading, **multiple browsers and devices**

### Documentation & handoff

- Guide for **church admins**: managing profiles, updating Firestore, common issues
- Keep code **maintainable** (structure and comments where helpful)

---

## Notes

This file is the **living snapshot** of progress; update it as features ship or priorities change.
