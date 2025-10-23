import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Config:
    """Application configuration from environment variables"""
    
    # Flask Configuration
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')
    FLASK_ENV = os.getenv('FLASK_ENV', 'development')
    
    # Database Configuration
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', 'sqlite:///database.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # CORS Configuration
    ALLOWED_ORIGINS = os.getenv('ALLOWED_ORIGINS', 'http://localhost:3000').split(',')
    
    # Overpass API Configuration (No API key needed - it's free!)
    OVERPASS_API_URL = 'http://overpass-api.de/api/interpreter'
    OVERPASS_TIMEOUT = int(os.getenv('OVERPASS_TIMEOUT', '30'))
    
    # Search Configuration
    DEFAULT_SEARCH_RADIUS = int(os.getenv('DEFAULT_SEARCH_RADIUS', '5000'))
    MAX_SEARCH_RADIUS = int(os.getenv('MAX_SEARCH_RADIUS', '15000'))
    
    # Optional: Twilio Configuration (for SMS alerts)
    TWILIO_ENABLED = os.getenv('TWILIO_ENABLED', 'false').lower() == 'true'
    TWILIO_ACCOUNT_SID = os.getenv('TWILIO_ACCOUNT_SID', '')
    TWILIO_AUTH_TOKEN = os.getenv('TWILIO_AUTH_TOKEN', '')
    TWILIO_PHONE_NUMBER = os.getenv('TWILIO_PHONE_NUMBER', '')
    TWILIO_EMERGENCY_PHONE = os.getenv('TWILIO_EMERGENCY_PHONE', '')
    
    # Optional: SendGrid Configuration (for email notifications)
    SENDGRID_ENABLED = os.getenv('SENDGRID_ENABLED', 'false').lower() == 'true'
    SENDGRID_API_KEY = os.getenv('SENDGRID_API_KEY', '')
    SENDGRID_FROM_EMAIL = os.getenv('SENDGRID_FROM_EMAIL', '')
    
    # Optional: Google Maps API Key (for geocoding)
    GOOGLE_MAPS_API_KEY = os.getenv('GOOGLE_MAPS_API_KEY', '')
    
    # Optional: Firebase Configuration (for push notifications)
    FIREBASE_ENABLED = os.getenv('FIREBASE_ENABLED', 'false').lower() == 'true'
    FIREBASE_API_KEY = os.getenv('FIREBASE_API_KEY', '')
    FIREBASE_PROJECT_ID = os.getenv('FIREBASE_PROJECT_ID', '')
    
    # Admin Configuration
    ADMIN_USERNAME = os.getenv('ADMIN_USERNAME', 'admin')
    ADMIN_PASSWORD = os.getenv('ADMIN_PASSWORD', 'admin123')  # Change in production!

