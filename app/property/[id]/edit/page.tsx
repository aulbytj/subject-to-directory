"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CurrencyInput } from '@/components/ui/currency-input';
import { PercentageInput } from '@/components/ui/percentage-input';
import { YearsInput } from '@/components/ui/years-input';
import { 
  ArrowLeft,
  Save,
  AlertCircle,
  Home,
  Lock
} from 'lucide-react';
import Link from 'next/link';
import { properties } from '@/lib/properties';
import { Property } from '@/lib/supabase';
import { useAuthContext } from '@/components/auth-provider';
import { toast } from 'sonner';

export default function EditPropertyPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuthContext();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const propertyId = params.id as string;

  // Redirect anonymous users to login page
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirectTo=' + encodeURIComponent(`/property/${propertyId}/edit`));
      return;
    }
  }, [authLoading, user, router, propertyId]);

  useEffect(() => {
    if (propertyId && user) {
      loadProperty();
    }
  }, [propertyId, user]);

  const loadProperty = async () => {
    try {
      setLoading(true);
      const { data, error } = await properties.getProperty(propertyId);
      
      if (error) {
        console.error('Error loading property:', error);
        toast.error('Failed to load property details');
        return;
      }

      if (!data) {
        toast.error('Property not found');
        router.push('/dashboard');
        return;
      }

      // Check if user owns this property
      if (data.user_id !== user?.id) {
        toast.error('You can only edit your own properties');
        router.push('/dashboard');
        return;
      }

      setProperty(data);
    } catch (error) {
      console.error('Error loading property:', error);
      toast.error('Failed to load property details');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof Property) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (!property) return;
    
    const value = e.target.type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value;
    setProperty(prev => prev ? { ...prev, [field]: value } : null);
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleCurrencyChange = (field: keyof Property) => (value: number) => {
    if (!property) return;
    setProperty(prev => prev ? { ...prev, [field]: value } : null);
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handlePercentageChange = (field: keyof Property) => (value: number) => {
    if (!property) return;
    setProperty(prev => prev ? { ...prev, [field]: value } : null);
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleYearsChange = (field: keyof Property) => (value: number) => {
    if (!property) return;
    setProperty(prev => prev ? { ...prev, [field]: value } : null);
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSelectChange = (field: keyof Property) => (value: string) => {
    if (!property) return;
    setProperty(prev => prev ? { ...prev, [field]: value } : null);
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleCheckboxChange = (field: keyof Property) => (checked: boolean) => {
    if (!property) return;
    setProperty(prev => prev ? { ...prev, [field]: checked } : null);
  };

  const validateForm = (): boolean => {
    if (!property) return false;
    
    const newErrors: Record<string, string> = {};

    if (!property.title?.trim()) newErrors.title = 'Property title is required';
    if (!property.description?.trim()) newErrors.description = 'Property description is required';
    if (!property.address?.trim()) newErrors.address = 'Address is required';
    if (!property.city?.trim()) newErrors.city = 'City is required';
    if (!property.state?.trim()) newErrors.state = 'State is required';
    if (!property.zip_code?.trim()) newErrors.zip_code = 'ZIP code is required';
    if (property.bedrooms <= 0) newErrors.bedrooms = 'Number of bedrooms must be greater than 0';
    if (property.bathrooms <= 0) newErrors.bathrooms = 'Number of bathrooms must be greater than 0';
    if (property.current_loan_balance <= 0) newErrors.current_loan_balance = 'Loan balance is required';
    if (property.interest_rate <= 0) newErrors.interest_rate = 'Interest rate is required';
    if (property.monthly_payment <= 0) newErrors.monthly_payment = 'Monthly payment is required';
    if (property.asking_price <= 0) newErrors.asking_price = 'Asking price is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!property || !user) {
      toast.error('Unable to save changes');
      return;
    }

    if (!validateForm()) {
      toast.error('Please fix the errors before saving');
      return;
    }

    setSaving(true);
    
    try {
      const { data, error } = await properties.updateProperty(property.id, {
        title: property.title,
        description: property.description,
        address: property.address,
        city: property.city,
        state: property.state,
        zip_code: property.zip_code,
        property_type: property.property_type,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        square_feet: property.square_feet,
        current_loan_balance: property.current_loan_balance,
        interest_rate: property.interest_rate,
        monthly_payment: property.monthly_payment,
        asking_price: property.asking_price,
        property_value: property.property_value,
        monthly_rent: property.monthly_rent,
        property_taxes: property.property_taxes,
        insurance: property.insurance,
        hoa_fees: property.hoa_fees,
        loan_type: property.loan_type,
        lender: property.lender,
        years_remaining: property.years_remaining,
        due_on_sale_clause: property.due_on_sale_clause
      });

      if (error) {
        console.error('Property update error:', error);
        toast.error(`Failed to update property: ${error.message || 'Unknown error'}`);
        return;
      }

      toast.success('Property updated successfully!');
      router.push(`/property/${property.id}`);
    } catch (error) {
      toast.error('An unexpected error occurred');
      console.error('Save error:', error);
    } finally {
      setSaving(false);
    }
  };

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold mb-2">Loading...</h2>
        </div>
      </div>
    );
  }

  // Show login prompt for anonymous users
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <Lock className="h-16 w-16 text-blue-600 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Login Required</h2>
          <p className="text-gray-600 mb-6">
            Please sign in to edit your property listings.
          </p>
          <Button asChild className="w-full">
            <Link href={`/login?redirectTo=${encodeURIComponent(`/property/${propertyId}/edit`)}`}>
              Sign In
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold mb-2">Loading property...</h2>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Property Not Found</h2>
          <p className="text-gray-600 mb-4">
            The property you're trying to edit doesn't exist or you don't have permission to edit it.
          </p>
          <Button onClick={() => router.push('/dashboard')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <Button variant="ghost" asChild className="mb-4">
            <Link href={`/property/${property.id}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Property Details
            </Link>
          </Button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Property</h1>
              <p className="text-gray-600">Update your property listing information</p>
            </div>
            <Badge variant="secondary">
              <Home className="mr-2 h-4 w-4" />
              Edit Mode
            </Badge>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>Update your property's basic details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title">Property Title</Label>
                    <Input
                      id="title"
                      value={property.title || ''}
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
                      value={property.description || ''}
                      onChange={handleInputChange('description')}
                      placeholder="Describe your property..."
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
                        value={property.address || ''}
                        onChange={handleInputChange('address')}
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
                        value={property.city || ''}
                        onChange={handleInputChange('city')}
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
                        value={property.state || ''}
                        onChange={handleInputChange('state')}
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
                        value={property.zip_code || ''}
                        onChange={handleInputChange('zip_code')}
                        className={errors.zip_code ? 'border-red-500' : ''}
                      />
                      {errors.zip_code && (
                        <p className="text-sm text-red-500 mt-1">{errors.zip_code}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Property Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Property Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Property Type</Label>
                    <Select value={property.property_type} onValueChange={handleSelectChange('property_type')}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="single_family">Single Family Home</SelectItem>
                        <SelectItem value="townhouse">Townhouse</SelectItem>
                        <SelectItem value="condo">Condominium</SelectItem>
                        <SelectItem value="multi_family">Multi-Family</SelectItem>
                        <SelectItem value="duplex">Duplex</SelectItem>
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
                        value={property.bedrooms}
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
                        value={property.bathrooms}
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
                        value={property.square_feet || ''}
                        onChange={handleInputChange('square_feet')}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Financial Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Financial Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Current Loan Balance</Label>
                      <CurrencyInput
                        value={property.current_loan_balance}
                        onChange={handleCurrencyChange('current_loan_balance')}
                        className={errors.current_loan_balance ? 'border-red-500' : ''}
                      />
                      {errors.current_loan_balance && (
                        <p className="text-sm text-red-500 mt-1">{errors.current_loan_balance}</p>
                      )}
                    </div>
                    <div>
                      <Label>Interest Rate</Label>
                      <PercentageInput
                        value={property.interest_rate}
                        onChange={handlePercentageChange('interest_rate')}
                        className={errors.interest_rate ? 'border-red-500' : ''}
                      />
                      {errors.interest_rate && (
                        <p className="text-sm text-red-500 mt-1">{errors.interest_rate}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Monthly Payment</Label>
                      <CurrencyInput
                        value={property.monthly_payment}
                        onChange={handleCurrencyChange('monthly_payment')}
                        className={errors.monthly_payment ? 'border-red-500' : ''}
                      />
                      {errors.monthly_payment && (
                        <p className="text-sm text-red-500 mt-1">{errors.monthly_payment}</p>
                      )}
                    </div>
                    <div>
                      <Label>Asking Price</Label>
                      <CurrencyInput
                        value={property.asking_price}
                        onChange={handleCurrencyChange('asking_price')}
                        className={errors.asking_price ? 'border-red-500' : ''}
                      />
                      {errors.asking_price && (
                        <p className="text-sm text-red-500 mt-1">{errors.asking_price}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Save Changes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Your changes will be saved and visible to all users immediately.
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-3">
                    <Button type="submit" className="w-full" disabled={saving}>
                      {saving ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save Changes
                        </>
                      )}
                    </Button>
                    
                    <Button type="button" variant="outline" className="w-full" asChild>
                      <Link href={`/property/${property.id}`}>
                        Cancel
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}