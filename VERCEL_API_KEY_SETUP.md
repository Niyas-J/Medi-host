# 🚀 Add API Key to Vercel (URGENT)

Your app is working but can't find hospitals because the API key isn't set on Vercel!

## ⚡ Quick Fix (5 Minutes):

### Step 1: Go to Vercel Dashboard
```
https://vercel.com/dashboard
```

### Step 2: Find Your Project
Click on **"Medi-host"** or **"frontend"**

### Step 3: Go to Settings
- Click **"Settings"** tab at the top
- Click **"Environment Variables"** in the left sidebar

### Step 4: Add the API Key
Click **"Add New"** button:

**Variable Name:**
```
VITE_GEOAPIFY_API_KEY
```

**Value:**
```
dc461739b87042228f6be3ee0e2bf02a
```

**Environments:** Check ALL boxes:
- ✅ Production
- ✅ Preview
- ✅ Development

Click **"Save"**

### Step 5: Redeploy
1. Go to **"Deployments"** tab
2. Click on the latest deployment
3. Click the **"..."** menu (three dots)
4. Click **"Redeploy"**
5. Wait 1-2 minutes

### Step 6: Test Again
Open your site and it should work:
```
https://frontend-fk1f98a8x-niyas-js-projects.vercel.app/
```

---

## 🧪 **Or Test with a Different Location:**

If your area has no facilities in the database, try searching for:
- **"Bangalore"**
- **"Koramangala"**
- **"New York"**
- **"London"**

Type in the search box at the top!

---

## ✅ **This Will Fix It!**

After adding the API key to Vercel and redeploying, hospitals will show up!

