"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  MapPin, 
  Home, 
  DollarSign,
  Percent,
  Calendar,
  User,
  Phone,
  Mail,
  MessageSquare,
  Heart,
  Share2,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Bed,
  Bath,
  Square,
  TrendingUp,
  Shield,
  Building,
  CreditCard,
  Clock
} from 'lucide-react';
import Link from 'next/link';
import { properties } from '@/lib/properties';
import { favorites } from '@/lib/favorites';
import { Property } from '@/lib/supabase';
import { useAuthContext } from '@/components/auth-provider';
import { toast } from 'sonner';

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuthContext();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorited, setIsFavorited] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const propertyId = params.id as string;

  useEffect(() => {
    if (propertyId) {
      loadProperty();
      checkFavoriteStatus();
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

      setProperty(data);
      
      // Increment view count
      await properties.incrementViewCount(propertyId);
    } catch (error) {
      console.error('Error loading property:', error);
      toast.error('Failed to load property details');
    } finally {
      setLoading(false);
    }
  };

  const checkFavoriteStatus = async () => {
    if (!user) return;
    
    try {
      const { isFavorite } = await favorites.isFavorite(propertyId);
      setIsFavorited(isFavorite);
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
  };

  const toggleFavorite = async () => {
    if (!user) {
      toast.error('Please login to save favorites');
      return;
    }

    try {
      setFavoriteLoading(true);
      
      if (isFavorited) {
        await favorites.removeFavorite(propertyId);
        setIsFavorited(false);
        toast.success('Removed from favorites');
      } else {
        await favorites.addFavorite(propertyId);
        setIsFavorited(true);
        toast.success('Added to favorites');
      }
    } catch (error) {
      toast.error('Failed to update favorites');
    } finally {
      setFavoriteLoading(false);
    }
  };

  const formatPropertyType = (type: string) => {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const hasPropertyImages = () => {
    return property?.property_images && property.property_images.length > 0;
  };

  const getPropertyImages = () => {
    if (!hasPropertyImages()) return [];
    return property!.property_images!.sort((a, b) => {
      if (a.is_primary) return -1;
      if (b.is_primary) return 1;
      return (a.order_index || 0) - (b.order_index || 0);
    });
  };

  const getDaysListed = (createdAt: string) => {
    const created = new Date(createdAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - created.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const calculateEquity = () => {
    if (!property) return 0;
    return property.property_value - property.current_loan_balance;
  };

  const calculateCashFlow = () => {
    if (!property) return 0;
    const totalExpenses = property.monthly_payment + 
                         (property.property_taxes || 0) + 
                         (property.insurance || 0) + 
                         (property.hoa_fees || 0);
    return (property.monthly_rent || 0) - totalExpenses;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-32 mb-4" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Skeleton className="aspect-video w-full mb-4" />
              <Skeleton className="h-8 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-4" />
              <Skeleton className="h-32 w-full" />
            </div>
            <div>
              <Skeleton className="h-64 w-full" />
            </div>
          </div>
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
            The property you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => router.push('/search')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Search
          </Button>
        </div>
      </div>
    );
  }

  const propertyImages = getPropertyImages();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <Button variant="ghost" onClick={() => router.back()} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <Card className="mb-6 overflow-hidden">
              <div className="aspect-video bg-gray-200 relative">
                {hasPropertyImages() ? (
                  <>
                    <img 
                      src={propertyImages[currentImageIndex]?.image_url} 
                      alt={`${property.address}, ${property.city}, ${property.state}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    {propertyImages.length > 1 && (
                      <>
                        <Button
                          variant="secondary"
                          size="sm"
                          className="absolute left-4 top-1/2 transform -translate-y-1/2"
                          onClick={() => setCurrentImageIndex(prev => 
                            prev === 0 ? propertyImages.length - 1 : prev - 1
                          )}
                        >
                          ←
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          className="absolute right-4 top-1/2 transform -translate-y-1/2"
                          onClick={() => setCurrentImageIndex(prev => 
                            prev === propertyImages.length - 1 ? 0 : prev + 1
                          )}
                        >
                          →
                        </Button>
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                          {propertyImages.map((_, index) => (
                            <button
                              key={index}
                              className={`w-2 h-2 rounded-full ${
                                index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                              }`}
                              onClick={() => setCurrentImageIndex(index)}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-300 flex items-center justify-center">
                    <div className="text-center">
                      <Home className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 text-lg font-medium">
                        {formatPropertyType(property.property_type)}
                      </p>
                      <p className="text-gray-400 text-sm mt-2">
                        No images available
                      </p>
                    </div>
                  </div>
                )}
                
                <div className="absolute top-4 left-4 flex gap-2">
                  <Badge className="bg-green-500 hover:bg-green-600">
                    {property.interest_rate}% Rate
                  </Badge>
                  {property.profiles?.verified && (
                    <Badge className="bg-blue-500 hover:bg-blue-600">
                      <CheckCircle className="mr-1 h-3 w-3" />
                      Verified
                    </Badge>
                  )}
                </div>

                <div className="absolute top-4 right-4 flex gap-2">
                  <Button 
                    size="sm" 
                    variant="secondary"
                    onClick={toggleFavorite}
                    disabled={favoriteLoading}
                  >
                    <Heart className={`h-4 w-4 ${isFavorited ? 'fill-red-500 text-red-500' : ''}`} />
                  </Button>
                  <Button size="sm" variant="secondary">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>

            {/* Property Details */}
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl mb-2">{property.title}</CardTitle>
                    <div className="flex items-center text-gray-600 mb-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      {property.address}, {property.city}, {property.state} {property.zip_code}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center">
                        <Bed className="h-4 w-4 mr-1" />
                        {property.bedrooms} bed
                      </span>
                      <span className="flex items-center">
                        <Bath className="h-4 w-4 mr-1" />
                        {property.bathrooms} bath
                      </span>
                      {property.square_feet && (
                        <span className="flex items-center">
                          <Square className="h-4 w-4 mr-1" />
                          {property.square_feet.toLocaleString()} sqft
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-green-600">
                      ${property.asking_price.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">
                      Listed {getDaysListed(property.created_at)} days ago
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Description</h3>
                    <p className="text-gray-700 leading-relaxed">{property.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold mb-3 flex items-center">
                        <Building className="mr-2 h-4 w-4" />
                        Property Details
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Property Type:</span>
                          <span className="font-medium">{formatPropertyType(property.property_type)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Property Value:</span>
                          <span className="font-medium">${property.property_value.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Equity Available:</span>
                          <span className="font-medium text-green-600">
                            ${calculateEquity().toLocaleString()}
                          </span>
                        </div>
                        {property.monthly_rent && (
                          <div className="flex justify-between">
                            <span>Potential Rent:</span>
                            <span className="font-medium">${property.monthly_rent.toLocaleString()}/month</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-3 flex items-center">
                        <CreditCard className="mr-2 h-4 w-4" />
                        Financial Details
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Current Loan Balance:</span>
                          <span className="font-medium">${property.current_loan_balance.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Interest Rate:</span>
                          <span className="font-medium">{property.interest_rate}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Monthly Payment:</span>
                          <span className="font-medium">${property.monthly_payment.toLocaleString()}</span>
                        </div>
                        {property.monthly_rent && (
                          <div className="flex justify-between">
                            <span>Cash Flow Potential:</span>
                            <span className={`font-medium ${calculateCashFlow() >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              ${calculateCashFlow().toLocaleString()}/month
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3 flex items-center">
                      <Shield className="mr-2 h-4 w-4" />
                      Loan Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Lender:</span>
                        <p className="font-medium">{property.lender}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Loan Type:</span>
                        <p className="font-medium">{property.loan_type}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Years Remaining:</span>
                        <p className="font-medium">{property.years_remaining} years</p>
                      </div>
                    </div>
                    
                    {property.due_on_sale_clause && (
                      <Alert className="mt-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          <strong>Note:</strong> This loan has a due-on-sale clause. Consult with legal counsel before proceeding.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Contact Card */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  Contact Seller
                </CardTitle>
                <CardDescription>
                  Get in touch with the property owner
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">{property.profiles?.full_name || 'Property Owner'}</p>
                    {property.profiles?.verified && (
                      <div className="flex items-center text-sm text-green-600">
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Verified Seller
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  {property.profiles?.phone && (
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <a href={`tel:${property.profiles.phone}`}>
                        <Phone className="mr-2 h-4 w-4" />
                        {property.profiles.phone}
                      </a>
                    </Button>
                  )}
                  
                  {property.profiles?.email && (
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <a href={`mailto:${property.profiles.email}`}>
                        <Mail className="mr-2 h-4 w-4" />
                        Email Seller
                      </a>
                    </Button>
                  )}

                  <Button className="w-full">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Send Message
                  </Button>
                </div>

                {property.profiles?.bio && (
                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-2">About the Seller</h4>
                    <p className="text-sm text-gray-600">{property.profiles.bio}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Loan-to-Value</span>
                  <span className="font-medium">
                    {Math.round((property.current_loan_balance / property.property_value) * 100)}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Views</span>
                  <span className="font-medium">{property.view_count || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Listed</span>
                  <span className="font-medium">{getDaysListed(property.created_at)} days ago</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Property ID</span>
                  <span className="font-medium text-xs">{property.id.slice(-8)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}