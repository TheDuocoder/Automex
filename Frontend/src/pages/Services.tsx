import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Wrench, Sparkles, Droplet, Paintbrush, Battery, Shield } from "lucide-react";

const Services = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  const services = [
    {
      id: 1,
      name: "AC Service",
      description: "Complete AC system check and repair",
      icon: Sparkles,
      price: "₹899",
      duration: "2-3 hours"
    },
    {
      id: 2,
      name: "Car Spa",
      description: "Premium interior and exterior cleaning",
      icon: Droplet,
      price: "₹1,299",
      duration: "3-4 hours"
    },
    {
      id: 3,
      name: "Denting & Painting",
      description: "Professional body repair and painting",
      icon: Paintbrush,
      price: "₹2,999",
      duration: "1-2 days"
    },
    {
      id: 4,
      name: "Battery Replacement",
      description: "Car battery check and replacement",
      icon: Battery,
      price: "₹3,499",
      duration: "1 hour"
    },
    {
      id: 5,
      name: "General Service",
      description: "Comprehensive vehicle servicing",
      icon: Wrench,
      price: "₹1,999",
      duration: "4-5 hours"
    },
    {
      id: 6,
      name: "Insurance Support",
      description: "Insurance claim assistance",
      icon: Shield,
      price: "Free",
      duration: "N/A"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-primary/90 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Welcome back, {user?.full_name || user?.email}!
          </h1>
          <p className="text-xl text-white/90">
            Choose from our premium car services
          </p>
        </div>
      </div>

      {/* Services Grid */}
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Our Services</h2>
          <p className="text-gray-600">Select a service to book an appointment</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <Card key={service.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Icon className="h-8 w-8 text-primary" />
                    <span className="text-2xl font-bold text-primary">{service.price}</span>
                  </div>
                  <CardTitle className="text-xl">{service.name}</CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Duration: {service.duration}</span>
                    <Button className="bg-primary hover:bg-primary/90">
                      Book Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Info Section */}
      <div className="bg-gray-100 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">150+ Services</h3>
              <p className="text-gray-600">Comprehensive car care solutions</p>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Free Pickup</h3>
              <p className="text-gray-600">Doorstep service at your convenience</p>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">40% Off</h3>
              <p className="text-gray-600">Best prices guaranteed</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;

