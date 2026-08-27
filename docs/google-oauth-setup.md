# Google OAuth Setup Guide for COMARI

## Step 1: Fix Google Login (Day 1)

Your Google Cloud project is in "testing mode" which means:
- Only manually approved users can log in
- Tokens expire after 7 days
- Max 100 test users

### To publish basic Google login immediately:

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select your project
3. Go to **APIs & Services** > **OAuth consent screen**
4. Look at the current **Publishing status** — it should say "Testing"
5. Click **"Publish App"**
6. Confirm the dialog

**Important:** Your basic Google Sign-In only uses `openid`, `email`, and `profile` scopes. These are **non-sensitive** and do NOT require verification. Publishing will work immediately.

The YouTube scope (`youtube.readonly`) used for host verification IS sensitive and will need separate verification (see Step 2).

### What this fixes:
- Anyone can log in with Google (no manual approval)
- Tokens don't expire after 7 days
- No 100-user cap

### What still needs verification:
- The YouTube channel connection on the /apply page (uses `youtube.readonly` scope)
- This stays in testing mode until Google verifies it (see below)

---

## Step 2: YouTube API Verification (Days 2-4)

### Prerequisites (build these first):
- [x] Privacy policy page at https://comari.app/privacy
- [x] Terms of service page at https://comari.app/terms
- [ ] Domain verified in Google Search Console
- [ ] Demo video recorded

### Verify domain in Google Search Console:
1. Go to [Google Search Console](https://search.google.com/search-console)
2. Add property: `comari.app`
3. Choose "Domain" verification
4. Add the TXT record they give you to your DNS (Namecheap)
5. Wait for verification (usually minutes to hours)

### Record the demo video:
Record a screen recording (OBS, Loom, or similar) showing:
1. A user visiting comari.app
2. Clicking "Sign in with Google" 
3. The Google consent screen appearing (showing the scopes requested)
4. The user granting access
5. How the YouTube channel data appears on the host profile after connecting
6. Show the /apply page where hosts connect their YouTube channel

Upload as an **unlisted** YouTube video. Keep the link.

### Scope justifications (copy-paste these):

**Scope: `https://www.googleapis.com/auth/youtube.readonly`**

Justification: "COMARI is a creator collaboration marketplace. We use the youtube.readonly scope for two purposes: (1) to verify that a user owns a YouTube channel when they apply to become a host on our platform, and (2) to display their channel name, subscriber count, and channel thumbnail on their public host profile. We only read basic channel metadata (channel name, subscriber count, video count, view count, thumbnail URL, and custom URL). We do not access private videos, comments, playlists, or any data beyond the channel's public statistics. A narrower scope is not available for reading channel ownership and statistics through the YouTube Data API."

### Submit for verification:
1. Go to Google Cloud Console > **APIs & Services** > **OAuth consent screen**
2. Click **"Prepare for Verification"** (or "Edit App")
3. Fill in:
   - App name: COMARI
   - User support email: hello@comari.app
   - App homepage: https://comari.app
   - Privacy policy: https://comari.app/privacy
   - Terms of service: https://comari.app/terms
   - Authorized domains: comari.app
   - Developer email: hello@comari.app
4. Add the scope justification above
5. Add the demo video YouTube link
6. Submit

**Expected timeline: 2-6 weeks.** Some YouTube API reviews take longer. You cannot speed this up, but you can check status in the console.

### While waiting:
- Google login works for all users (basic scopes are published)
- YouTube channel connection works for up to 100 manually approved test users
- You can manually add test users in Google Cloud Console > OAuth consent screen > Test users

---

## Environment variables needed

Make sure these are set in Vercel:

```
GOOGLE_CLIENT_ID=<your client ID>
GOOGLE_CLIENT_SECRET=<your client secret>
AUTH_SECRET=<your auth secret>
AUTH_URL=https://comari.app
```

Also make sure your Google Cloud OAuth client has these redirect URIs:
- `https://comari.app/api/auth/callback/google`
- `https://comari.app/api/auth/callback/google-youtube`
- `http://localhost:3000/api/auth/callback/google` (for local dev)
- `http://localhost:3000/api/auth/callback/google-youtube` (for local dev)
