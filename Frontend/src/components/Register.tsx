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
    } else {
      const phoneRegex = /^[6-9]\d{9}$/;
      if (!phoneRegex.test(formData.phoneNumber.trim())) {
        newErrors.phoneNumber = "Invalid phone number. Must be 10 digits and start with 6-9.";
        isValid = false;
      }
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
    <div className="premium-register-container w-full max-w-[540px] mx-auto p-8 relative">
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
      <div className="flex justify-center -mb-4">
        <img
          src="https://automex-bhubaneswar.s3.ap-south-2.amazonaws.com/Frontend/images/Automex_icon/AUTOMEX_logo.png"
          alt="AutoMex Logo"
          className="h-32 w-auto object-contain drop-shadow-2xl"
          onError={(e) => {
            e.currentTarget.src = "https://automex-bhubaneswar.s3.ap-south-2.amazonaws.com/Frontend/images/Landing_page_images/Red_Automex.png";
          }}
        />
      </div>

      {/* Title */}
      <div className="mb-2">
        <h2
          className="font-bold text-center text-white"
          style={{
            fontSize: '40px',
            textShadow: '0 2px 8px rgba(0, 0, 0, 0.3), 0 4px 16px rgba(255, 44, 131, 0.2)'
          }}
        >
          Create Account
        </h2>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Full Name Input */}
        <div className="premium-input-wrapper mb-4">
          <Input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Full Name"
            className="premium-input w-full h-12 px-4 text-base rounded-xl"
          />
          {errors.fullName && (
            <p className="text-xs text-red-300 mt-1">{errors.fullName}</p>
          )}
        </div>

        {/* Email Input */}
        <div className="premium-input-wrapper mb-4">
          <Input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email Address"
            className="premium-input w-full h-12 px-4 text-base rounded-xl"
          />
          {errors.email && (
            <p className="text-xs text-red-300 mt-1">{errors.email}</p>
          )}
        </div>

        {/* Phone Number Input */}
        <div className="premium-input-wrapper mb-4">
          <Input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            placeholder="Phone Number"
            className="premium-input w-full h-12 px-4 text-base rounded-xl"
          />
          {errors.phoneNumber && (
            <p className="text-xs text-red-300 mt-1">{errors.phoneNumber}</p>
          )}
        </div>

        {/* Password Input */}
        <div className="premium-input-wrapper mb-4">
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password (min 8 characters)"
              className="premium-input w-full h-12 px-4 pr-12 text-base rounded-xl"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="premium-eye-icon absolute right-4 top-1/2 -translate-y-1/2"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-red-300 mt-1">{errors.password}</p>
          )}
        </div>

        {/* Confirm Password Input */}
        <div className="premium-input-wrapper mb-5">
          <div className="relative">
            <Input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              className="premium-input w-full h-12 px-4 pr-12 text-base rounded-xl"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="premium-eye-icon absolute right-4 top-1/2 -translate-y-1/2"
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-xs text-red-300 mt-1">{errors.confirmPassword}</p>
          )}
        </div>

        {/* Terms & Conditions */}
        <div className="premium-checkbox-wrapper mb-5">
          <Checkbox
            id="terms"
            checked={acceptTerms}
            onCheckedChange={(checked) => {
              setAcceptTerms(checked as boolean);
              setErrors((prev) => ({ ...prev, terms: "" }));
            }}
            className="premium-checkbox"
          />
          <label htmlFor="terms" className="text-sm text-white/90 cursor-pointer leading-relaxed">
            I agree to the{" "}
            <a href="#" className="premium-link">
              Terms & Conditions
            </a>{" "}
            and{" "}
            <a href="#" className="premium-link">
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
          className="premium-create-btn w-full mb-5"
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
          className="premium-login-link"
        >
          Login here
        </button>
      </p>
    </div>
  );
};

export default Register;

