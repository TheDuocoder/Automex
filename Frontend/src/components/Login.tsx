import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  return (
    <div className="w-[600px] h-[550px] mx-auto bg-white rounded-2xl shadow-2xl p-8">
      {/* Logo/Icon */}
      <div className="flex justify-center mb-3">
        <img 
          src="/images/automexloginlogo.png" 
          alt="AutoMex Logo" 
          className="h-24 w-auto object-contain"
          onError={(e) => {
            e.currentTarget.src = "/images/AUTOMEX.png";
          }}
        />
      </div>

      {/* Title */}
      <div className="bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 rounded-lg py-3 px-4 mb-3">
        <h2 className="text-xl font-bold mb-0.5 text-center text-black">
          Welcome to AutoMex
        </h2>
        <p className="text-xs text-gray-600 text-center">Enter to get unlimited access to data & information.</p>
      </div>

      {/* Email Input */}
      <div className="mb-2.5">
        <label className="block text-xs font-semibold text-gray-900 mb-1">
          Email <span className="text-red-500">*</span>
        </label>
        <Input
          type="email"
          placeholder="Enter your mail address"
          className="w-full h-9 px-3 text-sm border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Password Input */}
      <div className="mb-2.5">
        <label className="block text-xs font-semibold text-gray-900 mb-1">
          Password <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Enter password"
            className="w-full h-9 px-3 pr-10 text-sm border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Remember Me & Forgot Password */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="remember"
            checked={rememberMe}
            onCheckedChange={(checked) => setRememberMe(checked as boolean)}
            className="border-blue-600 data-[state=checked]:bg-blue-600 w-4 h-4"
          />
          <label htmlFor="remember" className="text-xs text-gray-700 cursor-pointer">
            Remember me
          </label>
        </div>
        <a href="#" className="text-xs text-blue-600 hover:text-blue-700 font-medium">
          Forgot your password ?
        </a>
      </div>

      {/* Login Button */}
      <Button className="w-full h-9 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm font-semibold rounded-lg mb-3">
        Log In
      </Button>

      {/* Divider */}
      <div className="relative mb-3">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="px-3 bg-white text-gray-500">Or, Login with</span>
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

      {/* Register Link */}
      <p className="text-center text-xs text-gray-700">
        Don't have an account ?{" "}
        <a href="#" className="text-blue-600 hover:text-blue-700 font-semibold">
          Register here
        </a>
      </p>
    </div>
  );
};

export default Login;
