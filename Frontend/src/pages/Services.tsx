import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import ServiceCard from "@/components/ServiceCard";
import CategoryTabs from "@/components/CategoryTabs";
import BrandSelectorModal from "@/components/BrandSelectorModal";

const Services = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [selectedCategory, setSelectedCategory] = useState("car-services");
  const [selectedBrand, setSelectedBrand] = useState("");

  // Service categories data
  const serviceCategories = [
    { 
      id: "car-services", 
      name: "Car Services", 
      icon: <img src="/images/service_icons/car_service.png" alt="Car Services" className="h-7 w-7 object-contain" /> 
    },
    { 
      id: "ac-service", 
      name: "AC Service & Repair", 
      icon: <img src="/images/service_icons/car_ac_services.png" alt="AC Service & Repair" className="h-7 w-7 object-contain" /> 
    },
    { 
      id: "batteries", 
      name: "Batteries", 
      icon: <img src="/images/service_icons/battery.png" alt="Batteries" className="h-7 w-7 object-contain" /> 
    },
    { 
      id: "tyres", 
      name: "Tyres & Wheel Care", 
      icon: <img src="/images/service_icons/tyres_and_wheels_care.png" alt="Tyres & Wheel Care" className="h-7 w-7 object-contain" /> 
    },
    { 
      id: "denting", 
      name: "Denting & Painting", 
      icon: <img src="/images/service_icons/car_denting and painting1.png" alt="Denting & Painting" className="h-7 w-7 object-contain" /> 
    },
    { 
      id: "detailing", 
      name: "Detailing Services", 
      icon: <img src="/images/service_icons/car_detailing_services.png" alt="Detailing Services" className="h-7 w-7 object-contain" /> 
    },
    { 
      id: "suspension-fitting", 
      name: "Suspension and Fitting", 
      icon: <img src="/images/service_icons/car_suspensions and fitments.png" alt="Suspension and Fitting" className="h-7 w-7 object-contain" /> 
    },
    { 
      id: "car-spa", 
      name: "Spa and Cleaning", 
      icon: <img src="/images/service_icons/car_spa and cleaning.png" alt="Spa and Cleaning" className="h-7 w-7 object-contain" /> 
    },
    { 
      id: "clutch-body-parts", 
      name: "Clutch and Body Parts", 
      icon: <img src="/images/service_icons/clutch and body_parts.png" alt="Clutch and Body Parts" className="h-7 w-7 object-contain" /> 
    },
    { 
      id: "windshield-lights", 
      name: "Windshield and Lights", 
      icon: <img src="/images/service_icons/car_windshiled and lights2.png" alt="Windshield and Lights" className="h-7 w-7 object-contain" /> 
    },
    { 
      id: "car-inspections", 
      name: "Car Inspections", 
      icon: <img src="/images/service_icons/car-inspection.png" alt="Car Inspections" className="h-7 w-7 object-contain" /> 
    },
    { 
      id: "car-insurance", 
      name: "Car Insurance", 
      icon: <img src="/images/service_icons/car_insurance.png" alt="Car Insurance" className="h-7 w-7 object-contain" /> 
    },
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