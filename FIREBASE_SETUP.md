# 🔥 Firebase Setup Guide for TrendVerse Blog

This guide will help you set up Firebase to make your blog live with real-time database, authentication, and image storage.

---

## 📋 Prerequisites

- Google account
- Node.js installed
- Your blog code ready

---

## 🚀 Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Create a project"** (or "Add project")
3. Enter project name: `trendverse-blog` (or your preferred name)
4. Disable Google Analytics (optional - you can enable later)
5. Click **"Create project"**
6. Wait for the project to be created

---

## 🌐 Step 2: Add Web App

1. On the Project Overview page, click the **Web icon** (`</>`)
2. Register app with nickname: **"TrendVerse Blog"**
3. **DON'T** check "Firebase Hosting" for now
4. Click **"Register app"**
5. You'll see your Firebase config - **copy these values!**

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

---

## 🔐 Step 3: Enable Authentication

1. In Firebase Console, go to **Build > Authentication**
2. Click **"Get started"**
3. Go to **Sign-in method** tab
4. Click **"Email/Password"**
5. Toggle **Enable** to ON
6. Click **Save**

---

## 🗄️ Step 4: Set Up Firestore Database

1. Go to **Build > Firestore Database**
2. Click **"Create database"**
3. Choose **"Start in test mode"** (for development)
4. Select a location closest to your users
5. Click **"Enable"**

### Update Security Rules (for production):

Go to **Rules** tab and replace with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Anyone can read published posts
    match /posts/{postId} {
      allow read: if resource.data.status == 'published';
      allow read, write: if request.auth != null;
    }
    
    // Only authenticated users can write
    match /{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

---

## 📁 Step 5: Set Up Storage (for Image Uploads)

1. Go to **Build > Storage**
2. Click **"Get started"**
3. Choose **"Start in test mode"**
4. Click **"Next"** and then **"Done"**

### Update Storage Rules (for production):

Go to **Rules** tab and replace with:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /posts/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null 
                   && request.resource.size < 5 * 1024 * 1024
                   && request.resource.contentType.matches('image/.*');
    }
    match /avatars/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

---

## ⚙️ Step 6: Configure Your App

### Option A: Using Environment Variables (Recommended)

1. Create a `.env` file in your project root:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

2. Replace the values with your Firebase config from Step 2

### Option B: Direct Configuration

Edit `src/config/firebase.ts` and replace the config values directly:

```typescript
const firebaseConfig = {
  apiKey: "YOUR_ACTUAL_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

---

## 👤 Step 7: Create Admin Account

1. Run your app: `npm run dev`
2. Go to `/admin` or click "Admin Panel" button
3. Click **"First time? Create admin account"**
4. Enter your email and password (min 6 characters)
5. Click **"Create Account"**
6. You're now logged in!

---

## 📝 Step 8: Seed Initial Posts (Optional)

To populate your Firestore with the default posts:

1. Open your browser console (F12 > Console)
2. Run: `seedPosts()`
3. Wait for completion message
4. Refresh the page

---

## 🌍 Step 9: Deploy Your Blog

### Option A: Firebase Hosting (Free)

1. Install Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Login to Firebase:
```bash
firebase login
```

3. Initialize Firebase in your project:
```bash
firebase init
```
- Select **Hosting**
- Choose your project
- Set public directory to `dist`
- Configure as single-page app: **Yes**
- Don't overwrite index.html

4. Build and deploy:
```bash
npm run build
firebase deploy
```

### Option B: Vercel (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variables in Vercel dashboard
5. Deploy!

### Option C: Netlify

1. Push your code to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Import your repository
4. Set build command: `npm run build`
5. Set publish directory: `dist`
6. Add environment variables
7. Deploy!

---

## 🔧 Troubleshooting

### "Firebase: Error (auth/configuration-not-found)"
- Make sure your Firebase config values are correct
- Check that Authentication is enabled in Firebase Console

### "Missing or insufficient permissions"
- Update Firestore rules (see Step 4)
- Make sure you're logged in to admin panel

### "Failed to upload image"
- Enable Storage in Firebase Console (Step 5)
- Update Storage rules
- Check file size (max 5MB)

### Posts not showing
- Check Firestore rules allow reading
- Make sure posts have `status: 'published'`
- Check browser console for errors

---

## 📊 Firebase Console Quick Links

Once your project is created, bookmark these:

- **Authentication**: `https://console.firebase.google.com/project/YOUR_PROJECT/authentication`
- **Firestore**: `https://console.firebase.google.com/project/YOUR_PROJECT/firestore`
- **Storage**: `https://console.firebase.google.com/project/YOUR_PROJECT/storage`
- **Hosting**: `https://console.firebase.google.com/project/YOUR_PROJECT/hosting`

---

## 🎉 You're Done!

Your TrendVerse blog is now live with:

- ✅ Real-time database (Firestore)
- ✅ User authentication
- ✅ Image uploads (Storage)
- ✅ Admin panel for content management

---

## 📞 Need Help?

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase YouTube Channel](https://www.youtube.com/firebase)
- [Stack Overflow - Firebase](https://stackoverflow.com/questions/tagged/firebase)
