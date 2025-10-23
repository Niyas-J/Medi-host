# 📋 Project Structure

Complete file structure and component overview for Medi-Host.

## 📁 Directory Tree

```
Medi-Host/
│
├── 📄 README.md                          # Main documentation
├── 📄 QUICKSTART.md                      # Quick setup guide
├── 📄 DEPLOYMENT.md                      # Deployment instructions
├── 📄 API_DOCUMENTATION.md               # Complete API reference
├── 📄 PROJECT_STRUCTURE.md               # This file
├── 📄 .gitignore                         # Git ignore rules
│
├── 🐍 backend/                           # Flask Backend
│   ├── 📄 app.py                         # Main Flask application
│   ├── 📄 requirements.txt               # Python dependencies
│   ├── 📄 .env.example                   # Environment variables template
│   ├── 📄 .gitignore                     # Backend-specific ignores
│   └── 🗄️ database.db                    # SQLite database (auto-generated)
│
└── ⚛️ frontend/                          # React Frontend
    ├── 📁 public/
    │   └── 📄 vite.svg                   # Vite logo
    │
    ├── 📁 src/
    │   ├── 📁 components/                # React Components
    │   │   ├── 📄 MapView.jsx            # Interactive Leaflet map
    │   │   ├── 📄 FacilityList.jsx       # List of facilities with filters
    │   │   ├── 📄 AppointmentForm.jsx    # Booking form modal
    │   │   └── 📄 EmergencyButton.jsx    # SOS emergency button
    │   │
    │   ├── 📁 pages/                     # Page Components
    │   │   ├── 📄 Home.jsx               # Main landing page
    │   │   └── 📄 Admin.jsx              # Admin dashboard
    │   │
    │   ├── 📄 App.jsx                    # Root app component with routing
    │   ├── 📄 main.jsx                   # React entry point
    │   └── 📄 index.css                  # Global styles with Tailwind
    │
    ├── 📄 index.html                     # HTML template
    ├── 📄 package.json                   # Node dependencies
    ├── 📄 vite.config.js                 # Vite configuration
    ├── 📄 tailwind.config.js             # Tailwind CSS config
    ├── 📄 postcss.config.js              # PostCSS config
    └── 📄 .gitignore                     # Frontend-specific ignores
```

---

## 🔧 Component Architecture

### Backend Components

#### **app.py** (Main Flask App)
- **Database Models:**
  - `Appointment` - Store appointment bookings
  - `EmergencyAlert` - Store emergency alerts

- **API Endpoints:**
  - `GET /api/health` - Health check
  - `GET /api/nearby` - Fetch facilities from Overpass API
  - `POST /api/appointments` - Create appointment
  - `POST /api/emergency` - Send emergency alert
  - `GET /api/admin/appointments` - Get all appointments
  - `GET /api/admin/emergencies` - Get all alerts

- **Features:**
  - CORS enabled for frontend
  - SQLAlchemy ORM
  - Error handling
  - JSON responses

---

### Frontend Components

#### **Pages**

**Home.jsx** (Main User Interface)
- Geolocation detection
- Map container
- Facility list
- Search functionality
- Filter options
- Emergency button
- Appointment modal

**Admin.jsx** (Admin Dashboard)
- Appointments table
- Emergency alerts table
- Statistics cards
- Tab navigation
- Refresh functionality

---

#### **Components**

**MapView.jsx** (Interactive Map)
- Uses React Leaflet
- Shows user location (purple marker)
- Shows facilities (color-coded by type):
  - 🔴 Red = Hospital
  - 🔵 Blue = Clinic
  - 🟢 Green = Pharmacy
- Custom popups with facility info
- Auto-centering on location changes
- OpenStreetMap tiles

**FacilityList.jsx** (Facility Cards)
- Scrollable list of facilities
- Filter buttons (All/Hospital/Clinic/Pharmacy)
- Facility cards with:
  - Name and type
  - Address
  - Phone number
  - Opening hours
  - Website link
  - "Book" button
  - "Show on Map" button
