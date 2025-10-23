# 🏥 Medi-Host - Nearby Hospital Facility Finder

A modern, full-stack web application that helps users find nearby hospitals, clinics, and pharmacies using real-time location data and OpenStreetMap. Built with React, Flask, Tailwind CSS, and Leaflet.js.

![Medi-Host Banner](https://img.shields.io/badge/Medi--Host-Healthcare-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.2-61DAFB?style=flat-square&logo=react)
![Flask](https://img.shields.io/badge/Flask-3.0-000000?style=flat-square&logo=flask)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3-38B2AC?style=flat-square&logo=tailwind-css)

## ✨ Features

### 🌟 Core Features
- **🌍 Real-time Location Detection** - Automatically detect user's current location via browser geolocation
- **🗺️ Interactive Map** - Beautiful Leaflet map showing all nearby medical facilities
- **🏥 Facility Search** - Find hospitals, clinics, and pharmacies within customizable radius
- **📋 Detailed Information** - View name, address, phone, opening hours for each facility
- **📅 Appointment Booking** - Book appointments with form validation and confirmation
- **🚨 Emergency SOS** - One-tap emergency alert button with location sharing
- **🧑‍💼 Admin Dashboard** - View all appointments and emergency alerts

### 🎨 UI/UX Features
- **📱 Fully Responsive** - Works seamlessly on mobile, tablet, and desktop
- **🎨 Modern Design** - Clean UI with Tailwind CSS gradients, shadows, and animations
- **🔍 Location Search** - Manual location search for any city/address
- **🔄 Filter Options** - Filter facilities by type (Hospital/Clinic/Pharmacy)
- **💾 Smart Storage** - Auto-save user info in localStorage for faster booking
- **⚡ Real-time Updates** - Instant updates and smooth transitions

## 🛠️ Tech Stack

### Frontend
- **React 18.2** - Modern UI library
- **Vite** - Fast build tool and dev server
- **Tailwind CSS 3.3** - Utility-first CSS framework
- **React Leaflet** - Interactive map components
- **React Router** - Client-side routing
- **Axios** - HTTP client

### Backend
- **Flask 3.0** - Python web framework
- **SQLAlchemy** - ORM for database operations
- **Flask-CORS** - Cross-origin resource sharing
- **SQLite** - Lightweight database

### APIs
- **Geoapify Places API** - Real-time healthcare facility data with distance calculation
- **Geoapify Geocoding API** - Location search and coordinates

## 📁 Project Structure

```
Medi-Host/
├── backend/
│   ├── app.py                 # Flask application with API endpoints
│   ├── requirements.txt       # Python dependencies
│   ├── database.db            # SQLite database (auto-generated)
│   └── .gitignore
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── MapView.jsx           # Leaflet map component
│   │   │   ├── FacilityList.jsx      # List of facilities
│   │   │   ├── AppointmentForm.jsx   # Booking form modal
│   │   │   └── EmergencyButton.jsx   # SOS button
│   │   ├── pages/
│   │   │   ├── Home.jsx              # Main page
│   │   │   └── Admin.jsx             # Admin dashboard
│   │   ├── App.jsx                   # Root component
│   │   ├── main.jsx                  # Entry point
│   │   └── index.css                 # Global styles
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── .gitignore
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v16 or higher)
- **Python** (3.8 or higher)
- **npm** or **yarn**
- **Geoapify API Key** (free) - [Get it here](https://myprojects.geoapify.com/register)

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create virtual environment (recommended):**
   ```bash
   # Windows
   python -m venv venv
   venv\Scripts\activate

   # macOS/Linux
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the Flask server:**
   ```bash
   python app.py
   ```
   
   The backend will start at `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Geoapify API Key:**
   
   Create a `.env` file in the `frontend` folder:
   ```bash
   touch .env
   ```
   
   Add your Geoapify API key:
   ```env
   VITE_GEOAPIFY_API_KEY=your_api_key_here
   ```
   
   📖 **[Get FREE API Key & Setup Guide](GEOAPIFY_SETUP.md)**

4. **Start development server:**
   ```bash
   npm run dev
   ```
   
   The frontend will start at `http://localhost:3000`

### Access the Application

- **Main App:** http://localhost:3000
- **Admin Dashboard:** http://localhost:3000/admin
- **Backend API:** http://localhost:5000

## 🔌 API Endpoints

### GET `/api/nearby`
Fetch nearby medical facilities
- **Query Params:** `lat`, `lon`, `radius` (default: 3000m)
- **Response:** List of facilities with details

### POST `/api/appointments`
Create a new appointment
- **Body:** `{ name, phone, date, reason, facility_name }`
- **Response:** Created appointment object

### POST `/api/emergency`
Send emergency alert
- **Body:** `{ latitude, longitude, message, user_info }`
- **Response:** Created alert object

### GET `/api/admin/appointments`
Get all appointments (Admin)
- **Response:** List of all appointments

### GET `/api/admin/emergencies`
Get all emergency alerts (Admin)
- **Response:** List of all alerts

### GET `/api/health`
Health check endpoint
- **Response:** API status

## 🎯 Usage Guide

### For Users

1. **Allow Location Access** - Grant browser permission to access your location
2. **View Facilities** - See nearby hospitals, clinics, and pharmacies on the map
3. **Filter & Search** - Use filters to find specific facility types
4. **Book Appointment** - Click "Book" on any facility to schedule an appointment
5. **Emergency SOS** - Tap the red button in case of emergency

### For Administrators

1. **Access Dashboard** - Navigate to `/admin`
2. **View Appointments** - See all booked appointments with user details
3. **Monitor Emergencies** - Track emergency alerts with location data
4. **Export Data** - Use browser tools to export data if needed

## 🎨 Customization

### Change Map Radius
Edit the default radius in `frontend/src/pages/Home.jsx`:
```javascript
fetchNearbyFacilities(latitude, longitude, 5000) // Change 5000 to desired radius in meters
```

### Modify Color Scheme
Update Tailwind config in `frontend/tailwind.config.js`:
```javascript
colors: {
  primary: {
    500: '#your-color',
    // ...
  }
}
```

### Add More Facility Types
Update Overpass query in `backend/app.py`:
```python
node["amenity"="dentist"](around:{radius},{lat},{lon});
```

## 🌐 Deployment

### Backend Deployment (Railway)

1. Create account at [Railway.app](https://railway.app)
2. Create new project → Deploy from GitHub
3. Add environment variables if needed
4. Railway will auto-detect Flask and deploy

### Frontend Deployment (Netlify)

1. Build the frontend:
   ```bash
   cd frontend
   npm run build
   ```

2. Deploy `dist` folder to [Netlify](https://netlify.com)
3. Update API endpoint in production:
   ```javascript
   // frontend/vite.config.js
   const API_URL = import.meta.env.PROD 
     ? 'https://your-backend.railway.app'
     : 'http://localhost:5000'
   ```

### Alternative: GitHub Pages (Frontend)

```bash
cd frontend
npm run build
# Deploy dist folder to gh-pages branch
```

## 🔒 Security Considerations

- ⚠️ **Admin Dashboard:** Add authentication for production use
- 🔐 **API Keys:** Store sensitive keys in environment variables
- 🛡️ **CORS:** Restrict CORS origins in production
- 📊 **Rate Limiting:** Implement rate limiting for API endpoints
- 🔑 **HTTPS:** Use HTTPS in production

## 🐛 Troubleshooting

### Location Not Working
- Enable location services in browser settings
- Use HTTPS in production (required for geolocation)
- Check browser console for errors

### Map Not Loading
- Verify Leaflet CSS is loaded
- Check network tab for tile loading errors
- Ensure internet connection is stable

### API Timeout
- Overpass API may be slow during peak hours
- Increase timeout in backend: `timeout=60`
- Use local Overpass instance for production

### Database Errors
- Delete `database.db` and restart Flask to recreate tables
- Check SQLAlchemy logs for detailed errors

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m "Add feature"`
4. Push to branch: `git push origin feature-name`
5. Submit pull request

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- **OpenStreetMap** for map data and tiles
- **Overpass API** for facility search
- **Leaflet.js** for interactive maps
- **Tailwind CSS** for beautiful styling
- **React & Flask** communities for excellent documentation

## 📞 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Contact: your-email@example.com

## 🚀 Roadmap

- [ ] User authentication system
- [ ] SMS notifications via Twilio
- [ ] Real-time chat with facilities
- [ ] Mobile app (React Native)
- [ ] Multi-language support
- [ ] Dark mode
- [ ] Offline mode with service workers
- [ ] Integration with Google Maps
- [ ] Advanced analytics dashboard

---

**Built with ❤️ for better healthcare access**

**Emergency Numbers:** 911 (US) | 112 (EU) | 999 (UK) | 000 (AU)

