import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, X, Loader2, ArrowLeft, Mail, Lock } from "lucide-react";
import { useState, FormEvent } from "react";
import { useToast } from "@/hooks/use-toast";
import { usePasswordResetStore } from "@/stores/passwordResetStore";

interface ForgotPasswordProps {
  onClose?: () => void;
  onBackToLogin?: () => void;
}

const ForgotPassword = ({ onClose, onBackToLogin }: ForgotPasswordProps) => {
  const [step, setStep] = useState<1 | 2>(1); // Step 1: Email, Step 2: Token + New Password
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { setResetToken, resetToken, clearResetToken } = usePasswordResetStore();

  // Form state for step 1 (email)
  const [emailData, setEmailData] = useState({
    email: "",
  });

  // Form state for step 2 (password only - token is in store)
  const [resetData, setResetData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  // Form errors
  const [errors, setErrors] = useState({
    email: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Handle input changes for step 1
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setEmailData({ email: value });
    setErrors((prev) => ({ ...prev, email: "" }));
  };

  // Handle input changes for step 2 (only password fields)
  const handleResetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setResetData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Validate step 1 (email)
  const validateEmail = () => {
    if (!emailData.email.trim()) {
      setErrors((prev) => ({ ...prev, email: "Email is required" }));
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(emailData.email)) {
      setErrors((prev) => ({ ...prev, email: "Email is invalid" }));
      return false;
    }
    return true;
  };

  // Validate step 2 (password only - token is in store)
  const validateReset = () => {
    if (!resetToken) {
      toast({
        title: "Token Missing",
        description: "Reset token is missing. Please request a new token.",
        variant: "destructive",
      });
      return false;
    }

    let isValid = true;
    const newErrors = { ...errors };

    if (!resetData.newPassword) {
      newErrors.newPassword = "New password is required";
      isValid = false;
    } else if (resetData.newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters";
      isValid = false;
    }

    if (!resetData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
      isValid = false;
    } else if (resetData.newPassword !== resetData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle step 1 submission (request reset token)
  // This function can be called both from form submit and from resend button
  const handleEmailSubmit = async (e?: FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    if (!validateEmail()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/v1/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: emailData.email }),
      });

      // FastAPI Users returns 202 Accepted for forgot-password
      if (response.ok || response.status === 202) {
        const isResend = step === 2;
        
        // Try to get response data (may include token in development mode)
        let responseData: any = null;
        try {
          responseData = await response.json();
        } catch {
          // Response might be empty
        }
        
        // If token is returned (development mode), store it in Zustand
        if (responseData?.token) {
          setResetToken(responseData.token, emailData.email);
          toast({
            title: isResend ? "Token Resent!" : "Reset Token Generated!",
            description: `Token has been generated. You can now set your new password.`,
          });
        } else {
          toast({
            title: isResend ? "Token Resent!" : "Reset Token Sent!",
            description: responseData?.message || `If an account exists with ${emailData.email}, you will receive a password reset token. Please check your email.`,
          });
        }
        
        // Move to step 2 after successful request (only if not already there)
        if (step === 1) {
          setStep(2);
        }
      } else {
        // Try to parse error response
        let errorMessage = "Failed to send reset email. Please try again.";
        try {
          const errorData = await response.json();
          errorMessage = errorData.detail || errorData.message || errorMessage;
        } catch {
          // If JSON parsing fails, use status text
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }
    } catch (error) {
      // Handle network errors
      if (error instanceof TypeError && error.message.includes("fetch")) {
        toast({
          title: "Connection Error",
          description: "Unable to connect to the server. Please check your internet connection and try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to send reset email. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle step 2 submission (reset password)
  const handleResetSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateReset()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/v1/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: resetToken,
          password: resetData.newPassword,
        }),
      });

      if (response.ok || response.status === 200 || response.status === 204) {
        toast({
          title: "Password Reset Successful!",
          description: "Your password has been reset. You can now login with your new password.",
        });
        
        // Reset form and clear store, then go back to login
        clearResetToken();
        setTimeout(() => {
          setStep(1);
          setEmailData({ email: "" });
          setResetData({ newPassword: "", confirmPassword: "" });
          if (onBackToLogin) {
            onBackToLogin();
          }
        }, 1500);
      } else {
        // Try to parse error response
        let errorMessage = "Failed to reset password. Please check your token and try again.";
        try {
          const errorData = await response.json();
          errorMessage = errorData.detail || errorData.message || errorMessage;
        } catch {
          // If JSON parsing fails, use status text
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }
    } catch (error) {
      // Handle network errors
      if (error instanceof TypeError && error.message.includes("fetch")) {
        toast({
          title: "Connection Error",
          description: "Unable to connect to the server. Please check your internet connection and try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Reset Failed",
          description: error instanceof Error ? error.message : "Invalid token or password reset failed. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

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
          src="/images/Landing_page_images/Red_circle_Automex.png"
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
          {step === 1 ? "Forgot Password" : "Reset Password"}
        </h2>
        <p className="text-sm text-white/80 text-center mt-2">
          {step === 1
            ? "Enter your email to receive a reset token"
            : "Enter your new password"}
        </p>
      </div>

      {/* Step 1: Email Form */}
      {step === 1 && (
        <form onSubmit={handleEmailSubmit}>
          <div className="mb-6">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <Input
                type="email"
                value={emailData.email}
                onChange={handleEmailChange}
                placeholder="Enter your email address"
                className="w-full h-12 pl-12 pr-4 text-sm bg-white/60 backdrop-blur-sm border-0 rounded-xl focus:ring-2 focus:ring-white/50 text-gray-900 placeholder-gray-700 shadow-[0_4px_20px_rgba(0,0,0,0.15),0_2px_10px_rgba(255,81,47,0.1)]"
              />
            </div>
            {errors.email && (
              <p className="text-xs text-red-300 mt-1">{errors.email}</p>
            )}
          </div>

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
                Sending...
              </>
            ) : (
              "Send Reset Token"
            )}
          </Button>

          <div className="text-center">
            <button
              type="button"
              onClick={onBackToLogin}
              className="text-sm font-medium transition-colors inline-flex items-center gap-2"
              style={{ color: '#DD2476' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#FF512F';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#DD2476';
              }}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </button>
          </div>
        </form>
      )}

      {/* Step 2: Token + New Password Form */}
      {step === 2 && (
        <form onSubmit={handleResetSubmit}>
          {/* Info Message */}
          <div className="mb-4 p-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl">
            <p className="text-xs text-white/90">
              <strong>Password Reset Token:</strong> The token has been generated for{" "}
              <span className="font-semibold">{emailData.email}</span>. 
              {resetToken ? (
                <span className="block mt-1 text-green-300 font-semibold">
                  ✓ Token received! You can now set your new password below.
                </span>
              ) : (
                <span> Please check your email for the token.</span>
              )}
            </p>
          </div>

          {/* New Password Input */}
          <div className="mb-4">
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <Input
                type={showPassword ? "text" : "password"}
                name="newPassword"
                value={resetData.newPassword}
                onChange={handleResetChange}
                placeholder="New password (min. 8 characters)"
                className="w-full h-12 pl-12 pr-12 text-sm bg-white/60 backdrop-blur-sm border-0 rounded-xl focus:ring-2 focus:ring-white/50 text-gray-900 placeholder-gray-700 shadow-[0_4px_20px_rgba(0,0,0,0.15),0_2px_10px_rgba(255,81,47,0.1)]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {errors.newPassword && (
              <p className="text-xs text-red-300 mt-1">{errors.newPassword}</p>
            )}
          </div>

          {/* Confirm Password Input */}
          <div className="mb-6">
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <Input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={resetData.confirmPassword}
                onChange={handleResetChange}
                placeholder="Confirm new password"
                className="w-full h-12 pl-12 pr-12 text-sm bg-white/60 backdrop-blur-sm border-0 rounded-xl focus:ring-2 focus:ring-white/50 text-gray-900 placeholder-gray-700 shadow-[0_4px_20px_rgba(0,0,0,0.15),0_2px_10px_rgba(255,81,47,0.1)]"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-xs text-red-300 mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

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
                Resetting...
              </>
            ) : (
              "Reset Password"
            )}
          </Button>

          <div className="flex gap-3 justify-center">
            <button
              type="button"
              onClick={() => {
                setStep(1);
                clearResetToken();
                setResetData({ newPassword: "", confirmPassword: "" });
              }}
              className="text-sm font-medium transition-colors inline-flex items-center gap-2"
              style={{ color: '#DD2476' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#FF512F';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#DD2476';
              }}
            >
              <ArrowLeft className="w-4 h-4" />
              Change Email
            </button>
            <span className="text-white/50">|</span>
            <button
              type="button"
              onClick={() => {
                clearResetToken();
                if (onBackToLogin) {
                  onBackToLogin();
                }
              }}
              className="text-sm font-medium transition-colors"
              style={{ color: '#DD2476' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#FF512F';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#DD2476';
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ForgotPassword;
