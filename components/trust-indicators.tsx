import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Shield, 
  CheckCircle, 
  Users, 
  Star,
  Lock,
  Award
} from 'lucide-react';

export function TrustIndicators() {
  const trustFeatures = [
    {
      icon: Shield,
      title: "Verified Listings",
      description: "Every property goes through our verification process",
      stat: "100%"
    },
    {
      icon: CheckCircle,
      title: "Email Verification",
      description: "All users must verify their email address",
      stat: "Required"
    },
    {
      icon: Users,
      title: "Community Trust",
      description: "User profiles with ratings and response times",
      stat: "4.8/5"
    },
    {
      icon: Lock,
      title: "Secure Communication",
      description: "Private messaging keeps your info safe",
      stat: "Encrypted"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4 bg-blue-100 text-blue-800">
            <Shield className="mr-2 h-4 w-4" />
            Trust & Safety
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Built for Trust and Security
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            We've implemented multiple layers of security and verification to ensure 
            a safe environment for all users.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {trustFeatures.map((feature) => {
            const IconComponent = feature.icon;
            return (
              <Card key={feature.title} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">{feature.description}</p>
                  <Badge variant="outline" className="text-blue-600 border-blue-200">
                    {feature.stat}
                  </Badge>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Testimonial Section */}
        <div className="bg-white rounded-2xl p-8 shadow-xl">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
              ))}
            </div>
            <blockquote className="text-lg text-gray-700 mb-6">
              "This platform made finding a subject-to deal so much easier. The verification 
              process gave me confidence, and the educational resources helped me understand 
              the risks and opportunities."
            </blockquote>
            <div className="flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center mr-4">
                <Users className="h-6 w-6 text-gray-600" />
              </div>
              <div>
                <div className="font-semibold">Sarah M.</div>
                <div className="text-sm text-gray-600">Real Estate Investor</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}