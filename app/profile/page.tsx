"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Save, AlertCircle } from 'lucide-react';
import { useAuthContext } from '@/components/auth-provider';
import { getSupabaseClient } from '@/lib/supabase-client';
import { toast } from 'sonner';
import { ProtectedRoute } from '@/components/protected-route';

const supabase = getSupabaseClient();

function ProfilePageContent() {
  const { profile, user } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    phone: profile?.phone || '',
    bio: profile?.bio || '',
    location: profile?.location || '',
    role: profile?.role || 'buyer'
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('You must be logged in to update your profile');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .update(formData)
        .eq('id', user.id);

      if (error) {
        toast.error('Failed to update profile: ' + error.message);
      } else {
        toast.success('Profile updated successfully!');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Profile Not Found</h2>
          <p className="text-gray-600">Unable to load your profile information.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Profile Settings
            </h1>
            <p className="text-gray-600">
              Manage your account information and preferences
            </p>
          </div>

          {/* Profile Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5" />
                Personal Information
              </CardTitle>
              <CardDescription>
                Update your personal details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="full_name">Full Name</Label>
                    <Input
                      id="full_name"
                      type="text"
                      value={formData.full_name}
                      onChange={(e) => handleInputChange('full_name', e.target.value)}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="City, State"
                  />
                </div>

                <div>
                  <Label htmlFor="role">Primary Interest</Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value) => handleInputChange('role', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your primary interest" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="buyer">Buying properties (Investor)</SelectItem>
                      <SelectItem value="seller">Selling my property</SelectItem>
                      <SelectItem value="both">Both buying and selling</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    placeholder="Tell us about yourself and your real estate interests..."
                    rows={4}
                  />
                </div>

                <div className="flex items-center justify-between pt-6 border-t">
                  <div className="flex items-center space-x-4">
                    <div>
                      <span className="text-sm font-medium text-gray-700">Email:</span>
                      <span className="text-sm text-gray-600 ml-2">{profile.email}</span>
                    </div>
                    <Badge variant={profile.verified ? "default" : "secondary"}>
                      {profile.verified ? "Verified" : "Unverified"}
                    </Badge>
                  </div>
                  <Button type="submit" disabled={loading}>
                    {loading ? (
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
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Account Information */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>
                View your account status and membership details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Member since:</span>
                  <span className="text-sm text-gray-600">
                    {new Date(profile.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Account status:</span>
                  <Badge variant="default">Active</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Profile completion:</span>
                  <span className="text-sm text-gray-600">
                    {Math.round(
                      (Object.values(formData).filter(v => v && v.trim()).length / 
                       Object.keys(formData).length) * 100
                    )}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfilePageContent />
    </ProtectedRoute>
  );
}