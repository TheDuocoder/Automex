import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, X, Loader2 } from "lucide-react";
import { useState, FormEvent } from "react";
import { registerUser } from "@/services/authService";
import { useToast } from "@/hooks/use-toast";

interface RegisterProps {
  onClose?: () => void;
  onSwitchToLogin?: () => void;
}

const Register = ({ onClose, onSwitchToLogin }: RegisterProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Form state
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });

  // Form errors
  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    terms: "",
  });

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {
      fullName: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
      terms: "",
    };

    let isValid = true;

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
      isValid = false;
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
      isValid = false;
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    if (!acceptTerms) {
      newErrors.terms = "You must accept the terms and conditions";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields correctly.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      await registerUser({
        email: formData.email,
        password: formData.password,
        full_name: formData.fullName,
        phone_number: formData.phoneNumber,
      });

      toast({
        title: "Registration Successful!",
        description: "Your account has been created. Please login to continue.",
      });

      // Switch to login form after successful registration
      if (onSwitchToLogin) {
        setTimeout(() => {
          onSwitchToLogin();
        }, 1500);
      }
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: error instanceof Error ? error.message : "An error occurred during registration",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-2xl p-6 relative">
      {/* Close Button */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
      )}
      
      {/* Logo/Icon */}
      <div className="flex justify-center mb-2">
        <img 
          src="/images/automexloginlogo.png" 
          alt="AutoMex Logo" 
          className="h-16 w-auto object-contain"
          onError={(e) => {
            e.currentTarget.src = "/images/AUTOMEX.png";
          }}
        />
      </div>

      {/* Title */}
      <div className="bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 rounded-lg py-2 px-3 mb-3">
        <h2 className="text-lg font-bold mb-0.5 text-center text-black">
          Create Your Account
        </h2>
        <p className="text-xs text-gray-600 text-center">Join AutoMex for premium car services</p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Full Name Input */}
        <div className="mb-2">
          <label className="block text-xs font-semibold text-gray-900 mb-1">
            Full Name <span className="text-red-500">*</span>
          </label>
          <Input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Enter your full name"
            className={`w-full h-9 px-3 text-sm rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
              errors.fullName ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.fullName && (
            <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>
          )}
        </div>

        {/* Email Input */}
        <div className="mb-2">
          <label className="block text-xs font-semibold text-gray-900 mb-1">
            Email <span className="text-red-500">*</span>
          </label>
          <Input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email address"
            className={`w-full h-9 px-3 text-sm rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.email && (
            <p className="text-xs text-red-500 mt-1">{errors.email}</p>
          )}
        </div>

        {/* Phone Number Input */}
        <div className="mb-2">
          <label className="block text-xs font-semibold text-gray-900 mb-1">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <Input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            placeholder="Enter your phone number"
            className={`w-full h-9 px-3 text-sm rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
              errors.phoneNumber ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.phoneNumber && (
            <p className="text-xs text-red-500 mt-1">{errors.phoneNumber}</p>
          )}
        </div>

        {/* Password Input */}
        <div className="mb-2">
          <label className="block text-xs font-semibold text-gray-900 mb-1">
            Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password (min 8 characters)"
              className={`w-full h-9 px-3 pr-10 text-sm rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-red-500 mt-1">{errors.password}</p>
          )}
        </div>

        {/* Confirm Password Input */}
        <div className="mb-2">
          <label className="block text-xs font-semibold text-gray-900 mb-1">
            Confirm Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              className={`w-full h-9 px-3 pr-10 text-sm rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                errors.confirmPassword ? "border-red-500" : "border-gray-300"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>
          )}
        </div>

        {/* Terms & Conditions */}
        <div className="flex items-start space-x-2 mb-3">
          <Checkbox
            id="terms"
            checked={acceptTerms}
            onCheckedChange={(checked) => {
              setAcceptTerms(checked as boolean);
              setErrors((prev) => ({ ...prev, terms: "" }));
            }}
            className="border-primary data-[state=checked]:bg-primary w-4 h-4 mt-0.5"
          />
          <label htmlFor="terms" className="text-xs text-gray-700 cursor-pointer leading-relaxed">
            I agree to the{" "}
            <a href="#" className="text-primary hover:text-primary/80 font-medium">
              Terms & Conditions
            </a>{" "}
            and{" "}
            <a href="#" className="text-primary hover:text-primary/80 font-medium">
              Privacy Policy
            </a>
          </label>
        </div>
        {errors.terms && (
          <p className="text-xs text-red-500 mt-1 mb-2">{errors.terms}</p>
        )}

        {/* Register Button */}
        <Button 
          type="submit"
          disabled={isLoading}
          className="w-full h-9 bg-primary hover:bg-primary/90 text-white text-sm font-semibold rounded-lg mb-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Creating Account...
            </>
          ) : (
            "Create Account"
          )}
        </Button>
      </form>

      {/* Divider */}
      <div className="relative mb-3">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="px-3 bg-white text-gray-500">Or, Register with</span>
        </div>
      </div>

      {/* Google Sign Up */}
      <Button
        variant="outline"
        className="w-full h-9 border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 rounded-lg mb-3 flex items-center justify-center gap-2"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        <span className="text-sm font-medium text-gray-700">Sign up with google</span>
      </Button>

      {/* Login Link */}
      <p className="text-center text-xs text-gray-700">
        Already have an account?{" "}
        <button 
          onClick={onSwitchToLogin}
          className="text-primary hover:text-primary/80 font-semibold"
        >
          Login here
        </button>
      </p>
    </div>
  );
};

export default Register;

