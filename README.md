# 🚀 ExpressCare - AI-Powered Healthcare Access Platform

**ExpressCare** is an intelligent healthcare triage and access platform designed specifically for Lagos, Nigeria. Built for the hackathon, it leverages cutting-edge AI to bridge the gap between patients and quality healthcare through intelligent pre-diagnosis, doctor matching, and community-powered funding.

---

## 🎯 The Problem We're Solving

In Lagos and across Nigeria, accessing timely, affordable healthcare remains a critical challenge:

- **⏰ Long Wait Times**: Patients spend hours in clinics without knowing if they're in the right place
- **💸 Upfront Costs**: Many can't afford immediate medical care, delaying critical treatment
- **🤔 Mismatched Care**: People often visit the wrong specialists, wasting time and money
- **📍 Navigation Issues**: Finding nearby, affordable, and quality healthcare facilities is difficult

**ExpressCare** addresses these pain points with a three-pronged AI-driven approach.

---

## ✨ How ExpressCare Works

### 1️⃣ **Chat with AI - Smart Triage**
Our intelligent AI doctor conducts a comprehensive health screening through natural conversation:
- **Multimodal Input**: Text, voice, and image support for symptoms
- **Recursive Questioning**: Up to 9 follow-up questions for accurate diagnosis
- **Clinical Reasoning**: Generates urgency classification (🔴 Red / 🟡 Yellow / 🟢 Green)
- **Pre-Consult Summary**: Creates a detailed medical summary for doctors including:
  - Main complaint and symptoms
  - Red flag indicators
  - Differential diagnoses
  - Vital signs analysis
  - Risk categorization

### 2️⃣ **Get Matched - Intelligent Doctor Pairing**
AI-powered matching connects you with the right specialist:
- **Specialty Detection**: Identifies the exact type of doctor you need
- **Location-Based**: Finds verified clinics and doctors near you in Lagos
- **Real-Time Availability**: Shows doctors' schedules and booking slots
- **Hospital Verification**: Live video KYC ensures only legitimate facilities are listed

### 3️⃣ **Secure Funding - Community Crowdfunding**
Can't afford treatment? The community has your back:
- **Campaign Creation**: Share your medical needs with the community
- **Transparent Tracking**: Real-time funding progress with visual indicators
- **Direct Support**: Community members contribute directly to verified medical needs
- **Impact Metrics**: See how many people you've helped and who's helping you

---

## 🎨 Key Features

### For Patients
- ✅ **AI Health Screener**: Interactive conversational diagnosis with Google Gemini 2.5 Flash
- ✅ **Smart Symptom Analysis**: Text, voice, and image-based symptom input
- ✅ **Doctor Recommendations**: AI suggests the exact specialist you need
- ✅ **Interactive Map**: Explore verified hospitals and clinics across Lagos
- ✅ **Instant Booking**: Schedule appointments via integrated Google Calendar
- ✅ **Patient Dashboard**: Track your health journey, appointments, and crowdfunding campaigns
- ✅ **Medical Crowdfunding**: Raise funds for treatment with community support
- ✅ **Live Impact Stats**: See real-time platform statistics and success stories

### For Healthcare Providers
- ✅ **Hospital Onboarding**: Simple 3-step registration process
- ✅ **Live Video KYC**: AI-powered facility verification using camera feed
- ✅ **Admin Dashboard**: Manage doctors, appointments, and patients
- ✅ **Doctor Registry**: Add and manage medical staff with specializations
- ✅ **Appointment Management**: View and update patient bookings in real-time
- ✅ **Analytics**: Track facility performance and patient flow

---

## 🛠️ Technology Stack

Built with modern, production-ready technologies:

### Frontend
- **React 19**: Latest React with hooks and concurrent features
- **Vite**: Lightning-fast build tool and dev server
- **Tailwind CSS**: Utility-first styling with custom theming
- **Framer Motion**: Smooth animations and transitions
- **React Three Fiber**: 3D graphics and shader effects
- **Leaflet / React-Leaflet**: Interactive mapping

### AI & APIs
- **Google Gemini 2.5 Flash**: Advanced multimodal AI for medical triage
- **Recharts**: Data visualization for analytics
- **Lucide React**: Beautiful icon library

### UI Components
- **Radix UI**: Accessible component primitives
- **Sonner**: Elegant toast notifications
- **Canvas Confetti**: Celebratory effects
- **@paper-design/shaders-react**: Advanced visual effects

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 16+ and npm installed
- **Google Gemini API Key** (optional for AI features)

### Installation

1. **Clone or navigate to the project**:
   ```bash
   cd lagos-health-screener
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open in browser**:
   - Navigate to `http://localhost:5173` (or the URL shown in terminal)

5. **Configure AI (Optional)**:
   - The app works in demo mode without an API key
   - For real AI analysis, the Gemini API key is pre-configured
   - To use your own key, update it in the top-right API settings

---

## 📖 Usage Guide

### As a Patient

1. **Sign Up**: Create an account on the beautiful animated login page
2. **Start Screening**: Fill out the initial health wizard form
3. **AI Interview**: Answer the AI's follow-up questions about your symptoms
4. **Get Results**: Review your triage summary, risk level, and recommended specialist
5. **Find Doctors**: Browse matched doctors and clinics on the interactive map
6. **Book Appointment**: Schedule directly via Google Calendar integration
7. **Need Help Paying?**: Create a crowdfunding campaign from your dashboard

