import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import Header from "@/components/Header";
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
import { User, Mail, Phone, Shield, CheckCircle, XCircle, Edit, Key, Package, Loader2, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { updateUserProfile } from "@/services/authService";
import { toast } from "sonner";
import { usePasswordResetStore } from "@/stores/passwordResetStore";

const Profile = () => {
  const navigate = useNavigate();
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
    <div className="min-h-screen bg-gray-50/50">
      <Header />

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-primary/90 to-primary pb-32 pt-20 overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row items-center gap-6 text-white"
          >

            <div className="text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{currentUser?.full_name || 'User'}</h1>
              <p className="text-white/80 text-lg flex items-center justify-center md:justify-start gap-2">
                <Mail className="h-4 w-4" />
                {currentUser?.email}
              </p>
              <div className="flex items-center justify-center md:justify-start gap-3 mt-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium backdrop-blur-md border ${currentUser?.is_active
                  ? 'bg-green-500/20 border-green-400/30 text-green-100'
                  : 'bg-red-500/20 border-red-400/30 text-red-100'
                  }`}>
                  {currentUser?.is_active ? 'Active Account' : 'Inactive'}
                </span>
                {currentUser?.is_superuser && (
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 border border-blue-400/30 text-blue-100 backdrop-blur-md flex items-center gap-1">
                    <Shield className="h-3 w-3" />
                    Admin
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="container mx-auto px-4 -mt-20 pb-12 relative z-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* Main Info Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information Card */}
            <motion.div variants={itemVariants}>
              <Card className="overflow-hidden border-none shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="border-b border-gray-100 bg-white/50">
                  <CardTitle className="flex items-center gap-2 text-xl text-gray-800">
                    <User className="h-5 w-5 text-primary" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-500">Full Name</p>
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 group hover:bg-primary/5 transition-colors">
                        <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center shadow-sm text-primary">
                          <User className="h-4 w-4" />
                        </div>
                        <p className="font-medium text-gray-900">{currentUser?.full_name || 'Not provided'}</p>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-500">Email Address</p>
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 group hover:bg-primary/5 transition-colors">
                        <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center shadow-sm text-primary">
                          <Mail className="h-4 w-4" />
                        </div>
                        <p className="font-medium text-gray-900">{currentUser?.email}</p>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-500">Phone Number</p>
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 group hover:bg-primary/5 transition-colors">
                        <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center shadow-sm text-primary">
                          <Phone className="h-4 w-4" />
                        </div>
                        <p className="font-medium text-gray-900">{currentUser?.phone_number || 'Not provided'}</p>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-500">User ID</p>
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 group hover:bg-primary/5 transition-colors">
                        <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center shadow-sm text-primary">
                          <Shield className="h-4 w-4" />
                        </div>
                        <p className="font-medium text-gray-900">#{currentUser?.id}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Account Status Card */}
            <motion.div variants={itemVariants}>
              <Card className="overflow-hidden border-none shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="border-b border-gray-100 bg-white/50">
                  <CardTitle className="flex items-center gap-2 text-xl text-gray-800">
                    <Shield className="h-5 w-5 text-primary" />
                    Account Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex flex-wrap gap-4">
                    <div className={`flex items-center gap-3 p-4 rounded-xl border ${currentUser?.is_active
                      ? 'bg-green-50 border-green-100'
                      : 'bg-red-50 border-red-100'
                      } flex-1 min-w-[200px]`}>
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center ${currentUser?.is_active ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                        }`}>
                        {currentUser?.is_active ? <CheckCircle className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                      </div>
                      <div>
                        <p className={`font-semibold ${currentUser?.is_active ? 'text-green-700' : 'text-red-700'}`}>
                          {currentUser?.is_active ? 'Active' : 'Inactive'}
                        </p>
                        <p className={`text-sm ${currentUser?.is_active ? 'text-green-600' : 'text-red-600'}`}>
                          Account Status
                        </p>
                      </div>
                    </div>

                    <div className={`flex items-center gap-3 p-4 rounded-xl border ${currentUser?.is_verified
                      ? 'bg-blue-50 border-blue-100'
                      : 'bg-yellow-50 border-yellow-100'
                      } flex-1 min-w-[200px]`}>
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center ${currentUser?.is_verified ? 'bg-blue-100 text-blue-600' : 'bg-yellow-100 text-yellow-600'
                        }`}>
                        {currentUser?.is_verified ? <CheckCircle className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                      </div>
                      <div>
                        <p className={`font-semibold ${currentUser?.is_verified ? 'text-blue-700' : 'text-yellow-700'}`}>
                          {currentUser?.is_verified ? 'Verified' : 'Unverified'}
                        </p>
                        <p className={`text-sm ${currentUser?.is_verified ? 'text-blue-600' : 'text-yellow-600'}`}>
                          Email Verification
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar Column */}
          <div className="space-y-6">
            {/* Quick Actions Card */}
            <motion.div variants={itemVariants}>
              <Card className="overflow-hidden border-none shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="border-b border-gray-100 bg-white/50">
                  <CardTitle className="text-lg text-gray-800">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-3">
                  <Button
                    className="w-full justify-start gap-3 h-12 text-base font-medium transition-all hover:translate-x-1"
                    onClick={() => navigate('/my-services')}
                  >
                    <Package className="h-5 w-5" />
                    View My Services
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-3 h-12 text-base font-medium transition-all hover:translate-x-1 hover:bg-primary/5 hover:text-primary hover:border-primary/20"
                    onClick={() => setIsEditOpen(true)}
                  >
                    <Edit className="h-5 w-5" />
                    Edit Profile
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-3 h-12 text-base font-medium transition-all hover:translate-x-1 hover:bg-primary/5 hover:text-primary hover:border-primary/20"
                    onClick={() => setIsChangePasswordOpen(true)}
                  >
                    <Key className="h-5 w-5" />
                    Change Password
                  </Button>
                </CardContent>
              </Card>
            </motion.div>



            {/* Session Info (Optional/Debug) */}
            {token && (
              <motion.div variants={itemVariants}>
                <div className="px-4 py-2 text-center">
                  <p className="text-xs text-gray-400 font-mono">
                    Session ID: {token.substring(0, 8)}...
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
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
