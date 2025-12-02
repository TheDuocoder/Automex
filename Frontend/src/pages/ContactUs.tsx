import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, Mail, MapPin, Clock, Send, ArrowLeft, User, MessageSquare, ShieldCheck, Wrench } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ContactUs = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    toast({
      title: "Message Sent!",
      description: "We'll get back to you within 24 hours.",
    });
    // Reset form
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative text-white pt-32 pb-12 overflow-hidden">
        {/* Dark Workshop Gradient Background - Deep Black & Charcoal */}
        <div 
          className="absolute inset-0 z-0"
          style={{
            background: 'radial-gradient(ellipse at 50% 50%, #1a1a1a 0%, #0d0d0d 35%, #000000 100%)',
          }}
        />
        
        {/* Blurred Workshop Background with Enhanced Cinematic Depth */}
        <div 
          className="absolute inset-0 z-[1]"
          style={{
            backgroundImage: 'url("/images/Landing_page_images/automexfrontpage3.jpg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(100px) brightness(0.18) contrast(0.65)',
            opacity: 0.25,
          }}
        />
        
        {/* Soft Diffused Red Ambient Lighting */}
        <div 
          className="absolute inset-0 z-[2]"
          style={{
            background: 'radial-gradient(ellipse 1000px 700px at 45% 35%, rgba(139, 0, 0, 0.15) 0%, transparent 55%), radial-gradient(ellipse 800px 900px at 55% 65%, rgba(80, 0, 0, 0.12) 0%, transparent 50%)',
            filter: 'blur(120px)',
          }}
        />
        
        {/* PREMIUM METALLIC GRADIENT LAYER - Car Showroom Aesthetic */}
        <div 
          className="absolute z-[2.5]"
          style={{
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '800px',
            height: '800px',
            pointerEvents: 'none',
          }}
        >
          {/* Primary Metallic Gradient - Automotive Red Spectrum */}
          <div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(circle at 50% 50%, #FF2E2E 0%, #A00000 25%, #420000 50%, #550000 75%, transparent 100%)',
              borderRadius: '50%',
              filter: 'blur(150px)',
              opacity: 0.4,
              animation: 'metallicPulse 12s ease-in-out infinite',
              mixBlendMode: 'screen',
            }}
          />
          
          {/* Secondary Gradient Layer - Depth & Warmth */}
          <div
            className="absolute"
            style={{
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '600px',
              height: '600px',
              background: 'radial-gradient(circle at 40% 35%, #A00000 0%, #420000 40%, #550000 70%, transparent 100%)',
              borderRadius: '50%',
              filter: 'blur(100px)',
              opacity: 0.35,
              animation: 'metallicShift 15s ease-in-out infinite',
              mixBlendMode: 'multiply',
            }}
          />
          
          {/* Tertiary Highlight Layer - Bright Red Center */}
          <div
            className="absolute"
            style={{
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '400px',
              height: '400px',
              background: 'radial-gradient(circle at 45% 40%, #FF2E2E 0%, rgba(255, 46, 46, 0.6) 30%, transparent 60%)',
              borderRadius: '50%',
              filter: 'blur(80px)',
              opacity: 0.25,
              animation: 'metallicGlow 10s ease-in-out infinite',
              mixBlendMode: 'screen',
            }}
          />
          
          {/* Premium Depth Layer - Dark Automotive Base */}
          <div
            className="absolute"
            style={{
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '700px',
              height: '700px',
              background: 'radial-gradient(circle at 55% 60%, #420000 0%, #550000 35%, transparent 70%)',
              borderRadius: '50%',
              filter: 'blur(120px)',
              opacity: 0.3,
              animation: 'depthLayer 18s ease-in-out infinite',
              mixBlendMode: 'darken',
            }}
          />
        </div>
        
        {/* Premium Animated Liquid Glass Orb - Physics-Based Floating with Collision Detection */}
        <div 
          className="absolute z-[3]"
          style={{
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '600px',
            height: '500px',
            pointerEvents: 'none',
          }}
        >
          {/* Invisible Frame Boundary - The bulb bounces inside this */}
          <div className="absolute inset-0">
            {/* Moving Bulb Container - Physics-Based Path with Collision Rebounds */}
            <div
              className="absolute"
              style={{
                width: '200px',
                height: '200px',
                animation: 'physicsFloat 32s cubic-bezier(0.42, 0, 0.58, 1) infinite',
              }}
            >
          {/* Main Glassy Liquid Bulb with Surface Tension */}
          <div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(circle at 32% 28%, rgba(255, 255, 255, 0.35) 0%, rgba(255, 255, 255, 0.18) 15%, rgba(205, 0, 0, 0.12) 35%, rgba(139, 0, 0, 0.08) 55%, transparent 85%)',
              borderRadius: '50%',
              filter: 'blur(45px)',
              animation: 'liquidBulbMorph 10s ease-in-out infinite',
              boxShadow: '0 0 120px rgba(205, 0, 0, 0.4), 0 0 80px rgba(255, 255, 255, 0.15), inset 0 0 60px rgba(255, 255, 255, 0.12)',
            }}
          />
          
          {/* Ultra-Glossy Inner Core */}
          <div
            className="absolute"
            style={{
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '280px',
              height: '280px',
              background: 'radial-gradient(circle at 38% 32%, rgba(255, 255, 255, 0.5) 0%, rgba(255, 200, 200, 0.3) 18%, rgba(255, 81, 47, 0.2) 40%, rgba(221, 36, 118, 0.12) 65%, transparent 100%)',
              borderRadius: '50%',
              filter: 'blur(25px)',
              animation: 'liquidWobble 7s ease-in-out infinite',
              boxShadow: '0 0 70px rgba(255, 81, 47, 0.5), inset 0 0 50px rgba(255, 255, 255, 0.25)',
            }}
          />
          
          {/* Molten Glass Gel Layer - Translucent Effect */}
          <div
            className="absolute"
            style={{
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '350px',
              height: '350px',
              background: 'radial-gradient(circle at 30% 25%, rgba(255, 255, 255, 0.22) 0%, rgba(220, 220, 255, 0.15) 25%, rgba(205, 0, 0, 0.1) 50%, transparent 80%)',
              borderRadius: '50%',
              filter: 'blur(35px)',
              animation: 'gelBreathe 9s ease-in-out infinite',
              mixBlendMode: 'screen',
            }}
          />
          
          {/* Iridescent Light Refraction - Top Highlight */}
          <div
            className="absolute"
            style={{
              top: '22%',
              left: '28%',
              width: '130px',
              height: '130px',
              background: 'radial-gradient(circle, rgba(255, 255, 255, 0.7) 0%, rgba(200, 230, 255, 0.4) 25%, rgba(255, 255, 255, 0.15) 50%, transparent 75%)',
              borderRadius: '50%',
              filter: 'blur(18px)',
              animation: 'iridescentShift 11s ease-in-out infinite',
              mixBlendMode: 'overlay',
            }}
          />
          
          {/* Secondary Iridescent Reflection */}
          <div
            className="absolute"
            style={{
              bottom: '28%',
              right: '25%',
              width: '90px',
              height: '90px',
              background: 'radial-gradient(circle, rgba(255, 230, 230, 0.4) 0%, rgba(255, 200, 200, 0.2) 40%, transparent 70%)',
              borderRadius: '50%',
              filter: 'blur(22px)',
              animation: 'secondaryRefraction 13s ease-in-out infinite',
              mixBlendMode: 'screen',
            }}
          />
          
          {/* Crimson Neon Glow - Red to Deep Red Gradient */}
          <div
            className="absolute"
            style={{
              bottom: '20%',
              right: '28%',
              width: '140px',
              height: '140px',
              background: 'radial-gradient(circle, rgba(220, 20, 60, 0.3) 0%, rgba(205, 0, 0, 0.2) 30%, rgba(139, 0, 0, 0.12) 60%, transparent 100%)',
              borderRadius: '50%',
              filter: 'blur(40px)',
              animation: 'crimsonPulse 8s ease-in-out infinite',
            }}
          />
          
          {/* Faint Red Neon Accent - Automotive Theme */}
          <div
            className="absolute"
            style={{
              top: '35%',
              right: '20%',
              width: '100px',
              height: '100px',
              background: 'radial-gradient(circle, rgba(255, 0, 0, 0.25) 0%, rgba(205, 0, 0, 0.15) 40%, transparent 75%)',
              borderRadius: '50%',
              filter: 'blur(30px)',
              animation: 'neonAccent 12s ease-in-out infinite',
            }}
          />
          
          {/* Ultra-Glossy Edge with Light Refraction */}
          <div
            className="absolute inset-0"
            style={{
              borderRadius: '50%',
              border: '1.5px solid rgba(255, 255, 255, 0.25)',
              filter: 'blur(2px)',
              animation: 'glossyEdge 6s ease-in-out infinite',
              boxShadow: '0 0 50px rgba(205, 0, 0, 0.6), 0 0 30px rgba(255, 255, 255, 0.3), inset 0 0 40px rgba(255, 255, 255, 0.2)',
            }}
          />
          
          {/* Surface Tension Shimmer */}
          <div
            className="absolute"
            style={{
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '320px',
              height: '320px',
              borderRadius: '50%',
              background: 'conic-gradient(from 0deg at 50% 50%, transparent 0deg, rgba(255, 255, 255, 0.08) 90deg, transparent 180deg, rgba(255, 255, 255, 0.08) 270deg, transparent 360deg)',
              filter: 'blur(15px)',
              animation: 'surfaceShimmer 15s linear infinite',
              mixBlendMode: 'overlay',
            }}
          />
          
          {/* PREMIUM NEON RED HALO - Sharp Outer Ring */}
          <div
            className="absolute"
            style={{
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '460px',
              height: '460px',
              borderRadius: '50%',
              border: '2px solid rgba(255, 0, 0, 0.6)',
              filter: 'blur(1px)',
              animation: 'neonHaloPulse 5s ease-in-out infinite',
              boxShadow: `
                0 0 20px rgba(255, 0, 0, 0.8),
                0 0 40px rgba(220, 20, 60, 0.6),
                0 0 60px rgba(205, 0, 0, 0.4),
                inset 0 0 20px rgba(255, 0, 0, 0.3)
              `,
            }}
          />
          
          {/* NEON RED HALO - Secondary Glow Layer */}
          <div
            className="absolute"
            style={{
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '470px',
              height: '470px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, transparent 48%, rgba(255, 0, 0, 0.15) 49%, rgba(220, 20, 60, 0.25) 50%, rgba(205, 0, 0, 0.1) 52%, transparent 54%)',
              filter: 'blur(3px)',
              animation: 'neonHaloPulse 5s ease-in-out infinite 0.5s',
            }}
          />
          
          {/* METALLIC SPECULAR HIGHLIGHTS - Top Right */}
          <div
            className="absolute"
            style={{
              top: '12%',
              right: '18%',
              width: '50px',
              height: '50px',
              background: 'radial-gradient(circle, rgba(255, 255, 255, 0.9) 0%, rgba(192, 192, 192, 0.6) 30%, transparent 70%)',
              borderRadius: '50%',
              filter: 'blur(4px)',
              animation: 'metallicSpecular1 7s ease-in-out infinite',
              mixBlendMode: 'overlay',
            }}
          />
          
          {/* METALLIC SPECULAR HIGHLIGHTS - Left Edge */}
          <div
            className="absolute"
            style={{
              top: '40%',
              left: '8%',
              width: '35px',
              height: '35px',
              background: 'radial-gradient(circle, rgba(192, 192, 192, 0.8) 0%, rgba(255, 255, 255, 0.5) 40%, transparent 75%)',
              borderRadius: '50%',
              filter: 'blur(3px)',
              animation: 'metallicSpecular2 8s ease-in-out infinite',
              mixBlendMode: 'screen',
            }}
          />
          
          {/* METALLIC SPECULAR HIGHLIGHTS - Bottom Right Arc */}
          <div
            className="absolute"
            style={{
              bottom: '15%',
              right: '12%',
              width: '60px',
              height: '30px',
              background: 'linear-gradient(90deg, transparent 0%, rgba(192, 192, 192, 0.7) 50%, rgba(255, 255, 255, 0.5) 70%, transparent 100%)',
              borderRadius: '50%',
              filter: 'blur(5px)',
              animation: 'metallicSpecular3 9s ease-in-out infinite',
              mixBlendMode: 'overlay',
              transform: 'rotate(-25deg)',
            }}
          />
          
          {/* SHARP NEON RED ACCENT - AMG Style */}
          <div
            className="absolute"
            style={{
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '455px',
              height: '455px',
              borderRadius: '50%',
              border: '1px solid rgba(255, 0, 0, 0.4)',
              filter: 'blur(0.5px)',
              animation: 'sharpNeonEdge 4s ease-in-out infinite',
              boxShadow: `
                0 0 10px rgba(255, 0, 0, 0.9),
                0 0 20px rgba(220, 20, 60, 0.7),
                0 0 30px rgba(205, 0, 0, 0.5)
              `,
            }}
          />
          
          {/* METALLIC CHROME REFLECTION - Top Arc */}
          <div
            className="absolute"
            style={{
              top: '8%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '180px',
              height: '40px',
              background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.15) 20%, rgba(192, 192, 192, 0.35) 50%, rgba(255, 255, 255, 0.15) 80%, transparent 100%)',
              borderRadius: '50%',
              filter: 'blur(8px)',
              animation: 'chromeReflection 10s ease-in-out infinite',
              mixBlendMode: 'overlay',
            }}
          />
          
          {/* Collision Deformation Layer - Squash & Stretch Effect */}
          <div
            className="absolute inset-0"
            style={{
              animation: 'collisionDeform 32s ease-in-out infinite',
            }}
          />
            </div>
          </div>
        </div>
        
        {/* RED NEBULA FOG - Atmospheric Volume Around Orb */}
        <div 
          className="absolute z-[3.5]"
          style={{
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '700px',
            height: '700px',
            pointerEvents: 'none',
          }}
        >
          {/* Primary Nebula Layer */}
          <div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(circle at 50% 50%, rgba(255, 0, 0, 0.09) 0%, rgba(255, 0, 0, 0.06) 30%, rgba(139, 0, 0, 0.04) 50%, transparent 70%)',
              borderRadius: '50%',
              filter: 'blur(120px)',
              animation: 'nebulaFloat1 18s ease-in-out infinite',
              mixBlendMode: 'screen',
            }}
          />
          
          {/* Secondary Nebula Layer - Offset */}
          <div
            className="absolute"
            style={{
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '600px',
              height: '600px',
              background: 'radial-gradient(circle at 40% 35%, rgba(255, 0, 0, 0.08) 0%, rgba(220, 20, 60, 0.05) 35%, transparent 65%)',
              borderRadius: '50%',
              filter: 'blur(100px)',
              animation: 'nebulaFloat2 22s ease-in-out infinite',
              mixBlendMode: 'screen',
            }}
          />
          
          {/* Tertiary Depth Fog */}
          <div
            className="absolute"
            style={{
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '500px',
              height: '500px',
              background: 'radial-gradient(circle at 60% 55%, rgba(255, 40, 40, 0.07) 0%, rgba(205, 0, 0, 0.04) 40%, transparent 70%)',
              borderRadius: '50%',
              filter: 'blur(90px)',
              animation: 'nebulaFloat3 20s ease-in-out infinite',
              mixBlendMode: 'screen',
            }}
          />
        </div>
        
        {/* CINEMATIC LIGHT SWEEP - Glossy Car Hood Reflection */}
        <div 
          className="absolute inset-0 z-[4] overflow-hidden"
          style={{
            pointerEvents: 'none',
          }}
        >
          {/* Primary Light Sweep - Horizontal Movement */}
          <div
            className="absolute top-0 left-0 h-full"
            style={{
              width: '300px',
              background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.05) 50%, transparent 100%)',
              filter: 'blur(40px)',
              animation: 'lightSweep 20s linear infinite',
              transform: 'translateX(-300px) skewX(-15deg)',
              opacity: 0.8,
            }}
          />
          
          {/* Secondary Light Sweep - Offset for Depth */}
          <div
            className="absolute top-0 left-0 h-full"
            style={{
              width: '200px',
              background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.03) 50%, transparent 100%)',
              filter: 'blur(60px)',
              animation: 'lightSweep 20s linear infinite 5s',
              transform: 'translateX(-200px) skewX(-12deg)',
              opacity: 0.6,
            }}
          />
          
          {/* Tertiary Subtle Sweep - Additional Motion Layer */}
          <div
            className="absolute top-0 left-0 h-full"
            style={{
              width: '150px',
              background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.02) 50%, transparent 100%)',
              filter: 'blur(80px)',
              animation: 'lightSweep 20s linear infinite 10s',
              transform: 'translateX(-150px) skewX(-10deg)',
              opacity: 0.4,
            }}
          />
        </div>
        
        {/* Cinematic Shallow Depth of Field - Top Blur */}
        <div 
          className="absolute inset-x-0 top-0 h-56 z-[4]"
          style={{
            background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.4) 50%, transparent 100%)',
            filter: 'blur(15px)',
          }}
        />
        
        {/* Cinematic Shallow Depth of Field - Bottom Blur */}
        <div 
          className="absolute inset-x-0 bottom-0 h-56 z-[4]"
          style={{
            background: 'linear-gradient(to top, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.4) 50%, transparent 100%)',
            filter: 'blur(15px)',
          }}
        />
        
        {/* Premium Vignette for Depth */}
        <div 
          className="absolute inset-0 z-[5]"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 0%, transparent 40%, rgba(0, 0, 0, 0.4) 80%, rgba(0, 0, 0, 0.7) 100%)',
            pointerEvents: 'none',
          }}
        />
        
        {/* METALLIC PARTICLE SPARKS - Ultra Subtle Apple/Tesla Detail */}
        <div 
          className="absolute inset-0 z-[6] overflow-hidden"
          style={{
            pointerEvents: 'none',
          }}
        >
          {/* Particle Group 1 - Top Left Quadrant */}
          <div
            className="absolute"
            style={{
              top: '15%',
              left: '10%',
              width: '2px',
              height: '2px',
              background: 'radial-gradient(circle, rgba(255, 255, 255, 0.8) 0%, transparent 100%)',
              borderRadius: '50%',
              filter: 'blur(0.5px)',
              animation: 'particleFloat1 25s ease-in-out infinite',
              opacity: 0.008,
              boxShadow: '0 0 4px rgba(255, 255, 255, 0.3)',
            }}
          />
          <div
            className="absolute"
            style={{
              top: '25%',
              left: '20%',
              width: '1.5px',
              height: '1.5px',
              background: 'radial-gradient(circle, rgba(192, 192, 192, 0.9) 0%, transparent 100%)',
              borderRadius: '50%',
              filter: 'blur(0.5px)',
              animation: 'particleFloat2 30s ease-in-out infinite',
              opacity: 0.006,
              boxShadow: '0 0 3px rgba(192, 192, 192, 0.2)',
            }}
          />
          
          {/* Particle Group 2 - Top Right Quadrant */}
          <div
            className="absolute"
            style={{
              top: '20%',
              right: '15%',
              width: '2px',
              height: '2px',
              background: 'radial-gradient(circle, rgba(255, 255, 255, 0.7) 0%, transparent 100%)',
              borderRadius: '50%',
              filter: 'blur(0.5px)',
              animation: 'particleFloat3 28s ease-in-out infinite',
              opacity: 0.007,
              boxShadow: '0 0 4px rgba(255, 255, 255, 0.25)',
            }}
          />
          <div
            className="absolute"
            style={{
              top: '35%',
              right: '25%',
              width: '1px',
              height: '1px',
              background: 'radial-gradient(circle, rgba(255, 255, 255, 0.6) 0%, transparent 100%)',
              borderRadius: '50%',
              filter: 'blur(0.3px)',
              animation: 'particleFloat4 35s ease-in-out infinite',
              opacity: 0.005,
              boxShadow: '0 0 2px rgba(255, 255, 255, 0.2)',
            }}
          />
          
          {/* Particle Group 3 - Center Area */}
          <div
            className="absolute"
            style={{
              top: '45%',
              left: '30%',
              width: '1.5px',
              height: '1.5px',
              background: 'radial-gradient(circle, rgba(220, 220, 220, 0.8) 0%, transparent 100%)',
              borderRadius: '50%',
              filter: 'blur(0.5px)',
              animation: 'particleFloat5 32s ease-in-out infinite',
              opacity: 0.006,
              boxShadow: '0 0 3px rgba(220, 220, 220, 0.2)',
            }}
          />
          <div
            className="absolute"
            style={{
              top: '50%',
              right: '35%',
              width: '2px',
              height: '2px',
              background: 'radial-gradient(circle, rgba(255, 255, 255, 0.75) 0%, transparent 100%)',
              borderRadius: '50%',
              filter: 'blur(0.5px)',
              animation: 'particleFloat6 27s ease-in-out infinite',
              opacity: 0.007,
              boxShadow: '0 0 4px rgba(255, 255, 255, 0.25)',
            }}
          />
          
          {/* Particle Group 4 - Bottom Left Quadrant */}
          <div
            className="absolute"
            style={{
              bottom: '30%',
              left: '18%',
              width: '1px',
              height: '1px',
              background: 'radial-gradient(circle, rgba(192, 192, 192, 0.7) 0%, transparent 100%)',
              borderRadius: '50%',
              filter: 'blur(0.3px)',
              animation: 'particleFloat7 33s ease-in-out infinite',
              opacity: 0.005,
              boxShadow: '0 0 2px rgba(192, 192, 192, 0.2)',
            }}
          />
          <div
            className="absolute"
            style={{
              bottom: '25%',
              left: '28%',
              width: '1.5px',
              height: '1.5px',
              background: 'radial-gradient(circle, rgba(255, 255, 255, 0.65) 0%, transparent 100%)',
              borderRadius: '50%',
              filter: 'blur(0.5px)',
              animation: 'particleFloat8 29s ease-in-out infinite',
              opacity: 0.006,
              boxShadow: '0 0 3px rgba(255, 255, 255, 0.2)',
            }}
          />
          
          {/* Particle Group 5 - Bottom Right Quadrant */}
          <div
            className="absolute"
            style={{
              bottom: '28%',
              right: '20%',
              width: '2px',
              height: '2px',
              background: 'radial-gradient(circle, rgba(255, 255, 255, 0.8) 0%, transparent 100%)',
              borderRadius: '50%',
              filter: 'blur(0.5px)',
              animation: 'particleFloat9 31s ease-in-out infinite',
              opacity: 0.007,
              boxShadow: '0 0 4px rgba(255, 255, 255, 0.3)',
            }}
          />
          <div
            className="absolute"
            style={{
              bottom: '35%',
              right: '12%',
              width: '1px',
              height: '1px',
              background: 'radial-gradient(circle, rgba(220, 220, 220, 0.6) 0%, transparent 100%)',
              borderRadius: '50%',
              filter: 'blur(0.3px)',
              animation: 'particleFloat10 36s ease-in-out infinite',
              opacity: 0.005,
              boxShadow: '0 0 2px rgba(220, 220, 220, 0.15)',
            }}
          />
        </div>
        
        {/* Content */}
        <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-4xl relative z-[10] flex flex-col justify-center items-center text-center">
          <h1 
            className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-3"
            style={{
              animation: 'fadeInUp 0.8s ease-out forwards',
              opacity: 0,
              letterSpacing: '-0.02em'
            }}
          >
            Get In Touch
          </h1>
          
          {/* White Line Under Title */}
          <div 
            className="w-32 h-1 bg-white mb-6"
            style={{
              animation: 'fadeInUp 0.8s ease-out 0.2s forwards',
              opacity: 0,
            }}
          />
          
          <p 
            className="text-base sm:text-lg text-gray-300 max-w-2xl leading-relaxed"
            style={{ 
              animation: 'fadeInUp 0.8s ease-out 0.4s forwards',
              opacity: 0,
              fontWeight: '300'
            }}
          >
            Have questions about our services? We're here to help.
          </p>
          <p 
            className="text-base sm:text-lg text-gray-300 max-w-2xl mt-2"
            style={{ 
              animation: 'fadeInUp 0.8s ease-out 0.5s forwards',
              opacity: 0,
              fontWeight: '300'
            }}
          >
            Reach out to us, and our team will get back to you as soon as possible.
          </p>
        </div>
        
        {/* CSS Keyframes */}
        <style>{`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes iconBounce {
            0%, 100% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.1);
            }
          }
          
          @keyframes liquidBulbMorph {
            0%, 100% {
              border-radius: 50% 48% 52% 50%;
              transform: scale(1) rotate(0deg);
            }
            20% {
              border-radius: 48% 52% 50% 48%;
              transform: scale(1.04) rotate(1.5deg);
            }
            40% {
              border-radius: 52% 50% 48% 52%;
              transform: scale(0.97) rotate(-1deg);
            }
            60% {
              border-radius: 50% 48% 52% 50%;
              transform: scale(1.02) rotate(0.8deg);
            }
            80% {
              border-radius: 48% 52% 50% 48%;
              transform: scale(0.99) rotate(-0.5deg);
            }
          }
          
          @keyframes liquidWobble {
            0%, 100% {
              border-radius: 50%;
              transform: translate(-50%, -50%) scale(1);
            }
            25% {
              border-radius: 48% 52% 50% 48%;
              transform: translate(-50%, -50%) scale(1.06) translateY(-8px);
            }
            50% {
              border-radius: 52% 48% 50% 52%;
              transform: translate(-50%, -50%) scale(0.96) translateY(6px);
            }
            75% {
              border-radius: 50% 48% 52% 50%;
              transform: translate(-50%, -50%) scale(1.03) translateY(-4px);
            }
          }
          
          @keyframes gelBreathe {
            0%, 100% {
              transform: translate(-50%, -50%) scale(1);
              opacity: 0.85;
            }
            33% {
              transform: translate(-50%, -50%) scale(1.08);
              opacity: 1;
            }
            66% {
              transform: translate(-50%, -50%) scale(0.94);
              opacity: 0.9;
            }
          }
          
          @keyframes iridescentShift {
            0%, 100% {
              transform: translate(0, 0);
              opacity: 0.9;
            }
            25% {
              transform: translate(18px, -12px);
              opacity: 1;
            }
            50% {
              transform: translate(-10px, 8px);
              opacity: 0.85;
            }
            75% {
              transform: translate(8px, -6px);
              opacity: 0.95;
            }
          }
          
          @keyframes secondaryRefraction {
            0%, 100% {
              transform: translate(0, 0) scale(1);
              opacity: 0.7;
            }
            50% {
              transform: translate(-15px, 12px) scale(1.15);
              opacity: 1;
            }
          }
          
          @keyframes crimsonPulse {
            0%, 100% {
              transform: scale(1);
              opacity: 0.8;
              box-shadow: 0 0 40px rgba(205, 0, 0, 0.4);
            }
            50% {
              transform: scale(1.12);
              opacity: 1;
              box-shadow: 0 0 60px rgba(205, 0, 0, 0.6), 0 0 100px rgba(220, 20, 60, 0.4);
            }
          }
          
          @keyframes neonAccent {
            0%, 100% {
              transform: scale(1) rotate(0deg);
              opacity: 0.6;
            }
            33% {
              transform: scale(1.1) rotate(5deg);
              opacity: 0.9;
            }
            66% {
              transform: scale(0.95) rotate(-3deg);
              opacity: 0.7;
            }
          }
          
          @keyframes glossyEdge {
            0%, 100% {
              box-shadow: 0 0 50px rgba(205, 0, 0, 0.6), 0 0 30px rgba(255, 255, 255, 0.3), inset 0 0 40px rgba(255, 255, 255, 0.2);
              opacity: 0.85;
            }
            50% {
              box-shadow: 0 0 70px rgba(205, 0, 0, 0.8), 0 0 45px rgba(255, 255, 255, 0.5), inset 0 0 55px rgba(255, 255, 255, 0.35);
              opacity: 1;
            }
          }
          
          @keyframes surfaceShimmer {
            0% {
              transform: translate(-50%, -50%) rotate(0deg);
            }
            100% {
              transform: translate(-50%, -50%) rotate(360deg);
            }
          }
          
          @keyframes neonHaloPulse {
            0%, 100% {
              opacity: 0.8;
              box-shadow: 
                0 0 20px rgba(255, 0, 0, 0.8),
                0 0 40px rgba(220, 20, 60, 0.6),
                0 0 60px rgba(205, 0, 0, 0.4),
                inset 0 0 20px rgba(255, 0, 0, 0.3);
            }
            50% {
              opacity: 1;
              box-shadow: 
                0 0 30px rgba(255, 0, 0, 1),
                0 0 60px rgba(220, 20, 60, 0.8),
                0 0 90px rgba(205, 0, 0, 0.6),
                0 0 120px rgba(139, 0, 0, 0.4),
                inset 0 0 30px rgba(255, 0, 0, 0.5);
            }
          }
          
          @keyframes sharpNeonEdge {
            0%, 100% {
              opacity: 0.7;
              box-shadow: 
                0 0 10px rgba(255, 0, 0, 0.9),
                0 0 20px rgba(220, 20, 60, 0.7),
                0 0 30px rgba(205, 0, 0, 0.5);
            }
            50% {
              opacity: 1;
              box-shadow: 
                0 0 15px rgba(255, 0, 0, 1),
                0 0 30px rgba(220, 20, 60, 0.9),
                0 0 45px rgba(205, 0, 0, 0.7),
                0 0 60px rgba(139, 0, 0, 0.5);
            }
          }
          
          @keyframes metallicSpecular1 {
            0%, 100% {
              opacity: 0.6;
              transform: translate(0, 0) scale(1);
            }
            50% {
              opacity: 1;
              transform: translate(5px, -5px) scale(1.2);
            }
          }
          
          @keyframes metallicSpecular2 {
            0%, 100% {
              opacity: 0.5;
              transform: translate(0, 0) scale(1);
            }
            50% {
              opacity: 0.9;
              transform: translate(-3px, 3px) scale(1.15);
            }
          }
          
          @keyframes metallicSpecular3 {
            0%, 100% {
              opacity: 0.4;
              transform: rotate(-25deg) scale(1);
            }
            50% {
              opacity: 0.8;
              transform: rotate(-20deg) scale(1.1);
            }
          }
          
          @keyframes chromeReflection {
            0%, 100% {
              opacity: 0.5;
              transform: translateX(-50%) scaleX(1);
            }
            50% {
              opacity: 0.8;
              transform: translateX(-50%) scaleX(1.1);
            }
          }
          
          @keyframes metallicPulse {
            0%, 100% {
              opacity: 0.4;
              transform: translate(-50%, -50%) scale(1);
            }
            33% {
              opacity: 0.5;
              transform: translate(-50%, -50%) scale(1.05);
            }
            66% {
              opacity: 0.35;
              transform: translate(-50%, -50%) scale(0.98);
            }
          }
          
          @keyframes metallicShift {
            0%, 100% {
              opacity: 0.35;
              transform: translate(-50%, -50%) scale(1) rotate(0deg);
            }
            50% {
              opacity: 0.45;
              transform: translate(-50%, -50%) scale(1.08) rotate(5deg);
            }
          }
          
          @keyframes metallicGlow {
            0%, 100% {
              opacity: 0.25;
              transform: translate(-50%, -50%) scale(1);
              filter: blur(80px) brightness(1);
            }
            50% {
              opacity: 0.4;
              transform: translate(-50%, -50%) scale(1.1);
              filter: blur(90px) brightness(1.2);
            }
          }
          
          @keyframes depthLayer {
            0%, 100% {
              opacity: 0.3;
              transform: translate(-50%, -50%) scale(1);
            }
            50% {
              opacity: 0.4;
              transform: translate(-50%, -50%) scale(1.06);
            }
          }
          
          @keyframes lightSweep {
            0% {
              transform: translateX(-300px) skewX(-15deg);
            }
            100% {
              transform: translateX(calc(100vw + 300px)) skewX(-15deg);
            }
          }
          
          @keyframes particleFloat1 {
            0%, 100% {
              transform: translate(0, 0);
              opacity: 0.008;
            }
            50% {
              transform: translate(15px, -20px);
              opacity: 0.010;
            }
          }
          
          @keyframes particleFloat2 {
            0%, 100% {
              transform: translate(0, 0);
              opacity: 0.006;
            }
            50% {
              transform: translate(-12px, 18px);
              opacity: 0.009;
            }
          }
          
          @keyframes particleFloat3 {
            0%, 100% {
              transform: translate(0, 0);
              opacity: 0.007;
            }
            50% {
              transform: translate(-18px, -15px);
              opacity: 0.010;
            }
          }
          
          @keyframes particleFloat4 {
            0%, 100% {
              transform: translate(0, 0);
              opacity: 0.005;
            }
            50% {
              transform: translate(10px, 22px);
              opacity: 0.008;
            }
          }
          
          @keyframes particleFloat5 {
            0%, 100% {
              transform: translate(0, 0);
              opacity: 0.006;
            }
            50% {
              transform: translate(20px, -12px);
              opacity: 0.009;
            }
          }
          
          @keyframes particleFloat6 {
            0%, 100% {
              transform: translate(0, 0);
              opacity: 0.007;
            }
            50% {
              transform: translate(-15px, 16px);
              opacity: 0.010;
            }
          }
          
          @keyframes particleFloat7 {
            0%, 100% {
              transform: translate(0, 0);
              opacity: 0.005;
            }
            50% {
              transform: translate(14px, -18px);
              opacity: 0.008;
            }
          }
          
          @keyframes particleFloat8 {
            0%, 100% {
              transform: translate(0, 0);
              opacity: 0.006;
            }
            50% {
              transform: translate(-16px, -14px);
              opacity: 0.009;
            }
          }
          
          @keyframes particleFloat9 {
            0%, 100% {
              transform: translate(0, 0);
              opacity: 0.007;
            }
            50% {
              transform: translate(18px, 20px);
              opacity: 0.010;
            }
          }
          
          @keyframes particleFloat10 {
            0%, 100% {
              transform: translate(0, 0);
              opacity: 0.005;
            }
            50% {
              transform: translate(-10px, -16px);
              opacity: 0.007;
            }
          }
          
          @keyframes nebulaFloat1 {
            0%, 100% {
              transform: translate(-50%, -50%) scale(1);
              opacity: 0.8;
            }
            50% {
              transform: translate(-50%, -50%) scale(1.1) rotate(5deg);
              opacity: 1;
            }
          }
          
          @keyframes nebulaFloat2 {
            0%, 100% {
              transform: translate(-50%, -50%) scale(1);
              opacity: 0.7;
            }
            50% {
              transform: translate(-50%, -50%) scale(1.15) rotate(-3deg);
              opacity: 0.9;
            }
          }
          
          @keyframes nebulaFloat3 {
            0%, 100% {
              transform: translate(-50%, -50%) scale(1);
              opacity: 0.75;
            }
            50% {
              transform: translate(-50%, -50%) scale(1.12) rotate(4deg);
              opacity: 0.95;
            }
          }
          
          /* Physics-Based Floating with Collision Detection & Rebounds */
          @keyframes physicsFloat {
            /* Start: Center, Drift Right */
            0% {
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
            }
            
            /* Move to Right Wall - Approach */
            8% {
              top: 45%;
              left: 62%;
              transform: translate(-50%, -50%);
            }
            
            /* Collision with Right Wall - Deformation */
            10% {
              top: 44%;
              left: 64%;
              transform: translate(-50%, -50%) scaleX(0.85) scaleY(1.12);
            }
            
            /* Rebound from Right Wall */
            12% {
              top: 43%;
              left: 61%;
              transform: translate(-50%, -50%) scaleX(1.05) scaleY(0.97);
            }
            
            /* Drift Toward Top Left */
            20% {
              top: 28%;
              left: 38%;
              transform: translate(-50%, -50%);
            }
            
            /* Collision with Top Wall - Squash */
            23% {
              top: 24%;
              left: 36%;
              transform: translate(-50%, -50%) scaleX(1.14) scaleY(0.82);
            }
            
            /* Rebound from Top */
            26% {
              top: 30%;
              left: 35%;
              transform: translate(-50%, -50%) scaleX(0.96) scaleY(1.06);
            }
            
            /* Drift Toward Left Wall */
            35% {
              top: 55%;
              left: 22%;
              transform: translate(-50%, -50%);
            }
            
            /* Collision with Left Wall */
            38% {
              top: 56%;
              left: 19%;
              transform: translate(-50%, -50%) scaleX(0.88) scaleY(1.10);
            }
            
            /* Rebound from Left */
            41% {
              top: 57%;
              left: 24%;
              transform: translate(-50%, -50%) scaleX(1.04) scaleY(0.98);
            }
            
            /* Drift Toward Bottom Right */
            52% {
              top: 72%;
              left: 58%;
              transform: translate(-50%, -50%);
            }
            
            /* Collision with Bottom Wall */
            55% {
              top: 76%;
              left: 59%;
              transform: translate(-50%, -50%) scaleX(1.16) scaleY(0.80);
            }
            
            /* Rebound from Bottom */
            58% {
              top: 71%;
              left: 60%;
              transform: translate(-50%, -50%) scaleX(0.94) scaleY(1.08);
            }
            
            /* Drift Back Toward Top Right Corner */
            68% {
              top: 32%;
              left: 65%;
              transform: translate(-50%, -50%);
            }
            
            /* Corner Collision - Top Right */
            71% {
              top: 26%;
              left: 68%;
              transform: translate(-50%, -50%) scaleX(0.86) scaleY(0.86) rotate(-8deg);
            }
            
            /* Rebound from Corner - Dual Direction */
            74% {
              top: 34%;
              left: 62%;
              transform: translate(-50%, -50%) scaleX(1.08) scaleY(1.08) rotate(3deg);
            }
            
            /* Float Toward Center-Left */
            85% {
              top: 50%;
              left: 35%;
              transform: translate(-50%, -50%) rotate(0deg);
            }
            
            /* Gentle Drift Back to Center */
            95% {
              top: 50%;
              left: 48%;
              transform: translate(-50%, -50%);
            }
            
            /* Return to Start Position */
            100% {
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
            }
          }
          
          /* Collision Deformation - Synced with Physics Float */
          @keyframes collisionDeform {
            0%, 8%, 12%, 20%, 26%, 35%, 41%, 52%, 58%, 68%, 74%, 85%, 100% {
              border-radius: 50%;
            }
            
            /* Right Wall Impact */
            10% {
              border-radius: 35% 50% 50% 35%;
            }
            
            /* Top Wall Impact */
            23% {
              border-radius: 45% 45% 55% 55%;
            }
            
            /* Left Wall Impact */
            38% {
              border-radius: 50% 35% 35% 50%;
            }
            
            /* Bottom Wall Impact */
            55% {
              border-radius: 55% 55% 45% 45%;
            }
            
            /* Corner Impact - Asymmetric Deformation */
            71% {
              border-radius: 40% 50% 45% 38%;
            }
          }
          
          .icon-bounce-hover:hover {
            animation: iconBounce 0.6s ease-in-out infinite;
          }
        `}</style>
        
        {/* Minimal Wave Transition */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none" style={{ height: '40px' }}>
          <svg 
            className="relative block w-full" 
            style={{ height: '40px' }}
            viewBox="0 0 1200 120" 
            preserveAspectRatio="none"
          >
            <path 
              d="M0,60 C300,100 900,20 1200,60 L1200,120 L0,120 Z" 
              style={{ fill: '#ffffff' }}
            />
          </svg>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 sm:py-20 md:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-[1400px]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-6 sm:mb-8 md:mb-10 lg:mb-12">
            {/* Contact Information Cards */}
            {/* Phone Card */}
            <Card 
              className="sm:col-span-2 lg:col-span-1 transition-all duration-300 cursor-pointer group border-0 bg-white"
              style={{
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                borderRadius: '14px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.04)';
              }}
            >
              <CardContent className="p-10">
                <div className="flex flex-col items-start">
                  <div 
                    className="w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-105"
                    style={{
                      background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 50%, #c44569 100%)',
                      boxShadow: '0 2px 12px rgba(238, 90, 111, 0.2)'
                    }}
                  >
                    <Phone className="w-6 h-6 text-white" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-bold mt-6 text-gray-900" style={{ fontSize: '18px', letterSpacing: '-0.01em' }}>
                    Phone
                  </h3>
                  <p className="mt-2 text-gray-500" style={{ fontSize: '14px', lineHeight: '1.6' }}>
                    Call us for immediate assistance
                  </p>
                  <div className="space-y-2 mt-6">
                    <a 
                      href="tel:+918249614004" 
                      className="font-semibold block break-all transition-colors hover:underline text-gray-700 hover:text-red-600" 
                      style={{ fontSize: '15px' }}
                    >
                      +91 8249614004
                    </a>
                    <a 
                      href="tel:+919776433334" 
                      className="font-semibold block break-all transition-colors hover:underline text-gray-700 hover:text-red-600" 
                      style={{ fontSize: '15px' }}
                    >
                      +91 9776433334
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Email Card */}
            <Card 
              className="transition-all duration-300 cursor-pointer group border-0 bg-white"
              style={{
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                borderRadius: '14px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.04)';
              }}
            >
              <CardContent className="p-10">
                <div className="flex flex-col items-start">
                  <div 
                    className="w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-105"
                    style={{
                      background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 50%, #c44569 100%)',
                      boxShadow: '0 2px 12px rgba(238, 90, 111, 0.2)'
                    }}
                  >
                    <Mail className="w-6 h-6 text-white" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-bold mt-6 text-gray-900" style={{ fontSize: '18px', letterSpacing: '-0.01em' }}>
                    Email
                  </h3>
                  <p className="mt-2 text-gray-500" style={{ fontSize: '14px', lineHeight: '1.6' }}>
                    Send us an email anytime
                  </p>
                  <a 
                    href="mailto:sales@automex.in" 
                    className="font-semibold break-all transition-colors hover:underline mt-6 text-gray-700 hover:text-red-600" 
                    style={{ fontSize: '15px' }}
                  >
                    sales@automex.in
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Location Card */}
            <Card 
              className="transition-all duration-300 cursor-pointer group border-0 bg-white"
              style={{
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                borderRadius: '14px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.04)';
              }}
            >
              <CardContent className="p-10">
                <div className="flex flex-col items-start">
                  <div 
                    className="w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-105"
                    style={{
                      background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 50%, #c44569 100%)',
                      boxShadow: '0 2px 12px rgba(238, 90, 111, 0.2)'
                    }}
                  >
                    <MapPin className="w-6 h-6 text-white" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-bold mt-6 text-gray-900" style={{ fontSize: '18px', letterSpacing: '-0.01em' }}>
                    Location
                  </h3>
                  <p className="mt-2 text-gray-500" style={{ fontSize: '14px', lineHeight: '1.6' }}>
                    Visit our main office
                  </p>
                  <div className="mt-6">
                    <p className="font-semibold leading-relaxed text-gray-700" style={{ fontSize: '15px' }}>
                      AUTOMEX,<br />
                      Hanspal , Balianta market road<br />
                      Bhubaneswar, Odisha - 752101
                    </p>
                    <p className="mt-3 text-gray-500" style={{ fontSize: '14px' }}>
                      Contact: Tapas Parida
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form and Additional Info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-8 lg:gap-10 xl:gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 text-gray-900" style={{ fontSize: '2rem', letterSpacing: '-0.02em' }}>
                Send Us a Message
              </h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="relative">
                  <label 
                    className={`absolute left-3 transition-all duration-300 pointer-events-none ${
                      focusedField === 'name' || formData.name 
                        ? 'top-1 text-xs text-gray-600' 
                        : 'top-1/2 -translate-y-1/2 text-sm text-gray-400'
                    }`}
                    htmlFor="name"
                  >
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder=""
                      value={formData.name}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('name')}
                      onBlur={() => setFocusedField(null)}
                      required
                      className="w-full pl-10 pr-4 py-3.5 text-base bg-white transition-all duration-300 border"
                      style={{
                        borderWidth: '1px',
                        borderColor: focusedField === 'name' ? '#e5e5e5' : '#e8e8e8',
                        borderRadius: '10px',
                        boxShadow: focusedField === 'name' ? '0 0 0 3px rgba(0, 0, 0, 0.02)' : 'none'
                      }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="relative">
                    <label 
                      className={`absolute left-3 transition-all duration-300 pointer-events-none ${
                        focusedField === 'email' || formData.email 
                          ? 'top-1 text-xs text-gray-600' 
                          : 'top-1/2 -translate-y-1/2 text-sm text-gray-400'
                      }`}
                      htmlFor="email"
                    >
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder=""
                        value={formData.email}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('email')}
                        onBlur={() => setFocusedField(null)}
                        required
                        className="w-full pl-10 pr-4 py-3.5 text-base bg-white transition-all duration-300 border"
                        style={{
                          borderWidth: '1px',
                          borderColor: focusedField === 'email' ? '#e5e5e5' : '#e8e8e8',
                          borderRadius: '10px',
                          boxShadow: focusedField === 'email' ? '0 0 0 3px rgba(0, 0, 0, 0.02)' : 'none'
                        }}
                      />
                    </div>
                  </div>
                  <div className="relative">
                    <label 
                      className={`absolute left-3 transition-all duration-300 pointer-events-none ${
                        focusedField === 'phone' || formData.phone 
                          ? 'top-1 text-xs text-gray-600' 
                          : 'top-1/2 -translate-y-1/2 text-sm text-gray-400'
                      }`}
                      htmlFor="phone"
                    >
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder=""
                        value={formData.phone}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('phone')}
                        onBlur={() => setFocusedField(null)}
                        required
                        className="w-full pl-10 pr-4 py-3.5 text-base bg-white transition-all duration-300 border"
                        style={{
                          borderWidth: '1px',
                          borderColor: focusedField === 'phone' ? '#e5e5e5' : '#e8e8e8',
                          borderRadius: '10px',
                          boxShadow: focusedField === 'phone' ? '0 0 0 3px rgba(0, 0, 0, 0.02)' : 'none'
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <label 
                    className={`absolute left-3 transition-all duration-300 pointer-events-none ${
                      focusedField === 'subject' || formData.subject 
                        ? 'top-1 text-xs text-gray-600' 
                        : 'top-1/2 -translate-y-1/2 text-sm text-gray-400'
                    }`}
                    htmlFor="subject"
                  >
                    Subject *
                  </label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="subject"
                      name="subject"
                      type="text"
                      placeholder=""
                      value={formData.subject}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('subject')}
                      onBlur={() => setFocusedField(null)}
                      required
                      className="w-full pl-10 pr-4 py-3.5 text-base bg-white transition-all duration-300 border"
                      style={{
                        borderWidth: '1px',
                        borderColor: focusedField === 'subject' ? '#e5e5e5' : '#e8e8e8',
                        borderRadius: '10px',
                        boxShadow: focusedField === 'subject' ? '0 0 0 3px rgba(0, 0, 0, 0.02)' : 'none'
                      }}
                    />
                  </div>
                </div>

                <div className="relative">
                  <label 
                    className={`absolute left-3 top-2 transition-all duration-300 pointer-events-none ${
                      focusedField === 'message' || formData.message 
                        ? 'text-xs text-gray-600' 
                        : 'text-sm text-gray-400'
                    }`}
                    htmlFor="message"
                  >
                    Message *
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder=""
                    value={formData.message}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('message')}
                    onBlur={() => setFocusedField(null)}
                    required
                    className="w-full min-h-[150px] text-base bg-white transition-all duration-300 resize-none pt-6 border"
                    style={{
                      borderWidth: '1px',
                      borderColor: focusedField === 'message' ? '#e5e5e5' : '#e8e8e8',
                      borderRadius: '10px',
                      boxShadow: focusedField === 'message' ? '0 0 0 3px rgba(0, 0, 0, 0.02)' : 'none'
                    }}
                  />
                </div>

                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full sm:w-auto text-base px-8 py-6 font-semibold transition-all duration-300 text-white border-0"
                  style={{
                    background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                    borderRadius: '10px',
                    boxShadow: '0 2px 8px rgba(220, 38, 38, 0.2)',
                    letterSpacing: '-0.01em'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(220, 38, 38, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(220, 38, 38, 0.2)';
                  }}
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
              </form>
            </div>

            {/* Additional Information */}
            <div 
              className="p-8 sm:p-10 rounded-2xl"
              style={{
                backgroundColor: '#2a2a2a',
                borderRadius: '12px'
              }}
            >
              <h2 className="text-2xl sm:text-3xl font-bold mb-10 text-white" style={{ fontSize: '2rem', letterSpacing: '-0.02em' }}>
                Why Choose AutoMex?
              </h2>
              
              {/* Three Column Layout */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-10">
                {/* Business Hours */}
                <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                  <div 
                    className="w-14 h-14 rounded-full flex items-center justify-center mb-5 transition-all duration-300 hover:scale-105"
                    style={{
                      background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 50%, #c44569 100%)',
                      boxShadow: '0 2px 12px rgba(238, 90, 111, 0.25)'
                    }}
                  >
                    <Clock className="w-6 h-6 text-white" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-base font-bold mb-3 text-white" style={{ letterSpacing: '-0.01em' }}>
                    Business Hours
                  </h3>
                  <p className="text-sm leading-relaxed text-gray-400">
                    Monday - Saturday:<br />
                    8:00 AM - 8:00 PM<br />
                    <span className="text-xs text-gray-500">Sunday: 9:00 AM - 6:00 PM</span>
                  </p>
                </div>

                {/* Expertise */}
                <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                  <div 
                    className="w-14 h-14 rounded-full flex items-center justify-center mb-5 transition-all duration-300 hover:scale-105"
                    style={{
                      background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 50%, #c44569 100%)',
                      boxShadow: '0 2px 12px rgba(238, 90, 111, 0.25)'
                    }}
                  >
                    <Wrench className="w-6 h-6 text-white" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-base font-bold mb-3 text-white" style={{ letterSpacing: '-0.01em' }}>
                    Expertise
                  </h3>
                  <p className="text-sm leading-relaxed text-gray-400">
                    10+ Years Experience<br />
                    Certified Technicians<br />
                    <span className="text-xs text-gray-500">Premium Tools & Parts</span>
                  </p>
                </div>

                {/* Service Guarantee */}
                <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                  <div 
                    className="w-14 h-14 rounded-full flex items-center justify-center mb-5 transition-all duration-300 hover:scale-105"
                    style={{
                      background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 50%, #c44569 100%)',
                      boxShadow: '0 2px 12px rgba(238, 90, 111, 0.25)'
                    }}
                  >
                    <ShieldCheck className="w-6 h-6 text-white" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-base font-bold mb-3 text-white" style={{ letterSpacing: '-0.01em' }}>
                    Service Guarantee
                  </h3>
                  <p className="text-sm leading-relaxed text-gray-400">
                    100% Genuine Parts<br />
                    Transparent Pricing<br />
                    <span className="text-xs text-gray-500">Quality Assured</span>
                  </p>
                </div>
              </div>

              {/* Services Card */}
              <Card 
                className="bg-white border-0"
                style={{
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                  borderRadius: '12px'
                }}
              >
                <CardContent className="p-8">
                  <h3 className="text-lg font-bold mb-6 text-gray-900" style={{ letterSpacing: '-0.01em' }}>
                    Our Services
                  </h3>
                  <ul className="space-y-3 text-sm text-gray-700">
                    <li className="flex items-center gap-3">
                      <span className="text-red-600 text-base font-bold">✓</span>
                      <span>Premium Car Services</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="text-red-600 text-base font-bold">✓</span>
                      <span>AC Service & Repair</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="text-red-600 text-base font-bold">✓</span>
                      <span>Battery Replacement</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="text-red-600 text-base font-bold">✓</span>
                      <span>Tyres & Wheel Care</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="text-red-600 text-base font-bold">✓</span>
                      <span>Denting & Painting</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="text-red-600 text-base font-bold">✓</span>
                      <span>Car Detailing & Spa</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="text-red-600 text-base font-bold">✓</span>
                      <span>Car Inspections</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Map Section */}
          <div className="mt-6 sm:mt-8 md:mt-10 lg:mt-12 xl:mt-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8 text-center" style={{ fontSize: '2.2rem' }}>Find Us Here</h2>
            <Card
              style={{
                boxShadow: '0 8px 20px rgba(255, 0, 0, 0.1)',
                borderRadius: '20px',
                overflow: 'hidden'
              }}
            >
              <CardContent className="p-0">
                <div className="w-full h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px] bg-gray-200 overflow-hidden" style={{ borderRadius: '20px' }}>
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3742.3449!2d85.8812874!3d20.3131578!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a1909e93ac6dd85%3A0xfde0d57e3d8cd8de!2sForeign%20auto%20service!5e0!3m2!1sen!2sin!4v1732377366"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="AutoMex Location - Foreign Auto Service, Balianta"
                  ></iframe>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
      
      {/* CSS Animations */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        /* Smooth hover effects */
        .hover-glow:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08) !important;
          transition: all 0.3s ease;
        }
        
        /* Input focus styles */
        input:focus,
        textarea:focus {
          outline: none;
        }
      `}</style>
    </div>
  );
};

export default ContactUs;

