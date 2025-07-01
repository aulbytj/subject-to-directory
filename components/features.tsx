import { 
  Search, 
  MessageCircle, 
  Shield, 
  BookOpen,
  Users,
  TrendingUp,
  Home,
  Calculator,
  FileText
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function Features() {
  const features = [
    {
      icon: Search,
      title: "Advanced Search",
      description: "Filter by location, interest rates, payment amounts, and seller situation to find the perfect deal.",
      color: "text-blue-600"
    },
    {
      icon: Shield,
      title: "Verified Listings",
      description: "Multi-layer verification ensures legitimate properties and reduces fraud risk.",
      color: "text-green-600"
    },
    {
      icon: MessageCircle,
      title: "Secure Messaging",
      description: "Built-in communication system keeps your contact info private until you're ready to share.",
      color: "text-purple-600"
    },
    {
      icon: BookOpen,
      title: "Education Center",
      description: "Learn about subject-to deals, risks, legal considerations, and best practices.",
      color: "text-orange-600"
    },
    {
      icon: Calculator,
      title: "Deal Calculators",
      description: "ROI calculators, payment analyzers, and equity estimators to evaluate opportunities.",
      color: "text-indigo-600"
    },
    {
      icon: Users,
      title: "Trusted Community",
      description: "Connect with verified investors, wholesalers, and homeowners in our growing network.",
      color: "text-teal-600"
    }
  ];

  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Everything You Need for Creative Real Estate
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Our platform provides all the tools and resources needed to successfully navigate 
            subject-to and creative financing deals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => {
            const IconComponent = feature.icon;
            return (
              <Card key={feature.title} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center mb-4`}>
                    <IconComponent className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}