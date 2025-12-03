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

      // Close the form and redirect to home page (welcome form)
      if (onClose) {
        onClose();
      }
      // Redirect to home page after successful login to show welcome form
      navigate('/');
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
    <div 
      className="w-full max-w-[540px] bg-black/5 border border-white/5 rounded-3xl p-8 relative"
      style={{
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        boxShadow: `
          0 8px 32px rgba(0, 0, 0, 0.3),
          0 0 60px rgba(255, 81, 47, 0.15),
          0 0 100px rgba(221, 36, 118, 0.1),
          inset 0 0 40px rgba(255, 255, 255, 0.05),
          0 0 80px rgba(255, 44, 131, 0.2)
        `
      }}
    >      {/* Close Button */}
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
      <div className="flex justify-center mb-4 relative">
        {/* Spotlight glow behind logo */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(255, 80, 80, 0.15) 0%, rgba(255, 255, 255, 0.05) 40%, transparent 70%)',
            filter: 'blur(20px)',
            zIndex: 0
          }}
        />
        <img
          src="/images/Automex_icon/AUTOMEX_logo.png"
          alt="AutoMex Logo"
          className="h-32 w-auto object-contain drop-shadow-2xl relative z-10"
          onError={(e) => {
            e.currentTarget.src = "/images/Landing_page_images/Red_Automex.png";
          }}
        />
      </div>

      {/* Title */}
      <div className="mb-8">
        <h2 
          className="font-bold text-center text-white"
          style={{
            fontSize: '40px',
            textShadow: '0 2px 8px rgba(0, 0, 0, 0.3), 0 4px 16px rgba(255, 44, 131, 0.2)'
          }}
        >
          Login
        </h2>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Email Input */}
        <div className="premium-input-wrapper mb-4">
          <Input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Username or email"
            className="premium-input w-full h-12 px-4 text-base rounded-xl"
          />
          {errors.email && (
            <p className="text-xs text-red-300 mt-1">{errors.email}</p>
          )}
        </div>

        {/* Password Input */}
        <div className="premium-input-wrapper mb-6">
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="premium-input w-full h-12 px-4 pr-12 text-base rounded-xl"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="premium-eye-icon absolute right-3 top-1/2 -translate-y-1/2"
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
          className="w-full h-12 text-white text-base font-semibold rounded-xl mb-4 disabled:opacity-50 disabled:cursor-not-allowed uppercase transition-all duration-300"
          style={{
            backgroundImage: 'linear-gradient(to right, #FF6A3D 0%, #FF2C83 51%, #FF6A3D 100%)',
            backgroundSize: '200% auto',
            backgroundPosition: 'left center',
            boxShadow: '0 0 12px rgba(255, 80, 80, 0.4), 0 8px 30px rgba(255, 44, 131, 0.3), 0 4px 15px rgba(0, 0, 0, 0.2)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundPosition = 'right center';
            e.currentTarget.style.boxShadow = '0 0 20px rgba(255, 80, 80, 0.6), 0 12px 40px rgba(255, 44, 131, 0.5), 0 6px 20px rgba(0, 0, 0, 0.3)';
            e.currentTarget.style.transform = 'scale(1.03)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundPosition = 'left center';
            e.currentTarget.style.boxShadow = '0 0 12px rgba(255, 80, 80, 0.4), 0 8px 30px rgba(255, 44, 131, 0.3), 0 4px 15px rgba(0, 0, 0, 0.2)';
            e.currentTarget.style.transform = 'scale(1)';
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
            className="text-sm font-semibold transition-colors"
            style={{ color: '#FF3E8A' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#FF6A3D';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#FF3E8A';
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
          style={{ color: '#FF3E8A' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#FF6A3D';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '#FF3E8A';
          }}
        >
          Create new account!
        </button>
      </p>
    </div>
  );
};

export default Login;
