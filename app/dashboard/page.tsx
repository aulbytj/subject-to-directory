"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  Home, 
  MessageCircle, 
  Heart,
  Settings,
  Plus,
  Eye,
  DollarSign,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { useAuthContext } from '@/components/auth-provider';
import { properties } from '@/lib/properties';
import { favorites } from '@/lib/favorites';
import { messages } from '@/lib/messages';
import { Property, Favorite, Message } from '@/lib/supabase';
import { toast } from 'sonner';

export default function DashboardPage() {
  const { user, profile, loading: authLoading } = useAuthContext();
  const [userProperties, setUserProperties] = useState<Property[]>([]);
  const [userFavorites, setUserFavorites] = useState<Favorite[]>([]);
  const [receivedMessages, setReceivedMessages] = useState<Message[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      loadDashboardData();
    } else if (!authLoading && !user) {
      // If auth is done loading and there's no user, stop loading
      setLoading(false);
    }
  }, [user?.id, authLoading]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load user's properties
      const { data: propertiesData, error: propertiesError } = await properties.getUserProperties(user!.id);
      if (propertiesError) {
        toast.error('Failed to load your properties');
      } else {
        setUserProperties(propertiesData || []);
      }

      // Load user's favorites
      const { data: favoritesData, error: favoritesError } = await favorites.getUserFavorites();
      if (favoritesError) {
        toast.error('Failed to load favorites');
      } else {
        setUserFavorites(favoritesData || []);
      }

      // Load received messages
      const { data: messagesData, error: messagesError } = await messages.getReceivedMessages();
      if (messagesError) {
        toast.error('Failed to load messages');
      } else {
        setReceivedMessages(messagesData || []);
      }

      // Load unread count
      const { count, error: countError } = await messages.getUnreadCount();
      if (!countError && count !== null) {
        setUnreadCount(count);
      }

    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (messageId: string) => {
    try {
      await messages.markAsRead(messageId);
      await loadDashboardData(); // Refresh data
      toast.success('Message marked as read');
    } catch (error) {
      toast.error('Failed to mark message as read');
    }
  };

  const handleRemoveFavorite = async (propertyId: string) => {
    try {
      await favorites.removeFavorite(propertyId);
      await loadDashboardData(); // Refresh data
      toast.success('Removed from favorites');
    } catch (error) {
      toast.error('Failed to remove favorite');
    }
  };


  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold mb-2">Loading...</h2>
          <p className="text-gray-600">Please wait while we load your dashboard.</p>
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
          <p className="text-gray-600">Please log in to access your dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {profile.full_name?.split(' ').map((name: string) => name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()).join(' ')}!
              </h1>
              <p className="text-gray-600 mt-2">
                Manage your properties, favorites, and messages
              </p>
            </div>
            <div className="flex gap-3">
              <Button asChild>
                <Link href="/list-property">
                  <Plus className="mr-2 h-4 w-4" />
                  List Property
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/search">
                  <Eye className="mr-2 h-4 w-4" />
                  Browse Deals
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="flex items-center p-6">
              <Home className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <div className="text-2xl font-bold">{userProperties.length}</div>
                <div className="text-sm text-gray-600">My Listings</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center p-6">
              <Heart className="h-8 w-8 text-red-600 mr-3" />
              <div>
                <div className="text-2xl font-bold">{userFavorites.length}</div>
                <div className="text-sm text-gray-600">Favorites</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center p-6">
              <MessageCircle className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <div className="text-2xl font-bold">{unreadCount}</div>
                <div className="text-sm text-gray-600">Unread Messages</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center p-6">
              <TrendingUp className="h-8 w-8 text-purple-600 mr-3" />
              <div>
                <div className="text-2xl font-bold">
                  {userProperties.reduce((sum, prop) => sum + prop.view_count, 0)}
                </div>
                <div className="text-sm text-gray-600">Total Views</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="properties" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="properties">My Properties</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          {/* My Properties */}
          <TabsContent value="properties">
            <Card>
              <CardHeader>
                <CardTitle>My Property Listings</CardTitle>
                <CardDescription>
                  Manage your active and inactive property listings
                </CardDescription>
              </CardHeader>
              <CardContent>
                {userProperties.length === 0 ? (
                  <div className="text-center py-8">
                    <Home className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No properties listed yet</h3>
                    <p className="text-gray-600 mb-4">
                      Start by listing your first property to connect with potential buyers.
                    </p>
                    <Button asChild>
                      <Link href="/list-property">
                        <Plus className="mr-2 h-4 w-4" />
                        List Your First Property
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userProperties.map((property) => (
                      <div key={property.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-2">{property.title}</h3>
                            <p className="text-gray-600 mb-2">{property.address}, {property.city}, {property.state}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span>{property.bedrooms} bed • {property.bathrooms} bath</span>
                              <span>${property.asking_price.toLocaleString()}</span>
                              <Badge variant={property.status === 'active' ? 'default' : 'secondary'}>
                                {property.status}
                              </Badge>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-gray-600 mb-2">
                              <Eye className="h-4 w-4 inline mr-1" />
                              {property.view_count} views
                            </div>
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/listing/${property.id}`}>
                                View Listing
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Favorites */}
          <TabsContent value="favorites">
            <Card>
              <CardHeader>
                <CardTitle>Favorite Properties</CardTitle>
                <CardDescription>
                  Properties you've saved for later review
                </CardDescription>
              </CardHeader>
              <CardContent>
                {userFavorites.length === 0 ? (
                  <div className="text-center py-8">
                    <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No favorites yet</h3>
                    <p className="text-gray-600 mb-4">
                      Browse properties and save interesting ones to your favorites.
                    </p>
                    <Button asChild>
                      <Link href="/search">
                        <Eye className="mr-2 h-4 w-4" />
                        Browse Properties
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userFavorites.map((favorite) => {
                      const property = favorite.properties;
                      if (!property) return null;
                      
                      return (
                        <div key={favorite.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg mb-2">{property.title}</h3>
                              <p className="text-gray-600 mb-2">{property.address}, {property.city}, {property.state}</p>
                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                <span>{property.bedrooms} bed • {property.bathrooms} bath</span>
                                <span>${property.asking_price.toLocaleString()}</span>
                                <span>{property.interest_rate}% interest</span>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" asChild>
                                <Link href={`/listing/${property.id}`}>
                                  View Listing
                                </Link>
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleRemoveFavorite(property.id)}
                              >
                                Remove
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Messages */}
          <TabsContent value="messages">
            <Card>
              <CardHeader>
                <CardTitle>Messages</CardTitle>
                <CardDescription>
                  Communications from interested buyers and sellers
                </CardDescription>
              </CardHeader>
              <CardContent>
                {receivedMessages.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No messages yet</h3>
                    <p className="text-gray-600">
                      Messages from interested parties will appear here.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {receivedMessages.slice(0, 5).map((message) => (
                      <div 
                        key={message.id} 
                        className={`border rounded-lg p-4 hover:shadow-md transition-shadow ${
                          !message.read ? 'bg-blue-50 border-blue-200' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold">{message.sender?.full_name}</h3>
                              {!message.read && (
                                <Badge variant="default" className="text-xs">New</Badge>
                              )}
                            </div>
                            {message.subject && (
                              <p className="font-medium mb-1">{message.subject}</p>
                            )}
                            <p className="text-gray-600 mb-2 line-clamp-2">{message.content}</p>
                            <p className="text-sm text-gray-500">
                              About: {message.properties?.title}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            {!message.read && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleMarkAsRead(message.id)}
                              >
                                Mark Read
                              </Button>
                            )}
                            <Button variant="ghost" size="sm">
                              Reply
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                    {receivedMessages.length > 5 && (
                      <div className="text-center pt-4">
                        <Button variant="outline">
                          View All Messages
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Manage your account details and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Full Name</label>
                    <p className="mt-1 text-gray-900">{profile.full_name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Email</label>
                    <p className="mt-1 text-gray-900">{profile.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Role</label>
                    <Badge variant="outline" className="mt-1">
                      {profile.role}
                    </Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Verification Status</label>
                    <Badge variant={profile.verified ? "default" : "secondary"} className="mt-1">
                      {profile.verified ? "Verified" : "Unverified"}
                    </Badge>
                  </div>
                </div>
                <div className="pt-4">
                  <Button variant="outline">
                    <Settings className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}