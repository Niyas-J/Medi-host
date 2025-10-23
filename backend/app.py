from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import requests
import os

app = Flask(__name__)

# Load configuration
try:
    from config import Config
    app.config.from_object(Config)
    CORS(app, origins=Config.ALLOWED_ORIGINS)
except ImportError:
    # Fallback if config.py doesn't exist
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    CORS(app)

db = SQLAlchemy(app)

# Models
class Appointment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    date = db.Column(db.String(50), nullable=False)
    reason = db.Column(db.String(200), nullable=False)
    facility_name = db.Column(db.String(200))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'phone': self.phone,
            'date': self.date,
            'reason': self.reason,
            'facility_name': self.facility_name,
            'created_at': self.created_at.isoformat()
        }

class EmergencyAlert(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    latitude = db.Column(db.Float, nullable=False)
    longitude = db.Column(db.Float, nullable=False)
    message = db.Column(db.String(500))
    user_info = db.Column(db.String(200))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'latitude': self.latitude,
            'longitude': self.longitude,
            'message': self.message,
            'user_info': self.user_info,
            'created_at': self.created_at.isoformat()
        }

# Create tables
with app.app_context():
    db.create_all()

# API Routes
@app.route('/api/nearby', methods=['GET'])
def get_nearby_facilities():
    """Fetch nearby hospitals, clinics, and pharmacies using Overpass API"""
    try:
        lat = request.args.get('lat', type=float)
        lon = request.args.get('lon', type=float)
        radius = request.args.get('radius', default=3000, type=int)

        if not lat or not lon:
            return jsonify({'error': 'Latitude and longitude are required'}), 400

        # Overpass API query
        overpass_url = "http://overpass-api.de/api/interpreter"
        query = f"""
        [out:json];
        (
          node["amenity"="hospital"](around:{radius},{lat},{lon});
          node["amenity"="clinic"](around:{radius},{lat},{lon});
          node["amenity"="pharmacy"](around:{radius},{lat},{lon});
          way["amenity"="hospital"](around:{radius},{lat},{lon});
          way["amenity"="clinic"](around:{radius},{lat},{lon});
          way["amenity"="pharmacy"](around:{radius},{lat},{lon});
        );
        out center;
        """

        response = requests.post(overpass_url, data={'data': query}, timeout=30)
        
        if response.status_code != 200:
            return jsonify({'error': 'Failed to fetch data from Overpass API'}), 500

        data = response.json()
        facilities = []

        for element in data.get('elements', []):
            # Get coordinates
            if element['type'] == 'node':
                facility_lat = element['lat']
                facility_lon = element['lon']
            elif element['type'] == 'way' and 'center' in element:
                facility_lat = element['center']['lat']
                facility_lon = element['center']['lon']
            else:
                continue

            tags = element.get('tags', {})
            
            facility = {
                'id': element['id'],
                'name': tags.get('name', 'Unnamed Facility'),
                'type': tags.get('amenity', 'unknown'),
                'latitude': facility_lat,
                'longitude': facility_lon,
                'address': tags.get('addr:street', '') + ' ' + tags.get('addr:housenumber', ''),
                'phone': tags.get('phone', tags.get('contact:phone', 'N/A')),
                'opening_hours': tags.get('opening_hours', 'N/A'),
                'website': tags.get('website', tags.get('contact:website', ''))
            }
            facilities.append(facility)

        return jsonify({
            'success': True,
            'count': len(facilities),
            'facilities': facilities
        })

    except requests.Timeout:
        return jsonify({'error': 'Request to Overpass API timed out'}), 504
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/appointments', methods=['POST'])
def create_appointment():
    """Create a new appointment"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400

        required_fields = ['name', 'phone', 'date', 'reason']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'{field} is required'}), 400

        appointment = Appointment(
            name=data['name'],
            phone=data['phone'],
            date=data['date'],
            reason=data['reason'],
            facility_name=data.get('facility_name', 'N/A')
        )

        db.session.add(appointment)
        db.session.commit()

        return jsonify({
            'success': True,
            'message': 'Appointment created successfully',
            'appointment': appointment.to_dict()
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/emergency', methods=['POST'])
def create_emergency_alert():
    """Create an emergency alert"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400

        if 'latitude' not in data or 'longitude' not in data:
            return jsonify({'error': 'Location data is required'}), 400

        alert = EmergencyAlert(
            latitude=data['latitude'],
            longitude=data['longitude'],
            message=data.get('message', 'Emergency alert triggered'),
            user_info=data.get('user_info', '')
        )

        db.session.add(alert)
        db.session.commit()

        return jsonify({
            'success': True,
            'message': 'Emergency alert sent successfully',
            'alert': alert.to_dict()
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/appointments', methods=['GET'])
def get_all_appointments():
    """Get all appointments for admin dashboard"""
    try:
        appointments = Appointment.query.order_by(Appointment.created_at.desc()).all()
        return jsonify({
            'success': True,
            'count': len(appointments),
            'appointments': [apt.to_dict() for apt in appointments]
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/emergencies', methods=['GET'])
def get_all_emergencies():
    """Get all emergency alerts for admin dashboard"""
    try:
        alerts = EmergencyAlert.query.order_by(EmergencyAlert.created_at.desc()).all()
        return jsonify({
            'success': True,
            'count': len(alerts),
            'alerts': [alert.to_dict() for alert in alerts]
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'message': 'Nearby Hospital Facility Finder API is running'
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)