- Hover effects
- Responsive design

**AppointmentForm.jsx** (Booking Modal)
- Modal popup overlay
- Form fields:
  - Full name
  - Phone number
  - Date & time picker
  - Reason for visit
- localStorage integration (saves user data)
- Form validation
- Success/error handling
- Close button

**EmergencyButton.jsx** (SOS Button)
- Fixed position (bottom-right)
- Pulsing animation
- Confirmation dialog
- Sends location data
- Shows user coordinates
- Emergency contact info

---

## 🎨 Styling System

### Tailwind CSS Classes Used

**Layout:**
- `container mx-auto` - Centered container
- `grid grid-cols-1 lg:grid-cols-2` - Responsive grid
- `flex flex-col md:flex-row` - Flexible layouts

**Colors:**
- Blue (`blue-500`, `blue-600`) - Primary actions
- Green (`green-500`, `green-600`) - Success/booking
- Red (`red-500`, `red-600`) - Emergency/alerts
- Purple (`purple-600`, `purple-700`) - Admin theme

**Effects:**
- `shadow-xl` - Large shadows
- `hover:shadow-2xl` - Hover shadows
- `rounded-xl`, `rounded-2xl` - Rounded corners
- `transition-all duration-300` - Smooth transitions
- `hover:-translate-y-1` - Hover lift effect
- `bg-gradient-to-r` - Gradient backgrounds

---

## 📊 Data Flow

### User Location → Facilities
```
User Browser
    ↓ (navigator.geolocation)
Home Component
    ↓ (axios.get)
Flask Backend
    ↓ (requests.post)
Overpass API
    ↓ (JSON response)
Flask Backend
    ↓ (processed data)
Frontend Components
    ↓ (render)
Map + List Display
```

### Appointment Booking
```
User fills form
    ↓
AppointmentForm Component
    ↓ (axios.post)
Flask Backend
    ↓ (SQLAlchemy)
SQLite Database
    ↓ (confirmation)
User notification
    ↓ (localStorage)
Save user data for next time
```

### Emergency Alert
```
User clicks SOS
    ↓
EmergencyButton Component
    ↓ (confirm dialog)
User confirms
    ↓ (axios.post with location)
Flask Backend
    ↓ (SQLAlchemy)
SQLite Database
    ↓ (success)
Admin Dashboard (visible)
```

---

## 🗃️ Database Schema

### Appointments Table
| Column | Type | Constraints |
|--------|------|-------------|
| id | INTEGER | PRIMARY KEY |
| name | VARCHAR(100) | NOT NULL |
| phone | VARCHAR(20) | NOT NULL |
| date | VARCHAR(50) | NOT NULL |
| reason | VARCHAR(200) | NOT NULL |
| facility_name | VARCHAR(200) | - |
| created_at | DATETIME | DEFAULT NOW |

### Emergency Alerts Table
| Column | Type | Constraints |
|--------|------|-------------|
| id | INTEGER | PRIMARY KEY |
| latitude | FLOAT | NOT NULL |
| longitude | FLOAT | NOT NULL |
| message | VARCHAR(500) | - |
| user_info | VARCHAR(200) | - |
| created_at | DATETIME | DEFAULT NOW |

---

## 🔄 State Management

### Home Page State
```javascript
- userLocation: [lat, lon] | null
- facilities: Array<Facility>
- loading: boolean
- error: string
- selectedFacility: Facility | null
- showAppointmentForm: boolean
- filter: 'all' | 'hospital' | 'clinic' | 'pharmacy'
- searchLocation: string
```

### Admin Page State
```javascript
- appointments: Array<Appointment>
- emergencies: Array<EmergencyAlert>
- loading: boolean
- activeTab: 'appointments' | 'emergencies'
```

---

## 🌐 API Integration

### External APIs Used

