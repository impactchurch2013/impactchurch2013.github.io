# Church directory (GitHub Pages)

## Local preview (no git push)

Use this while editing so you don’t have to deploy to see changes.

1. One-time: install Node dependencies (from this folder):

   ```bash
   npm install
   ```

2. Start the preview server (leave this terminal **running**):

   ```bash
   npm run preview
   ```

3. In Edge, open **exactly**:

   **`http://localhost:5500`**

   (You can add `/index.html` if you want; same page.)

### Firebase login locally

- On **`localhost`** / **`127.0.0.1`**, the app uses **Google sign-in via popup** (more reliable than redirect with the dev server). On **GitHub Pages** it uses **redirect** as before. Allow popups for `localhost` if Edge blocks them.
- **`localhost` and `127.0.0.1` are different sites.** If only **`localhost`** is in Firebase → Authentication → **Authorized domains**, use **`http://localhost:5500`** in the address bar for Google sign-in.
- If Edge opens **`http://127.0.0.1:5500`**, use the **“Open this page on localhost”** link on the login screen, or type **`http://localhost:5500`** yourself. (Do not use an automatic redirect from `127.0.0.1` before Firebase runs — it breaks the Google redirect flow.)
- Optional: add **`127.0.0.1`** (host only, no port) to **Authorized domains** if you want sign-in to work while using that URL.

### If the page won’t load

- The preview command must still be running in a terminal (stopping it closes the server).
- Prefer **`http://localhost:5500`** as above.
- The dev server listens on all interfaces; bookmark **`localhost`** so the browser doesn’t default to **`127.0.0.1`**.

### Alternative: Python (no Node)

```bash
npm run preview:python
```

Then open **`http://localhost:5501`**.

---

## Firestore allowlist (`allowedUsers`)

The app checks whether your Google email is allowed **after** sign-in. That requires **Firestore security rules** that let **signed-in users read** the `allowedUsers` collection (and optional `email` / `Email` field queries).

- Example rules for this project: **`firestore.rules`** in the repo root — copy into **Firebase Console → Firestore → Rules** (merge with any rules you already use), then **Publish**.

If rules block reads, you’ll stay “not authorized” even when your email exists in the database.

---

## Deploy

Push to `main` as usual; GitHub Pages serves this repo’s site.
