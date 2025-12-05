import { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  User, Mail, Phone, Shield, CheckCircle, XCircle, Edit, Key, Package,
  Loader2, Eye, EyeOff, LayoutDashboard, Car, Award, History, Settings,
  LogOut, Bell, Calendar, Hash, Trophy, ChevronRight, Camera
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { updateUserProfile, uploadProfilePicture } from "@/services/authService";
import { toast } from "sonner";
import { usePasswordResetStore } from "@/stores/passwordResetStore";
import HelpDropdown from "@/components/HelpDropdown";
import MyCars from "@/components/dashboard/MyCars";
import ServiceHistory from "@/components/dashboard/ServiceHistory";
import SchedulePickUp from "@/components/dashboard/SchedulePickUp";

import { carService, Car as CarModel, serviceHistoryService, ServiceHistory as ServiceHistoryModel } from "@/services/api";
import Footer from "@/components/Footer";

const Profile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user: contextUser, isAuthenticated, logout, refreshUser, updateUser } = useAuth();
  
  // Get setUser function from AuthContext if available (for immediate updates)
  // We'll update both Zustand and trigger AuthContext update
  const { user } = useAuthStore();

  // State for active view
  const [activeView, setActiveView] = useState("dashboard");

  useEffect(() => {
    if (location.state && (location.state as any).view) {
      setActiveView((location.state as any).view);
    }
  }, [location]);

  // Dashboard Data State
  const [dashboardCars, setDashboardCars] = useState<CarModel[]>([]);
  const [dashboardHistory, setDashboardHistory] = useState<ServiceHistoryModel[]>([]);

  // State for Edit Profile Modal
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone_number: "",
  });

  // State for Change Password Modal
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordErrors, setPasswordErrors] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const { setResetToken, resetToken, clearResetToken } = usePasswordResetStore();

  // State for Profile Picture Upload
  const [isUploadingPicture, setIsUploadingPicture] = useState(false);
  const [profilePictureKey, setProfilePictureKey] = useState(0); // Force re-render key
  const [localProfilePictureUrl, setLocalProfilePictureUrl] = useState<string | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Use Zustand user or context user (Zustand takes priority)
  // Subscribe to Zustand store changes - this will re-render when store updates
  const currentUser = user || contextUser;
  
  // Sync local profile picture URL with user data
  useEffect(() => {
    if (currentUser?.profile_picture_url) {
      setLocalProfilePictureUrl(currentUser.profile_picture_url);
    }
  }, [currentUser?.profile_picture_url]);
  
  // Use local profile picture URL if available, otherwise use currentUser's
  const displayProfilePictureUrl = localProfilePictureUrl || currentUser?.profile_picture_url;

  // Watch for profile picture URL changes and update key to force image reload
  const prevProfileUrlRef = useRef<string | undefined>(currentUser?.profile_picture_url);
  useEffect(() => {
    if (currentUser?.profile_picture_url && currentUser.profile_picture_url !== prevProfileUrlRef.current) {
      prevProfileUrlRef.current = currentUser.profile_picture_url;
      setLocalProfilePictureUrl(currentUser.profile_picture_url);
      setProfilePictureKey(prev => prev + 1);
    }
  }, [currentUser?.profile_picture_url]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated && !user) {
      navigate('/');
    }
  }, [isAuthenticated, user, navigate]);

  // Fetch Dashboard Data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch Cars
        const carsResponse = await carService.getAll();
        if (carsResponse.error) {
          console.error("Error fetching cars:", carsResponse.error);
          // Don't show error toast for empty data, only for actual errors
          if (carsResponse.status !== 404 && carsResponse.status !== 200) {
            toast.error(carsResponse.error || "Failed to fetch vehicles");
          }
          return;
        }
        
        if (carsResponse.data) {
          setDashboardCars(carsResponse.data);

          // Fetch Service History for all cars
          // For dashboard, we'll just fetch history for the first car for now, 
          // or we could fetch for all and aggregate. Let's fetch for the first car if available.
          if (carsResponse.data.length > 0) {
            try {
              const firstCarId = carsResponse.data[0].id;
              const historyResponse = await serviceHistoryService.getAll(firstCarId);
              if (historyResponse.error) {
                console.error("Error fetching service history:", historyResponse.error);
                // Don't show error for empty history, it's normal
                if (historyResponse.status !== 404) {
                  console.warn("Service history fetch failed:", historyResponse.error);
                }
              } else if (historyResponse.data) {
                setDashboardHistory(historyResponse.data);
              }
            } catch (historyError) {
              console.error("Error fetching service history:", historyError);
              // Don't show error toast for service history, it's optional
            }
          }
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        // Only show error if it's a network error or critical error
        if (error instanceof TypeError && error.message.includes('fetch')) {
          toast.error("Network error: Please check your connection");
        } else if (error instanceof Error && !error.message.includes('404')) {
          toast.error(error.message || "Failed to fetch dashboard data");
        }
      }
    };

    if (currentUser) {
      fetchDashboardData();
    }
  }, [currentUser]);

  // Initialize form data when modal opens
  useEffect(() => {
    if (isEditOpen && currentUser) {
      setFormData({
        full_name: currentUser.full_name || "",
        email: currentUser.email || "",
        phone_number: currentUser.phone_number || "",
      });
    }
  }, [isEditOpen, currentUser]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await updateUserProfile(formData);
      toast.success("Profile updated successfully");
      setIsEditOpen(false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to update profile";
      const errorLower = errorMessage.toLowerCase();

      // Check if it's a duplicate phone number error
      if (errorLower.includes("phone") && (errorLower.includes("already exists") || errorLower.includes("already registered"))) {
        toast.error("An account with this phone number already exists. Please use a different phone number.");
      } else {
        toast.error(errorMessage);
      }
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Change Password - Step 1: Generate reset token
  const handleRequestPasswordReset = async () => {
    if (!currentUser?.email) {
      toast.error("Email not found. Please contact support.");
      return;
    }

    setIsPasswordLoading(true);
    try {
      const response = await fetch("/api/v1/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: currentUser.email }),
      });

      if (response.ok || response.status === 202) {
        let responseData: any = null;
        try {
          responseData = await response.json();
        } catch {
          // Response might be empty
        }

        // If token is returned (development mode), store it
        if (responseData?.token) {
          setResetToken(responseData.token, currentUser.email);
          toast.success("Reset token generated successfully");
        } else {
          toast.success("Reset token has been sent to your email");
        }
      } else {
        const errorData = await response.json().catch(() => ({ detail: "Failed to generate reset token" }));
        throw new Error(errorData.detail || errorData.message || "Failed to generate reset token");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to generate reset token");
      console.error(error);
    } finally {
      setIsPasswordLoading(false);
    }
  };

  // Handle Change Password - Step 2: Reset password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate passwords
    const errors = {
      newPassword: "",
      confirmPassword: "",
    };

    if (!passwordData.newPassword) {
      errors.newPassword = "New password is required";
    } else if (passwordData.newPassword.length < 8) {
      errors.newPassword = "Password must be at least 8 characters";
    }

    if (!passwordData.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setPasswordErrors(errors);

    if (errors.newPassword || errors.confirmPassword) {
      return;
    }

    // Check if we have a reset token
    if (!resetToken) {
      toast.error("Reset token is missing. Please close and try again.");
      return;
    }

    handlePasswordReset();
  };

  const handlePasswordReset = async () => {
    if (!resetToken) {
      toast.error("Reset token is missing. Please try again.");
      return;
    }

    setIsPasswordLoading(true);
    try {
      const response = await fetch("/api/v1/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: resetToken,
          password: passwordData.newPassword,
        }),
      });

      if (response.ok || response.status === 200 || response.status === 204) {
        toast.success("Password changed successfully! You will be logged out and redirected to login.");
        setIsChangePasswordOpen(false);
        setPasswordData({ newPassword: "", confirmPassword: "" });
        clearResetToken();

        // Logout user and redirect to landing page (login)
        // Use logout from AuthContext to ensure all state is cleared
        await logout();
        setTimeout(() => {
          navigate('/');
        }, 1500); // Small delay to show success message
      } else {
        const errorData = await response.json().catch(() => ({ detail: "Failed to reset password" }));
        throw new Error(errorData.detail || errorData.message || "Failed to reset password");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to reset password");
      console.error(error);
    } finally {
      setIsPasswordLoading(false);
    }
  };

  // Initialize password reset when modal opens
  useEffect(() => {
    if (isChangePasswordOpen && currentUser?.email) {
      // Clear previous state
      setPasswordData({ newPassword: "", confirmPassword: "" });
      setPasswordErrors({ newPassword: "", confirmPassword: "" });
      clearResetToken();

      // Generate reset token automatically when modal opens
      const requestToken = async () => {
        setIsPasswordLoading(true);
        try {
          const response = await fetch("/api/v1/auth/forgot-password", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: currentUser.email }),
          });

          if (response.ok || response.status === 202) {
            let responseData: any = null;
            try {
              responseData = await response.json();
            } catch {
              // Response might be empty
            }

            // If token is returned (development mode), store it
            if (responseData?.token) {
              setResetToken(responseData.token, currentUser.email);
              toast.success("Reset token generated successfully");
            } else {
              toast.success("Reset token has been sent to your email");
            }
          } else {
            const errorData = await response.json().catch(() => ({ detail: "Failed to generate reset token" }));
            toast.error(errorData.detail || errorData.message || "Failed to generate reset token");
          }
        } catch (error) {
          toast.error(error instanceof Error ? error.message : "Failed to generate reset token");
          console.error(error);
        } finally {
          setIsPasswordLoading(false);
        }
      };

      requestToken();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isChangePasswordOpen]);

  if (!isAuthenticated && !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Left Sidebar */}
      <motion.aside
        initial={{ x: -300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-64 min-h-screen fixed left-0 top-0 shadow-2xl z-50"
        style={{
          background: 'linear-gradient(180deg, #06080D, #0B0F1A)',
          boxShadow: '0 0 50px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
        }}
      >
        {/* Logo */}
        <div className="px-6 py-5 border-b border-white/10 flex items-center justify-center">
          <button
            onClick={() => navigate('/')}
            className="focus:outline-none focus:ring-2 focus:ring-white/20 rounded-lg"
          >
            <img
              src="/images/Automex_icon/AUTOMEX_logo.png"
              alt="Automex"
              className="h-36 w-auto transform hover:scale-105 transition-transform duration-300 cursor-pointer"
            />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-3">
          <button
            onClick={() => setActiveView('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${activeView === 'dashboard'
              ? 'text-white shadow-lg'
              : 'text-white hover:bg-white/5'
              }`}
            style={activeView === 'dashboard' ? { backgroundColor: '#191970' } : {}}
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </button>

          <button
            onClick={() => setActiveView('profile')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${activeView === 'profile'
              ? 'text-white shadow-lg'
              : 'text-white hover:bg-white/5'
              }`}
            style={activeView === 'profile' ? { backgroundColor: '#191970' } : {}}
          >
            <User className="h-4 w-4" />
            Profile
          </button>

          <button
            onClick={() => setActiveView('my-cars')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${activeView === 'my-cars'
              ? 'text-white shadow-lg'
              : 'text-white hover:bg-white/5'
              }`}
            style={activeView === 'my-cars' ? { backgroundColor: '#191970' } : {}}
          >
            <Car className="h-4 w-4" />
            My Cars
          </button>

          <button
            onClick={() => setActiveView('service-history')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${activeView === 'service-history'
              ? 'text-white shadow-lg'
              : 'text-white hover:bg-white/5'
              }`}
            style={activeView === 'service-history' ? { backgroundColor: '#191970' } : {}}
          >
            <History className="h-4 w-4" />
            Service History
          </button>

          <button
            onClick={() => setActiveView('schedule-pickup')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${activeView === 'schedule-pickup'
              ? 'text-white shadow-lg'
              : 'text-white hover:bg-white/5'
              }`}
            style={activeView === 'schedule-pickup' ? { backgroundColor: '#191970' } : {}}
          >
            <Calendar className="h-4 w-4" />
            Schedule Pick Up
          </button>
        </nav>

        {/* Logout Button at Bottom */}
        <div className="absolute bottom-8 left-4 right-4">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg bg-red-500/10 text-white hover:bg-red-500/20 text-sm font-medium transition-all border border-red-500/20"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 ml-64 flex flex-col">
        {/* Profile Header with Gradient */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="px-6 py-5 relative overflow-hidden"
          style={{ 
            background: '#191970',
            boxShadow: 'inset 0 0 60px rgba(0, 0, 0, 0.1), 0 4px 20px rgba(0, 0, 0, 0.3)'
          }}
        >
          {/* Help Dropdown - Top Right */}
          <div className="absolute top-4 right-6">
            <HelpDropdown variant="dark" />
          </div>

          <div className="flex items-center gap-4 mb-4">
            <div className="relative group">
              {displayProfilePictureUrl ? (
                <img
                  key={`profile-img-${profilePictureKey}`}
                  src={`${displayProfilePictureUrl}?v=${profilePictureKey}`}
                  alt={currentUser?.full_name || 'User'}
                  className="h-20 w-20 rounded-full object-cover border-3 border-white/30 shadow-xl transition-all group-hover:border-white/50"
                  onError={(e) => {
                    // Fallback to initial if image fails to load
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              ) : (
                <div className="h-20 w-20 rounded-full bg-white/20 backdrop-blur-md border-3 border-white/30 flex items-center justify-center text-white font-bold text-xl shadow-xl transition-all group-hover:border-white/50">
                  {currentUser?.full_name?.charAt(0).toUpperCase() || 'U'}
                </div>
              )}
              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  // Validate file type
                  if (!file.type.startsWith('image/')) {
                    toast.error('Please select an image file');
                    return;
                  }

                  // Validate file size (5MB)
                  if (file.size > 5 * 1024 * 1024) {
                    toast.error('Image size must be less than 5MB');
                    return;
                  }

                  setIsUploadingPicture(true);
                  try {
                    const updatedUser = await uploadProfilePicture(file);
                    
                    // IMMEDIATELY update local state to show picture right away in Profile component
                    if (updatedUser.profile_picture_url) {
                      setLocalProfilePictureUrl(updatedUser.profile_picture_url);
                      setProfilePictureKey(prev => prev + 1);
                    }
                    
                    // IMMEDIATELY update AuthContext (for Header, Hero components)
                    // This updates all components that use useAuth() hook
                    updateUser(updatedUser);
                    
                    // Zustand store is already updated in uploadProfilePicture function
                    // But ensure it's synced (redundant but safe)
                    const store = useAuthStore.getState();
                    if (store.user?.id !== updatedUser.id) {
                      store.setUser(updatedUser);
                    }
                    
                    toast.success('Profile picture uploaded successfully!');
                  } catch (error) {
                    console.error('Error uploading profile picture:', error);
                    let errorMessage = 'Failed to upload profile picture';
                    
                    if (error instanceof TypeError && error.message.includes('fetch')) {
                      errorMessage = 'Network error: Please check your connection and try again';
                    } else if (error instanceof Error) {
                      errorMessage = error.message || errorMessage;
                    }
                    
                    toast.error(errorMessage);
                  } finally {
                    setIsUploadingPicture(false);
                    // Reset file input
                    if (fileInputRef.current) {
                      fileInputRef.current.value = '';
                    }
                  }
                }}
              />
              {/* Edit Icon Badge */}
              <button
                className="absolute bottom-0 right-0 h-6 w-6 rounded-full bg-white shadow-md flex items-center justify-center text-primary hover:bg-gray-50 transition-all hover:scale-110 border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingPicture}
                title="Upload profile picture"
              >
                {isUploadingPicture ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Camera className="h-3 w-3" />
                )}
              </button>
            </div>

            <div className="text-white">
              <h2 className="text-xl font-bold mb-0.5">
                {currentUser?.full_name 
                  ? currentUser.full_name.split(' ').map(word => 
                      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                    ).join(' ')
                  : 'User'}
              </h2>
              <p className="text-white/90 flex items-center gap-1.5 mb-0.5 text-xs">
                <Mail className="h-3 w-3" />
                {currentUser?.email}
              </p>
              <p className="text-white/90 flex items-center gap-1.5 mb-1.5 text-xs">
                <Phone className="h-3 w-3" />
                {currentUser?.phone_number || 'No phone number'}
              </p>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-500/30 border border-green-400/30 text-white backdrop-blur-md">
                  Active Account
                </span>
                <span className="text-xs text-white/80">Member Since: 2021</span>
              </div>
            </div>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-2.5 border border-white/20 hover:bg-white/15 transition-all shadow-lg">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-white/20 flex items-center justify-center">
                  <Calendar className="h-3.5 w-3.5 text-white" />
                </div>
                <div>
                  <p className="text-white/70 text-xs">Next Service Date</p>
                  <p className="text-white font-bold text-xs">Dec 15, 2025</p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-2.5 border border-white/20 hover:bg-white/15 transition-all shadow-lg">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-white/20 flex items-center justify-center">
                  <Hash className="h-3.5 w-3.5 text-white" />
                </div>
                <div>
                  <p className="text-white/70 text-xs">
                    {dashboardCars.length > 1 ? 'Total Vehicles' : 'Vehicle Number'}
                  </p>
                  <p className="text-white font-bold text-xs">
                    {dashboardCars.length === 0 ? 'No Vehicle' :
                      dashboardCars.length === 1 ? dashboardCars[0].registration_number :
                        `${dashboardCars.length} Vehicles`}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-2.5 border border-white/20 hover:bg-white/15 transition-all shadow-lg">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-white/20 flex items-center justify-center">
                  <Trophy className="h-3.5 w-3.5 text-white" />
                </div>
                <div>
                  <p className="text-white/70 text-xs">Rewards Points</p>
                  <p className="text-white font-bold text-xs">2,450 pts</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Dynamic Content Area */}
        <div className="px-6 py-4">
          {activeView === 'dashboard' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Dashboard View - Summary */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card className="shadow-lg border-none h-full">
                  <CardHeader className="border-b bg-gray-50/50 pb-2 pt-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <History className="h-4 w-4 text-primary" />
                      Service History
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 space-y-2.5">
                    {dashboardHistory.length > 0 ? (
                      <div className="space-y-2.5">
                        {dashboardHistory.slice(0, 3).map((history) => (
                          <div key={history.id} className="flex items-center justify-between border-b pb-1.5 last:border-0">
                            <div>
                              <p className="font-medium text-xs">{history.service_name}</p>
                              <p className="text-xs text-gray-500">{new Date(history.service_date).toLocaleDateString()}</p>
                            </div>
                            <span className={`px-1.5 py-0.5 rounded-full text-xs font-medium ${history.status === 'Completed' ? 'bg-green-100 text-green-700' :
                              history.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                                'bg-gray-100 text-gray-700'
                              }`}>
                              {history.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-xs">No recent activity found.</p>
                    )}
                    <Button variant="outline" onClick={() => setActiveView('service-history')} className="w-full mt-2 text-xs h-8">
                      View Full History
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Card className="shadow-lg border-none h-full">
                  <CardHeader className="border-b bg-gray-50/50 pb-2 pt-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Car className="h-4 w-4 text-primary" />
                      My Vehicles
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 space-y-2.5">
                    {dashboardCars.length > 0 ? (
                      <div className="space-y-2">
                        {dashboardCars.slice(0, 3).map((car) => (
                          <div key={car.id} className="flex items-center gap-2.5 p-2 bg-gray-50 rounded-lg">
                            <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center shadow-sm">
                              <Car className="h-3.5 w-3.5 text-gray-500" />
                            </div>
                            <div>
                              <p className="font-medium text-xs">{car.make} {car.model}</p>
                              <p className="text-xs text-gray-500">{car.registration_number}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-xs">No vehicles added yet.</p>
                    )}
                    <Button variant="outline" onClick={() => setActiveView('my-cars')} className="w-full text-xs h-8 mt-2">
                      Manage Vehicles
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          )}

          {activeView === 'profile' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="shadow-lg border-none max-w-2xl mx-auto">
                <CardHeader className="border-b bg-gray-50/50 pb-4">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <User className="h-5 w-5 text-primary" />
                    Profile Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label className="text-gray-500">Full Name</Label>
                      <p className="text-lg font-medium">{currentUser?.full_name}</p>
                    </div>
                    <div>
                      <Label className="text-gray-500">Email</Label>
                      <p className="text-lg font-medium">{currentUser?.email}</p>
                    </div>
                    <div>
                      <Label className="text-gray-500">Phone Number</Label>
                      <p className="text-lg font-medium">{currentUser?.phone_number || 'Not set'}</p>
                    </div>
                  </div>
                  <div className="pt-6 flex gap-4">
                    <Button onClick={() => setIsEditOpen(true)}>
                      <Edit className="mr-2 h-4 w-4" /> Edit Profile
                    </Button>
                    <Button variant="outline" onClick={() => setIsChangePasswordOpen(true)}>
                      <Key className="mr-2 h-4 w-4" /> Change Password
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {activeView === 'my-cars' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <MyCars />
            </motion.div>
          )}

          {activeView === 'service-history' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <ServiceHistory />
            </motion.div>
          )}

          {activeView === 'schedule-pickup' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <SchedulePickUp />
            </motion.div>
          )}
        </div>
        
        {/* Footer */}
        <Footer compact={true} />
      </div>

      {/* Edit Profile Modal */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateProfile}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">
                  Phone
                </Label>
                <Input
                  id="phone"
                  value={formData.phone_number}
                  onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Change Password Modal */}
      <Dialog open={isChangePasswordOpen} onOpenChange={setIsChangePasswordOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>
              Enter your new password. A reset token has been generated for {currentUser?.email}.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleChangePassword}>
            <div className="grid gap-4 py-4">
              {/* Info Message */}
              {resetToken ? (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-xs text-green-700">
                    ✓ Reset token generated successfully. You can now set your new password.
                  </p>
                </div>
              ) : (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-xs text-yellow-700">
                    Generating reset token... Please wait.
                  </p>
                </div>
              )}

              {/* New Password Input */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="newPassword" className="text-right">
                  New Password
                </Label>
                <div className="col-span-3 relative">
                  <Input
                    id="newPassword"
                    type={showPassword ? "text" : "password"}
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className={passwordErrors.newPassword ? "border-red-500" : ""}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {passwordErrors.newPassword && (
                  <p className="col-span-4 text-right text-xs text-red-500 mt-1">{passwordErrors.newPassword}</p>
                )}
              </div>

              {/* Confirm Password Input */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="confirmPassword" className="text-right">
                  Confirm Password
                </Label>
                <div className="col-span-3 relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className={passwordErrors.confirmPassword ? "border-red-500" : ""}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {passwordErrors.confirmPassword && (
                  <p className="col-span-4 text-right text-xs text-red-500 mt-1">{passwordErrors.confirmPassword}</p>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsChangePasswordOpen(false);
                  setPasswordData({ newPassword: "", confirmPassword: "" });
                  clearResetToken();
                }}
                disabled={isPasswordLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={!resetToken || isPasswordLoading}>
                {isPasswordLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Change Password
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Profile;
