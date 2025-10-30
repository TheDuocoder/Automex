import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, Mail, MapPin, Clock, Send, ArrowLeft } from "lucide-react";
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
      <section className="bg-black text-white pt-24 pb-6 sm:pt-28 sm:pb-8 md:pt-32 md:pb-10 lg:pt-36 lg:pb-12">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-7xl">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6 mb-4 sm:mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight order-2 sm:order-1">
              Get In Touch
            </h1>
            <Button
              variant="outline"
              className="bg-white/10 backdrop-blur-sm text-white border-white/30 hover:bg-white hover:text-black hover:border-white shadow-lg transition-all duration-300 font-semibold text-xs sm:text-sm px-4 py-2 whitespace-nowrap order-1 sm:order-2 self-end sm:self-auto"
              onClick={() => navigate("/")}
            >
              <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="hidden xs:inline">Back to Home</span>
              <span className="xs:hidden">Back</span>
            </Button>
          </div>
          <p className="text-xs sm:text-sm md:text-base lg:text-lg text-white/80 max-w-3xl leading-relaxed">
            Have questions about our services? We're here to help!<br className="hidden sm:block" />
            <span className="sm:hidden"> </span>Reach out to us and we'll respond as soon as possible.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-6 sm:py-8 md:py-10 lg:py-12">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-7xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
            {/* Contact Information Cards */}
            <Card className="hover:shadow-lg transition-shadow sm:col-span-2 lg:col-span-1">
              <CardContent className="p-4 sm:p-5 md:p-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                  <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>
                <h3 className="text-base sm:text-lg md:text-xl font-bold mb-1.5 sm:mb-2">Phone</h3>
                <p className="text-muted-foreground mb-2 sm:mb-3 text-xs sm:text-sm">
                  Call us for immediate assistance
                </p>
                <div className="space-y-1">
                  <a href="tel:+918249614004" className="text-primary hover:underline font-semibold text-xs sm:text-sm block break-all">
                    +91 8249614004
                  </a>
                  <a href="tel:+919776433334" className="text-primary hover:underline font-semibold text-xs sm:text-sm block break-all">
                    +91 9776433334
                  </a>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4 sm:p-5 md:p-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                  <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>
                <h3 className="text-base sm:text-lg md:text-xl font-bold mb-1.5 sm:mb-2">Email</h3>
                <p className="text-muted-foreground mb-2 sm:mb-3 text-xs sm:text-sm">
                  Send us an email anytime
                </p>
                <a href="mailto:sales@automex.in" className="text-primary hover:underline font-semibold text-xs sm:text-sm break-all">
                  sales@automex.in
                </a>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4 sm:p-5 md:p-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                  <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>
                <h3 className="text-base sm:text-lg md:text-xl font-bold mb-1.5 sm:mb-2">Location</h3>
                <p className="text-muted-foreground mb-2 sm:mb-3 text-xs sm:text-sm">
                  Visit our main office
                </p>
                <p className="font-semibold text-xs sm:text-sm leading-relaxed">
                  AUTOMEX,<br />
                  Hanspal puri, colony, Balianta road<br />
                  Bhubaneswar, Odisha - 752101
                </p>
                <p className="text-xs text-muted-foreground mt-1.5 sm:mt-2">
                  Contact: Tapas Parida
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form and Additional Info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6">Send Us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div>
                  <label htmlFor="name" className="block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2">
                    Full Name *
                  </label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full text-sm sm:text-base"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="email" className="block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2">
                      Email Address *
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full text-sm sm:text-base"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2">
                      Phone Number *
                    </label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full text-sm sm:text-base"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2">
                    Subject *
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    type="text"
                    placeholder="How can we help?"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full text-sm sm:text-base"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2">
                    Message *
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Tell us more about your inquiry..."
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="w-full min-h-[120px] sm:min-h-[150px] text-sm sm:text-base"
                  />
                </div>

                <Button type="submit" size="lg" className="w-full sm:w-auto text-sm sm:text-base">
                  <Send className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                  Send Message
                </Button>
              </form>
            </div>

            {/* Additional Information */}
            <div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6">Why Choose AutoMex?</h2>
              
              <div className="space-y-4 sm:space-y-6 mb-6 sm:mb-8">
                <div className="flex gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-500/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold mb-1 sm:mb-2">Business Hours</h3>
                    <p className="text-muted-foreground text-xs sm:text-sm">
                      Monday - Saturday: 8:00 AM - 8:00 PM<br />
                      Sunday: 9:00 AM - 6:00 PM
                    </p>
                  </div>
                </div>

                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="p-4 sm:p-5 md:p-6">
                    <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Our Services</h3>
                    <ul className="space-y-1.5 sm:space-y-2 text-muted-foreground text-xs sm:text-sm">
                      <li>✓ Premium Car Services</li>
                      <li>✓ AC Service & Repair</li>
                      <li>✓ Battery Replacement</li>
                      <li>✓ Tyres & Wheel Care</li>
                      <li>✓ Denting & Painting</li>
                      <li>✓ Car Detailing & Spa</li>
                      <li>✓ Car Inspections</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="bg-orange-500/5 border-orange-500/20">
                  <CardContent className="p-4 sm:p-5 md:p-6">
                    <h3 className="text-lg sm:text-xl font-bold mb-2">Emergency Support</h3>
                    <p className="text-muted-foreground mb-3 text-xs sm:text-sm">
                      Need immediate roadside assistance? We're available 24/7 for emergency support.
                    </p>
                    <Button variant="outline" className="w-full border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white text-xs sm:text-sm">
                      Call Emergency Support
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Map Section */}
          <div className="mt-8 sm:mt-12 md:mt-16">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 text-center">Find Us Here</h2>
            <Card>
              <CardContent className="p-0">
                <div className="w-full h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px] bg-gray-200 rounded-lg overflow-hidden">
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
    </div>
  );
};

export default ContactUs;

