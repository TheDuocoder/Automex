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
      const errorMessage = error instanceof Error ? error.message : "An error occurred during registration";
      
      // Parse error message to determine if it's email or phone number duplicate
      const errorLower = errorMessage.toLowerCase();
      
      if (errorLower.includes("email") && (errorLower.includes("already exists") || errorLower.includes("already registered"))) {
        // Set email error
        setErrors((prev) => ({
          ...prev,
          email: "An account with this email already exists. Please use a different email or try logging in.",
        }));
        toast({
          title: "Email Already Exists",
          description: "An account with this email address already exists. Please use a different email or try logging in.",
          variant: "destructive",
        });
      } else if (errorLower.includes("phone") && (errorLower.includes("already exists") || errorLower.includes("already registered"))) {
        // Set phone number error
        setErrors((prev) => ({
          ...prev,
          phoneNumber: "An account with this phone number already exists. Please use a different phone number.",
        }));
        toast({
          title: "Phone Number Already Exists",
          description: "An account with this phone number already exists. Please use a different phone number.",
          variant: "destructive",
        });
      } else {
        // Generic error
        toast({
          title: "Registration Failed",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[540px] mx-auto bg-black/5 backdrop-blur-sm border border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.3),0_0_60px_rgba(255,81,47,0.15),0_0_100px_rgba(221,36,118,0.1)] rounded-3xl p-8 relative">
      {/* Close Button */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors z-10"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
      )}
      
      {/* Logo/Icon */}
      <div className="flex justify-center mb-4">
        <img 
          src="/images/Automex_icon/AUTOMEX__DP.png" 
          alt="AutoMex Logo" 
          className="h-32 w-auto object-contain drop-shadow-2xl"
          onError={(e) => {
            e.currentTarget.src = "/images/Landing_page_images/Red_Automex.png";
          }}
        />
      </div>

      {/* Title */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-center text-white drop-shadow-2xl">
          Create Account
        </h2>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Full Name Input */}
        <div className="mb-3">
          <Input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Full Name"
            className="w-full h-11 px-4 text-sm bg-white/60 backdrop-blur-sm border-0 rounded-xl focus:ring-2 focus:ring-white/50 text-gray-900 placeholder-gray-700 shadow-[0_4px_20px_rgba(0,0,0,0.15),0_2px_10px_rgba(255,81,47,0.1)]"
          />
          {errors.fullName && (
            <p className="text-xs text-red-300 mt-1">{errors.fullName}</p>
          )}
        </div>

        {/* Email Input */}
        <div className="mb-3">
          <Input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email Address"
            className="w-full h-11 px-4 text-sm bg-white/60 backdrop-blur-sm border-0 rounded-xl focus:ring-2 focus:ring-white/50 text-gray-900 placeholder-gray-700 shadow-[0_4px_20px_rgba(0,0,0,0.15),0_2px_10px_rgba(255,81,47,0.1)]"
          />
          {errors.email && (
            <p className="text-xs text-red-300 mt-1">{errors.email}</p>
          )}
        </div>

        {/* Phone Number Input */}
        <div className="mb-3">
          <Input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            placeholder="Phone Number"
            className="w-full h-11 px-4 text-sm bg-white/60 backdrop-blur-sm border-0 rounded-xl focus:ring-2 focus:ring-white/50 text-gray-900 placeholder-gray-700 shadow-[0_4px_20px_rgba(0,0,0,0.15),0_2px_10px_rgba(255,81,47,0.1)]"
          />
          {errors.phoneNumber && (
            <p className="text-xs text-red-300 mt-1">{errors.phoneNumber}</p>
          )}
        </div>

        {/* Password Input */}
        <div className="mb-3">
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password (min 8 characters)"
              className="w-full h-11 px-4 pr-10 text-sm bg-white/60 backdrop-blur-sm border-0 rounded-xl focus:ring-2 focus:ring-white/50 text-gray-900 placeholder-gray-700 shadow-[0_4px_20px_rgba(0,0,0,0.15),0_2px_10px_rgba(255,81,47,0.1)]"
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
            <p className="text-xs text-red-300 mt-1">{errors.password}</p>
          )}
        </div>

        {/* Confirm Password Input */}
        <div className="mb-4">
          <div className="relative">
            <Input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              className="w-full h-11 px-4 pr-10 text-sm bg-white/60 backdrop-blur-sm border-0 rounded-xl focus:ring-2 focus:ring-white/50 text-gray-900 placeholder-gray-700 shadow-[0_4px_20px_rgba(0,0,0,0.15),0_2px_10px_rgba(255,81,47,0.1)]"
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
            <p className="text-xs text-red-300 mt-1">{errors.confirmPassword}</p>
          )}
        </div>

        {/* Terms & Conditions */}
        <div className="flex items-start space-x-2 mb-4">
          <Checkbox
            id="terms"
            checked={acceptTerms}
            onCheckedChange={(checked) => {
              setAcceptTerms(checked as boolean);
              setErrors((prev) => ({ ...prev, terms: "" }));
            }}
            className="border-white/50 w-4 h-4 mt-0.5"
            style={{
              backgroundColor: acceptTerms ? '#DD2476' : 'transparent'
            }}
          />
          <label htmlFor="terms" className="text-xs text-white/90 cursor-pointer leading-relaxed">
            I agree to the{" "}
            <a 
              href="#" 
              className="font-medium transition-colors"
              style={{ color: '#DD2476' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#FF512F';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#DD2476';
              }}
            >
              Terms & Conditions
            </a>{" "}
            and{" "}
            <a 
              href="#" 
              className="font-medium transition-colors"
              style={{ color: '#DD2476' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#FF512F';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#DD2476';
              }}
            >
              Privacy Policy
            </a>
          </label>
        </div>
        {errors.terms && (
          <p className="text-xs text-red-300 mt-1 mb-2">{errors.terms}</p>
        )}

        {/* Register Button */}
        <Button 
          type="submit"
          disabled={isLoading}
          className="w-full h-12 text-white text-base font-semibold rounded-xl mb-4 disabled:opacity-50 disabled:cursor-not-allowed uppercase transition-all duration-500 shadow-[0_0_20px_rgba(255,81,47,0.4),0_8px_30px_rgba(221,36,118,0.3),0_4px_15px_rgba(0,0,0,0.2)]"
          style={{
            backgroundImage: 'linear-gradient(to right, #FF512F 0%, #DD2476 51%, #FF512F 100%)',
            backgroundSize: '200% auto',
            backgroundPosition: 'left center'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundPosition = 'right center';
            e.currentTarget.style.boxShadow = '0 0 30px rgba(255,81,47,0.6), 0 12px 40px rgba(221,36,118,0.5), 0 6px 20px rgba(0,0,0,0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundPosition = 'left center';
            e.currentTarget.style.boxShadow = '0 0 20px rgba(255,81,47,0.4), 0 8px 30px rgba(221,36,118,0.3), 0 4px 15px rgba(0,0,0,0.2)';
          }}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Creating Account...
            </>
          ) : (
            "Create Account"
          )}
        </Button>
      </form>

      {/* Login Link */}
      <p className="text-center text-sm text-white/90">
        Already have an account?{" "}
        <button 
          onClick={onSwitchToLogin}
          className="font-semibold transition-colors"
          style={{ color: '#DD2476' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#FF512F';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '#DD2476';
          }}
        >
          Login here
        </button>
      </p>
    </div>
  );
};

export default Register;

