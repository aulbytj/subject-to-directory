"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Home, 
  DollarSign, 
  MapPin, 
  FileText, 
  Camera,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import { useAuthContext } from '@/components/auth-provider';
import { properties } from '@/lib/properties';
import { toast } from 'sonner';

interface PropertyFormData {
  // Basic Information
  title: string;
  description: string;
  
  // Location
  address: string;
  city: string;
  state: string;
  zip_code: string;
  
  // Property Details
  property_type: 'single_family' | 'townhouse' | 'condo' | 'multi_family' | 'duplex' | 'other';
  bedrooms: number;
  bathrooms: number;
  square_feet: number;
  
  // Financial Information
  current_loan_balance: number;
  interest_rate: number;
  monthly_payment: number;
  asking_price: number;
  property_value: number;
  monthly_rent: number;
  property_taxes: number;
  insurance: number;
  hoa_fees: number;
  
  // Loan Details
  loan_type: string;
  lender: string;
  years_remaining: number;
  due_on_sale_clause: boolean;
}

const initialFormData: PropertyFormData = {
  title: '',
  description: '',
  address: '',
  city: '',
  state: '',
  zip_code: '',
  property_type: 'single_family',
  bedrooms: 3,
  bathrooms: 2,
  square_feet: 1500,
  current_loan_balance: 0,
  interest_rate: 0,
  monthly_payment: 0,
  asking_price: 0,
  property_value: 0,
  monthly_rent: 0,
  property_taxes: 0,
  insurance: 0,
  hoa_fees: 0,
  loan_type: '',
  lender: '',
  years_remaining: 30,
  due_on_sale_clause: false,
};