### As a Hospital

1. **Hospital Signup**: Register as a healthcare provider
2. **Facility Details**: Enter your hospital information
3. **Add Doctors**: Register your medical staff and specializations
4. **Live Verification**: Complete AI-powered video KYC by showing your facility
5. **Access Dashboard**: Manage appointments, doctors, and patient flow

---

## 🔥 Continuing Development

Want to contribute or build upon ExpressCare? Here's how:

### Project Structure
```
lagos-health-screener/
├── src/
│   ├── components/          # React components
│   │   ├── ui/             # Reusable UI components
│   │   ├── Wizard.jsx      # Initial health form
│   │   ├── AIInterview.jsx # Conversational AI chat
│   │   ├── Summary.jsx     # Triage results
│   │   ├── HospitalMap.jsx # Interactive clinic map
│   │   └── ...
│   ├── data/               # Mock data & constants
│   ├── lib/                # Utilities
│   ├── App.jsx             # Main app logic & routing
│   └── index.css           # Global styles
├── public/                 # Static assets
└── package.json            # Dependencies
```

### Development Workflow

1. **Run in Development Mode**:
   ```bash
   npm run dev
   ```

2. **Build for Production**:
   ```bash
   npm run build
   ```

3. **Preview Production Build**:
   ```bash
   npm run preview
   ```

4. **Lint Code**:
   ```bash
   npm run lint
   ```

### Adding Features

#### Adding a New Symptom Type
1. Edit `src/components/AIInterview.jsx`
2. Add symptom logic to the AI prompt generation
3. Update the clinical reasoning schema in `src/App.jsx`

#### Adding a New Hospital
1. Update `src/data/clinics.js` with new clinic data
2. Ensure coordinates are accurate for map display
3. Add corresponding doctors to `src/data/doctors.js`

#### Customizing AI Prompts
1. Navigate to `src/App.jsx` → `handleInterviewComplete` function
2. Modify the `prompt` variable with your clinical reasoning logic
3. Adjust the JSON schema output as needed

#### Integrating Real Payment
1. Replace crowdfunding mock logic in `src/components/CrowdFundingView.jsx`
2. Integrate Paystack, Flutterwave, or Stripe APIs
3. Add transaction tracking to the patient dashboard

### Environment Variables

Create a `.env` file in the root directory:
```env
VITE_GEMINI_API_KEY=your_google_gemini_api_key_here
```

Update `src/App.jsx` to use environment variables:
```javascript
const [apiKey, setApiKey] = useState(import.meta.env.VITE_GEMINI_API_KEY || "");
```

### Key Extension Points

- **🔌 Backend Integration**: Replace localStorage with a real backend (Firebase, Supabase, or custom API)
- **💳 Payment Gateway**: Integrate Paystack or Flutterwave for real crowdfunding
- **📱 Mobile App**: Wrap with React Native or Capacitor for native mobile apps
- **🔔 Notifications**: Add push notifications for appointment reminders
- **📊 Advanced Analytics**: Expand hospital dashboard with detailed metrics
- **🌍 Multi-City Support**: Extend beyond Lagos to other Nigerian cities
- **🏥 EHR Integration**: Connect with existing hospital management systems
- **🔐 Enhanced Security**: Add OAuth, 2FA, and HIPAA-compliant data handling

---

## 🎨 Design Philosophy

ExpressCare follows a **premium, futuristic aesthetic**:
- **⚫ Pure Black & White**: Clean, high-contrast interface
- **💚 Neon Green Accents (#39ff14)**: Vibrant, energetic highlights for key actions
- **✨ Smooth Animations**: Framer Motion for delightful micro-interactions
- **🌊 3D Shaders**: WebGL effects for hero sections and backgrounds
- **🎯 Mobile-First**: Responsive design that works beautifully on all devices

---

## 🤝 Contributing

We welcome contributions! Here's how to get involved:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Code Style Guidelines
- Use **functional components** with hooks
- Follow **Airbnb JavaScript Style Guide**
- Add **PropTypes** or TypeScript for type safety
- Write **meaningful commit messages**
- Test on both desktop and mobile viewports

---

## 📝 License

This project was created for a hackathon and is available for educational and development purposes.

---

## 🙏 Acknowledgments

- **Google Gemini AI**: Powering our intelligent medical triage
- **Leaflet**: Open-source mapping
- **React Community**: For incredible tools and libraries
- **Lagos Healthcare Workers**: For inspiring this solution

---

## 📞 Support

Need help or have questions?
- 🐛 **Report Bugs**: Open an issue on GitHub
- 💡 **Feature Requests**: Share your ideas in discussions
- 📧 **Contact**: Reach out to the development team

---

## 🌟 Project Vision

ExpressCare aims to democratize healthcare access in Nigeria by combining AI-driven triage, community support, and verified healthcare networks. Our vision is a future where:
- **Every Nigerian** can access quality healthcare regardless of location or financial status
- **AI assists diagnosis** to reduce misdiagnosis and unnecessary hospital visits
- **Communities support each other** through transparent, verified crowdfunding
- **Healthcare providers** are fairly compensated and efficiently matched with patients

**Built with ❤️ for Lagos, Nigeria 🇳🇬**

---

*Last Updated: December 2025*
