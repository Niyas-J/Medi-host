# 🗺️ Geoapify API Setup Guide

This project now uses **Geoapify Places API** for real-time location detection and nearby hospital search.

## 🎯 Why Geoapify?

- ✅ **Accurate & Fast**: Real-time data from multiple sources
- ✅ **Distance Calculation**: Shows exact distance to each facility
- ✅ **Better Coverage**: More comprehensive healthcare facility data
- ✅ **Free Tier**: 3,000 requests/day for free
- ✅ **Modern API**: Clean REST API with JSON responses

---

## 📝 Getting Your FREE Geoapify API Key

### Step 1: Sign Up
1. Go to [Geoapify Registration](https://myprojects.geoapify.com/register)
2. Sign up with your email or Google account
3. Verify your email address

### Step 2: Create API Key
1. Log in to [Geoapify Dashboard](https://myprojects.geoapify.com/)
2. Click **"Create a new project"** or use the default project
3. You'll see your **API Key** automatically generated
4. Copy the API key (looks like: `abc123def456...`)

### Step 3: Add to Your Project

#### Option A: Environment Variable (Recommended for Production)
1. In the `frontend` folder, create a file named `.env`:
   ```bash
   cd frontend
   touch .env
   ```

2. Add your API key to `.env`:
   ```env
   VITE_GEOAPIFY_API_KEY=your_actual_api_key_here
   ```

3. **Important**: Never commit `.env` to Git (it's already in `.gitignore`)

#### Option B: Direct in Code (For Testing Only)
Edit `frontend/src/utils/geoapifyAPI.js`:
```javascript
const GEOAPIFY_API_KEY = 'your_actual_api_key_here';
```

⚠️ **Warning**: Don't use this method in production or commit the key to Git!

---

## 🚀 Running the Application

### Development
```bash
cd frontend
npm install
npm run dev
```

### Production Build
```bash
cd frontend
npm run build
```

---

## 🔧 API Features Used

### 1. **Places API** - Nearby Hospitals
- **Endpoint**: `/v2/places`
- **Categories**: 
  - `healthcare.hospital` - Hospitals
  - `healthcare.clinic` - Clinics
  - `healthcare.pharmacy` - Pharmacies
  - `healthcare.dentist` - Dental clinics
  - `healthcare.doctors` - Doctor offices
- **Features**:
  - Circle filter for radius search
  - Limit results for performance
  - Returns name, address, phone, hours, website

### 2. **Geocoding API** - Location Search
- **Endpoint**: `/v1/geocode/search`
- **Use**: Convert city names to coordinates
- **Example**: "New York" → `{lat: 40.7128, lon: -74.0060}`

---

## 📊 Free Tier Limits

| Feature | Limit |
|---------|-------|
| Requests/Day | 3,000 |
| Requests/Second | 5 |
| Places API | ✅ Included |
| Geocoding API | ✅ Included |

💡 **Tip**: This is more than enough for most applications!

---

## 🐛 Troubleshooting

### Issue: "API key error" or "401 Unauthorized"
**Solution**: 
- Check that your API key is correct
- Make sure `.env` file is in the `frontend` folder
- Restart the dev server after adding `.env`

### Issue: "No hospitals found"
**Solutions**:
- Increase search radius using the slider
- Try a different location (some rural areas have limited data)
- Check browser console for detailed error messages

### Issue: "Too many requests" (429 error)
**Solution**: 
- You've exceeded the free tier limit (3,000/day)
- Wait for the next day or upgrade your plan

### Issue: API key not loading
**Solution**:
```bash
# Make sure you're using VITE_ prefix for Vite to recognize it
VITE_GEOAPIFY_API_KEY=your_key

# Restart dev server
npm run dev
```

---

## 🔒 Security Best Practices

1. ✅ **Never commit** `.env` files to Git
2. ✅ **Use environment variables** in production
3. ✅ **Restrict API key** in Geoapify dashboard (optional)
   - Go to dashboard → Select project → API key settings
   - Add allowed domains (e.g., `yoursite.com`)
4. ✅ **Monitor usage** in Geoapify dashboard

---

## 📈 Upgrading (If Needed)

If you exceed 3,000 requests/day:

1. Go to [Geoapify Pricing](https://www.geoapify.com/pricing)
2. Choose a plan based on your needs
3. Paid plans start at $0.001 per request

---

## 🆚 Geoapify vs Overpass API

| Feature | Geoapify | Overpass (Old) |
|---------|----------|---------------|
| Speed | ⚡ Very Fast | 🐌 Slow |
| Distance | ✅ Built-in | ❌ Manual calc |
| Data Quality | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| Coverage | 🌍 Worldwide | 🌍 Worldwide |
| API Key | ✅ Required | ❌ No key |
| Rate Limits | 3K/day free | Unlimited (slow) |
| Modern | ✅ Yes | ❌ Legacy |

---

## 📞 Support

- **Geoapify Docs**: https://apidocs.geoapify.com/
- **Support**: https://www.geoapify.com/contact
- **Status**: https://status.geoapify.com/

---

## 🎓 Example API Response

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "name": "City General Hospital",
        "categories": ["healthcare.hospital"],
        "address_line1": "123 Main St",
        "address_line2": "New York, NY 10001",
        "phone": "+1-555-123-4567",
        "website": "https://hospital.com",
        "opening_hours": "24/7"
      },
      "geometry": {
        "type": "Point",
        "coordinates": [-74.0060, 40.7128]
      }
    }
  ]
}
```

---

**Last Updated**: October 2025

**Built with ❤️ using Geoapify API**

