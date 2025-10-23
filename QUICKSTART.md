# 🚀 Quick Start Guide

Get Medi-Host up and running in 5 minutes!

## Step 1: Clone or Download

```bash
# If cloning from git
git clone <repository-url>
cd Medi-Host
```

## Step 2: Backend Setup

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run Flask server
python app.py
```

✅ Backend running at http://localhost:5000

## Step 3: Frontend Setup

**Open a new terminal window**

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

✅ Frontend running at http://localhost:3000

## Step 4: Test the App

1. Open browser: http://localhost:3000
2. Allow location access when prompted
3. See nearby hospitals on the map!

## 🎉 That's it!

### Quick Commands Cheat Sheet

**Backend:**
```bash
cd backend
venv\Scripts\activate  # Windows
source venv/bin/activate  # macOS/Linux
python app.py
```

**Frontend:**
```bash
cd frontend
npm run dev
```

**Admin Dashboard:**
Navigate to: http://localhost:3000/admin

## ⚠️ Troubleshooting

### Location Not Working?
- Make sure you're using HTTPS in production
- Enable location services in browser settings
- Try Chrome/Firefox for best compatibility

### Port Already in Use?
- Backend: Change port in `backend/app.py`: `app.run(port=5001)`
- Frontend: Change port in `frontend/vite.config.js`: `server: { port: 3001 }`

### Can't See Facilities?
- Check internet connection (needed for Overpass API)
- Wait a few seconds (API may be slow)
- Try a different location

## 📚 Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Customize the UI colors in `frontend/tailwind.config.js`
- Add authentication to the admin dashboard
- Deploy to Railway (backend) and Netlify (frontend)

**Need help?** Check the troubleshooting section in README.md

