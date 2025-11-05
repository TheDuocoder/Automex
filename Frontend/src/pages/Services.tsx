import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import ServiceCard from "@/components/ServiceCard";
import CategoryTabs from "@/components/CategoryTabs";
import BrandSelectorModal from "@/components/BrandSelectorModal";
import { 
  Car, 
  Wind, 
  Battery, 
  Settings, 
  Paintbrush, 
  Sparkles
} from "lucide-react";

const Services = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [selectedCategory, setSelectedCategory] = useState("car-services");
  const [selectedBrand, setSelectedBrand] = useState("");

  // Service categories data
  const serviceCategories = [
    { id: "car-services", name: "Car Services", icon: <Car className="h-6 w-6" /> },
    { id: "ac-service", name: "AC Service & Repair", icon: <Wind className="h-6 w-6" /> },
    { id: "batteries", name: "Batteries", icon: <Battery className="h-6 w-6" /> },
    { id: "tyres", name: "Tyres & Wheel Care", icon: <Settings className="h-6 w-6" /> },
    { id: "denting", name: "Denting & Painting", icon: <Paintbrush className="h-6 w-6" /> },
    { id: "detailing", name: "Detailing Services", icon: <Sparkles className="h-6 w-6" /> },
  ];

  // Mock service packages data
  const servicePackages = [
    {
      id: "basic-service",
      name: "Basic Service",
      thumbnail: "",
      warranty: "1000 Kms or 3 Months Warranty",
      recommended: "Every 5000 Kms or 6 Months (Recommended)",
      features: [
        { name: "Wiper Fluid Replacement", included: true },
        { name: "Car Wash", included: true },
        { name: "Engine Oil Replacement", included: true },
        { name: "Battery Water Top Up", included: true },
        { name: "Interior Vacuuming (Carpet & Seats)", included: true },
      ],
      moreServicesCount: 4,
      originalPrice: 3559,
      discountedPrice: 2669,
      duration: "4 Hrs Taken",
      offer: {
        price: 2169,
        discount: "Extra ₹500 OFF",
        badgeColor: "bg-green-500"
      },
      isRecommended: false
    },
    {
      id: "standard-service",
      name: "Standard Service",
      thumbnail: "",
      warranty: "1000 Kms or 3 Months Warranty",
      recommended: "Every 10,000 Kms or 6 Months (Recommended)",
      features: [
        { name: "Car Scanning", included: true },
        { name: "Battery Water Top up", included: true },
        { name: "Interior Vacuuming (Carpet & Seats)", included: true },
        { name: "Wiper Fluid Replacement", included: true },
        { name: "Car Wash", included: true },
      ],
      moreServicesCount: 10,
      originalPrice: 4813,
      discountedPrice: 3369,
      duration: "6 Hrs Taken",
      isRecommended: true
    }
  ];

  const handleAddToCart = (serviceId: string, serviceName: string) => {
    console.log(`Adding to cart: ${serviceName} (ID: ${serviceId})`);
    
    if (!isAuthenticated) {
      navigate('/', { state: { showAuth: true } });
      return;
    }
    
    // Handle authenticated user cart logic here
    alert(`${serviceName} added to cart!`);
  };

  return (
    <div className="min-h-screen bg-white font-inter">
      <Header />
      
      {/* Main Content */}
      <div className="pt-20 pb-8">
        {/* Service Categories and Brand Selection */}
        <div className="container mx-auto px-4 mb-8">
          <div className="flex items-center gap-4">
            {/* Service Categories */}
            <div className="flex-1">
              <CategoryTabs
                categories={serviceCategories}
                activeCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
              />
            </div>

            {/* Brand Selector */}
            <div className="flex-shrink-0">
              <BrandSelectorModal
                selectedBrand={selectedBrand}
                onBrandSelect={setSelectedBrand}
              />
            </div>
          </div>
        </div>

        {/* Scheduled Packages Section */}
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Scheduled Packages</h2>
          </div>

          {/* Service Cards */}
          <div className="space-y-6">
            {servicePackages.map((pkg) => (
              <ServiceCard
                key={pkg.id}
                id={pkg.id}
                name={pkg.name}
                thumbnail={pkg.thumbnail}
                warranty={pkg.warranty}
                recommended={pkg.recommended}
                features={pkg.features}
                moreServicesCount={pkg.moreServicesCount}
                originalPrice={pkg.originalPrice}
                discountedPrice={pkg.discountedPrice}
                duration={pkg.duration}
                offer={pkg.offer}
                isRecommended={pkg.isRecommended}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        </div>

        {/* Info Section */}
        <div className="bg-gray-100 py-12 mt-12">
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
    </div>
  );
};

export default Services;