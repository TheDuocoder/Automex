import { Fragment, useState } from "react";
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
  features: { name: string; included: boolean; details?: string; }[];
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
  descriptions?: string[];
  sectionTitle?: string;
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
      icon: <img src="/images/service_icons/car_service.png" alt="Car Services" className="h-10 w-10 object-contain" />
    },
    {
      id: "ac-service",
      name: "AC Service & Repair",
      icon: <img src="/images/service_icons/car_ac_services.png" alt="AC Service & Repair" className="h-10 w-10 object-contain" />
    },
    {
      id: "batteries",
      name: "Batteries",
      icon: <img src="/images/service_icons/battery.png" alt="Batteries" className="h-10 w-10 object-contain" />
    },
    {
      id: "tyres",
      name: "Tyres & Wheel Care",
      icon: <img src="/images/service_icons/car_tyre and wheels_care.png" alt="Tyres & Wheel Care" className="h-10 w-10 object-contain" />
    },
    {
      id: "denting",
      name: "Denting & Painting",
      icon: <img src="/images/service_icons/car_denting and painting1.png" alt="Denting & Painting" className="h-10 w-10 object-contain" />
    },
    {
      id: "detailing",
      name: "Detailing Services",
      icon: <img src="/images/service_icons/car_detailing_services.png" alt="Detailing Services" className="h-10 w-10 object-contain" />
    },
    {
      id: "suspension-fitting",
      name: "Suspension and Fitting",
      icon: <img src="/images/service_icons/car_suspensions and fitments.png" alt="Suspension and Fitting" className="h-10 w-10 object-contain" />
    },
    {
      id: "car-spa",
      name: "Spa and Cleaning",
      icon: <img src="/images/service_icons/car_spa and cleaning.png" alt="Spa and Cleaning" className="h-10 w-10 object-contain" />
    },
    {
      id: "clutch-body-parts",
      name: "Clutch and Body Parts",
      icon: <img src="/images/service_icons/car_clutch and body_parts.png" alt="Clutch and Body Parts" className="h-10 w-10 object-contain" />
    },
    {
      id: "windshield-lights",
      name: "Windshield and Lights",
      icon: <img src="/images/service_icons/car_windshiled and lights2.png" alt="Windshield and Lights" className="h-10 w-10 object-contain" />
    },
    {
      id: "car-inspections",
      name: "Inspection",
      icon: <img src="/images/service_icons/car-inspection.png" alt="Inspection" className="h-10 w-10 object-contain" />
    },
    {
      id: "car-insurance",
      name: "Insurance",
      icon: <img src="/images/service_icons/car_insurance1.png" alt="Insurance" className="h-10 w-10 object-contain" />
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
          { name: "Air Filter Cleaning", included: true },
          { name: "Spark Plug Inspection", included: true },
          { name: "Coolant Top-Up 200ml", included: true }
      ],
      moreServicesCount: 4,
        descriptions: [
          "Complete 34-point inspection covering brakes, suspension, electricals, tyres and safety.",
          "Top-up of all essential fluids including radiator coolant, power steering and windshield washer.",
          "Detailed cabin sanitisation with dashboard polish and door-pad wipe down.",
          "Road test with post-service quality checklist before final handover."
        ],
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
          { name: "Brake Cleaning & Adjustment", included: true },
          { name: "Fuel Filter Replacement", included: true },
          { name: "AC Filter Replacement", included: true },
          { name: "Throttle Body Cleaning", included: true },
          { name: "Wheel Alignment Check", included: true }
        ],
        moreServicesCount: 6,
        descriptions: [
          "Premium service includes synthetic oil refill and OEM filter kit.",
          "Comprehensive 50-point inspection with digital scan report.",
          "Torque setting of suspension, steering and wheel components.",
          "Exterior foam wash and interior germ cleaning with ozone treatment."
        ],
      originalPrice: 4813,
      discountedPrice: 3369,
      duration: "6 Hrs Taken",
      isRecommended: true
    },
    {
      id: "comprehensive-service",
      name: "Comprehensive Service",
      thumbnail: "/images/Services/Premium car service.png",
      warranty: "1000 Kms or 1 Month Warranty",
      recommended: "Every 20,000 Kms or 12 Months (Recommended)",
      features: [
        { name: "AC Filter Replacement", included: true },
        { name: "Car Scanning", included: true },
        { name: "Interior Vacuuming (Carpet & Seats)", included: true },
        { name: "Front Brake Pads Serviced", included: true },
        { name: "Wheel Alignment", included: true },
        { name: "Engine Oil Replacement", included: true },
        { name: "Air Filter Replacement", included: true },
        { name: "Gear Oil Top Up", included: true },
        { name: "Spark Plug Inspection", included: true },
        { name: "Fuel Filter Cleaning", included: true },
        { name: "Rear Brake Shoes Serviced", included: true },
        { name: "Wheel Balancing", included: true },
        { name: "Tyre Rotation", included: true },
        { name: "Throttle Body Cleaning", included: true },
        { name: "Coolant Top Up (200 ml)", included: true },
        { name: "Brake Fluid Top Up", included: true }
      ],
      moreServicesCount: 8,
      originalPrice: 5299,
      discountedPrice: 4199,
      duration: "8 Hrs Taken",
      specialLabel: "FREE AC GAS TOP-UP",
      offer: {
        price: 3799,
        discount: "Extra ₹400 OFF",
        badgeColor: "bg-green-500"
      },
      isRecommended: false,
      descriptions: [
        "Full synthetic oil service with OEM filter kit and complete top-up of all fluids.",
        "50-point health check covering suspension, steering, drivetrain and electrical systems.",
        "Includes wheel alignment & balancing, throttle body cleaning and brake servicing.",
        "Exterior foam wash + interior deep clean with deodorisation and ozone sanitation."
      ]
    },
    {
      id: "brake-maintenance-heading",
      name: "Brake Maintenance",
      thumbnail: "",
      warranty: "",
      recommended: "",
      features: [],
      moreServicesCount: 0,
      originalPrice: 0,
      discountedPrice: 0,
      duration: "",
      sectionTitle: "Brake Maintenance",
      isRecommended: false
    },
    {
      id: "front-brake-pads",
      name: "Front Brake Pads",
      thumbnail: "/images/product_images/frontbrakes.png",
      warranty: "1 Month Warranty",
      recommended: "Every 20,000 Kms or 12 Months (Recommended)",
      features: [
        { name: "Opening & Fitting of Front Brake Pads", included: true },
        { name: "Applicable for Set of 2 Front Brake Pads", included: true },
        { name: "Front Brake Disc Cleaning", included: true },
        { name: "Front Brake Pads Replacement (OES)", included: true },
        { name: "Inspection of Front Brake Calipers", included: true }
      ],
      moreServicesCount: 1,
      originalPrice: 2374,
      discountedPrice: 1899,
      duration: "3 Hours",
      specialLabel: "OEM/BRAND INCLUDED",
      isRecommended: false,
      descriptions: [
        "Premium ceramic brake pads with warranty on labour & fitment.",
        "Includes disc brushing, caliper pin greasing and road test."
      ]
    },
    {
      id: "rear-brake-shoes",
      name: "Rear Brake Shoes",
      thumbnail: "/images/product_images/rearbreak_shoes.png",
      warranty: "1 Month Warranty",
      recommended: "Every 20,000 Kms or 12 Months (Recommended)",
      features: [
        { name: "Opening & Fitting of Rear Brake Shoes", included: true },
        { name: "Applicable for Set of 2 Rear Brake Shoes", included: true },
        { name: "Rear Brake Disc Cleaning", included: true },
        { name: "Rear Brake Shoes Replacement (OEM)", included: true },
        { name: "Inspection of Rear Brake Calipers", included: true }
      ],
      moreServicesCount: 1,
      originalPrice: 2499,
      discountedPrice: 2099,
      duration: "90 Mins",
      specialLabel: "LABOUR INCLUDED",
      isRecommended: false,
      descriptions: [
        "Original equipment rear brake shoe set with warranty on labour.",
        "Includes handbrake adjustment, drum cleaning and final inspection."
      ]
    },
    {
      id: "front-brake-discs",
      name: "Front Brake Discs",
      thumbnail: "/images/product_images/frontbrake_disk.png",
      warranty: "1 Month Warranty • Corrosion Resistance",
      recommended: "Best Performance (Single OE Unit)",
      features: [
        { name: "Opening & Fitting of Front Brake Disc", included: true },
        { name: "Reduces Vibrations and Brake Noise", included: true },
        { name: "Free Pickup & Drop", included: true },
        { name: "Front Brake Disc Replacement", included: true }
      ],
      moreServicesCount: 0,
      originalPrice: 3599,
      discountedPrice: 3099,
      duration: "90 Mins",
      specialLabel: "LABOUR INCLUDED",
      isRecommended: false,
      descriptions: [
        "Replacement with OEM-spec rotors including torque tightening.",
        "Brake bedding procedure and vibration test drive post fitment."
      ]
    },
    {
      id: "caliper-pin-replacement",
      name: "Caliper Pin Replacement",
      thumbnail: "/images/product_images/caliperpin_replacement.png",
      warranty: "Recommended in case of noise from brakes",
      recommended: "Caliper Pin Replacement (OES) • Caliper Assembly Cost Additional",
      features: [
        { name: "Opening & Fitting of Caliper Pin", included: true },
        { name: "Free Pickup & Drop", included: true },
        { name: "Caliper Pin Lubrication", included: true }
      ],
      moreServicesCount: 0,
      originalPrice: 1899,
      discountedPrice: 1599,
      duration: "60 Mins",
      specialLabel: "NEW",
      isRecommended: false,
      descriptions: [
        "Eliminates brake squeal by replacing worn pins and lubricating bushings.",
        "Complete inspection of caliper guide sleeves and dust boots."
      ]
    },
    {
      id: "brake-drums-turning",
      name: "Brake Drums Turning",
      thumbnail: "/images/product_images/break_drums_turning.png",
      warranty: "1 Month Warranty on Labour",
      recommended: "Applicable for Set of 2 Brake Drums • Professional Drum Machining",
      features: [
        { name: "Inspection of Brake Drums", included: true },
        { name: "Precision Brake Drums Turning", included: true },
        { name: "Brake Shoes Cleaning & Adjustment", included: true }
      ],
      moreServicesCount: 0,
      originalPrice: 2199,
      discountedPrice: 1799,
      duration: "75 Mins",
      specialLabel: "LABOUR INCLUDED",
      isRecommended: false,
      descriptions: [
        "Professional brake drums turning restores smooth braking performance.",
        "Includes drum runout measurement and brake shoes adjustment procedure."
      ]
    },
    {
      id: "handbrake-wire-replacement",
      name: "Handbrake Wire Replacement",
      thumbnail: "/images/product_images/handbrack_wire.png",
      warranty: "1 Month Warranty",
      recommended: "Restores handbrake bite & safety",
      features: [
        { name: "Replacement with OEM Handbrake Cable", included: true },
        { name: "Adjustment of Handbrake Lever", included: true },
        { name: "Lubrication of Linkages", included: true },
        { name: "Free Pickup & Drop", included: true }
      ],
      moreServicesCount: 0,
      originalPrice: 1999,
      discountedPrice: 1699,
      duration: "90 Mins",
      specialLabel: "NEW",
      isRecommended: false,
      descriptions: [
        "Ensures optimal parking brake hold with fresh OEM cables and adjusters.",
        "Includes underbody inspection and corrosion protection for linkages."
      ]
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
          { name: "Vent Sanitisation", included: true },
          { name: "Cabin Deodorising", included: true }
        ],
        moreServicesCount: 3,
        descriptions: [
          "AC pressure testing with UV leak detection dye.",
          "Deep cleaning of blower motor and vents for odour removal.",
          "Dashboard and vents sanitisation with anti-bacterial spray.",
          "Post-service temperature drop report and performance test."
        ],
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
        id: "high-performance-ac-service",
        name: "High Performance AC Service",
        thumbnail: "/images/Services/ac_service_technician.png",
        warranty: "1,000 kms or 1 Month Warranty",
        recommended: "Every 10,000 Kms or 1 Year (Recommended)",
        features: [
          { name: "AC Vent Cleaning", included: true },
          { name: "AC Leak Test", included: true },
          { name: "Dashboard Removing Refitting", included: true },
          { name: "Dashboard Cleaning", included: true },
          { name: "AC Gas (Upto 600gms)", included: true }
        ],
        moreServicesCount: 4,
        originalPrice: 4570,
        discountedPrice: 3199,
        duration: "Takes 8 Hours",
        specialLabel: "FREE AC GAS",
        offer: {
          price: 2699,
          discount: "Extra ₹500 OFF",
          badgeColor: "bg-green-500"
        },
        descriptions: [
          "Comprehensive AC service including dashboard removal for deep cleaning.",
          "Professional leak detection using UV dye and pressure testing.",
          "Premium AC gas refill with moisture removal and system optimization."
        ],
        isRecommended: false
      },
      {
        id: "ac-fitments-heading",
        name: "AC Fitments",
        thumbnail: "",
        warranty: "",
        recommended: "",
        features: [],
        moreServicesCount: 0,
        originalPrice: 0,
        discountedPrice: 0,
        duration: "",
        sectionTitle: "AC Fitments",
        isRecommended: false
      },
      {
        id: "cooling-coil-replacement",
        name: "Cooling Coil Replacement",
        thumbnail: "/images/product_images/coiling_coil1.png",
        warranty: "3 Months Warranty",
        recommended: "In Case of No / Less Cooling",
        features: [
          { name: "Cooling Coil Replacement ( OES )", included: true },
          { name: "Spare Part Cost Only", included: true },
          { name: "AC Pipe, Valve, Sensors Cost Additional", included: true },
          { name: "AC Gas, Compressor Oil Cost Additional", included: true },
          { name: "Free Pickup & Drop", included: true }
        ],
        moreServicesCount: 0,
        originalPrice: 4143,
        discountedPrice: 2900,
        duration: "Takes 8 Hours",
        specialLabel: "BESTSELLER",
        offer: {
          price: 2900,
          discount: "",
          badgeColor: "bg-green-500"
        },
        descriptions: [
          "High-quality cooling coil replacement with OEM specifications.",
          "Includes comprehensive leak test and system optimization.",
          "Post-replacement performance validation with temperature monitoring."
        ],
        isRecommended: false
      },
      {
        id: "ac-compressor-replacement",
        name: "Compressor Replacement",
        thumbnail: "/images/service_icons/car_ac_services.png",
        warranty: "3 Months Warranty",
        recommended: "Recommended in case of compressor leakage or less cooling",
        features: [
          { name: "Compressor Replacement (OES)", included: true },
          { name: "AC Gas Refill", included: true },
          { name: "AC Pipes, Valves Sensors Cost Additional", included: true },
          { name: "Free Pickup & Drop", included: true }
        ],
        moreServicesCount: 0,
        originalPrice: 9499,
        discountedPrice: 7899,
        duration: "6 Hrs taken",
        specialLabel: "FREE AC GAS SERVICE",
        descriptions: [
          "Installation of OEM compressor with compressor oil charge.",
          "Replacement of receiver-drier and necessary gaskets.",
          "Includes flushing and recalibration of AC system."
        ],
        isRecommended: false
      },
      {
        id: "ac-heating-coil-replacement",
        name: "Heating Coil Replacement",
        thumbnail: "/images/service_icons/car_ac_services.png",
        warranty: "3 Months Warranty",
        recommended: "Recommended in case of heater not working",
        features: [
          { name: "Heating Coil Replacement (OES)", included: true },
          { name: "Spare Part Cost Only", included: true },
          { name: "Free Pickup & Drop", included: true },
          { name: "Hoses Additional (If Required)", included: true },
          { name: "Coolant and Radiator Flush Cost Additional", included: true }
        ],
        moreServicesCount: 0,
        originalPrice: 5999,
        discountedPrice: 4999,
        duration: "6 Hrs taken",
        specialLabel: "SPARE PART COST ONLY",
        descriptions: [
          "Core replacement for heaters with OEM grade components.",
          "Includes inspection of coolant hoses and valves.",
          "Fresh coolant refill and pressure test post replacement."
        ],
        isRecommended: false
      },
      {
        id: "ac-vbelt-replacement",
        name: "V Belt Replacement",
        thumbnail: "/images/service_icons/car_ac_services.png",
        warranty: "1 Month Warranty",
        recommended: "Recommended in case of whining noise from engine",
        features: [
          { name: "V Belt Replacement (OES)", included: true },
          { name: "Pulleys, Bearings Timing Cost Additional", included: true },
          { name: "Free Pickup & Drop", included: true },
          { name: "Opening & Fitting of V Belt", included: true },
          { name: "Scanning Cost Additional", included: true }
        ],
        moreServicesCount: 0,
        duration: "6 Hrs taken",
        originalPrice: 2199,
        discountedPrice: 1799,
        specialLabel: "LABOUR INCLUDED",
        descriptions: [
          "Replacement of cracked or worn out belts to restore smooth operation.",
          "Inspection of pulleys, tensioners and idlers for wear.",
          "Includes belt adjustment and squeal elimination."
        ],
        isRecommended: false
      },
      {
        id: "ac-blower-motor-replacement",
        name: "AC Blower Motor Replacement",
        thumbnail: "/images/service_icons/car_ac_services.png",
        warranty: "1 Month Warranty",
        recommended: "Recommended in case of rattling, humming noise from AC blower",
        features: [
          { name: "AC Blower Motor Replacement (OES)", included: true },
          { name: "AC Filters, Vents Cleaning Cost Additional", included: true },
          { name: "Free Pickup & Drop", included: true },
          { name: "Spare Part Cost Only", included: true },
          { name: "Wiring Cost Additional (If Needed)", included: true }
        ],
        moreServicesCount: 0,
        originalPrice: 4499,
        discountedPrice: 3899,
        duration: "6 Hrs taken",
        specialLabel: "NEW",
        descriptions: [
          "OEM-spec blower motor installation with vibration testing.",
          "Includes diagnostics of blower relay, resistor and control module.",
          "Complimentary cleaning of blower housing and vents."
        ],
        isRecommended: false
      },
      {
        id: "radiator-heading",
        name: "Radiator",
        thumbnail: "",
        warranty: "",
        recommended: "",
        features: [],
        moreServicesCount: 0,
        originalPrice: 0,
        discountedPrice: 0,
        duration: "",
        sectionTitle: "Radiator",
        isRecommended: false
      },
      {
        id: "radiator-replacement",
        name: "Radiator Replacement",
        thumbnail: "/images/service_icons/car_ac_services.png",
        warranty: "1 Month Warranty",
        recommended: "Recommended in case of blockage in the radiator vessels",
        features: [
          { name: "Radiator Replacement (OES)", included: true },
          { name: "Radiator Hoses, Thermostats Valves Cost Additional", included: true },
          { name: "Free Pickup & Drop", included: true },
          { name: "Spare Part Cost Only", included: true },
          { name: "Coolant Cost Additional", included: true }
        ],
        moreServicesCount: 0,
        originalPrice: 6299,
        discountedPrice: 5299,
        duration: "6 Hrs taken",
        specialLabel: "SPARE PART COST ONLY",
        descriptions: [
          "Radiator replacement with thorough system flush and leak test.",
          "Thermostat and hoses inspected with optional replacement on request.",
          "Fresh coolant refill and temperature stability check."
        ],
        isRecommended: false
      },
      {
        id: "radiator-fan-motor",
        name: "Radiator Fan Motor Replacement",
        thumbnail: "/images/service_icons/car_ac_services.png",
        warranty: "1 Month Warranty",
        recommended: "Recommended in case of radiator fan not working",
        features: [
          { name: "Radiator Fan Motor Replacement (OES)", included: true },
          { name: "Coolant and Radiator Flush Cost Additional", included: true },
          { name: "Free Pickup & Drop", included: true },
          { name: "Opening & Fitting of Radiator Fan Motor", included: true }
        ],
        moreServicesCount: 0,
        originalPrice: 3499,
        discountedPrice: 2999,
        duration: "3 Hrs taken",
        specialLabel: "LABOUR INCLUDED",
        descriptions: [
          "Install OEM fan motor to restore cooling efficiency during idling.",
          "Includes relay and wiring inspection along with coolant flush."
        ],
        isRecommended: false
      },
      {
        id: "radiator-flush-clean",
        name: "Radiator Flush & Clean",
        thumbnail: "/images/service_icons/car_ac_services.png",
        warranty: "Protects Radiator from Corrosion",
        recommended: "Free Pickup and Drop",
        features: [
          { name: "Radiator Flushing", included: true },
          { name: "Radiator Cleaning", included: true },
          { name: "Coolant Replacement (Additional)", included: true }
        ],
        moreServicesCount: 0,
        originalPrice: 1999,
        discountedPrice: 1599,
        duration: "2 Hrs taken",
        specialLabel: "LABOUR INCLUDED",
        descriptions: [
          "Chemical flush removes rust deposits and sludge from radiator and block.",
          "Improves coolant circulation and prevents overheating issues."
        ],
        isRecommended: false
      },
      {
        id: "cooling-coil-replacement",
        name: "Cooling Coil Replacement",
        thumbnail: "/images/service_icons/car_ac_services.png",
        warranty: "3 Months Warranty",
        recommended: "Recommended in case of no/less cooling",
        features: [
          { name: "Cooling Coil Replacement (OES)", included: true },
          { name: "AC Pipe, Valve, Sensors Cost Additional", included: true },
          { name: "Free Pickup & Drop", included: true },
          { name: "Spare Part Cost Only", included: true },
          { name: "AC Gas, Compressor Oil Cost Additional", included: true }
        ],
        moreServicesCount: 0,
        originalPrice: 6399,
        discountedPrice: 5199,
        duration: "6 Hrs taken",
        specialLabel: "FREE AC GAS TOP UP",
        descriptions: [
          "Cooling coil replacement with OEM-approved evaporator and seals.",
          "Includes dashboard removal, heater inspection and leak testing.",
          "AC system evac and recharge with recommended refrigerant."
        ],
        isRecommended: false
      }
    ],
    "batteries": [
      { sectionTitle: "Amaron" },
      {
        id: "amaron-55-35ah",
        name: "Amaron (55 Months Warranty)",
        thumbnail: "https://gomechprod.blob.core.windows.net/websiteasset/New Website/video/thumbnails/1*1/Battery Service.jpg",
        warranty: "55 Months Warranty",
        recommended: "35 Amp Hour • 55 Months Warranty • Free of Cost Installation",
        features: [
          { name: "Free Pickup & Drop", included: true },
          { name: "Old Battery Price Included", included: true },
          { name: "Free Installation", included: true },
          { name: "Available at Doorstep", included: true },
          { name: "Immediate Jump Start Help", included: true }
        ],
        moreServicesCount: 0,
        originalPrice: 0,
        discountedPrice: 0,
        duration: "",
        specialLabel: "",
        offer: undefined,
        isRecommended: true
      },
      {
        id: "amaron-72-35ah",
        name: "Amaron (72 Months Warranty)",
        thumbnail: "https://gomechprod.blob.core.windows.net/websiteasset/New Website/video/thumbnails/1*1/Battery Service.jpg",
        warranty: "72 Months Warranty",
        recommended: "35 Amp Hour • 72 Months Warranty • Free of Cost Installation",
        features: [
          { name: "Free Pickup & Drop", included: true },
          { name: "Old Battery Price Included", included: true },
          { name: "Free Installation", included: true },
          { name: "Available at Doorstep", included: true },
          { name: "Immediate Jump Start Help", included: true }
        ],
        moreServicesCount: 0,
        originalPrice: 0,
        discountedPrice: 0,
        duration: "",
        specialLabel: "",
        offer: undefined,
        isRecommended: false
      },

      { sectionTitle: "Exide" },
      {
        id: "exide-55-35ah",
        name: "Exide (55 Months Warranty)",
        thumbnail: "/images/Services/Battery service.png",
        warranty: "55 Months Warranty",
        recommended: "35 Amp Hour • Free of Cost Installation",
        features: [
          { name: "Free Pickup & Drop", included: true },
          { name: "Old Battery Price Included", included: true },
          { name: "Free Installation", included: true },
          { name: "Available at Doorstep", included: true },
          { name: "Immediate Jump Start Help", included: true }
        ],
        moreServicesCount: 0,
        originalPrice: 0,
        discountedPrice: 0,
        duration: "",
        specialLabel: "",
        offer: undefined,
        isRecommended: false
      },
      {
        id: "exide-66-35ah",
        name: "Exide (66 Months Warranty)",
        thumbnail: "/images/Services/Battery service.png",
        warranty: "66 Months Warranty",
        recommended: "35 Amp Hour • Free of Cost Installation",
        features: [
          { name: "Free Pickup & Drop", included: true },
          { name: "Old Battery Price Included", included: true },
          { name: "Free Installation", included: true },
          { name: "Available at Doorstep", included: true },
          { name: "Immediate Jump Start Help", included: true }
        ],
        moreServicesCount: 0,
        originalPrice: 0,
        discountedPrice: 0,
        duration: "",
        specialLabel: "",
        offer: undefined,
        isRecommended: false
      },
      { sectionTitle: "Livguard" },
      {
        id: "livguard-60-35ah",
        name: "Livguard (60 Months Warranty)",
        thumbnail: "/images/Services/Battery service.png",
        warranty: "60 Months Warranty",
        recommended: "35 Amp Hour • Free of Cost Installation",
        features: [
          { name: "Free Pickup & Drop", included: true },
          { name: "Old Battery Price Included", included: true },
          { name: "Free Installation", included: true },
          { name: "Available at Doorstep", included: true },
          { name: "Immediate Jump Start Help", included: true }
        ],
        moreServicesCount: 0,
        originalPrice: 0,
        discountedPrice: 0,
        duration: "",
        specialLabel: "",
        offer: undefined,
        isRecommended: false
      },
      {
        id: "livguard-72-35ah",
        name: "Livguard (72 Months Warranty)",
        thumbnail: "/images/Services/Battery service.png",
        warranty: "72 Months Warranty",
        recommended: "35 Amp Hour • Free of Cost Installation",
        features: [
          { name: "Free Pickup & Drop", included: true },
          { name: "Old Battery Price Included", included: true },
          { name: "Free Installation", included: true },
          { name: "Available at Doorstep", included: true },
          { name: "Immediate Jump Start Help", included: true }
        ],
        moreServicesCount: 0,
        originalPrice: 0,
        discountedPrice: 0,
        duration: "",
        specialLabel: "",
        offer: undefined,
        isRecommended: false
      },
      { sectionTitle: "Alternator" },
      {
        id: "alternator-replacement",
        name: "Alternator Replacement",
        thumbnail: "/images/service_icons/car_inspection.png",
        warranty: "1 Month Warranty",
        recommended: "Recommended in case of frequently discharging battery",
        features: [
          { name: "Alternator Replacement", included: true },
          { name: "Alternator Belt Adjusted", included: true },
          { name: "Free Pickup & Drop", included: true }
        ],
        moreServicesCount: 0,
        originalPrice: 0,
        discountedPrice: 0,
        duration: "",
        specialLabel: "",
        offer: undefined,
        isRecommended: false
      },
      {
        id: "alternator-repair",
        name: "Alternator Repair",
        thumbnail: "/images/service_icons/car_inspection.png",
        warranty: "3 Months Warranty",
        recommended: "Recommended in case of frequently discharging battery",
        features: [
          { name: "Cleaning & Fitting of Alternator", included: true },
          { name: "Alternator Belt Adjusted", included: true },
          { name: "Free Pickup & Drop", included: true }
        ],
        moreServicesCount: 0,
        originalPrice: 0,
        discountedPrice: 0,
        duration: "",
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
    ],
    "car-inspections": [
      {
        id: "basic-inspection",
        name: "Basic Car Inspection",
        thumbnail: "/images/Services/car_inspection.png",
        warranty: "1 Month Inspection Report",
        recommended: "For Used Car Purchase or Regular Check-up",
        features: [
          { name: "Engine Performance Check", included: true },
          { name: "Brake System Inspection", included: true },
          { name: "Tyre Condition Assessment", included: true },
          { name: "Light & Electrical Check", included: true },
          { name: "Basic Safety Check", included: true },
        ],
        moreServicesCount: 3,
        originalPrice: 1999,
        discountedPrice: 1499,
        duration: "Takes 2 hours",
        specialLabel: "FREE PICKUP & DROP",
        offer: {
          price: 1199,
          discount: "Extra ₹300 OFF",
          badgeColor: "bg-blue-500"
        },
        isRecommended: false
      },
      {
        id: "comprehensive-inspection",
        name: "Comprehensive Inspection",
        thumbnail: "/images/Services/car_inspection.png",
        warranty: "3 Month Inspection Report",
        recommended: "For Pre-Purchase or Complete Health Check",
        features: [
          { name: "Complete Engine Diagnostics", included: true },
          { name: "Brake & Suspension Check", included: true },
          { name: "AC System Inspection", included: true },
          { name: "Electrical System Check", included: true },
          { name: "Body & Paint Assessment", included: true },
          { name: "Interior & Exterior Check", included: true },
        ],
        moreServicesCount: 8,
        originalPrice: 3499,
        discountedPrice: 2699,
        duration: "Takes 4 hours",
        specialLabel: "DETAILED REPORT",
        offer: {
          price: 2299,
          discount: "Extra ₹400 OFF",
          badgeColor: "bg-blue-500"
        },
        isRecommended: true
      },
      {
        id: "pre-purchase-inspection",
        name: "Pre-Purchase Inspection",
        thumbnail: "/images/Services/car_inspection.png",
        warranty: "6 Month Inspection Report",
        recommended: "Before Buying a Used Car",
        features: [
          { name: "Complete Vehicle History", included: true },
          { name: "Engine & Transmission Check", included: true },
          { name: "Accident & Flood Check", included: true },
          { name: "Legal Document Verification", included: true },
          { name: "Market Value Assessment", included: true },
          { name: "Expert Recommendation", included: true },
        ],
        moreServicesCount: 12,
        originalPrice: 4999,
        discountedPrice: 3799,
        duration: "Takes 6 hours",
        specialLabel: "EXPERT CERTIFIED",
        offer: {
          price: 3299,
          discount: "Extra ₹500 OFF",
          badgeColor: "bg-blue-500"
        },
        isRecommended: true
      }
    ],
    "car-insurance": [
      {
        id: "comprehensive-insurance",
        name: "Comprehensive Car Insurance",
        thumbnail: "/images/Services/car_insurance.png",
        warranty: "1 Year Policy Coverage",
        recommended: "Complete Protection for Your Car",
        features: [
          { name: "Accident Coverage", included: true },
          { name: "Theft Protection", included: true },
          { name: "Natural Disaster Coverage", included: true },
          { name: "Third Party Coverage", included: true },
          { name: "Personal Accident Cover", included: true },
        ],
        moreServicesCount: 5,
        originalPrice: 25999,
        discountedPrice: 19499,
        duration: "Instant Policy",
        specialLabel: "ZERO DEPRECIATION",
        offer: {
          price: 16999,
          discount: "Extra ₹2500 OFF",
          badgeColor: "bg-green-500"
        },
        isRecommended: true
      },
      {
        id: "third-party-insurance",
        name: "Third Party Insurance",
        thumbnail: "/images/Services/car_insurance.png",
        warranty: "1 Year Policy Coverage",
        recommended: "Legal Mandatory Coverage",
        features: [
          { name: "Third Party Liability", included: true },
          { name: "Legal Compliance", included: true },
          { name: "Court Case Protection", included: true },
          { name: "Instant Policy Issuance", included: true },
        ],
        moreServicesCount: 2,
        originalPrice: 3999,
        discountedPrice: 2999,
        duration: "Instant Policy",
        specialLabel: "MANDATORY COVERAGE",
        offer: {
          price: 2499,
          discount: "Extra ₹500 OFF",
          badgeColor: "bg-orange-500"
        },
        isRecommended: false
      },
      {
        id: "zero-dep-insurance",
        name: "Zero Depreciation Insurance",
        thumbnail: "/images/Services/car_insurance.png",
        warranty: "1 Year Policy Coverage",
        recommended: "Maximum Coverage for New Cars",
        features: [
          { name: "Zero Depreciation Claims", included: true },
          { name: "Complete Accident Coverage", included: true },
          { name: "Engine Protection", included: true },
          { name: "Roadside Assistance", included: true },
          { name: "Cashless Garage Network", included: true },
          { name: "Personal Accident Cover", included: true },
        ],
        moreServicesCount: 8,
        originalPrice: 35999,
        discountedPrice: 27999,
        duration: "Instant Policy",
        specialLabel: "PREMIUM PROTECTION",
        offer: {
          price: 24999,
          discount: "Extra ₹3000 OFF",
          badgeColor: "bg-purple-500"
        },
        isRecommended: true
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
      <div className="pt-0 pb-8">
        <div className="max-w-[1400px] mx-auto pl-2 pr-6">
          <div className="flex gap-8">
            {/* Left Content Area */}
            <div className="flex-1 max-w-[1280px]">
              {/* Category Navigation */}
              <div className="mb-6">
              <CategoryTabs
                categories={serviceCategories}
                activeCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
              />
            </div>

              {/* Service Packages Section */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-8">
                  {selectedCategory === "ac-service" ? "Service Packages" :
                   selectedCategory === "batteries" ? "Batteries" :
                   selectedCategory === "tyres" ? "Premium Tyres" :
                   selectedCategory === "car-inspections" ? "Inspection Services" :
                   selectedCategory === "car-insurance" ? "Insurance Plans" : "Scheduled Packages"}
                </h2>

          <div className="space-y-6">
                  {((servicePackages[selectedCategory as keyof typeof servicePackages] || servicePackages["car-services"])
                      .filter((pkg) => !(
                        selectedCategory === "batteries" && (
                          (pkg.name?.includes("Cooling Coil Replacement")) ||
                          (typeof (pkg as any).id === "string" && (pkg as any).id.includes("cooling-coil"))
                        )
                      )))
                    .map((pkg) => (
                    <Fragment key={pkg.id}>
                      {pkg.sectionTitle ? (
                        <h3 className="text-lg font-semibold text-gray-700 uppercase tracking-wide mt-10">
                          {pkg.sectionTitle}
                        </h3>
                      ) : (
              <ServiceCard
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
                          descriptions={pkg.descriptions}
                variant={["car-services", "batteries"].includes(selectedCategory) ? "gom" : "default"}
                onAddToCart={handleAddToCart}
              />
                      )}
                    </Fragment>
            ))}
          </div>
        </div>

              {/* Statistics Section */}
              <div className="bg-gray-100 rounded-2xl mt-16 py-12 px-8">
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
            <div className="w-full xl:w-[360px] flex-shrink-0 mt-10 xl:mt-0 xl:ml-16">
              <div className="xl:sticky xl:top-20">
                <BrandSelectorModal
                  variant="sidebar"
                  selectedBrand={selectedBrand}
                  onBrandSelect={setSelectedBrand}
                  className="h-[500px] xl:h-[520px] max-h-[70vh] overflow-hidden rounded-2xl shadow-[0px_6px_30px_rgba(0,0,0,0.25)] bg-white"
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