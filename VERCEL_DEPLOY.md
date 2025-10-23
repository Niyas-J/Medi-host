# 🚀 Vercel Deployment Guide for Medi-Host

## ✅ GitHub Repository Published!

Your code is now live at: **https://github.com/Niyas-J/Medi-host.git**

---

## 🌐 Deploy to Vercel (2 Options)

### Option 1: Deploy via Vercel Website (Recommended - Easiest)

#### **Step 1: Sign Up / Login to Vercel**
1. Go to https://vercel.com
2. Click **"Sign Up"** or **"Login"**
3. Choose **"Continue with GitHub"**
4. Authorize Vercel to access your GitHub account

#### **Step 2: Import Your Repository**
1. Click **"Add New..."** → **"Project"**
2. Find **"Niyas-J/Medi-host"** in the list
3. Click **"Import"**

#### **Step 3: Configure Project**

**Framework Preset:** Select **"Vite"**

**Root Directory:** Click **"Edit"** → Select **"frontend"**

**Build Settings:**
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

**Environment Variables:** (Click "Add Environment Variable")
```
VITE_API_URL = https://your-backend-url.vercel.app
```
(We'll update this after backend is deployed)

#### **Step 4: Deploy Frontend**
1. Click **"Deploy"**
2. Wait 2-3 minutes
3. You'll get a URL like: `https://medi-host-xxx.vercel.app`

#### **Step 5: Deploy Backend Separately**

1. Click **"Add New..."** → **"Project"** again
2. Import the same repository **"Niyas-J/Medi-host"**
3. **Root Directory:** Select **"backend"**
4. Click **"Deploy"**
5. You'll get a backend URL like: `https://medi-host-backend-xxx.vercel.app`

#### **Step 6: Update Frontend Environment Variable**

1. Go to your **frontend project** on Vercel
2. Settings → Environment Variables
3. Update `VITE_API_URL` to your backend URL
4. Click **"Redeploy"** to apply changes

---

### Option 2: Deploy via Vercel CLI

#### **Step 1: Install Vercel CLI**
```bash
npm install -g vercel
```

#### **Step 2: Login to Vercel**
```bash
vercel login
```

#### **Step 3: Deploy Frontend**
```bash
cd frontend
vercel --prod
```

Follow the prompts:
- **Set up and deploy?** Yes
- **Which scope?** Your account
- **Link to existing project?** No
- **Project name?** medi-host-frontend
- **Directory?** ./
- **Override settings?** No

#### **Step 4: Deploy Backend**
```bash
cd ../backend
vercel --prod
```

Follow the prompts similarly.

#### **Step 5: Get URLs**

After both deployments, note down the URLs:
- Frontend: `https://medi-host-frontend.vercel.app`
- Backend: `https://medi-host-backend.vercel.app`

---

## ⚙️ Important Configurations

### **Update Frontend to Use Production Backend**

Edit `frontend/vite.config.js`:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'http://localhost:5000',
        changeOrigin: true,
      }
    }
  }
})
```

### **Update Backend CORS**

Make sure `backend/.env` or Vercel environment variables include:
```
ALLOWED_ORIGINS=https://medi-host-frontend.vercel.app
```

---

## 📋 Post-Deployment Checklist

- [ ] Both frontend and backend deployed
- [ ] Frontend environment variable points to backend URL
- [ ] Backend CORS allows frontend domain
- [ ] Test location detection works
- [ ] Test hospital search works
- [ ] Test appointment booking
- [ ] Test emergency SOS button
- [ ] Test admin dashboard

---

## 🔧 Common Issues & Fixes

### **Issue: "Failed to fetch facilities"**
**Fix:** Update `VITE_API_URL` in frontend environment variables to backend URL

### **Issue: "CORS policy error"**
**Fix:** Add frontend URL to `ALLOWED_ORIGINS` in backend environment variables

### **Issue: "500 Internal Server Error"**
**Fix:** Check Vercel logs for backend errors
- Go to Vercel Dashboard → Backend Project → Functions → View Logs

### **Issue: "Map not loading"**
**Fix:** Verify all frontend assets are deployed
- Check Vercel deployment logs for build errors

---

## 🌟 Your Live URLs

After deployment, you'll have:

✅ **Frontend:** `https://medi-host.vercel.app`  
✅ **Backend API:** `https://medi-host-backend.vercel.app`  
✅ **GitHub Repo:** https://github.com/Niyas-J/Medi-host.git

---

## 🎉 Quick Deploy Now!

**Just 3 clicks:**

1. Visit: https://vercel.com/new
2. Import: Niyas-J/Medi-host
3. Deploy!

---

## 📞 Support

If you encounter issues:
- Check Vercel documentation: https://vercel.com/docs
- View deployment logs in Vercel dashboard
- Verify environment variables are set correctly

**Happy Deploying! 🚀**

