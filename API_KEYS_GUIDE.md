# 🔑 API Keys Configuration Guide

Complete guide to configure API keys for Medi-Host.

---

## ✅ No API Key Required!

**Good News!** The core functionality of Medi-Host uses the **Overpass API (OpenStreetMap)** which is **completely FREE and requires NO API KEY**! 

Your app will work perfectly without any API keys. The optional API keys below are only for **enhanced features**.

---

## 🚀 Quick Start (No Keys Needed)

Just run the app as-is:

```bash
# Backend
cd backend
pip install -r requirements.txt
python app.py

# Frontend
cd frontend
npm install
npm run dev
```

**That's it!** Your app is fully functional without any API keys.

---

## 🔧 Configuration File

The app now loads configuration from `backend/.env` file:

```bash
backend/
├── .env              # Your API keys (never commit this!)
├── .env.example      # Template (safe to commit)
└── config.py         # Configuration loader
```

---

## 📝 How to Add API Keys

### Step 1: Install python-dotenv
```bash
cd backend
pip install python-dotenv
```

### Step 2: Edit the .env file
Open `backend/.env` and add your keys:

```env
# Example
TWILIO_ENABLED=true
TWILIO_ACCOUNT_SID=your_actual_sid_here
TWILIO_AUTH_TOKEN=your_actual_token_here
```

### Step 3: Restart Backend
```bash
python app.py
```

**That's it!** The app will automatically load your keys.

---

## 🌍 Overpass API (OpenStreetMap)

### Status: ✅ **NO API KEY REQUIRED**

**What it does:** Finds nearby hospitals, clinics, and pharmacies

**Cost:** FREE forever

**Rate Limits:** 
- ~1 request per second
- No daily limit
- No registration needed

**Current Configuration:**
```python
OVERPASS_API_URL = 'http://overpass-api.de/api/interpreter'
OVERPASS_TIMEOUT = 30 seconds
```

**Alternative Instances (if main is slow):**
- `https://overpass.kumi.systems/api/interpreter`
- `https://overpass.openstreetmap.ru/api/interpreter`

**Documentation:** https://overpass-api.de/

---

## 📱 Optional API Keys

These are **completely optional** and only add extra features.

---

### 1. Twilio (SMS Alerts) 📱

**Purpose:** Send SMS alerts when emergency button is pressed

**Cost:** Free trial with $15 credit, then pay-as-you-go ($0.0079/SMS)

**Setup:**

1. **Sign up:** https://www.twilio.com/try-twilio
2. **Get credentials:**
   - Go to Console Dashboard
   - Copy **Account SID**
   - Copy **Auth Token**
   - Get a **Phone Number** (free with trial)

3. **Add to .env:**
```env
TWILIO_ENABLED=true
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890
TWILIO_EMERGENCY_PHONE=+1987654321
```

4. **Install Twilio library:**
```bash
pip install twilio
```

5. **Usage Example:**
```python
from twilio.rest import Client

if app.config['TWILIO_ENABLED']:
    client = Client(
        app.config['TWILIO_ACCOUNT_SID'],
        app.config['TWILIO_AUTH_TOKEN']
    )
    
    message = client.messages.create(
        body="Emergency Alert! Location: lat, lon",
        from_=app.config['TWILIO_PHONE_NUMBER'],
        to=app.config['TWILIO_EMERGENCY_PHONE']
    )
```

---

### 2. SendGrid (Email Notifications) ✉️

**Purpose:** Send email confirmations for appointments

**Cost:** Free tier (100 emails/day), then $14.95/month for 40k emails

**Setup:**

1. **Sign up:** https://sendgrid.com/
2. **Get API Key:**
   - Settings → API Keys
   - Create API Key
   - Copy the key (shown only once!)

3. **Add to .env:**
```env
SENDGRID_ENABLED=true
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxx
SENDGRID_FROM_EMAIL=noreply@yourdomain.com
```

4. **Install SendGrid library:**
```bash
pip install sendgrid
```

5. **Usage Example:**
```python
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

if app.config['SENDGRID_ENABLED']:
    message = Mail(
        from_email=app.config['SENDGRID_FROM_EMAIL'],
        to_emails='user@example.com',
        subject='Appointment Confirmed',
        html_content='<strong>Your appointment is confirmed!</strong>'
    )
    
    sg = SendGridAPIClient(app.config['SENDGRID_API_KEY'])
    response = sg.send(message)
```

---

### 3. Google Maps API (Enhanced Geocoding) 🗺️

**Purpose:** Better location search and geocoding (alternative to Nominatim)

**Cost:** $200 free credit/month, then pay-as-you-go

**Setup:**

1. **Sign up:** https://console.cloud.google.com/
2. **Enable APIs:**
   - Geocoding API
   - Places API (optional)
   - Maps JavaScript API (optional)

3. **Get API Key:**
   - APIs & Services → Credentials
   - Create Credentials → API Key
   - Restrict key to your APIs

4. **Add to .env:**
```env
GOOGLE_MAPS_API_KEY=AIzaSyxxxxxxxxxxxxxxxxxxxxxxxxx
```

5. **Usage Example:**
```python
import googlemaps

if app.config['GOOGLE_MAPS_API_KEY']:
    gmaps = googlemaps.Client(key=app.config['GOOGLE_MAPS_API_KEY'])
    
    # Geocode an address
    result = gmaps.geocode('New York City')
    location = result[0]['geometry']['location']
    lat = location['lat']
    lng = location['lng']
```

---

### 4. Firebase (Push Notifications) 🔔

**Purpose:** Send push notifications to users' browsers

