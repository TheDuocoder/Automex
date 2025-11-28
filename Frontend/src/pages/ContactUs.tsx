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
        {/* Gradient Background */}
        <div 
          className="absolute inset-0 z-0"
          style={{
            background: 'linear-gradient(180deg, #0a0a0a, #1a1a1a)'
          }}
        />
        
        {/* Soft Car Service Background Image Overlay */}
        <div 
          className="absolute inset-0 z-[1]"
          style={{
            backgroundImage: 'url("/images/Landing_page_images/automexfrontpage3.jpg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(5px) brightness(0.4)'
          }}
        />
        
        {/* Subtle Dark Overlay */}
        <div 
          className="absolute inset-0 z-[2]"
          style={{
            background: 'rgba(0, 0, 0, 0.6)'
          }}
        />
        
        {/* Content */}
        <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-4xl relative z-[3] flex flex-col justify-center items-center text-center">
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
          
          {/* Minimal Red Accent Line */}
          <div 
            className="h-0.5 w-20 mb-6"
            style={{
              background: '#FF0000',
              animation: 'fadeInUp 0.8s ease-out 0.2s forwards',
              opacity: 0
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
                      Hanspal puri, colony, Balianta road<br />
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

