# 🏠 Subject-To Real Estate Directory

A comprehensive platform for creative real estate financing deals, connecting sellers and buyers for subject-to, seller-finance, and wraparound mortgage transactions.

![Next.js](https://img.shields.io/badge/Next.js-13.5.1-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0.4-blue?logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-2.26.0-green?logo=supabase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3.0-blue?logo=tailwindcss)

## ✨ Features

### 🔐 Authentication System
- **Secure user registration and login** with Supabase Auth
- **Role-based access control** (Buyers, Sellers, Both)
- **Protected routes** with middleware
- **Session management** with proper token handling

### 🏡 Property Management
- **4-step property listing form** with comprehensive validation
- **Property search and filtering** by location, price, type
- **Image upload and management** for listings
- **Property status tracking** (Active, Pending, Sold, Withdrawn)

### 📊 Financial Calculators
- **Cash Flow Calculator** - Monthly and annual cash flow analysis
- **Returns Calculator** - Cash-on-cash return and cap rate calculations
- **Deal Analysis** - Complete investment analysis with risk assessment
- **Payment Calculator** - Mortgage payment calculations

### 👤 User Dashboard
- **Personal property listings** management
- **Favorites system** for saved properties
- **Message center** for buyer-seller communication
- **Profile management** with verification status

### 📱 Modern UI/UX
- **Responsive design** optimized for all devices
- **shadcn/ui components** with Tailwind CSS
- **Smooth animations** and transitions
- **Accessible interface** following WCAG guidelines

## 🛠️ Technical Stack

- **Frontend**: Next.js 13.5.1 with App Router
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Styling**: Tailwind CSS + shadcn/ui components
- **Language**: TypeScript with strict configuration
- **Authentication**: Supabase Auth with Row Level Security
- **Database**: PostgreSQL with optimized queries
- **Deployment**: Vercel with automatic deployments

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/aulbytj/subject-to-directory.git
   cd subject-to-directory
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Add your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🗄️ Database Setup

The project uses Supabase with the following main tables:

- **profiles** - User profile information
- **properties** - Property listings with financial details
- **property_images** - Property photos and media
- **messages** - Communication between users
- **favorites** - Saved properties for users

### Database Migrations

Run the included migrations to set up your database:

```bash
# Apply migrations
supabase db push
```

## 📋 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous key | ✅ |

## 🎯 Usage

### For Sellers
1. **Create an account** as a Seller or Both
2. **List your property** using the comprehensive 4-step form
3. **Manage your listings** from the dashboard
4. **Communicate with buyers** through the message system

### For Buyers
1. **Create an account** as a Buyer or Both
2. **Search properties** using filters and criteria
3. **Use calculators** to analyze potential deals
4. **Save favorites** and contact sellers
5. **Track your activity** in the dashboard

### Financial Analysis
- **Cash Flow Calculator**: Analyze monthly and annual cash flow
- **Returns Calculator**: Calculate cash-on-cash return and cap rate
- **Deal Analysis**: Complete investment analysis with risk assessment
- **Payment Calculator**: Mortgage payment calculations

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Supabase](https://supabase.com/) - Backend as a Service
- [shadcn/ui](https://ui.shadcn.com/) - UI component library
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Lucide Icons](https://lucide.dev/) - Beautiful icons

## 📞 Support

If you have any questions or need help with setup, please open an issue or contact the development team.

---

**Built with ❤️ for the real estate investment community**