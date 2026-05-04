# StudySpot

A mobile-first web app that helps students find study-friendly locations based on real user-submitted data about study conditions such as noise level, outlet availability, WiFi, seating type, purchase requirement, and open hours.

## 🚀 Live Deployment

**Frontend**: [https://main.xxxxx.amplifyapp.com](https://main.xxxxx.amplifyapp.com) *(Replace with your actual Amplify URL)*
**API**: [https://xxxxx.execute-api.us-east-1.amazonaws.com/prod](https://xxxxx.execute-api.us-east-1.amazonaws.com/prod) *(Replace with your actual API Gateway URL)*

## Project Structure

```
StudySpot/
├── client/     # React PWA (Vite + TailwindCSS)
│   ├── src/
│   │   ├── components/    # Navigation, MapView
│   │   ├── pages/        # Home, Results, Location, Review, Moderation
│   │   ├── services/     # API, Auth services
│   │   └── utils/        # Geolocation utilities
│   ├── public/
│   │   ├── manifest.json  # PWA manifest
│   │   └── icons/       # PWA icons (192x192, 512x512)
│   └── package.json
├── api/        # Express API (Serverless deployment)
│   ├── server.js          # Express server
│   ├── lambda.js          # Lambda wrapper
│   ├── serverless.yml     # Serverless configuration
│   └── package.json
├── supabase/   # SQL migrations + seeds
├── docs/       # PRD, site map, OpenAPI, deployment notes
├── README.md
└── .gitignore
```

## ✅ Level 3 Specification Compliance

This prototype meets all Level 3 Specification requirements:

### Navigation Plan
- ✅ Browse-first navigation (default list view)
- ✅ Map view available as alternative
- ✅ Filter panel with all required filters
- ✅ Clear location page hierarchy
- ✅ Write a Review action prominently placed

### Authentication Flow
- ✅ Users can browse without authentication
- ✅ Authentication required only on review submission
- ✅ Supabase Auth integration with email/password
- ✅ Sign up and sign in flows
- ✅ Session management and persistence

### Features Implemented
- ✅ **Home/Browse Nearby**: Default list view with map toggle
- ✅ **Filter Panel**: Noise level, WiFi, outlets, seating, open now, purchase required, public restroom
- ✅ **Location Preview**: Name, distance, rating, quick tags
- ✅ **Full Location Page**: Complete details with clear hierarchy
- ✅ **Review Submission**: Direct controls (buttons, radio buttons) instead of dropdowns
- ✅ **Review Moderation**: Upvote, downvote, and report functionality

## 🛠 Tech Stack

- **Frontend**: React 19 + Vite + TailwindCSS (PWA)
- **Backend**: Express.js + Serverless Framework
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Deployment**: AWS Amplify (Frontend) + AWS Lambda + API Gateway (Backend)

## 🚀 Deployment

### Frontend (AWS Amplify)
1. Connect GitHub repository to AWS Amplify
2. Set build directory: `/dist`
3. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_API_BASE_URL`
4. Deploy

### Backend (Serverless)
1. Install AWS CLI and configure credentials
2. Store secrets in AWS Secrets Manager:
   ```bash
   aws secretsmanager create-secret --name studyspot/api/prod --secret-string file://secrets.json
   ```
3. Deploy API:
   ```bash
   cd api
   npm run deploy
   ```

### Environment Variables

#### Client (.env)
```bash
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_API_BASE_URL=https://your-api-gateway-url.com/prod
```

#### API (.env)
```bash
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
AWS_REGION=us-east-1
```

## 📱 PWA Features

- ✅ Progressive Web App manifest
- ✅ Service Worker (Vite PWA plugin)
- ✅ Installable on mobile devices
- ✅ Offline functionality
- ✅ Responsive design

## 🔧 Development

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Supabase account
- AWS account (for deployment)

### Local Development

1. **Clone and install**:
   ```bash
   git clone <repository-url>
   cd StudySpot
   npm install --prefix client
   npm install --prefix api
   ```

2. **Configure environment**:
   ```bash
   cp client/.env.example client/.env
   cp api/.env.example api/.env
   # Edit both files with your credentials
   ```

3. **Run development servers**:
   ```bash
   # Terminal 1: Client
   cd client
   npm run dev

   # Terminal 2: API
   cd api
   npm run dev
   ```

4. **Access applications**:
   - Frontend: http://localhost:5173
   - API: http://localhost:3000

## 🧪 Testing

### Run API Tests
```bash
cd api
npm test
```

### Manual Testing Checklist
- [ ] Browse study spots (list and map views)
- [ ] Apply filters and sort
- [ ] View location details
- [ ] Submit review (with authentication flow)
- [ ] Vote on reviews
- [ ] Report inappropriate content
- [ ] PWA installation on mobile

## 🐛 Known Issues

- Location services require HTTPS for full functionality
- Some mobile browsers may limit PWA installation
- Review moderation UI needs admin panel for full content management

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 📞 Support

For deployment issues or questions:
- Check AWS CloudWatch logs for API errors
- Verify Supabase RLS policies
- Confirm environment variables are set correctly
- Check CORS configuration in API Gateway
