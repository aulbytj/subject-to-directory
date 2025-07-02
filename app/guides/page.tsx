'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  AlertTriangle, 
  BookOpen, 
  Calculator, 
  CheckCircle, 
  DollarSign, 
  FileText, 
  Home, 
  Shield, 
  TrendingUp,
  Users
} from 'lucide-react';

export default function GuidesPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Subject-To Real Estate Guides</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Master the art of creative real estate financing with our comprehensive guides to subject-to deals, 
          seller financing, and alternative investment strategies.
        </p>
      </div>

      <Tabs defaultValue="basics" className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
          <TabsTrigger value="basics">Basics</TabsTrigger>
          <TabsTrigger value="process">Process</TabsTrigger>
          <TabsTrigger value="legal">Legal</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="basics" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <BookOpen className="h-6 w-6" />
                <CardTitle>What is a Subject-To Deal?</CardTitle>
              </div>
              <CardDescription>
                Understanding the fundamentals of subject-to real estate investing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm leading-relaxed">
                A subject-to deal is a real estate transaction where the buyer takes ownership of a property 
                "subject to" the existing mortgage. The buyer makes payments on the seller's loan while the 
                original mortgage remains in the seller's name.
              </p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-semibold text-green-700 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Benefits for Buyers
                  </h4>
                  <ul className="text-sm space-y-1 pl-6">
                    <li>• Lower upfront costs</li>
                    <li>• No bank qualification required</li>
                    <li>• Faster closing process</li>
                    <li>• Access to properties below market value</li>
                    <li>• Build equity immediately</li>
                  </ul>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold text-blue-700 flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Benefits for Sellers
                  </h4>
                  <ul className="text-sm space-y-1 pl-6">
                    <li>• Avoid foreclosure</li>
                    <li>• Stop mortgage payments immediately</li>
                    <li>• Preserve credit score</li>
                    <li>• Quick property sale</li>
                    <li>• Potential future equity share</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <DollarSign className="h-6 w-6" />
                <CardTitle>Types of Creative Financing</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <Card className="border-2">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Subject-To</CardTitle>
                    <Badge variant="secondary">Most Common</Badge>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-sm">Buyer takes deed while mortgage stays in seller's name</p>
                    <p className="text-xs text-muted-foreground">Risk: Due-on-sale clause</p>
                  </CardContent>
                </Card>
                
                <Card className="border-2">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Owner Financing</CardTitle>
                    <Badge variant="outline">Seller Acts as Bank</Badge>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-sm">Seller provides financing directly to buyer</p>
                    <p className="text-xs text-muted-foreground">More control for both parties</p>
                  </CardContent>
                </Card>
                
                <Card className="border-2">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Wraparound</CardTitle>
                    <Badge variant="outline">Complex Structure</Badge>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-sm">New mortgage "wraps around" existing loan</p>
                    <p className="text-xs text-muted-foreground">Higher complexity, more protection</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="process" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <FileText className="h-6 w-6" />
                <CardTitle>Step-by-Step Process</CardTitle>
              </div>
              <CardDescription>
                How to structure and execute a subject-to deal from start to finish
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">1</div>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-2">Property Evaluation</h4>
                    <p className="text-sm text-muted-foreground mb-2">Analyze the deal's potential and verify all financial details</p>
                    <ul className="text-sm space-y-1 pl-4">
                      <li>• Confirm loan balance and payment amounts</li>
                      <li>• Verify property value through comps</li>
                      <li>• Calculate monthly cash flow potential</li>
                      <li>• Review loan terms and interest rate</li>
                    </ul>
                  </div>
                </div>

                <Separator />

                <div className="flex items-start gap-4">
                  <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">2</div>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-2">Due Diligence</h4>
                    <p className="text-sm text-muted-foreground mb-2">Thoroughly investigate the property and seller situation</p>
                    <ul className="text-sm space-y-1 pl-4">
                      <li>• Title search and lien verification</li>
                      <li>• Property inspection</li>
                      <li>• Seller motivation and timeline</li>
                      <li>• Neighborhood analysis</li>
                    </ul>
                  </div>
                </div>

                <Separator />

                <div className="flex items-start gap-4">
                  <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">3</div>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-2">Contract Negotiation</h4>
                    <p className="text-sm text-muted-foreground mb-2">Structure the deal terms that work for both parties</p>
                    <ul className="text-sm space-y-1 pl-4">
                      <li>• Purchase price agreement</li>
                      <li>• Down payment terms</li>
                      <li>• Monthly payment responsibility</li>
                      <li>• Property maintenance obligations</li>
                    </ul>
                  </div>
                </div>

                <Separator />

                <div className="flex items-start gap-4">
                  <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">4</div>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-2">Closing & Transfer</h4>
                    <p className="text-sm text-muted-foreground mb-2">Complete the legal transfer of ownership</p>
                    <ul className="text-sm space-y-1 pl-4">
                      <li>• Execute deed transfer</li>
                      <li>• Set up mortgage payment system</li>
                      <li>• Transfer utilities and insurance</li>
                      <li>• Document the agreement thoroughly</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Calculator className="h-6 w-6" />
                <CardTitle>Financial Analysis Framework</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">Key Metrics to Calculate</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                      <span className="text-sm">Monthly Cash Flow</span>
                      <code className="text-xs bg-background px-2 py-1 rounded">Rent - Payment - Expenses</code>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                      <span className="text-sm">Cash-on-Cash Return</span>
                      <code className="text-xs bg-background px-2 py-1 rounded">Annual Cash Flow / Cash Invested</code>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                      <span className="text-sm">Loan-to-Value Ratio</span>
                      <code className="text-xs bg-background px-2 py-1 rounded">Loan Balance / Property Value</code>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-semibold">Deal Quality Indicators</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Positive monthly cash flow</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">LTV below 85%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Stable rental market</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Motivated seller</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Good loan terms</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="legal" className="space-y-6">
          <Alert className="border-orange-200 bg-orange-50">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Legal Disclaimer</AlertTitle>
            <AlertDescription>
              This information is for educational purposes only and should not be considered legal advice. 
              Always consult with qualified real estate attorneys and tax professionals before proceeding with any transaction.
            </AlertDescription>
          </Alert>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="h-6 w-6" />
                <CardTitle>Legal Considerations & Risks</CardTitle>
              </div>
              <CardDescription>
                Understanding the legal landscape and potential complications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-red-700">Primary Risks</h4>
                  <div className="space-y-3">
                    <div className="p-3 border border-red-200 rounded-lg bg-red-50">
                      <h5 className="font-medium text-sm mb-1">Due-on-Sale Clause</h5>
                      <p className="text-xs text-muted-foreground">
                        Lender can call the loan due upon transfer of ownership
                      </p>
                    </div>
                    <div className="p-3 border border-red-200 rounded-lg bg-red-50">
                      <h5 className="font-medium text-sm mb-1">Seller Default Risk</h5>
                      <p className="text-xs text-muted-foreground">
                        Complications if seller has other financial issues
                      </p>
                    </div>
                    <div className="p-3 border border-red-200 rounded-lg bg-red-50">
                      <h5 className="font-medium text-sm mb-1">Title Issues</h5>
                      <p className="text-xs text-muted-foreground">
                        Potential problems with insurance and resale
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-semibold text-green-700">Risk Mitigation</h4>
                  <div className="space-y-3">
                    <div className="p-3 border border-green-200 rounded-lg bg-green-50">
                      <h5 className="font-medium text-sm mb-1">Loan Monitoring</h5>
                      <p className="text-xs text-muted-foreground">
                        Set up systems to track loan status and payments
                      </p>
                    </div>
                    <div className="p-3 border border-green-200 rounded-lg bg-green-50">
                      <h5 className="font-medium text-sm mb-1">Insurance Protection</h5>
                      <p className="text-xs text-muted-foreground">
                        Maintain adequate property and liability coverage
                      </p>
                    </div>
                    <div className="p-3 border border-green-200 rounded-lg bg-green-50">
                      <h5 className="font-medium text-sm mb-1">Legal Documentation</h5>
                      <p className="text-xs text-muted-foreground">
                        Proper contracts and agreements with attorney review
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Required Documentation</CardTitle>
              <CardDescription>Essential paperwork for a subject-to transaction</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-3">
                  <h4 className="font-semibold">Transfer Documents</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Warranty Deed or Quitclaim Deed</li>
                    <li>• Purchase Agreement</li>
                    <li>• Authorization to Release Information</li>
                    <li>• Property Disclosure Statement</li>
                  </ul>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold">Financial Records</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Loan Statements</li>
                    <li>• Payment History</li>
                    <li>• Property Tax Records</li>
                    <li>• Insurance Policies</li>
                  </ul>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold">Ongoing Agreements</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Monthly Payment Agreement</li>
                    <li>• Property Management Agreement</li>
                    <li>• Default and Remedy Procedures</li>
                    <li>• Future Sale Procedures</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-6 w-6" />
                <CardTitle>Advanced Strategies</CardTitle>
              </div>
              <CardDescription>
                Sophisticated techniques for experienced investors
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-3">Master Lease with Option to Purchase</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Combine a long-term lease agreement with an option to buy, providing flexibility and reduced risk.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-medium text-sm mb-2">Structure Benefits</h5>
                      <ul className="text-xs space-y-1">
                        <li>• Lower initial commitment</li>
                        <li>• Option to walk away</li>
                        <li>• Time to improve property value</li>
                        <li>• Lease payments can apply to purchase</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-medium text-sm mb-2">Key Terms</h5>
                      <ul className="text-xs space-y-1">
                        <li>• Option period length</li>
                        <li>• Purchase price determination</li>
                        <li>• Lease credit percentage</li>
                        <li>• Maintenance responsibilities</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-3">Land Contracts / Contract for Deed</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Seller retains legal title until buyer completes all payments under the contract terms.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-medium text-sm mb-2">Seller Advantages</h5>
                      <ul className="text-xs space-y-1">
                        <li>• Retain title as security</li>
                        <li>• Higher sales price potential</li>
                        <li>• Regular income stream</li>
                        <li>• Easier foreclosure process</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-medium text-sm mb-2">Buyer Considerations</h5>
                      <ul className="text-xs space-y-1">
                        <li>• No ownership until paid in full</li>
                        <li>• Risk of seller default</li>
                        <li>• Limited refinancing options</li>
                        <li>• Need strong legal protections</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-3">Equity Sharing Agreements</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Split ownership and future appreciation between buyer and seller based on agreed percentages.
                  </p>
                  <div className="bg-muted p-3 rounded text-sm">
                    <strong>Example Structure:</strong> Buyer gets 70% equity growth, seller retains 30% 
                    for providing financing. Both benefit from property appreciation over time.
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Home className="h-6 w-6" />
                <CardTitle>Market Analysis & Sourcing</CardTitle>
              </div>
              <CardDescription>Finding and evaluating subject-to opportunities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">Best Target Markets</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Areas with economic stress</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">High foreclosure rates</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Strong rental demand</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Stable property values</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-semibold">Lead Generation Methods</h4>
                  <div className="space-y-2 text-sm">
                    <div className="p-2 bg-muted rounded">Direct mail campaigns</div>
                    <div className="p-2 bg-muted rounded">Online marketing & SEO</div>
                    <div className="p-2 bg-muted rounded">Real estate agent networks</div>
                    <div className="p-2 bg-muted rounded">Foreclosure list monitoring</div>
                    <div className="p-2 bg-muted rounded">Bankruptcy court filings</div>
                    <div className="p-2 bg-muted rounded">Probate and divorce cases</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}