**Overpass API** (OpenStreetMap)
- URL: `http://overpass-api.de/api/interpreter`
- Purpose: Fetch nearby medical facilities
- Rate limit: ~1 request per second
- Free tier: Yes

**Nominatim API** (OpenStreetMap)
- URL: `https://nominatim.openstreetmap.org/search`
- Purpose: Geocode location search
- Rate limit: 1 request per second
- Free tier: Yes

---

## 📦 Dependencies

### Backend (Python)
```
Flask==3.0.0           # Web framework
Flask-CORS==4.0.0      # CORS support
Flask-SQLAlchemy==3.1.1 # ORM
requests==2.31.0        # HTTP client
SQLAlchemy==2.0.23      # Database toolkit
```

### Frontend (JavaScript)
```
react==18.2.0           # UI library
react-dom==18.2.0       # React DOM
react-router-dom==6.20.0 # Routing
leaflet==1.9.4          # Map library
react-leaflet==4.2.1    # React wrapper for Leaflet
axios==1.6.2            # HTTP client
tailwindcss==3.3.6      # CSS framework
vite==5.0.8             # Build tool
```

---

## 🚀 Build Process

### Development
```bash
# Backend
cd backend
python app.py
→ Runs on localhost:5000

# Frontend
cd frontend
npm run dev
→ Runs on localhost:3000
→ Vite hot reload enabled
```

### Production Build
```bash
# Backend
cd backend
pip install -r requirements.txt
gunicorn app:app  # Or python app.py

# Frontend
cd frontend
npm run build
→ Creates optimized dist/ folder
→ Minified and bundled assets
```

---

## 🔐 Security Considerations

### Current Implementation
- ✅ CORS enabled for development
- ✅ Input validation on backend
- ✅ SQL injection prevention (SQLAlchemy)
- ✅ XSS prevention (React escaping)

### Production Recommendations
- 🔒 Add JWT authentication for admin
- 🔒 Implement rate limiting
- 🔒 Use HTTPS everywhere
- 🔒 Add CSRF protection
- 🔒 Sanitize user inputs
- 🔒 Use environment variables for secrets
- 🔒 Enable SQL query logging
- 🔒 Add API key for Overpass if available

---

## 📈 Performance Optimization

### Current Optimizations
- React component memoization
- Lazy loading for modals
- Efficient state updates
- Optimized Leaflet rendering

### Future Improvements
- Implement service worker for offline mode
- Add Redis caching for API responses
- Use CDN for Leaflet tiles
- Implement infinite scroll for large datasets
- Add image optimization
- Implement code splitting

---

## 🧪 Testing Strategy

### Recommended Tests

**Backend:**
- Unit tests for API endpoints
- Database model tests
- Integration tests with Overpass API
- Error handling tests

**Frontend:**
- Component rendering tests
- User interaction tests
- Map functionality tests
- Form validation tests
- API integration tests

---

## 📝 Development Workflow

1. **Start Backend:** `python backend/app.py`
2. **Start Frontend:** `npm run dev` in frontend/
3. **Make Changes:** Edit files (hot reload enabled)
4. **Test Locally:** Test all features
5. **Commit:** `git commit -m "feature description"`
6. **Deploy:** Push to GitHub → Auto-deploy (if configured)

---

## 🆘 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Map not loading | Check Leaflet CSS is imported |
| Location denied | User must enable browser location |
| CORS error | Verify Flask-CORS is configured |
| Port in use | Change port in config files |
| Database locked | Close other database connections |
| Overpass timeout | Increase timeout or reduce radius |

---

## 📚 Resources

- **React Docs:** https://react.dev
- **Flask Docs:** https://flask.palletsprojects.com
- **Leaflet Docs:** https://leafletjs.com
- **Tailwind Docs:** https://tailwindcss.com
- **Overpass API:** https://overpass-api.de
- **OpenStreetMap:** https://www.openstreetmap.org

---

**Last Updated:** October 2025
**Version:** 1.0.0

