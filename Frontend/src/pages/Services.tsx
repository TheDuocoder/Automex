import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import ServiceCard from "@/components/ServiceCard";
import CategoryTabs from "@/components/CategoryTabs";
import BrandSelectorModal from "@/components/BrandSelectorModal";

interface ServicePackage {
  id: string;
  name: string;
  thumbnail: string;
  warranty: string;
  recommended: string;
  features: { name: string; included: boolean; }[];
  moreServicesCount: number;
  originalPrice: number;
  discountedPrice: number;
  duration: string;
  specialLabel?: string;
  offer?: {
    price: number;
    discount: string;
    badgeColor?: string;
  };
  isRecommended: boolean;
}

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
      icon: <img src="/images/service_icons/car_tyre and wheels_care.png" alt="Tyres & Wheel Care" className="h-7 w-7 object-contain" /> 
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
      icon: <img src="/images/service_icons/car_clutch and body_parts.png" alt="Clutch and Body Parts" className="h-7 w-7 object-contain" /> 
    },
    { 
      id: "windshield-lights", 
      name: "Windshield and Lights", 
      icon: <img src="/images/service_icons/car_windshiled and lights2.png" alt="Windshield and Lights" className="h-7 w-7 object-contain" /> 
    },
    { 
      id: "car-inspections", 
      name: "Inspection", 
      icon: <img src="/images/service_icons/car-inspection.png" alt="Inspection" className="h-7 w-7 object-contain" /> 
    },
    { 
      id: "car-insurance", 
      name: "Insurance", 
      icon: <img src="/images/service_icons/car_insurance1.png" alt="Insurance" className="h-7 w-7 object-contain" /> 
    },
  ];

  // Mock service packages data
  const servicePackages: Record<string, ServicePackage[]> = {
    "car-services": [
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
    ],
    "ac-service": [
      {
        id: "regular-ac-service",
        name: "Regular AC Service",
        thumbnail: "/images/Ac repair.png",
        warranty: "500 Kms or 1 Month Warranty",
        recommended: "Every 5,000 Kms or 3 Months (Recommended)",
        features: [
          { name: "AC Gas Top Up", included: true },
          { name: "AC Filter Cleaning", included: true },
          { name: "Condenser Cleaning", included: true },
          { name: "Evaporator Coil Check", included: true },
          { name: "Compressor Belt Check", included: true },
        ],
        moreServicesCount: 4,
        originalPrice: 1799,
        discountedPrice: 1299,
        duration: "Takes 4 hours",
        specialLabel: "FREE AC UNIT INSPECTION",
        offer: {
          price: 999,
          discount: "Extra ₹300 OFF",
          badgeColor: "bg-green-500"
        },
        isRecommended: false
      },
      {
        id: "complete-ac-service",
        name: "Complete AC Service",
        thumbnail: "/images/Services/detailing service.png",
        warranty: "1000 Kms or 2 Months Warranty",
        recommended: "Every 8,000 Kms or 6 Months (Recommended)",
        features: [
          { name: "Complete AC Gas Refill", included: true },
          { name: "AC Filter Replacement", included: true },
          { name: "Condenser Deep Cleaning", included: true },
          { name: "Evaporator Coil Cleaning", included: true },
          { name: "Compressor Check & Service", included: true },
          { name: "AC Vent Sanitization", included: true },
        ],
        moreServicesCount: 6,
        originalPrice: 2999,
        discountedPrice: 2299,
        duration: "Takes 6 hours",
        specialLabel: "FREE AC GAS",
        offer: {
          price: 1899,
          discount: "Extra ₹400 OFF",
          badgeColor: "bg-green-500"
        },
        isRecommended: true
      },
      {
        id: "ac-repair-service",
        name: "AC Repair & Diagnosis",
        thumbnail: "/images/Services/inspection service.png",
        warranty: "1500 Kms or 3 Months Warranty",
        recommended: "When AC issues arise",
        features: [
          { name: "Complete AC Diagnosis", included: true },
          { name: "Compressor Repair/Replace", included: true },
          { name: "AC Leak Detection & Fix", included: true },
          { name: "Thermostat Check & Fix", included: true },
          { name: "Electrical Circuit Check", included: true },
        ],
        moreServicesCount: 5,
        originalPrice: 4599,
        discountedPrice: 3499,
        duration: "Takes 8 hours",
        specialLabel: "FREE DIAGNOSIS",
        offer: {
          price: 2999,
          discount: "Extra ₹500 OFF",
          badgeColor: "bg-green-500"
        },
        isRecommended: false
      }
    ],
    "batteries": [
      {
        id: "amaron-go-35-amp",
        name: "Amaron Go 35 Amp",
        thumbnail: "/images/Services/Battery service.png",
        warranty: "Right Layout",
        recommended: "60 Months Warranty • Free of Cost Installation",
        features: [
          { name: "Free Pickup & Drop", included: true },
          { name: "Old Battery Price Included", included: true },
          { name: "Free Installation", included: true },
          { name: "Available at Doorstep", included: true },
        ],
        moreServicesCount: 0,
        originalPrice: 5171,
        discountedPrice: 3888,
        duration: "Expert Rating: 4.7",
        specialLabel: "",
        offer: undefined,
        isRecommended: false
      },
      {
        id: "amaron-flo-35-amp",
        name: "Amaron Flo 35 Amp",
        thumbnail: "/images/Services/Battery service.png",
        warranty: "Right Layout",
        recommended: "72 Months Warranty • Free of Cost Installation",
        features: [
          { name: "Free Pickup & Drop", included: true },
          { name: "Old Battery Price Included", included: true },
          { name: "Free Installation", included: true },
          { name: "Available at Doorstep", included: true },
        ],
        moreServicesCount: 0,
        originalPrice: 5497,
        discountedPrice: 4133,
        duration: "Expert Rating: 4.2",
        specialLabel: "",
        offer: undefined,
        isRecommended: false
      }
    ],
    "tyres": [
      {
        id: "michelin-energy-xm2",
        name: "Michelin Energy XM2",
        thumbnail: "/images/Services/Tyre service.png",
        warranty: "Premium Quality",
        recommended: "60,000 Kms Warranty • Professional Installation",
        features: [
          { name: "Free Home Installation", included: true },
          { name: "Old Tyre Exchange", included: true },
          { name: "Wheel Alignment Check", included: true },
          { name: "Nitrogen Filling", included: true },
        ],
        moreServicesCount: 0,
        originalPrice: 8999,
        discountedPrice: 7299,
        duration: "Expert Rating: 4.6",
        specialLabel: "",
        offer: undefined,
        isRecommended: true
      },
      {
        id: "ceat-secura-drive",
        name: "CEAT SecuraDrive",
        thumbnail: "/images/Services/Tyre service.png",
        warranty: "Premium Quality",
        recommended: "50,000 Kms Warranty • Professional Installation",
        features: [
          { name: "Free Home Installation", included: true },
          { name: "Old Tyre Exchange", included: true },
          { name: "Wheel Balancing", included: true },
          { name: "Road Hazard Protection", included: true },
        ],
        moreServicesCount: 0,
        originalPrice: 6799,
        discountedPrice: 5499,
        duration: "Expert Rating: 4.3",
        specialLabel: "",
        offer: undefined,
        isRecommended: false
      },
      {
        id: "apollo-alnac-4g",
        name: "Apollo Alnac 4G",
        thumbnail: "/images/Services/Tyre service.png",
        warranty: "Premium Quality",
        recommended: "55,000 Kms Warranty • Professional Installation",
        features: [
          { name: "Free Home Installation", included: true },
          { name: "Old Tyre Exchange", included: true },
          { name: "Puncture Protection", included: true },
          { name: "Wet Grip Performance", included: true },
        ],
        moreServicesCount: 0,
        originalPrice: 7499,
        discountedPrice: 6199,
        duration: "Expert Rating: 4.4",
        specialLabel: "",
        offer: undefined,
        isRecommended: false
      }
    ]
  };

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
      <div className="pt-2 pb-8">
        <div className="max-w-[1400px] mx-auto pl-2 pr-6">
          <div className="flex gap-8">
            {/* Left Content Area */}
            <div className="flex-1 max-w-[880px]">
              {/* Category Navigation */}
              <div className="mb-2 -ml-2">
                <div className="bg-white rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-gray-100/50 px-3 py-2">
                  <CategoryTabs
                    categories={serviceCategories}
                    activeCategory={selectedCategory}
                    onCategoryChange={setSelectedCategory}
                  />
                </div>
              </div>

              {/* Service Packages Section */}
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  {selectedCategory === "ac-service" ? "Service Packages" : 
                   selectedCategory === "batteries" ? "Amaron" :
                   selectedCategory === "tyres" ? "Premium Tyres" : "Scheduled Packages"}
                </h2>
                
                <div className="space-y-6">
                  {(servicePackages[selectedCategory as keyof typeof servicePackages] || servicePackages["car-services"]).map((pkg) => (
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
                      specialLabel={pkg.specialLabel}
                      onAddToCart={handleAddToCart}
                    />
                  ))}
                </div>
              </div>

              {/* Statistics Section */}
              <div className="bg-gray-100 rounded-2xl mt-12 py-12 px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">150+ Services</h3>
                    <p className="text-gray-600">Comprehensive car care solutions</p>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Free Pickup</h3>
                    <p className="text-gray-600">Doorstep service at your convenience</p>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">40% Off</h3>
                    <p className="text-gray-600">Best prices guaranteed</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Sidebar - Select Manufacturer */}
            <div className="w-[450px] flex-shrink-0">
              <div className="sticky top-20">
                <BrandSelectorModal
                  variant="sidebar"
                  selectedBrand={selectedBrand}
                  onBrandSelect={setSelectedBrand}
                  className="h-[600px] overflow-hidden rounded-2xl shadow-[0px_6px_30px_rgba(0,0,0,0.35)] bg-white"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;