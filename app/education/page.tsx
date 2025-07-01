import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  BookOpen, 
  AlertTriangle, 
  Shield, 
  Calculator,
  FileText,
  Video,
  ChevronRight,
  CheckCircle
} from 'lucide-react';
import Link from 'next/link';

export default function EducationPage() {
  const topics = [
    {
      icon: BookOpen,
      title: "What is Subject-To?",
      description: "Understanding the basics of subject-to real estate transactions",
      level: "Beginner",
      readTime: "5 min read",
      color: "text-blue-600"
    },
    {
      icon: AlertTriangle,
      title: "Risks and Considerations",
      description: "Important legal and financial risks every participant should know",
      level: "Important",
      readTime: "8 min read",
      color: "text-red-600"
    },
    {
      icon: Shield,
      title: "Due Diligence Checklist",
      description: "Essential steps to verify and protect your investment",
      level: "Intermediate",
      readTime: "12 min read",
      color: "text-green-600"
    },
    {
      icon: Calculator,
      title: "Financial Analysis",
      description: "How to evaluate deals and calculate returns",
      level: "Intermediate",
      readTime: "10 min read",
      color: "text-purple-600"
    },
    {
      icon: FileText,
      title: "Legal Documentation",
      description: "Understanding contracts and legal requirements",
      level: "Advanced",
      readTime: "15 min read",
      color: "text-orange-600"
    },
    {
      icon: Video,
      title: "Case Studies",
      description: "Real-world examples and success stories",
      level: "All Levels",
      readTime: "20 min read",
      color: "text-teal-600"
    }
  ];

  const quickFacts = [
    {
      title: "Due-on-Sale Clause",
      description: "Most loans have a due-on-sale clause that technically makes the full balance due when ownership transfers."
    },
    {
      title: "Insurance Requirements",
      description: "Buyers typically need to maintain insurance and may need to be added to the existing policy."
    },
    {
      title: "Legal Consultation",
      description: "Always consult with a real estate attorney familiar with subject-to transactions in your state."
    },
    {
      title: "Exit Strategy",
      description: "Have a clear plan for refinancing or selling the property within a reasonable timeframe."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">
            <BookOpen className="mr-2 h-4 w-4" />
            Education Center
          </Badge>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Learn About Subject-To Deals
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Get educated on the ins and outs of subject-to real estate transactions. 
            Understanding the risks and opportunities is crucial for success.
          </p>
        </div>

        {/* Warning Notice */}
        <Card className="mb-8 border-orange-200 bg-orange-50">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-6 w-6 text-orange-600 mt-1" />
              <div>
                <h3 className="font-semibold text-orange-900 mb-2">
                  Important Legal Disclaimer
                </h3>
                <p className="text-orange-800 text-sm">
                  Subject-to real estate transactions involve significant legal and financial risks. 
                  This platform provides educational information only and does not constitute legal advice. 
                  Always consult with qualified professionals before proceeding with any transaction.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Learning Topics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {topics.map((topic) => {
            const IconComponent = topic.icon;
            return (
              <Card key={topic.title} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center mb-4`}>
                    <IconComponent className={`h-6 w-6 ${topic.color}`} />
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline">{topic.level}</Badge>
                    <span className="text-sm text-gray-500">{topic.readTime}</span>
                  </div>
                  <CardTitle className="text-lg">{topic.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 mb-4">
                    {topic.description}
                  </CardDescription>
                  <Button variant="ghost" className="w-full justify-between" asChild>
                    <Link href={`/education/${topic.title.toLowerCase().replace(/\s+/g, '-')}`}>
                      Read Article
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Facts */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="mr-2 h-5 w-5 text-green-600" />
              Quick Facts & Key Points
            </CardTitle>
            <CardDescription>
              Essential information every participant should know
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {quickFacts.map((fact, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">{fact.title}</h4>
                    <p className="text-sm text-gray-600">{fact.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-blue-900 mb-2">
                Ready to Start Your Journey?
              </h3>
              <p className="text-blue-700 mb-6">
                Browse our calculators and guides to help you evaluate opportunities
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild>
                  <Link href="/calculators">
                    <Calculator className="mr-2 h-4 w-4" />
                    Use Calculators
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/guides">
                    <FileText className="mr-2 h-4 w-4" />
                    Download Guides
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}