**Cost:** Free Spark plan (unlimited notifications!)

**Setup:**

1. **Create project:** https://console.firebase.google.com/
2. **Get config:**
   - Project Settings → General
   - Copy **API Key** and **Project ID**
   - Go to Cloud Messaging
   - Generate new key pair

3. **Add to .env:**
```env
FIREBASE_ENABLED=true
FIREBASE_API_KEY=AIzaSyxxxxxxxxxxxxxxxxxxxxxxxxx
FIREBASE_PROJECT_ID=your-project-id
```

4. **Install Firebase Admin:**
```bash
pip install firebase-admin
```

5. **Usage Example:**
```python
import firebase_admin
from firebase_admin import credentials, messaging

if app.config['FIREBASE_ENABLED']:
    cred = credentials.Certificate("path/to/serviceAccountKey.json")
    firebase_admin.initialize_app(cred)
    
    message = messaging.Message(
        notification=messaging.Notification(
            title='Appointment Reminder',
            body='Your appointment is tomorrow at 2 PM'
        ),
        token=device_token
    )
    
    response = messaging.send(message)
```

---

## 🔒 Security Best Practices

### ✅ DO:
- Keep `.env` file secure (never commit to Git)
- Use different keys for development and production
- Rotate keys regularly
- Restrict API keys to specific domains/IPs
- Use environment variables on deployment platforms

### ❌ DON'T:
- Commit `.env` to Git (it's already in .gitignore)
- Share API keys publicly
- Use same keys across projects
- Hard-code API keys in source files

---

## 🌐 Production Deployment

### Railway (Backend)

Add environment variables in Railway dashboard:

```
Settings → Variables → Add Variable
```

```env
SECRET_KEY=your-production-secret-key
ALLOWED_ORIGINS=https://your-frontend.netlify.app
TWILIO_ACCOUNT_SID=ACxxxx...
TWILIO_AUTH_TOKEN=xxxxx...
```

### Netlify (Frontend)

Add environment variables in Netlify:

```
Site Settings → Build & Deploy → Environment Variables
```

```env
VITE_API_URL=https://your-backend.railway.app
VITE_GOOGLE_MAPS_KEY=AIzaSyxxx...
```

---

## 🧪 Testing API Keys

### Test Twilio:
```bash
curl -X POST https://api.twilio.com/2010-04-01/Accounts/YOUR_SID/Messages.json \
  --data-urlencode "Body=Test message" \
  --data-urlencode "From=+1234567890" \
  --data-urlencode "To=+1987654321" \
  -u YOUR_SID:YOUR_AUTH_TOKEN
```

### Test SendGrid:
```bash
curl --request POST \
  --url https://api.sendgrid.com/v3/mail/send \
  --header 'Authorization: Bearer YOUR_API_KEY' \
  --header 'Content-Type: application/json' \
  --data '{"personalizations":[{"to":[{"email":"test@example.com"}]}],"from":{"email":"sender@example.com"},"subject":"Test","content":[{"type":"text/plain","value":"Hello"}]}'
```

---

## 📊 API Costs Summary

| Service | Free Tier | After Free Tier |
|---------|-----------|-----------------|
| **Overpass API** | ✅ FREE Forever | N/A |
| **Twilio** | $15 credit | $0.0079/SMS |
| **SendGrid** | 100 emails/day | $14.95/month |
| **Google Maps** | $200/month credit | Pay per request |
| **Firebase** | Unlimited notifications | FREE |

---

## ❓ FAQ

**Q: Do I need any API keys to use the app?**  
A: No! The app works perfectly with just Overpass API (free, no key needed).

**Q: Which API keys are most useful?**  
A: Twilio for SMS alerts and SendGrid for email confirmations are the most practical.

**Q: Can I use the app in production without any paid keys?**  
A: Yes! All core features work with free services.

**Q: How do I know if my API key is working?**  
A: Check the backend console logs or use the testing commands above.

**Q: What if I hit rate limits?**  
A: Overpass API rate limits are generous. For higher traffic, consider self-hosting an Overpass instance.

---

## 🆘 Troubleshooting

### API Key Not Working?
1. Check `.env` file syntax (no spaces around `=`)
2. Restart Flask server after adding keys
3. Verify key hasn't expired
4. Check API dashboard for usage/errors

### Environment Variables Not Loading?
```bash
# Install python-dotenv
pip install python-dotenv

# Verify config.py exists
ls backend/config.py

# Check if .env is being read
python -c "from config import Config; print(Config.SECRET_KEY)"
```

### Overpass API Slow?
- Try alternative instances (see above)
- Reduce search radius
- Implement caching

---

## 📚 Additional Resources

- **Overpass API Docs:** https://wiki.openstreetmap.org/wiki/Overpass_API
- **Twilio Docs:** https://www.twilio.com/docs
- **SendGrid Docs:** https://docs.sendgrid.com/
- **Google Maps Platform:** https://developers.google.com/maps
- **Firebase Docs:** https://firebase.google.com/docs

---

## ✅ Quick Checklist

- [x] App works without any API keys (Overpass is free!)
- [ ] (Optional) Add Twilio for SMS alerts
- [ ] (Optional) Add SendGrid for email notifications
- [ ] (Optional) Add Google Maps for better geocoding
- [ ] (Optional) Add Firebase for push notifications
- [ ] Never commit `.env` file to Git
- [ ] Use environment variables in production
- [ ] Test API keys before deploying

---

**Remember: Your app is fully functional right now with zero API keys! Optional keys just add extra features.** 🎉

**Last Updated:** October 2025

