import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, X, Loader2 } from "lucide-react";
import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import ForgotPassword from "./ForgotPassword";

interface LoginProps {
  onClose?: () => void;
  onSwitchToRegister?: () => void;
}

const Login = ({ onClose, onSwitchToRegister }: LoginProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Form errors
  const [errors, setErrors] = useState({
    email: "",
    password: "",
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
      email: "",
      password: "",
    };

    let isValid = true;

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      await login(formData.email, formData.password);

      toast({
        title: "Login Successful!",
        description: "Welcome back to AutoMex.",
      });

      // Close the form and redirect to my services page
      if (onClose) {
        onClose();
      }
      // Redirect to my services page after successful login
      navigate('/my-services');
    } catch (error) {
      toast({
        title: "Login Failed",
        description: error instanceof Error ? error.message : "Invalid email or password",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Show ForgotPassword component if requested
  if (showForgotPassword) {
    return (
      <ForgotPassword
        onClose={onClose}
        onBackToLogin={() => setShowForgotPassword(false)}
      />
    );
  }

  return (
    <div className="w-full max-w-[540px] bg-black/5 backdrop-blur-sm border border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.3),0_0_60px_rgba(255,81,47,0.15),0_0_100px_rgba(221,36,118,0.1)] rounded-3xl p-8 relative">
      {/* Close Button */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
      )}
      
      {/* Logo/Icon */}
      <div className="flex justify-center mb-4">
        <img 
          src="/images/Automex_icon/AUTOMEX (4).png" 
          alt="AutoMex Logo" 
          className="h-32 w-auto object-contain drop-shadow-2xl"
          onError={(e) => {
            e.currentTarget.src = "/images/Landing_page_images/Red_Automex.png";
          }}
        />
      </div>

      {/* Title */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-center text-white drop-shadow-2xl">
          Login
        </h2>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Email Input */}
        <div className="mb-4">
          <Input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Username or email"
            className="w-full h-12 px-4 text-sm bg-white/60 backdrop-blur-sm border-0 rounded-xl focus:ring-2 focus:ring-white/50 text-gray-900 placeholder-gray-700 shadow-[0_4px_20px_rgba(0,0,0,0.15),0_2px_10px_rgba(255,81,47,0.1)]"
          />
          {errors.email && (
            <p className="text-xs text-red-300 mt-1">{errors.email}</p>
          )}
        </div>

        {/* Password Input */}
        <div className="mb-6">
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full h-12 px-4 pr-10 text-sm bg-white/60 backdrop-blur-sm border-0 rounded-xl focus:ring-2 focus:ring-white/50 text-gray-900 placeholder-gray-700 shadow-[0_4px_20px_rgba(0,0,0,0.15),0_2px_10px_rgba(255,81,47,0.1)]"
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

        {/* Login Button */}
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
              Logging in...
            </>
          ) : (
            "Login"
          )}
        </Button>

        {/* Forgot Password */}
        <div className="text-center mb-6">
          <button
            type="button"
            onClick={() => setShowForgotPassword(true)}
            className="text-sm font-medium transition-colors"
            style={{ color: '#DD2476' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#FF512F';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#DD2476';
            }}
          >
            Forgot your password?
          </button>
        </div>
      </form>

      {/* Register Link */}
      <p className="text-center text-sm text-white/90">
        You Don't have an account?{" "}
        <button 
          onClick={onSwitchToRegister}
          className="font-semibold transition-colors"
          style={{ color: '#DD2476' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#FF512F';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '#DD2476';
          }}
        >
          Create new account!
        </button>
      </p>
    </div>
  );
};

export default Login;
