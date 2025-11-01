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
      <section className="relative text-white pt-24 pb-6 sm:pt-28 sm:pb-8 md:pt-32 md:pb-8 lg:pt-36 lg:pb-10 overflow-hidden">
        {/* Gradient Background */}
        <div 
          className="absolute inset-0 z-0"
          style={{
            background: 'linear-gradient(180deg, #000000, #1a1a1a)'
          }}
        />
        
        {/* Soft Car Service Background Image Overlay */}
        <div 
          className="absolute inset-0 z-[1] opacity-30"
          style={{
            backgroundImage: 'url("/images/automexfrontpage3.jpg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(8px) brightness(0.4)'
          }}
        />
        
        {/* Content */}
        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-10 max-w-7xl relative z-[2]">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 md:gap-6 mb-3 sm:mb-4 md:mb-5">
            <h1 
              className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tight order-2 sm:order-1 relative inline-block pb-3"
              style={{
                textShadow: '0 0 20px rgba(255, 0, 0, 0.5), 0 0 40px rgba(255, 0, 0, 0.3)'
              }}
            >
              Get In Touch
              {/* Red Accent Underline */}
              <span 
                className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent"
                style={{
                  boxShadow: '0 2px 8px rgba(255, 0, 0, 0.6)'
                }}
              />
            </h1>
            <Button
              variant="outline"
              className="bg-white/10 backdrop-blur-sm text-white border-white/30 hover:bg-white hover:text-black hover:border-white shadow-lg transition-all duration-300 font-semibold text-xs sm:text-sm px-3 sm:px-4 py-2 whitespace-nowrap order-1 sm:order-2 self-end sm:self-auto flex-shrink-0"
              onClick={() => navigate("/")}
            >
              <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              Back to Home
            </Button>
          </div>
          <p className="text-xs sm:text-sm md:text-sm lg:text-base xl:text-lg max-w-2xl md:max-w-3xl leading-relaxed" style={{ color: '#F2F2F2' }}>
            Have questions about our services? We're here to help!<br className="hidden sm:block" />
            <span className="sm:hidden"> </span>Reach out to us and we'll respond as soon as possible.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-6 sm:py-8 md:py-8 lg:py-10 xl:py-12">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-10 max-w-[1400px]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-6 sm:mb-8 md:mb-10 lg:mb-12">
            {/* Contact Information Cards */}
            <Card 
              className="sm:col-span-2 lg:col-span-1 transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
              style={{
                boxShadow: '0 8px 20px rgba(255, 0, 0, 0.1)',
                borderRadius: '20px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 10px 25px rgba(255, 0, 0, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(255, 0, 0, 0.1)';
              }}
            >
              <CardContent className="p-8">
                <div 
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                  style={{
                    background: 'linear-gradient(135deg, #FF2D2D 0%, #B30000 50%, #C0C0C0 100%)',
                    boxShadow: '0 4px 15px rgba(255, 45, 45, 0.3)'
                  }}
                >
                  <Phone className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-2" style={{ fontSize: '1.25rem' }}>Phone</h3>
                <p className="mb-4 text-sm" style={{ color: '#888' }}>
                  Call us for immediate assistance
                </p>
                <div className="space-y-2">
                  <a href="tel:+918249614004" className="text-[#FF2D2D] hover:underline font-semibold text-sm block break-all transition-colors hover:text-[#B30000]">
                    +91 8249614004
                  </a>
                  <a href="tel:+919776433334" className="text-[#FF2D2D] hover:underline font-semibold text-sm block break-all transition-colors hover:text-[#B30000]">
                    +91 9776433334
                  </a>
                </div>
              </CardContent>
            </Card>

            <Card 
              className="transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
              style={{
                boxShadow: '0 8px 20px rgba(255, 0, 0, 0.1)',
                borderRadius: '20px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 10px 25px rgba(255, 0, 0, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(255, 0, 0, 0.1)';
              }}
            >
              <CardContent className="p-8">
                <div 
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                  style={{
                    background: 'linear-gradient(135deg, #FF2D2D 0%, #B30000 50%, #C0C0C0 100%)',
                    boxShadow: '0 4px 15px rgba(255, 45, 45, 0.3)'
                  }}
                >
                  <Mail className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-2" style={{ fontSize: '1.25rem' }}>Email</h3>
                <p className="mb-4 text-sm" style={{ color: '#888' }}>
                  Send us an email anytime
                </p>
                <a href="mailto:sales@automex.in" className="text-[#FF2D2D] hover:underline font-semibold text-sm break-all transition-colors hover:text-[#B30000]">
                  sales@automex.in
                </a>
              </CardContent>
            </Card>

            <Card 
              className="transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
              style={{
                boxShadow: '0 8px 20px rgba(255, 0, 0, 0.1)',
                borderRadius: '20px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 10px 25px rgba(255, 0, 0, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(255, 0, 0, 0.1)';
              }}
            >
              <CardContent className="p-8">
                <div 
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                  style={{
                    background: 'linear-gradient(135deg, #FF2D2D 0%, #B30000 50%, #C0C0C0 100%)',
                    boxShadow: '0 4px 15px rgba(255, 45, 45, 0.3)'
                  }}
                >
                  <MapPin className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-2" style={{ fontSize: '1.25rem' }}>Location</h3>
                <p className="mb-4 text-sm" style={{ color: '#888' }}>
                  Visit our main office
                </p>
                <p className="font-semibold text-sm leading-relaxed">
                  AUTOMEX,<br />
                  Hanspal puri, colony, Balianta road<br />
                  Bhubaneswar, Odisha - 752101
                </p>
                <p className="text-xs mt-2" style={{ color: '#888' }}>
                  Contact: Tapas Parida
                </p>
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
                        ? 'top-1 text-xs text-[#FF2D2D]' 
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
                          ? 'border-[#FF2D2D] ring-2 ring-[#FF2D2D]/20 bg-white/90' 
                          : 'border-gray-300/50 bg-white/80'
                      }`}
                      style={{
                        borderColor: focusedField === 'name' ? '#FF2D2D' : 'rgba(0,0,0,0.1)',
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
                          ? 'top-1 text-xs text-[#FF2D2D]' 
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
                            ? 'border-[#FF2D2D] ring-2 ring-[#FF2D2D]/20 bg-white/90' 
                            : 'border-gray-300/50 bg-white/80'
                        }`}
                        style={{
                          borderColor: focusedField === 'email' ? '#FF2D2D' : 'rgba(0,0,0,0.1)',
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
                          ? 'top-1 text-xs text-[#FF2D2D]' 
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
                            ? 'border-[#FF2D2D] ring-2 ring-[#FF2D2D]/20 bg-white/90' 
                            : 'border-gray-300/50 bg-white/80'
                        }`}
                        style={{
                          borderColor: focusedField === 'phone' ? '#FF2D2D' : 'rgba(0,0,0,0.1)',
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
                        ? 'top-1 text-xs text-[#FF2D2D]' 
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
                          ? 'border-[#FF2D2D] ring-2 ring-[#FF2D2D]/20 bg-white/90' 
                          : 'border-gray-300/50 bg-white/80'
                      }`}
                      style={{
                        borderColor: focusedField === 'subject' ? '#FF2D2D' : 'rgba(0,0,0,0.1)',
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
                        ? 'text-xs text-[#FF2D2D]' 
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
                        ? 'border-[#FF2D2D] ring-2 ring-[#FF2D2D]/20 bg-white/90' 
                        : 'border-gray-300/50 bg-white/80'
                    }`}
                    style={{
                      borderColor: focusedField === 'message' ? '#FF2D2D' : 'rgba(0,0,0,0.1)',
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
                    background: 'linear-gradient(90deg, #FF2D2D, #B30000)',
                    borderRadius: '20px',
                    boxShadow: '0 4px 15px rgba(255, 45, 45, 0.4)'
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
                      background: 'linear-gradient(135deg, #FF2D2D 0%, #B30000 50%, #C0C0C0 100%)',
                      boxShadow: '0 4px 15px rgba(255, 45, 45, 0.4)',
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
                      background: 'linear-gradient(135deg, #FF2D2D 0%, #B30000 50%, #C0C0C0 100%)',
                      boxShadow: '0 4px 15px rgba(255, 45, 45, 0.4)',
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
                      background: 'linear-gradient(135deg, #FF2D2D 0%, #B30000 50%, #C0C0C0 100%)',
                      boxShadow: '0 4px 15px rgba(255, 45, 45, 0.4)',
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
                      <span className="text-[#FF2D2D] text-lg">✓</span>
                      <span>Premium Car Services</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-[#FF2D2D] text-lg">✓</span>
                      <span>AC Service & Repair</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-[#FF2D2D] text-lg">✓</span>
                      <span>Battery Replacement</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-[#FF2D2D] text-lg">✓</span>
                      <span>Tyres & Wheel Care</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-[#FF2D2D] text-lg">✓</span>
                      <span>Denting & Painting</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-[#FF2D2D] text-lg">✓</span>
                      <span>Car Detailing & Spa</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-[#FF2D2D] text-lg">✓</span>
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
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3742.7447668847334!2d85.87199931490284!3d20.24088618657636!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a19a7a8d5ed5555%3A0x1234567890abcdef!2sBalianta%2C%20Bhubaneswar%2C%20Odisha%20752101!5e0!3m2!1sen!2sin!4v1234567890"
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
            box-shadow: 0 4px 15px rgba(255, 45, 45, 0.4);
          }
          50% {
            box-shadow: 0 4px 25px rgba(255, 45, 45, 0.7), 0 0 30px rgba(255, 45, 45, 0.3);
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

