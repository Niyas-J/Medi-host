# 🌐 Deployment Guide

Complete guide to deploy Medi-Host to production.

## Table of Contents
- [Backend Deployment (Railway)](#backend-deployment-railway)
- [Frontend Deployment (Netlify)](#frontend-deployment-netlify)
- [Alternative: Vercel](#alternative-vercel)
- [Alternative: Docker](#alternative-docker)
- [Environment Variables](#environment-variables)
- [Post-Deployment Checklist](#post-deployment-checklist)

---

## Backend Deployment (Railway)

Railway is perfect for Flask apps with free tier and automatic deployments.

### Steps:

1. **Create Railway Account**
   - Visit [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository
   - Select the `backend` folder

3. **Configure Build**
   - Railway auto-detects Flask
   - Build command: `pip install -r requirements.txt`
   - Start command: `python app.py`

4. **Add Environment Variables**
   ```
   FLASK_ENV=production
   SECRET_KEY=your-secret-key
   ```

5. **Deploy**
   - Click "Deploy"
   - Get your deployment URL: `https://your-app.railway.app`

6. **Enable Public Networking**
   - Go to Settings → Networking
   - Generate domain

---

## Frontend Deployment (Netlify)

Netlify offers free hosting with continuous deployment.

### Steps:

1. **Build the Frontend**
   ```bash
   cd frontend
   npm run build
   ```

2. **Update API Endpoint**
   
   Create `frontend/.env.production`:
   ```
   VITE_API_URL=https://your-backend.railway.app
   ```

   Update `frontend/vite.config.js`:
   ```javascript
   export default defineConfig({
     plugins: [react()],
     define: {
       'import.meta.env.VITE_API_URL': JSON.stringify(
         process.env.VITE_API_URL || 'http://localhost:5000'
       )
     }
   })
   ```

   Update API calls in components to use:
   ```javascript
   const API_URL = import.meta.env.VITE_API_URL || '/api'
   axios.get(`${API_URL}/nearby`)
   ```

3. **Deploy to Netlify**
   
   **Option A: Drag & Drop**
   - Visit [netlify.com](https://netlify.com)
   - Drag the `dist` folder to Netlify

   **Option B: CLI**
   ```bash
   npm install -g netlify-cli
   netlify login
   netlify deploy --prod --dir=dist
   ```

   **Option C: Continuous Deployment**
   - Connect GitHub repository
   - Build command: `npm run build`
   - Publish directory: `dist`

4. **Configure Redirects**
   
   Create `frontend/public/_redirects`:
   ```
   /* /index.html 200
   ```

5. **Custom Domain (Optional)**
   - Go to Domain settings
   - Add custom domain
   - Update DNS records

---

## Alternative: Vercel

Vercel is another excellent option for React apps.

### Steps:

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   cd frontend
   vercel
   ```

3. **Configure**
   - Build command: `npm run build`
   - Output directory: `dist`
   - Install command: `npm install`

---

## Alternative: Docker

Deploy both frontend and backend using Docker.

### Backend Dockerfile

Create `backend/Dockerfile`:
```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5000

CMD ["python", "app.py"]
```

### Frontend Dockerfile

Create `frontend/Dockerfile`:
```dockerfile
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### Docker Compose

Create `docker-compose.yml`:
```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - FLASK_ENV=production
    volumes:
      - ./backend:/app

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend
```

### Deploy
```bash
docker-compose up -d
```

---

## Environment Variables

### Backend (.env)
```
FLASK_ENV=production
SECRET_KEY=your-super-secret-key-change-this
DATABASE_URL=sqlite:///database.db
ALLOWED_ORIGINS=https://your-frontend.netlify.app
```

### Frontend (.env.production)
```
VITE_API_URL=https://your-backend.railway.app
```

---

## Post-Deployment Checklist

### Security
- [ ] Change default SECRET_KEY
- [ ] Enable HTTPS for both frontend and backend
- [ ] Restrict CORS origins to production domain
- [ ] Add rate limiting to API endpoints
- [ ] Implement admin authentication

### Performance
- [ ] Enable caching for static assets
- [ ] Compress images and assets
- [ ] Use CDN for Leaflet tiles (optional)
- [ ] Implement database indexing
- [ ] Add API response caching

### Monitoring
- [ ] Set up error tracking (Sentry)
- [ ] Add analytics (Google Analytics)
- [ ] Monitor API response times
- [ ] Set up uptime monitoring
- [ ] Configure backup for database

### Testing
- [ ] Test location detection on mobile
- [ ] Verify map loads on different devices
- [ ] Test appointment booking flow
- [ ] Check emergency alert functionality
- [ ] Test admin dashboard

### Documentation
- [ ] Update README with production URLs
- [ ] Document API rate limits
- [ ] Add deployment date to docs
- [ ] Update support contact info

---

## Common Issues

### CORS Errors
**Problem:** API requests blocked by CORS

**Solution:** 
```python
# backend/app.py
CORS(app, origins=['https://your-frontend.netlify.app'])
```

### Build Failures
**Problem:** Build fails on deployment platform

**Solution:**
- Check Node.js version matches local
- Verify all dependencies in package.json
- Clear cache and rebuild

### Database Issues
**Problem:** SQLite not suitable for production

**Solution:**
- Use PostgreSQL on Railway
- Update DATABASE_URL environment variable
- Change SQLAlchemy connection string

### Map Not Loading
**Problem:** Leaflet map doesn't load in production

**Solution:**
- Verify Leaflet CSS is included
- Check HTTPS is enabled
- Test on different browsers

---

## Scaling Tips

### Backend Scaling
- Use PostgreSQL instead of SQLite
- Add Redis for caching
- Implement background jobs with Celery
- Use load balancer for multiple instances

### Frontend Scaling
- Use CDN for static assets
- Implement lazy loading
- Add service worker for offline support
- Optimize bundle size with code splitting

### Database Scaling
- Add database indexes
- Implement connection pooling
- Use read replicas
- Archive old data

---

## Support

For deployment issues:
- Check platform documentation
- Open GitHub issue
- Contact: your-email@example.com

**Happy Deploying! 🚀**

