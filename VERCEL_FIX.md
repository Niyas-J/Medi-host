# 🔧 Vercel Deployment - Fixed Instructions

## ✅ Issue Fixed: Output Directory Error

I've updated the configuration files. Follow these steps:

---

## 🚀 **CORRECT Deployment Steps**

### **Option 1: Deploy Frontend & Backend Separately (Recommended)**

This is the **easiest and most reliable** method.

#### **Step 1: Deploy Frontend**

1. Go to https://vercel.com/new
2. Click **"Import"** on **Niyas-J/Medi-host**
3. **Important Settings:**
   ```
   Framework Preset: Vite
   Root Directory: frontend
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```
4. Click **"Deploy"**
5. ✅ You'll get: `https://medi-host-frontend.vercel.app`

#### **Step 2: Deploy Backend**

1. Go to https://vercel.com/new again
2. Click **"Import"** on **Niyas-J/Medi-host** (same repo)
3. **Important Settings:**
   ```
   Framework Preset: Other
   Root Directory: backend
   ```
4. Click **"Deploy"**
5. ✅ You'll get: `https://medi-host-backend.vercel.app`

#### **Step 3: Connect Them**

1. Go to **Frontend project** in Vercel Dashboard
2. **Settings** → **Environment Variables**
3. Add:
   ```
   Name: VITE_API_URL
   Value: https://your-backend-url.vercel.app
   ```
4. **Deployments** → Click **"..."** → **Redeploy**

---

## 🎯 **Alternative: One-Click Deploy Buttons**

### Deploy Frontend:
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Niyas-J/Medi-host&root-directory=frontend)

### Deploy Backend:
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Niyas-J/Medi-host&root-directory=backend)

---

## 📋 **Troubleshooting the "No Output Directory" Error**

If you still see the error, check these:

### ✅ **1. Root Directory Must Be Set**
- For frontend: **`frontend`**
- For backend: **`backend`**
- Do NOT leave it as root (`./`)

### ✅ **2. Verify Build Settings**
```
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

### ✅ **3. Check package.json**
Make sure `frontend/package.json` has:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

### ✅ **4. Framework Detection**
- Vercel should auto-detect **Vite**
- If not, manually select **"Vite"** in Framework Preset

---

## 🔍 **Common Mistakes**

❌ **Wrong:** Root Directory = `./` (project root)
✅ **Correct:** Root Directory = `frontend`

❌ **Wrong:** Deploying both frontend and backend together
✅ **Correct:** Deploy them as **separate projects**

❌ **Wrong:** Output Directory = `frontend/dist`
✅ **Correct:** Output Directory = `dist` (because root is already `frontend`)

---

## 📸 **Visual Guide**

When importing the project on Vercel:

```
┌─────────────────────────────────────┐
│  Configure Project                   │
├─────────────────────────────────────┤
│  Framework Preset:  Vite        ▼   │
│  Root Directory:    frontend    ▼   │
│                                      │
│  Build and Output Settings:          │
│  ✓ Override                          │
│                                      │
│  Build Command:                      │
│  npm run build                       │
│                                      │
│  Output Directory:                   │
│  dist                                │
│                                      │
│  Install Command:                    │
│  npm install                         │
└─────────────────────────────────────┘
```

---

## 🎉 **Success Checklist**

After deployment, verify:

- [ ] Frontend builds without errors
- [ ] `dist` folder is created during build
- [ ] Frontend URL works: `https://your-app.vercel.app`
- [ ] Backend API responds: `https://your-backend.vercel.app/api/health`
- [ ] Map loads with satellite view
- [ ] Location detection works
- [ ] Hospitals show on map

---

## 🆘 **Still Having Issues?**

### Check Build Logs:
1. Go to Vercel Dashboard
2. Click on your deployment
3. Go to **"Deployment"** tab
4. Click **"View Build Logs"**
5. Look for errors

### Common Error Messages:

**Error:** "No Output Directory named 'dist' found"
**Solution:** Set Root Directory to `frontend` AND Output Directory to `dist`

**Error:** "Module not found: Can't resolve..."
**Solution:** Make sure `npm install` runs successfully

**Error:** "CORS policy error" (after deployment)
**Solution:** Update backend `ALLOWED_ORIGINS` environment variable

---

## 💡 **Pro Tip: Automatic Deployments**

Once configured correctly, Vercel will:
- ✅ Auto-deploy when you push to GitHub
- ✅ Generate preview URLs for pull requests
- ✅ Provide SSL certificates automatically
- ✅ Give you a production-ready URL

---

## 📞 **Quick Support**

If deployment fails:
1. Check the Root Directory is set to `frontend`
2. Verify Output Directory is `dist` (not `frontend/dist`)
3. Make sure Framework Preset is `Vite`
4. Review build logs for specific errors

---

**Now try deploying again with the correct settings! 🚀**

