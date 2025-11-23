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
      <section className="relative text-white pt-32 pb-12 sm:pt-36 sm:pb-16 md:pt-40 md:pb-20 lg:pt-44 lg:pb-24 overflow-hidden">
        {/* Gradient Background */}
        <div 
          className="absolute inset-0 z-0"
          style={{
            background: 'linear-gradient(180deg, #000000, #1a1a1a)'
          }}
        />
        
        {/* Soft Car Service Background Image Overlay */}
        <div 
          className="absolute inset-0 z-[1]"
          style={{
            backgroundImage: 'url("/images/Landing_page_images/automexfrontpage3.jpg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(4px) brightness(0.6)'
          }}
        />
        
        {/* Black Overlay for Better Contrast */}
        <div 
          className="absolute inset-0 z-[2]"
          style={{
            background: 'rgba(0, 0, 0, 0.45)'
          }}
        />
        
        {/* Content */}
        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-10 max-w-7xl relative z-[3] flex flex-col justify-center min-h-[200px] sm:min-h-[240px] md:min-h-[280px]">
          <div 
            className="flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-8 md:gap-10 mb-6 sm:mb-8 animate-fade-in"
            style={{
              animation: 'fadeInUp 0.8s ease-out forwards',
              opacity: 0
            }}
          >
            <h1 
              className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight relative inline-block pb-4"
              style={{
                textShadow: '0 0 20px rgba(255, 0, 0, 0.5), 0 0 40px rgba(255, 0, 0, 0.3)',
                animation: 'fadeInUp 0.8s ease-out 0.2s forwards',
                opacity: 0
              }}
            >
              Get In Touch
              {/* Custom Accent Underline - More Balanced */}
              <span 
                className="absolute bottom-0 left-1/2 -translate-x-1/2 h-1 w-3/4"
                style={{
                  background: `linear-gradient(to right, transparent, #FF0000 20%, #FF0000 80%, transparent)`,
                  boxShadow: '0 2px 12px rgba(255, 0, 0, 0.5)',
                  filter: 'blur(0.5px)'
                }}
              />
            </h1>
          </div>
          <p 
            className="text-sm sm:text-base md:text-base lg:text-lg xl:text-xl max-w-2xl md:max-w-3xl leading-relaxed" 
            style={{ 
              color: '#F2F2F2',
              animation: 'fadeInUp 0.8s ease-out 0.4s forwards',
              opacity: 0
            }}
          >
            Have questions about our services? We're here to help.<br />
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
          
          .icon-bounce-hover:hover {
            animation: iconBounce 0.6s ease-in-out infinite;
          }
        `}</style>
        
        {/* Curved Wave Transition */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none" style={{ height: '80px' }}>
          <svg 
            className="relative block w-full" 
            style={{ height: '80px' }}
            viewBox="0 0 1200 120" 
            preserveAspectRatio="none"
          >
            <path 
              d="M0,0 C150,100 350,0 600,50 C850,100 1050,0 1200,50 L1200,120 L0,120 Z" 
              style={{ fill: '#ffffff' }}
            />
          </svg>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-6 sm:py-8 md:py-8 lg:py-10 xl:py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-10 max-w-[1400px]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-6 sm:mb-8 md:mb-10 lg:mb-12">
            {/* Contact Information Cards */}
            <Card 
              className="sm:col-span-2 lg:col-span-1 transition-all duration-300 cursor-pointer group border-0"
              style={{
                boxShadow: '0 8px 20px rgba(0, 0, 0, 0.06)',
                borderRadius: '16px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 12px 30px rgba(0, 0, 0, 0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.06)';
              }}
            >
              <CardContent className="p-8 py-10">
                <div className="flex flex-col items-start">
                  <div 
                    className="w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 relative overflow-hidden icon-bounce-hover"
                    style={{
                      background: 'linear-gradient(135deg, #FF4444 0%, #FF0000 40%, #CC0000 100%)',
                      boxShadow: '0 6px 20px rgba(255, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
                    }}
                  >
                    {/* Subtle white reflection overlay */}
                    <div 
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, transparent 50%)'
                      }}
                    />
                    <Phone className="w-8 h-8 text-white relative z-10" style={{ filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))' }} />
                  </div>
                  <h3 className="font-bold mt-5" style={{ fontSize: '20px', color: '#111' }}>Phone</h3>
                  <p className="mt-3.5" style={{ fontSize: '14px', color: '#777' }}>
                    Call us for immediate assistance
                  </p>
                  <div className="space-y-2 mt-5">
                    <a href="tel:+918249614004" className="font-semibold block break-all transition-colors hover:underline" style={{ fontSize: '15px', color: '#FF0000' }}>
                      +91 8249614004
                    </a>
                    <a href="tel:+919776433334" className="font-semibold block break-all transition-colors hover:underline" style={{ fontSize: '15px', color: '#FF0000' }}>
                      +91 9776433334
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card 
              className="transition-all duration-300 cursor-pointer group border-0"
              style={{
                boxShadow: '0 8px 20px rgba(0, 0, 0, 0.06)',
                borderRadius: '16px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 12px 30px rgba(0, 0, 0, 0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.06)';
              }}
            >
              <CardContent className="p-8 py-10">
                <div className="flex flex-col items-start">
                  <div 
                    className="w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 relative overflow-hidden icon-bounce-hover"
                    style={{
                      background: 'linear-gradient(135deg, #FF4444 0%, #FF0000 40%, #CC0000 100%)',
                      boxShadow: '0 6px 20px rgba(255, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
                    }}
                  >
                    {/* Subtle white reflection overlay */}
                    <div 
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, transparent 50%)'
                      }}
                    />
                    <Mail className="w-8 h-8 text-white relative z-10" style={{ filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))' }} />
                  </div>
                  <h3 className="font-bold mt-5" style={{ fontSize: '20px', color: '#111' }}>Email</h3>
                  <p className="mt-3.5" style={{ fontSize: '14px', color: '#777' }}>
                    Send us an email anytime
                  </p>
                  <a href="mailto:sales@automex.in" className="font-semibold break-all transition-colors hover:underline mt-5" style={{ fontSize: '15px', color: '#FF0000' }}>
                    sales@automex.in
                  </a>
                </div>
              </CardContent>
            </Card>

            <Card 
              className="transition-all duration-300 cursor-pointer group border-0"
              style={{
                boxShadow: '0 8px 20px rgba(0, 0, 0, 0.06)',
                borderRadius: '16px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 12px 30px rgba(0, 0, 0, 0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.06)';
              }}
            >
              <CardContent className="p-8 py-10">
                <div className="flex flex-col items-start">
                  <div 
                    className="w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 relative overflow-hidden icon-bounce-hover"
                    style={{
                      background: 'linear-gradient(135deg, #FF4444 0%, #FF0000 40%, #CC0000 100%)',
                      boxShadow: '0 6px 20px rgba(255, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
                    }}
                  >
                    {/* Subtle white reflection overlay */}
                    <div 
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, transparent 50%)'
                      }}
                    />
                    <MapPin className="w-8 h-8 text-white relative z-10" style={{ filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))' }} />
                  </div>
                  <h3 className="font-bold mt-5" style={{ fontSize: '20px', color: '#111' }}>Location</h3>
                  <p className="mt-3.5" style={{ fontSize: '14px', color: '#777' }}>
                    Visit our main office
                  </p>
                  <div className="mt-5">
                    <p className="font-semibold leading-relaxed" style={{ fontSize: '15px', color: '#111' }}>
                      AUTOMEX,<br />
                      Hanspal puri, colony, Balianta road<br />
                      Bhubaneswar, Odisha - 752101
                    </p>
                    <p className="mt-2" style={{ fontSize: '14px', color: '#777' }}>
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
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8" style={{ fontSize: '2.2rem' }}>Send Us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="relative">
                  <label 
                    className={`absolute left-3 transition-all duration-300 pointer-events-none ${
                      focusedField === 'name' || formData.name 
                        ? 'top-1 text-xs text-[#FF0000]' 
                        : 'top-1/2 -translate-y-1/2 text-sm text-gray-400'
                    }`}
                    htmlFor="name"
                  >
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
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
                      className={`w-full pl-10 pr-4 py-3 text-base rounded-xl transition-all duration-300 ${
                        focusedField === 'name' 
                          ? 'border-[#FF0000] ring-2 ring-[#FF0000]/20 bg-white/90' 
                          : 'border-gray-300/50 bg-white/80'
                      }`}
                      style={{
                        borderColor: focusedField === 'name' ? '#FF0000' : 'rgba(0,0,0,0.1)',
                        boxShadow: focusedField === 'name' ? '0 0 10px rgba(255, 45, 45, 0.4)' : '0 2px 8px rgba(0,0,0,0.05)',
                        borderRadius: '20px'
                      }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="relative">
                    <label 
                      className={`absolute left-3 transition-all duration-300 pointer-events-none ${
                        focusedField === 'email' || formData.email 
                          ? 'top-1 text-xs text-[#FF0000]' 
                          : 'top-1/2 -translate-y-1/2 text-sm text-gray-400'
                      }`}
                      htmlFor="email"
                    >
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
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
                        className={`w-full pl-10 pr-4 py-3 text-base rounded-xl transition-all duration-300 ${
                          focusedField === 'email' 
                            ? 'border-[#FF0000] ring-2 ring-[#FF0000]/20 bg-white/90' 
                            : 'border-gray-300/50 bg-white/80'
                        }`}
                        style={{
                          borderColor: focusedField === 'email' ? '#FF0000' : 'rgba(0,0,0,0.1)',
                          boxShadow: focusedField === 'email' ? '0 0 10px rgba(255, 45, 45, 0.4)' : '0 2px 8px rgba(0,0,0,0.05)',
                          borderRadius: '20px'
                        }}
                      />
                    </div>
                  </div>
                  <div className="relative">
                    <label 
                      className={`absolute left-3 transition-all duration-300 pointer-events-none ${
                        focusedField === 'phone' || formData.phone 
                          ? 'top-1 text-xs text-[#FF0000]' 
                          : 'top-1/2 -translate-y-1/2 text-sm text-gray-400'
                      }`}
                      htmlFor="phone"
                    >
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
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
                        className={`w-full pl-10 pr-4 py-3 text-base rounded-xl transition-all duration-300 ${
                          focusedField === 'phone' 
                            ? 'border-[#FF0000] ring-2 ring-[#FF0000]/20 bg-white/90' 
                            : 'border-gray-300/50 bg-white/80'
                        }`}
                        style={{
                          borderColor: focusedField === 'phone' ? '#FF0000' : 'rgba(0,0,0,0.1)',
                          boxShadow: focusedField === 'phone' ? '0 0 10px rgba(255, 45, 45, 0.4)' : '0 2px 8px rgba(0,0,0,0.05)',
                          borderRadius: '20px'
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <label 
                    className={`absolute left-3 transition-all duration-300 pointer-events-none ${
                      focusedField === 'subject' || formData.subject 
                        ? 'top-1 text-xs text-[#FF0000]' 
                        : 'top-1/2 -translate-y-1/2 text-sm text-gray-400'
                    }`}
                    htmlFor="subject"
                  >
                    Subject *
                  </label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
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
                      className={`w-full pl-10 pr-4 py-3 text-base rounded-xl transition-all duration-300 ${
                        focusedField === 'subject' 
                          ? 'border-[#FF0000] ring-2 ring-[#FF0000]/20 bg-white/90' 
                          : 'border-gray-300/50 bg-white/80'
                      }`}
                      style={{
                        borderColor: focusedField === 'subject' ? '#FF0000' : 'rgba(0,0,0,0.1)',
                        boxShadow: focusedField === 'subject' ? '0 0 10px rgba(255, 45, 45, 0.4)' : '0 2px 8px rgba(0,0,0,0.05)',
                        borderRadius: '20px'
                      }}
                    />
                  </div>
                </div>

                <div className="relative">
                  <label 
                    className={`absolute left-3 top-2 transition-all duration-300 pointer-events-none ${
                      focusedField === 'message' || formData.message 
                        ? 'text-xs text-[#FF0000]' 
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
                    className={`w-full min-h-[150px] text-base rounded-xl transition-all duration-300 resize-none pt-6 ${
                      focusedField === 'message' 
                        ? 'border-[#FF0000] ring-2 ring-[#FF0000]/20 bg-white/90' 
                        : 'border-gray-300/50 bg-white/80'
                    }`}
                    style={{
                      borderColor: focusedField === 'message' ? '#FF0000' : 'rgba(0,0,0,0.1)',
                      boxShadow: focusedField === 'message' ? '0 0 10px rgba(255, 45, 45, 0.4)' : '0 2px 8px rgba(0,0,0,0.05)',
                      borderRadius: '20px'
                    }}
                  />
                </div>

                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full sm:w-auto text-base sm:text-lg px-8 py-6 font-bold rounded-xl transition-all duration-300 hover:shadow-xl hover:scale-105 text-white"
                  style={{
                    background: 'linear-gradient(90deg, #FF0000, #CC0000)',
                    borderRadius: '20px',
                    boxShadow: '0 4px 15px rgba(255, 0, 0, 0.4)'
                  }}
                >
                  <Send className="w-5 h-5 mr-2" />
                  Send Message
                </Button>
              </form>
            </div>

            {/* Additional Information */}
            <div 
              className="p-6 sm:p-8 rounded-2xl"
              style={{
                backgroundColor: '#121212',
                borderRadius: '20px'
              }}
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8" style={{ fontSize: '2.2rem' }}>Why Choose AutoMex?</h2>
              
              {/* Three Column Layout */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 mb-8">
                {/* Business Hours */}
                <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                  <div 
                    className="w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-transform duration-300 hover:scale-110"
                    style={{
                      background: 'linear-gradient(135deg, #FF0000 0%, #FF0000 50%, #C0C0C0 100%)',
                      boxShadow: '0 4px 15px rgba(255, 0, 0, 0.4)',
                      animation: 'redPulse 3s ease-in-out infinite'
                    }}
                  >
                    <Clock className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">Business Hours</h3>
                  <p className="text-sm" style={{ color: '#888' }}>
                    Monday - Saturday:<br />
                    8:00 AM - 8:00 PM<br />
                    <span className="text-xs">Sunday: 9:00 AM - 6:00 PM</span>
                  </p>
                </div>

                {/* Expertise */}
                <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                  <div 
                    className="w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-transform duration-300 hover:scale-110"
                    style={{
                      background: 'linear-gradient(135deg, #FF0000 0%, #FF0000 50%, #C0C0C0 100%)',
                      boxShadow: '0 4px 15px rgba(255, 0, 0, 0.4)',
                      animation: 'redPulse 3s ease-in-out infinite',
                      animationDelay: '0.5s'
                    }}
                  >
                    <Wrench className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">Expertise</h3>
                  <p className="text-sm" style={{ color: '#888' }}>
                    10+ Years Experience<br />
                    Certified Technicians<br />
                    <span className="text-xs">Premium Tools & Parts</span>
                  </p>
                </div>

                {/* Service Guarantee */}
                <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                  <div 
                    className="w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-transform duration-300 hover:scale-110"
                    style={{
                      background: 'linear-gradient(135deg, #FF0000 0%, #FF0000 50%, #C0C0C0 100%)',
                      boxShadow: '0 4px 15px rgba(255, 0, 0, 0.4)',
                      animation: 'redPulse 3s ease-in-out infinite',
                      animationDelay: '1s'
                    }}
                  >
                    <ShieldCheck className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">Service Guarantee</h3>
                  <p className="text-sm" style={{ color: '#888' }}>
                    100% Genuine Parts<br />
                    Transparent Pricing<br />
                    <span className="text-xs">Quality Assured</span>
                  </p>
                </div>
              </div>

              {/* Services Card */}
              <Card 
                className="mt-8"
                style={{
                  boxShadow: '0 8px 20px rgba(255, 0, 0, 0.1)',
                  borderRadius: '20px'
                }}
              >
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4">Our Services</h3>
                  <ul className="space-y-2 text-sm" style={{ color: '#888' }}>
                    <li className="flex items-center gap-2">
                      <span className="text-[#FF0000] text-lg">✓</span>
                      <span>Premium Car Services</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-[#FF0000] text-lg">✓</span>
                      <span>AC Service & Repair</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-[#FF0000] text-lg">✓</span>
                      <span>Battery Replacement</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-[#FF0000] text-lg">✓</span>
                      <span>Tyres & Wheel Care</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-[#FF0000] text-lg">✓</span>
                      <span>Denting & Painting</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-[#FF0000] text-lg">✓</span>
                      <span>Car Detailing & Spa</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-[#FF0000] text-lg">✓</span>
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
        @keyframes redPulse {
          0%, 100% {
            box-shadow: 0 4px 15px rgba(255, 0, 0, 0.4);
          }
          50% {
            box-shadow: 0 4px 25px rgba(255, 0, 0, 0.7), 0 0 30px rgba(255, 0, 0, 0.3);
          }
        }
        
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
        
        /* Smooth hover glow effects */
        .hover-glow:hover {
          box-shadow: 0 8px 25px rgba(255, 45, 45, 0.3) !important;
          transition: all 0.3s ease;
        }
        
        /* Input focus glow */
        input:focus,
        textarea:focus {
          outline: none;
          box-shadow: 0 0 0 3px rgba(255, 45, 45, 0.1);
        }
      `}</style>
    </div>
  );
};

export default ContactUs;

