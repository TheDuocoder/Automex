import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import Header from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Mail, Phone, Shield, Calendar, CheckCircle, XCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Profile = () => {
  const navigate = useNavigate();
  const { user: contextUser, isAuthenticated } = useAuth();
  const { user, role, token } = useAuthStore();

  // Use Zustand user or context user (Zustand takes priority)
  const currentUser = user || contextUser;

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated && !user) {
      navigate('/');
    }
  }, [isAuthenticated, user, navigate]);

  if (!isAuthenticated && !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-primary/90 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">My Profile</h1>
          <p className="text-xl text-white/90">View and manage your account information</p>
        </div>
      </div>

      {/* Profile Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Profile Card */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-10 w-10 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">
                      {currentUser?.full_name || 'User'}
                    </CardTitle>
                    <CardDescription className="text-base mt-1">
                      {currentUser?.email}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-gray-900">Personal Information</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                        <User className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Full Name</p>
                        <p className="text-base font-medium text-gray-900">
                          {currentUser?.full_name || 'Not provided'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                        <Mail className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Email Address</p>
                        <p className="text-base font-medium text-gray-900">
                          {currentUser?.email}
                        </p>
                      </div>
                    </div>

                    {currentUser?.phone_number && (
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                          <Phone className="h-5 w-5 text-gray-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Phone Number</p>
                          <p className="text-base font-medium text-gray-900">
                            {currentUser.phone_number}
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                        <Shield className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">User ID</p>
                        <p className="text-base font-medium text-gray-900">
                          {currentUser?.id}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Account Status */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-gray-900">Account Status</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-gray-50">
                      {currentUser?.is_active ? (
                        <>
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <span className="text-sm font-medium text-gray-900">Active</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="h-5 w-5 text-red-600" />
                          <span className="text-sm font-medium text-gray-900">Inactive</span>
                        </>
                      )}
                    </div>

                    <div className="flex items-center gap-2 p-3 rounded-lg bg-gray-50">
                      {currentUser?.is_verified ? (
                        <>
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <span className="text-sm font-medium text-gray-900">Verified</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="h-5 w-5 text-yellow-600" />
                          <span className="text-sm font-medium text-gray-900">Not Verified</span>
                        </>
                      )}
                    </div>

                    {currentUser?.is_superuser && (
                      <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/10">
                        <Shield className="h-5 w-5 text-primary" />
                        <span className="text-sm font-medium text-primary">Admin</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-4 border-t">
                  <Button className="bg-primary hover:bg-primary/90">
                    Edit Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Role & Quick Info */}
          <div className="space-y-6">
            {/* Role Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Role Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                {role && (
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Role Name</p>
                      <p className="text-lg font-semibold text-gray-900">{role.name}</p>
                    </div>
                    {role.description && (
                      <div>
                        <p className="text-sm text-gray-500">Description</p>
                        <p className="text-base text-gray-700">{role.description}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-gray-500">Role ID</p>
                      <p className="text-base text-gray-700">{role.id}</p>
                    </div>
                  </div>
                )}
                {!role && currentUser?.role && (
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Role Name</p>
                      <p className="text-lg font-semibold text-gray-900">{currentUser.role.name}</p>
                    </div>
                    {currentUser.role.description && (
                      <div>
                        <p className="text-sm text-gray-500">Description</p>
                        <p className="text-base text-gray-700">{currentUser.role.description}</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate('/services')}
                >
                  View Services
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate('/profile/edit')}
                >
                  Edit Profile
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                >
                  Change Password
                </Button>
              </CardContent>
            </Card>

            {/* Token Info (for debugging) */}
            {token && (
              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle className="text-sm">Session Info</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-gray-500 break-all">
                    Token: {token.substring(0, 20)}...
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

