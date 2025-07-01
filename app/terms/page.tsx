import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Home } from 'lucide-react';
import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Home className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold">Sub2Directory</span>
            </div>
            <CardTitle className="text-3xl">Terms of Service</CardTitle>
            <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
          </CardHeader>
          
          <CardContent className="prose max-w-none">
            <h2>Acceptance of Terms</h2>
            <p>By accessing and using Sub2Directory, you accept and agree to be bound by the terms and provision of this agreement.</p>
            
            <h2>Use License</h2>
            <p>Permission is granted to temporarily use Sub2Directory for personal, non-commercial transitory viewing only.</p>
            
            <h2>User Account</h2>
            <p>You are responsible for safeguarding the password and for maintaining the confidentiality of your account.</p>
            
            <h2>Property Listings</h2>
            <p>Users are responsible for the accuracy of their property listings and must comply with all applicable laws and regulations.</p>
            
            <h2>Prohibited Uses</h2>
            <p>You may not use our service for any illegal or unauthorized purpose or to violate any laws in your jurisdiction.</p>
            
            <h2>Limitation of Liability</h2>
            <p>Sub2Directory shall not be liable for any indirect, incidental, special, consequential, or punitive damages.</p>
            
            <h2>Contact Information</h2>
            <p>If you have any questions about these Terms of Service, please contact us at legal@sub2directory.com</p>
            
            <div className="mt-8 pt-4 border-t">
              <Link href="/signup" className="text-primary hover:underline">
                ← Back to Sign Up
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}