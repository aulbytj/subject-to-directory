import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  UserPlus, 
  Home, 
  Search, 
  MessageCircle,
  FileCheck,
  Handshake
} from 'lucide-react';

export function HowItWorks() {
  const steps = [
    {
      icon: UserPlus,
      title: "Sign Up Free",
      description: "Create your account in minutes. Choose your role as a buyer, seller, or both.",
      color: "bg-blue-500"
    },
    {
      icon: Home,
      title: "List or Browse",
      description: "Sellers list properties with loan details. Buyers search and filter opportunities.",
      color: "bg-green-500"
    },
    {
      icon: MessageCircle,
      title: "Connect Securely",
      description: "Use our built-in messaging to communicate privately and safely.",
      color: "bg-purple-500"
    },
    {
      icon: FileCheck,
      title: "Verify & Validate",
      description: "Complete verification steps and perform due diligence on properties.",
      color: "bg-orange-500"
    },
    {
      icon: Handshake,
      title: "Close the Deal",
      description: "Work with professionals to structure and close your creative financing deal.",
      color: "bg-teal-500"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            Simple Process
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            How It Works
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Our streamlined process makes it easy to find and connect with the right opportunities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <div key={index} className="text-center">
                <Card className="mb-4 hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className={`w-16 h-16 rounded-full ${step.color} flex items-center justify-center mx-auto mb-4`}>
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <div className="text-sm font-medium text-gray-500 mb-2">
                      Step {index + 1}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}