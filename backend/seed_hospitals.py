"""
Seed script to add sample hospitals to the database
Run this script to populate the database with sample medical facilities
"""
from app import app, db, Hospital

# Sample hospitals with real locations (you can customize these)
sample_hospitals = [
    {
        'name': 'City General Hospital',
        'type': 'hospital',
        'latitude': 40.7589,
        'longitude': -73.9851,
        'address': '123 Medical Center Drive, New York, NY 10001',
        'phone': '+1 (555) 123-4567',
        'opening_hours': '24/7',
        'website': 'https://citygeneralhospital.example.com',
        'description': 'Full-service hospital with emergency room and specialized care departments',
        'is_featured': True
    },
    {
        'name': 'Downtown Medical Clinic',
        'type': 'clinic',
        'latitude': 40.7489,
        'longitude': -73.9680,
        'address': '456 Health Avenue, New York, NY 10002',
        'phone': '+1 (555) 234-5678',
        'opening_hours': 'Mon-Fri 8:00-18:00, Sat 9:00-14:00',
        'website': 'https://downtownmedical.example.com',
        'description': 'Walk-in clinic for urgent care and family medicine',
        'is_featured': True
    },
    {
        'name': 'Metro Pharmacy Plus',
        'type': 'pharmacy',
        'latitude': 40.7689,
        'longitude': -73.9590,
        'address': '789 Wellness Street, New York, NY 10003',
        'phone': '+1 (555) 345-6789',
        'opening_hours': 'Mon-Sat 7:00-22:00, Sun 9:00-20:00',
        'website': 'https://metropharmacy.example.com',
        'description': 'Full-service pharmacy with prescription services and health consultations',
        'is_featured': False
    },
    {
        'name': 'Riverside Dental Center',
        'type': 'dentist',
        'latitude': 40.7389,
        'longitude': -73.9920,
        'address': '321 Dental Plaza, New York, NY 10004',
        'phone': '+1 (555) 456-7890',
        'opening_hours': 'Mon-Fri 8:00-17:00',
        'website': 'https://riversidedental.example.com',
        'description': 'Comprehensive dental care including cosmetic dentistry',
        'is_featured': False
    },
    {
        'name': 'Family Care Medical Group',
        'type': 'doctors',
        'latitude': 40.7289,
        'longitude': -73.9750,
        'address': '555 Doctor Lane, New York, NY 10005',
        'phone': '+1 (555) 567-8901',
        'opening_hours': 'Mon-Fri 8:00-18:00, Sat 9:00-13:00',
        'website': 'https://familycaremedical.example.com',
        'description': 'Primary care physicians and specialists for all ages',
        'is_featured': True
    },
    {
        'name': 'Emergency Care Hospital',
        'type': 'hospital',
        'latitude': 40.7189,
        'longitude': -73.9880,
        'address': '999 Emergency Blvd, New York, NY 10006',
        'phone': '+1 (555) 678-9012',
        'opening_hours': '24/7',
        'website': 'https://emergencycare.example.com',
        'description': 'Trauma center with state-of-the-art emergency facilities',
        'is_featured': True
    },
    {
        'name': 'Wellness Clinic & Spa',
        'type': 'clinic',
        'latitude': 40.7889,
        'longitude': -73.9650,
        'address': '777 Wellness Way, New York, NY 10007',
        'phone': '+1 (555) 789-0123',
        'opening_hours': 'Mon-Sun 9:00-20:00',
        'website': 'https://wellnessclinic.example.com',
        'description': 'Holistic healthcare with alternative medicine options',
        'is_featured': False
    },
    {
        'name': 'Central Health Pharmacy',
        'type': 'pharmacy',
        'latitude': 40.7589,
        'longitude': -73.9750,
        'address': '888 Central Ave, New York, NY 10008',
        'phone': '+1 (555) 890-1234',
        'opening_hours': 'Mon-Fri 7:00-21:00, Sat-Sun 8:00-20:00',
        'website': 'https://centralhealthpharmacy.example.com',
        'description': '24-hour prescription filling and medical supplies',
        'is_featured': False
    }
]

def seed_database():
    """Add sample hospitals to the database"""
    with app.app_context():
        # Clear existing hospitals (optional - remove if you want to keep existing data)
        # Hospital.query.delete()
        
        # Add sample hospitals
        count = 0
        for hospital_data in sample_hospitals:
            # Check if hospital already exists (by name)
            existing = Hospital.query.filter_by(name=hospital_data['name']).first()
            if not existing:
                hospital = Hospital(**hospital_data)
                db.session.add(hospital)
                count += 1
                print(f"✓ Added: {hospital_data['name']}")
            else:
                print(f"⊘ Skipped (already exists): {hospital_data['name']}")
        
        # Commit changes
        db.session.commit()
        print(f"\n✅ Successfully added {count} new hospitals to the database!")
        print(f"📊 Total hospitals in database: {Hospital.query.count()}")

if __name__ == '__main__':
    print("🏥 Seeding database with sample hospitals...\n")
    seed_database()