export default function ListPropertyPage() {
  const { user, profile, loading: authLoading } = useAuthContext();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<PropertyFormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const totalSteps = 4;

  // Handle form input changes
  const handleInputChange = (field: keyof PropertyFormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = e.target.type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSelectChange = (field: keyof PropertyFormData) => (value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleCheckboxChange = (field: keyof PropertyFormData) => (checked: boolean) => {
    setFormData(prev => ({ ...prev, [field]: checked }));
  };

  // Form validation
  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1: // Basic Information
        if (!formData.title.trim()) newErrors.title = 'Property title is required';
        if (!formData.description.trim()) newErrors.description = 'Property description is required';
        if (!formData.address.trim()) newErrors.address = 'Address is required';
        if (!formData.city.trim()) newErrors.city = 'City is required';
        if (!formData.state.trim()) newErrors.state = 'State is required';
        if (!formData.zip_code.trim()) newErrors.zip_code = 'ZIP code is required';
        break;
      
      case 2: // Property Details
        if (formData.bedrooms <= 0) newErrors.bedrooms = 'Number of bedrooms must be greater than 0';
        if (formData.bathrooms <= 0) newErrors.bathrooms = 'Number of bathrooms must be greater than 0';
        if (formData.square_feet <= 0) newErrors.square_feet = 'Square footage must be greater than 0';
        break;
      
      case 3: // Financial Information
        if (formData.current_loan_balance <= 0) newErrors.current_loan_balance = 'Loan balance is required';
        if (formData.interest_rate <= 0) newErrors.interest_rate = 'Interest rate is required';
        if (formData.monthly_payment <= 0) newErrors.monthly_payment = 'Monthly payment is required';
        if (formData.asking_price <= 0) newErrors.asking_price = 'Asking price is required';
        if (formData.property_value <= 0) newErrors.property_value = 'Property value is required';
        break;
      
      case 4: // Loan Details
        if (!formData.loan_type.trim()) newErrors.loan_type = 'Loan type is required';
        if (!formData.lender.trim()) newErrors.lender = 'Lender is required';
        if (formData.years_remaining <= 0) newErrors.years_remaining = 'Years remaining must be greater than 0';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!user) {
      toast.error('You must be logged in to list a property');
      return;
    }

    if (!validateStep(currentStep)) {
      return;
    }

    setLoading(true);
    
    try {
      const propertyData = {
        ...formData,
        user_id: user.id,
        status: 'active' as const,
        featured: false,
        view_count: 0,
      };

      const { data, error } = await properties.createProperty(propertyData);
      
      if (error) {
        toast.error('Failed to create property listing');
        console.error('Property creation error:', error);
        return;
      }

      toast.success('Property listed successfully!');
      router.push('/dashboard');
    } catch (error) {
      toast.error('An unexpected error occurred');
      console.error('Submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold mb-2">Loading...</h2>
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">Please log in to list a property.</p>
          <Button onClick={() => router.push('/login')}>
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  const stepTitles = [
    'Basic Information',
    'Property Details', 
    'Financial Information',
    'Loan Details'
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Badge variant="secondary" className="mb-4">
            <Home className="mr-2 h-4 w-4" />
            List Property
          </Badge>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            List Your Subject-To Property
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Connect with qualified buyers by listing your property for subject-to deals
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center justify-between">
            {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                  step <= currentStep 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {step < currentStep ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    step
                  )}
                </div>
                {step < totalSteps && (
                  <div className={`flex-1 h-1 mx-4 ${
                    step < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2">
            {stepTitles.map((title, index) => (
              <div key={index} className="text-sm text-gray-600 text-center">
                {title}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                Step {currentStep}: {stepTitles[currentStep - 1]}
              </CardTitle>
              <CardDescription>
                {currentStep === 1 && "Tell us about your property's location and basic details"}
                {currentStep === 2 && "Provide specific details about the property"}
                {currentStep === 3 && "Share the financial information for your property"}
                {currentStep === 4 && "Final details about the existing loan"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Step 1: Basic Information */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Property Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={handleInputChange('title')}
                      placeholder="e.g., Beautiful 3BR Home - Subject-To Deal"
                      className={errors.title ? 'border-red-500' : ''}
                    />
                    {errors.title && (
                      <p className="text-sm text-red-500 mt-1">{errors.title}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={handleInputChange('description')}
                      placeholder="Describe your property, its condition, and why it's perfect for a subject-to deal..."
                      rows={4}
                      className={errors.description ? 'border-red-500' : ''}
                    />
                    {errors.description && (
                      <p className="text-sm text-red-500 mt-1">{errors.description}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="address">Street Address</Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={handleInputChange('address')}
                        placeholder="123 Main Street"
                        className={errors.address ? 'border-red-500' : ''}
                      />
                      {errors.address && (
                        <p className="text-sm text-red-500 mt-1">{errors.address}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={handleInputChange('city')}
                        placeholder="City"
                        className={errors.city ? 'border-red-500' : ''}
                      />
                      {errors.city && (
                        <p className="text-sm text-red-500 mt-1">{errors.city}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        value={formData.state}
                        onChange={handleInputChange('state')}
                        placeholder="CA"
                        className={errors.state ? 'border-red-500' : ''}
                      />
                      {errors.state && (
                        <p className="text-sm text-red-500 mt-1">{errors.state}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="zip_code">ZIP Code</Label>
                      <Input
                        id="zip_code"
                        value={formData.zip_code}
                        onChange={handleInputChange('zip_code')}
                        placeholder="90210"
                        className={errors.zip_code ? 'border-red-500' : ''}
                      />
                      {errors.zip_code && (
                        <p className="text-sm text-red-500 mt-1">{errors.zip_code}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Property Details */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="property_type">Property Type</Label>
                    <Select value={formData.property_type} onValueChange={handleSelectChange('property_type')}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select property type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="single_family">Single Family Home</SelectItem>
                        <SelectItem value="townhouse">Townhouse</SelectItem>
                        <SelectItem value="condo">Condominium</SelectItem>
                        <SelectItem value="multi_family">Multi-Family</SelectItem>
                        <SelectItem value="duplex">Duplex</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="bedrooms">Bedrooms</Label>
                      <Input
                        id="bedrooms"
                        type="number"
                        min="1"
                        value={formData.bedrooms}
                        onChange={handleInputChange('bedrooms')}
                        className={errors.bedrooms ? 'border-red-500' : ''}
                      />
                      {errors.bedrooms && (
                        <p className="text-sm text-red-500 mt-1">{errors.bedrooms}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="bathrooms">Bathrooms</Label>
                      <Input
                        id="bathrooms"
                        type="number"
                        min="1"
                        step="0.5"
                        value={formData.bathrooms}
                        onChange={handleInputChange('bathrooms')}
                        className={errors.bathrooms ? 'border-red-500' : ''}
                      />
                      {errors.bathrooms && (
                        <p className="text-sm text-red-500 mt-1">{errors.bathrooms}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="square_feet">Square Feet</Label>
                      <Input
                        id="square_feet"
                        type="number"
                        min="1"
                        value={formData.square_feet}
                        onChange={handleInputChange('square_feet')}
                        className={errors.square_feet ? 'border-red-500' : ''}
                      />
                      {errors.square_feet && (
                        <p className="text-sm text-red-500 mt-1">{errors.square_feet}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Financial Information */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="current_loan_balance">Current Loan Balance</Label>
                      <Input
                        id="current_loan_balance"
                        type="number"
                        min="0"
                        value={formData.current_loan_balance}
                        onChange={handleInputChange('current_loan_balance')}
                        placeholder="250000"
                        className={errors.current_loan_balance ? 'border-red-500' : ''}
                      />
                      {errors.current_loan_balance && (
                        <p className="text-sm text-red-500 mt-1">{errors.current_loan_balance}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="interest_rate">Interest Rate (%)</Label>
                      <Input
                        id="interest_rate"
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.interest_rate}
                        onChange={handleInputChange('interest_rate')}
                        placeholder="3.5"
                        className={errors.interest_rate ? 'border-red-500' : ''}
                      />
                      {errors.interest_rate && (
                        <p className="text-sm text-red-500 mt-1">{errors.interest_rate}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="monthly_payment">Monthly Payment</Label>
                      <Input
                        id="monthly_payment"
                        type="number"
                        min="0"
                        value={formData.monthly_payment}
                        onChange={handleInputChange('monthly_payment')}
                        placeholder="1200"
                        className={errors.monthly_payment ? 'border-red-500' : ''}
                      />
                      {errors.monthly_payment && (
                        <p className="text-sm text-red-500 mt-1">{errors.monthly_payment}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="asking_price">Asking Price</Label>
                      <Input
                        id="asking_price"
                        type="number"
                        min="0"
                        value={formData.asking_price}
                        onChange={handleInputChange('asking_price')}
                        placeholder="300000"
                        className={errors.asking_price ? 'border-red-500' : ''}
                      />
                      {errors.asking_price && (
                        <p className="text-sm text-red-500 mt-1">{errors.asking_price}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="property_value">Current Property Value</Label>
                      <Input
                        id="property_value"
                        type="number"
                        min="0"
                        value={formData.property_value}
                        onChange={handleInputChange('property_value')}
                        placeholder="320000"
                        className={errors.property_value ? 'border-red-500' : ''}
                      />
                      {errors.property_value && (
                        <p className="text-sm text-red-500 mt-1">{errors.property_value}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="monthly_rent">Potential Monthly Rent</Label>
                      <Input
                        id="monthly_rent"
                        type="number"
                        min="0"
                        value={formData.monthly_rent}
                        onChange={handleInputChange('monthly_rent')}
                        placeholder="1800"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="property_taxes">Monthly Property Taxes</Label>
                      <Input
                        id="property_taxes"
                        type="number"
                        min="0"
                        value={formData.property_taxes}
                        onChange={handleInputChange('property_taxes')}
                        placeholder="400"
                      />
                    </div>
                    <div>
                      <Label htmlFor="insurance">Monthly Insurance</Label>
                      <Input
                        id="insurance"
                        type="number"
                        min="0"
                        value={formData.insurance}
                        onChange={handleInputChange('insurance')}
                        placeholder="150"
                      />
                    </div>
                    <div>
                      <Label htmlFor="hoa_fees">Monthly HOA Fees</Label>
                      <Input
                        id="hoa_fees"
                        type="number"
                        min="0"
                        value={formData.hoa_fees}
                        onChange={handleInputChange('hoa_fees')}
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Loan Details */}
              {currentStep === 4 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="loan_type">Loan Type</Label>
                      <Input
                        id="loan_type"
                        value={formData.loan_type}
                        onChange={handleInputChange('loan_type')}
                        placeholder="e.g., Conventional, FHA, VA"
                        className={errors.loan_type ? 'border-red-500' : ''}
                      />
                      {errors.loan_type && (
                        <p className="text-sm text-red-500 mt-1">{errors.loan_type}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="lender">Lender</Label>
                      <Input
                        id="lender"
                        value={formData.lender}
                        onChange={handleInputChange('lender')}
                        placeholder="e.g., Wells Fargo, Chase"
                        className={errors.lender ? 'border-red-500' : ''}
                      />
                      {errors.lender && (
                        <p className="text-sm text-red-500 mt-1">{errors.lender}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="years_remaining">Years Remaining on Loan</Label>
                    <Input
                      id="years_remaining"
                      type="number"
                      min="1"
                      value={formData.years_remaining}
                      onChange={handleInputChange('years_remaining')}
                      placeholder="27"
                      className={errors.years_remaining ? 'border-red-500' : ''}
                    />
                    {errors.years_remaining && (
                      <p className="text-sm text-red-500 mt-1">{errors.years_remaining}</p>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="due_on_sale_clause"
                      checked={formData.due_on_sale_clause}
                      onCheckedChange={handleCheckboxChange('due_on_sale_clause')}
                    />
                    <Label htmlFor="due_on_sale_clause" className="text-sm">
                      This loan has a due-on-sale clause
                    </Label>
                  </div>

                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Important:</strong> Most conventional loans have due-on-sale clauses. 
                      Please verify this information with your lender or loan documents.
                    </AlertDescription>
                  </Alert>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6">
                <Button 
                  variant="outline" 
                  onClick={prevStep}
                  disabled={currentStep === 1}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Previous
                </Button>

                {currentStep < totalSteps ? (
                  <Button onClick={nextStep}>
                    Next
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button onClick={handleSubmit} disabled={loading}>
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        List Property
                      </>
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}