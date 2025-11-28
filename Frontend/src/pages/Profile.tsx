import { useEffect, useState } from "react";
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
import { updateUserProfile } from "@/services/authService";
import { toast } from "sonner";
import { usePasswordResetStore } from "@/stores/passwordResetStore";
import HelpDropdown from "@/components/HelpDropdown";

const Profile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user: contextUser, isAuthenticated, logout } = useAuth();
  const { user, role, token } = useAuthStore();

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

  // Use Zustand user or context user (Zustand takes priority)
  const currentUser = user || contextUser;

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated && !user) {
      navigate('/');
    }
  }, [isAuthenticated, user, navigate]);

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Sidebar */}
      <motion.aside 
        initial={{ x: -300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-64 min-h-screen fixed left-0 top-0 shadow-2xl z-50"
        style={{
          background: 'linear-gradient(180deg, #1a1f2e 0%, #141923 100%)',
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
              className="h-20 w-auto transform hover:scale-105 transition-transform duration-300 cursor-pointer"
            />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-3">
          <button 
            onClick={() => navigate('/profile')}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg bg-primary/90 text-white text-sm font-medium transition-all hover:bg-primary shadow-lg shadow-primary/20"
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </button>
          
          <button 
            onClick={() => navigate('/profile')}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-400 hover:bg-white/5 hover:text-white text-sm font-medium transition-all"
          >
            <User className="h-4 w-4" />
            Profile
          </button>
          
          <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-400 hover:bg-white/5 hover:text-white text-sm font-medium transition-all">
            <Car className="h-4 w-4" />
            My Cars
          </button>
          
          <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-400 hover:bg-white/5 hover:text-white text-sm font-medium transition-all">
            <Award className="h-4 w-4" />
            Rewards
          </button>
          
          <button 
            onClick={() => navigate('/my-services')}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-400 hover:bg-white/5 hover:text-white text-sm font-medium transition-all"
          >
            <History className="h-4 w-4" />
            Service History
          </button>
          
          <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-400 hover:bg-white/5 hover:text-white text-sm font-medium transition-all">
            <Settings className="h-4 w-4" />
            Settings
          </button>
        </nav>

        {/* Logout Button at Bottom */}
        <div className="absolute bottom-8 left-4 right-4">
          <button 
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 text-sm font-medium transition-all border border-red-500/20"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 ml-64">
        {/* Profile Header with Gradient */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-r from-red-600 via-red-500 to-red-600 px-8 py-5 relative"
        >
          {/* Help Dropdown - Top Right */}
          <div className="absolute top-5 right-8">
            <HelpDropdown variant="dark" />
          </div>

          <div className="flex items-center gap-5 mb-4">
            <div className="relative group">
              <div className="h-28 w-28 rounded-full bg-white/20 backdrop-blur-md border-4 border-white/30 flex items-center justify-center text-white font-bold text-3xl shadow-2xl transition-all group-hover:border-white/50">
                {currentUser?.full_name?.charAt(0) || 'U'}
              </div>
              {/* Edit Icon Badge */}
              <button 
                className="absolute bottom-2 right-2 h-8 w-8 rounded-full bg-white shadow-md flex items-center justify-center text-primary hover:bg-gray-50 transition-all hover:scale-110 border border-gray-200"
                onClick={() => toast.info('Profile picture upload coming soon!')}
              >
                <Camera className="h-4 w-4" />
              </button>
            </div>
            
            <div className="text-white">
              <h2 className="text-3xl font-bold mb-1">{currentUser?.full_name || 'User'}</h2>
              <p className="text-white/90 flex items-center gap-2 mb-2">
                <Mail className="h-4 w-4" />
                {currentUser?.email}
              </p>
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/30 border border-green-400/30 text-white backdrop-blur-md">
                  Active Account
                </span>
                <span className="text-sm text-white/80">Member Since: 2021</span>
              </div>
            </div>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/20 hover:bg-white/15 transition-all shadow-lg">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-lg bg-white/20 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-white/70 text-xs">Next Service Date</p>
                  <p className="text-white font-bold text-base">Dec 15, 2025</p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/20 hover:bg-white/15 transition-all shadow-lg">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-lg bg-white/20 flex items-center justify-center">
                  <Hash className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-white/70 text-xs">Vehicle Number</p>
                  <p className="text-white font-bold text-base">XYZ 789</p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/20 hover:bg-white/15 transition-all shadow-lg">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-lg bg-white/20 flex items-center justify-center">
                  <Trophy className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-white/70 text-xs">Rewards Points</p>
                  <p className="text-white font-bold text-base">2,450 pts</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Left Column - Service History */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="shadow-lg border-none">
                <CardHeader className="border-b bg-gray-50/50 pb-4">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <History className="h-5 w-5 text-primary" />
                    Service History
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-4">
                  {/* Service Card 1 */}
                  <div className="bg-white border border-gray-100 rounded-xl p-5 hover:shadow-md transition-all group">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-lg mb-1">Oil Change & Tire Rotation</h3>
                        <p className="text-sm text-gray-500">2024</p>
                      </div>
                      <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">Regular maintenance service including oil change and tire rotation for optimal performance.</p>
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <span className="text-xs font-medium text-green-600">Completed</span>
                      <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-primary transition-colors" />
                    </div>
                  </div>

                  {/* Service Card 2 */}
                  <div className="bg-white border border-gray-100 rounded-xl p-5 hover:shadow-md transition-all group">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-lg mb-1">Brake Pad Replacement</h3>
                        <p className="text-sm text-gray-500">2024</p>
                      </div>
                      <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">Complete brake pad replacement service ensuring safety and optimal braking performance.</p>
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <span className="text-xs font-medium text-green-600">Completed</span>
                      <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-primary transition-colors" />
                    </div>
                  </div>

                  {/* Service Card 3 */}
                  <div className="bg-white border border-gray-100 rounded-xl p-5 hover:shadow-md transition-all group">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-lg mb-1">General Service</h3>
                        <p className="text-sm text-gray-500">2023</p>
                      </div>
                      <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">Comprehensive general service including fluid checks, filter replacement, and system diagnostics.</p>
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <span className="text-xs font-medium text-green-600">Completed</span>
                      <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-primary transition-colors" />
                    </div>
                  </div>

                  {/* Service Card 4 */}
                  <div className="bg-white border border-gray-100 rounded-xl p-5 hover:shadow-md transition-all group">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-lg mb-1">Vehicle Inspection</h3>
                        <p className="text-sm text-gray-500">2023</p>
                      </div>
                      <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">Complete vehicle inspection covering all major systems and safety components.</p>
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <span className="text-xs font-medium text-green-600">Completed</span>
                      <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-primary transition-colors" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Right Column - My Vehicles */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="shadow-lg border-none">
                <CardHeader className="border-b bg-gray-50/50 pb-4">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Car className="h-5 w-5 text-primary" />
                    My Vehicles
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  {/* Vehicle Card 1 */}
                  <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-2xl p-6 hover:shadow-xl transition-all">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-bold text-xl text-gray-900">Toyota Camry</h3>
                        <p className="text-sm text-gray-500">2022</p>
                      </div>
                      <div className="bg-primary/10 px-3 py-1 rounded-full">
                        <p className="text-sm font-medium text-primary">XYZ 789</p>
                      </div>
                    </div>
                    
                    <div className="mb-4 rounded-xl overflow-hidden bg-gray-100">
                      <img 
                        src="/images/car_images/toyota-camry.jpg" 
                        alt="Toyota Camry"
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "/images/Car_images/default-car.jpg";
                        }}
                      />
                    </div>
                    
                    <div className="flex gap-3">
                      <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                        Book Service
                      </Button>
                      <Button variant="outline" className="flex-1">
                        Vehicle Details
                      </Button>
                    </div>
                  </div>

                  {/* Vehicle Card 2 */}
                  <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-2xl p-6 hover:shadow-xl transition-all">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-bold text-xl text-gray-900">Honda CR-V</h3>
                        <p className="text-sm text-gray-500">2021</p>
                      </div>
                      <div className="bg-primary/10 px-3 py-1 rounded-full">
                        <p className="text-sm font-medium text-primary">ABC 123</p>
                      </div>
                    </div>
                    
                    <div className="mb-4 rounded-xl overflow-hidden bg-gray-100">
                      <img 
                        src="/images/car_images/honda-crv.jpg" 
                        alt="Honda CR-V"
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "/images/Car_images/default-car.jpg";
                        }}
                      />
                    </div>
                    
                    <div className="flex gap-3">
                      <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                        Book Service
                      </Button>
                      <Button variant="outline" className="flex-1">
                        Vehicle Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Quick Actions Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8"
          >
            <Card className="shadow-lg border-none">
              <CardHeader className="border-b bg-gray-50/50">
                <CardTitle className="text-xl">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button
                    variant="outline"
                    className="h-16 justify-start gap-3 hover:bg-primary/5 hover:border-primary/30 hover:text-primary transition-all"
                    onClick={() => setIsEditOpen(true)}
                  >
                    <Edit className="h-5 w-5" />
                    <span className="font-medium">Edit Profile</span>
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="h-16 justify-start gap-3 hover:bg-primary/5 hover:border-primary/30 hover:text-primary transition-all"
                    onClick={() => setIsChangePasswordOpen(true)}
                  >
                    <Key className="h-5 w-5" />
                    <span className="font-medium">Change Password</span>
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="h-16 justify-start gap-3 hover:bg-primary/5 hover:border-primary/30 hover:text-primary transition-all"
                    onClick={() => navigate('/my-services')}
                  >
                    <Package className="h-5 w-5" />
                    <span className="font-medium">View All Services</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
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
                    onChange={(e) => {
                      setPasswordData({ ...passwordData, newPassword: e.target.value });
                      setPasswordErrors({ ...passwordErrors, newPassword: "" });
                    }}
                    className="pr-10"
                    placeholder="Min. 8 characters"
                    disabled={!resetToken || isPasswordLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                  {passwordErrors.newPassword && (
                    <p className="text-xs text-red-500 mt-1">{passwordErrors.newPassword}</p>
                  )}
                </div>
              </div>

              {/* Confirm Password Input */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="confirmPassword" className="text-right">
                  Confirm
                </Label>
                <div className="col-span-3 relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={passwordData.confirmPassword}
                    onChange={(e) => {
                      setPasswordData({ ...passwordData, confirmPassword: e.target.value });
                      setPasswordErrors({ ...passwordErrors, confirmPassword: "" });
                    }}
                    className="pr-10"
                    placeholder="Confirm new password"
                    disabled={!resetToken || isPasswordLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                  {passwordErrors.confirmPassword && (
                    <p className="text-xs text-red-500 mt-1">{passwordErrors.confirmPassword}</p>
                  )}
                </div>
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
