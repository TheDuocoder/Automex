import { Fragment, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ServiceCard from "@/components/ServiceCard";
import CategoryTabs from "@/components/CategoryTabs";
import BrandSelectorModal from "@/components/BrandSelectorModal";

interface ServicePackage {
  id?: string;
  name?: string;
  thumbnail?: string;
  warranty?: string;
  recommended?: string;
  features?: { name: string; included: boolean; details?: string; }[];
  moreServicesCount?: number;
  originalPrice?: number;
  discountedPrice?: number;
  duration?: string;
  specialLabel?: string;
  offer?: {
    price: number;
    discount: string;
    badgeColor?: string;
  };
  isRecommended?: boolean;
  descriptions?: string[];
  sectionTitle?: string;
  expertRating?: string;
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
      name: "Suspension & Fitting",
      icon: <img src="/images/service_icons/car_suspensions and fitments.png" alt="Suspension & Fitting" className="h-10 w-10 object-contain" />
    },
    {
      id: "car-spa",
      name: "Spa",
      icon: <img src="/images/service_icons/car_spa and cleaning.png" alt="Spa" className="h-10 w-10 object-contain" />
    },
    {
      id: "clutch-body-parts",
      name: "Clutch & Body Parts",
      icon: <img src="/images/service_icons/car_clutch and body_parts.png" alt="Clutch & Body Parts" className="h-10 w-10 object-contain" />
    },
    {
      id: "windshield-lights",
      name: "Windshields & Lights",
      icon: <img src="/images/service_icons/car_windshiled and lights2.png" alt="Windshields & Lights" className="h-10 w-10 object-contain" />
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
      thumbnail: "/images/product_images/Car services/Basic Service.png",
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
      thumbnail: "/images/product_images/Car services/Standard Service.png",
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
      thumbnail: "/images/product_images/Car services/Comprehensive Service.png",
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
      thumbnail: "/images/product_images/Car services/frontbrakes.png",
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
      thumbnail: "/images/product_images/Car services/rearbreak_shoes.png",
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
      thumbnail: "/images/product_images/Car services/frontbrake_disk.png",
      warranty: "1 Month Warranty • Corrosion Resistance",
      recommended: "Best Performance (Single OE Unit)",
      features: [
        { name: "Opening & Fitting of Front Brake Disc", included: true },
        { name: "Reduces Vibrations & Brake Noise", included: true },
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
      thumbnail: "/images/product_images/Car services/caliperpin_replacement.png",
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
      thumbnail: "/images/product_images/Car services/break_drums_turning.png",
      warranty: "1 Month Warranty",
      recommended: "Recommended : In Case of Screeching Noise from Brakes",
      features: [
        { name: "Brake Drums Turning", included: true },
        { name: "Refacing of Brake Drums", included: true },
        { name: "Free Pickup & Drop", included: true },
        { name: "Opening & Fitting of Brake Drums", included: true },
        { name: "Applicable for Set of 2 Brake Drums", included: true }
      ],
      moreServicesCount: 0,
      originalPrice: 1124,
      discountedPrice: 899,
      duration: "4 Hours",
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
      thumbnail: "/images/product_images/Car services/handbrack_wire.png",
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
    },
    {
      id: "wheel-cylinder-replacement",
      name: "Wheel Cylinder Replacement",
      thumbnail: "/images/product_images/Car services/wheel_cylinder_replacement.png",
      warranty: "Recommended : In case of Poor Braking",
      recommended: "Wheel Cylinder Replacement (OES)",
      features: [
        { name: "Wheel Cylinder Replacement (OES)", included: true },
        { name: "Brake Shoe & Brake Fluid Cost Additional", included: true },
        { name: "Spare Part Price Only", included: true },
        { name: "Free Pickup & Drop", included: true }
      ],
      moreServicesCount: 0,
      originalPrice: 1476,
      discountedPrice: 1181,
      duration: "6 Hours",
      specialLabel: "LABOUR INCLUDED",
      isRecommended: false,
      descriptions: [
        "Professional wheel cylinder replacement service with OES parts.",
        "Includes brake system inspection and performance verification."
      ]
    },

    {
      id: "caliper-pin-greasing",
      name: "Caliper Pin Greasing",
      thumbnail: "/images/product_images/Car services/cliper_pin_greasing.png",
      warranty: "",
      recommended: "Recommended: In case of Brake Noise or Sticking",
      features: [
        { name: "Caliper Pin Greasing", included: true }
      ],
      moreServicesCount: 0,
      originalPrice: 1499,
      discountedPrice: 149,
      duration: "1 Hour",
      isRecommended: false
    },
    {
      id: "front-brake-pads-cleaning",
      name: "Front Brake Pads Cleaning",
      thumbnail: "/images/product_images/Car services/front_breakpad_cleaning.png",
      warranty: "",
      recommended: "Recommended: In case of Brake Vibration or Noise",
      features: [
        { name: "Front Brake Pad Cleaning", included: true }
      ],
      moreServicesCount: 0,
      originalPrice: 1499,
      discountedPrice: 149,
      duration: "Takes 1 Hour",
      isRecommended: false
    },
    {
      id: "rear-brake-pads-shoes-cleaning",
      name: "Rear Brake Pads / Shoes Cleaning",
      thumbnail: "/images/product_images/Car services/ Rear Brake Pads.png",
      warranty: "",
      recommended: "Recommended: In case of Brake Noise or Reduced Performance",
      features: [
        { name: "Rear Brake Shoe / Pad Cleaning", included: true }
      ],
      moreServicesCount: 0,
      originalPrice: 1499,
      discountedPrice: 149,
      duration: "Takes 1 Hour",
      isRecommended: false
    },
    {
      id: "wiper-fluid-replacement",
      name: "Wiper Fluid Replacement",
      thumbnail: "/images/product_images/Car services/wiper_fluid.png",
      warranty: "",
      recommended: "Every 1 Month Recommended • Applicable on Walk-ins Only",
      features: [
        { name: "Wiper Fluid Replacement", included: true },
        { name: "Wiper Assembly Check", included: true }
      ],
      moreServicesCount: 0,
      originalPrice: 499,
      discountedPrice: 49,
      duration: "Takes 30 Minutes",
      isRecommended: false
    },
    {
      id: "headlight-adjustment",
      name: "Headlight Adjustment",
      thumbnail: "/images/product_images/Car services/headlight_adustment.png",
      warranty: "",
      recommended: "Recommended: In Case of Poor Road Visibility • Applicable on Walk-ins Only",
      features: [
        { name: "Headlight Bulb Adjustment", included: true },
        { name: "Headlight Wiring Inspection", included: true }
      ],
      moreServicesCount: 0,
      originalPrice: 499,
      discountedPrice: 49,
      duration: "Takes 30 Minutes",
      isRecommended: false
    }
    ],
    "suspension-fitting": [
      {
        id: "steering-heading",
        name: "Steering",
        thumbnail: "",
        warranty: "",
        recommended: "",
        features: [],
        moreServicesCount: 0,
        originalPrice: 0,
        discountedPrice: 0,
        duration: "",
        sectionTitle: "Steering",
        isRecommended: false
      },
      {
        id: "eps-motor-repair",
        name: "EPS Module Repair",
        thumbnail: "/images/product_images/Suspension & Fittings/eps_module.png",
        warranty: "1 Month Warranty",
        recommended: "Heavy/jerky steering • EPS warning",
        features: [
          { name: "EPS Module Overhaul/Repair", included: true },
          { name: "Calibration & Fault Clear (If Required)", included: true }
        ],
        moreServicesCount: 0,
        originalPrice: 5499,
        discountedPrice: 4499,
        duration: "Takes 4-6 Hours",
        specialLabel: "RECOMMENDED",
        isRecommended: false
      },
      {
        id: "steering-rack-repair",
        name: "Steering Rack Repair",
        thumbnail: "/images/product_images/Suspension & Fittings/Steering Rack Repair.png",
        warranty: "1 Month Warranty",
        recommended: "Oil leak/knocking from rack",
        features: [
          { name: "Rack Overhaul/Seal Kit Replacement", included: true },
          { name: "Tie Rod End Check & Alignment Advice", included: true }
        ],
        moreServicesCount: 0,
        originalPrice: 7999,
        discountedPrice: 6599,
        duration: "Takes 1 Day",
        specialLabel: "",
        isRecommended: false
      },

      {
        id: "suspension-heading",
        name: "Suspension",
        thumbnail: "",
        warranty: "",
        recommended: "",
        features: [],
        moreServicesCount: 0,
        originalPrice: 0,
        discountedPrice: 0,
        duration: "",
        sectionTitle: "Suspension",
        isRecommended: false
      },
      {
        id: "front-shock-absorber",
        name: "Front Shock Absorber Replacement",
        thumbnail: "/images/product_images/Suspension & Fittings/Front Shock Absorber Replacement.png",
        warranty: "1 Month Warranty",
        recommended: "Bouncy ride • Oil leak on strut",
        features: [
          { name: "Opening & Fitting of Front Strut", included: true },
          { name: "Mount/Bearing Inspection", included: true }
        ],
        moreServicesCount: 0,
        originalPrice: 3299,
        discountedPrice: 2799,
        duration: "Takes 3 Hours",
        specialLabel: "",
        isRecommended: false
      },
      {
        id: "rear-shock-absorber",
        name: "Rear Shock Absorber Replacement",
        thumbnail: "/images/Landing_page_images/rear shock abserber .png",
        warranty: "1 Month Warranty",
        recommended: "Bouncy ride • Oil leak on damper",
        features: [
          { name: "Opening & Fitting of Rear Shock", included: true },
          { name: "Bushes/Link Inspection", included: true }
        ],
        moreServicesCount: 0,
        originalPrice: 2799,
        discountedPrice: 2299,
        duration: "Takes 2 Hours",
        specialLabel: "",
        isRecommended: false
      },
      {
        id: "lower-arm-replacement",
        name: "Suspension Lower Arm Replacement",
        thumbnail: "/images/product_images/Suspension & Fittings/Suspension Lower Arm Replacement.png",
        warranty: "1 Month Warranty",
        recommended: "Knocking • Drifting while driving",
        features: [
          { name: "Opening & Fitting of Lower Arm", included: true },
          { name: "Bush/Ball Joint Fitment", included: true }
        ],
        moreServicesCount: 0,
        originalPrice: 3299,
        discountedPrice: 2799,
        duration: "Takes 2-3 Hours",
        specialLabel: "",
        isRecommended: false
      },
      {
        id: "link-rod-replacement",
        name: "Link Rod Replacement",
        thumbnail: "/images/product_images/Suspension & Fittings/Link Rod Replacement.png",
        warranty: "1 Month Warranty",
        recommended: "Rattling from rough roads",
        features: [
          { name: "Opening & Fitting of Stabilizer Link", included: true },
          { name: "Both Sides Inspection", included: true }
        ],
        moreServicesCount: 0,
        originalPrice: 1599,
        discountedPrice: 1299,
        duration: "Takes 60-90 mins",
        specialLabel: "",
        isRecommended: false
      },
      {
        id: "tie-rod-end-replacement",
        name: "Tie Rod End Replacement",
        thumbnail: "/images/product_images/Suspension & Fittings/Tie Rod End Replacement.png",
        warranty: "1 Month Warranty",
        recommended: "Vibration • Uneven tyre wear",
        features: [
          { name: "Opening & Fitting of Tie Rod End", included: true },
          { name: "Alignment Recommendation", included: true }
        ],
        moreServicesCount: 0,
        originalPrice: 1799,
        discountedPrice: 1499,
        duration: "Takes 60-90 mins",
        specialLabel: "",
        isRecommended: false
      },
      {
        id: "front-axle-repair",
        name: "Front Axle Repair",
        thumbnail: "/images/product_images/Suspension & Fittings/Front Axle Repair.png",
        warranty: "1 Month Warranty",
        recommended: "Vibration while accelerating • Clicking while turning",
        features: [
          { name: "CV Joint/Boot Inspection", included: true },
          { name: "Greasing & Refit/Replacement Advice", included: true }
        ],
        moreServicesCount: 0,
        originalPrice: 4499,
        discountedPrice: 3799,
        duration: "Takes 3-4 Hours",
        specialLabel: "",
        isRecommended: false
      },

      {
        id: "fitting-heading",
        name: "Fitting",
        thumbnail: "",
        warranty: "",
        recommended: "",
        features: [],
        moreServicesCount: 0,
        originalPrice: 0,
        discountedPrice: 0,
        duration: "",
        sectionTitle: "Fitting",
        isRecommended: false
      },
      {
        id: "engine-mount-replacement",
        name: "Engine Mount Replacement",
        thumbnail: "/images/product_images/Suspension & Fittings/engine_mounting.png",
        warranty: "1 Month Warranty",
        recommended: "Vibration in cabin • Broken mount",
        features: [
          { name: "Opening & Fitting of Mount", included: true },
          { name: "Torque Tightening", included: true }
        ],
        moreServicesCount: 0,
        originalPrice: 2499,
        discountedPrice: 1999,
        duration: "Takes 2 Hours",
        specialLabel: "",
        isRecommended: false
      },
      {
        id: "gearbox-mount-replacement",
        name: "Gearbox Mount Replacement",
        thumbnail: "/images/product_images/Suspension & Fittings/Gearbox Mount Replacement.png",
        warranty: "1 Month Warranty",
        recommended: "Clunk when shifting • Excess movement",
        features: [
          { name: "Opening & Fitting of Mount", included: true },
          { name: "Alignment Check", included: true }
        ],
        moreServicesCount: 0,
        originalPrice: 2499,
        discountedPrice: 1999,
        duration: "Takes 2 Hours",
        specialLabel: "",
        isRecommended: false
      },
      {
        id: "fuel-pump-replacement",
        name: "Fuel Pump Replacement",
        thumbnail: "/images/product_images/Suspension & Fittings/Fuel Pump Replacement.png",
        warranty: "1 Month Warranty",
        recommended: "In Case of Car Jerking while Accelerating",
        features: [
          { name: "Fuel Pump Assy. Replacement", included: true },
          { name: "Fuel Line & Injectors Cleaning Cost Additional ( If Needed )", included: true },
          { name: "Free Pickup & Drop", included: true },
          { name: "OES Spare Part Cost Only", included: true },
          { name: "Fuel Pipes Cost Additional ( If Needed )", included: true }
        ],
        moreServicesCount: 0,
        originalPrice: 7556,
        discountedPrice: 6300,
        duration: "Takes 8 Hours",
        specialLabel: "Extra ₹500 OFF",
        isRecommended: false
      },
      {
        id: "ecm-repair",
        name: "ECM Repair",
        thumbnail: "/images/product_images/Suspension & Fittings/ecm_repair.png",
        warranty: "1 Month Warranty",
        recommended: "In case of Car Not Starting",
        features: [
          { name: "ECM Repair", included: true },
          { name: "Opening & Fitting of ECM", included: true },
          { name: "Free Pickup & Drop", included: true },
          { name: "Repairing of Electrical Circuits with Diodes & Capacitor", included: true },
          { name: "Circuit Board & Programming Cost Additional", included: true }
        ],
        moreServicesCount: 0,
        originalPrice: 7647,
        discountedPrice: 6500,
        duration: "Takes 8 Hours",
        specialLabel: "",
        isRecommended: false
      },
      {
        id: "water-pump-replacement",
        name: "Water Pump Replacement",
        thumbnail: "/images/product_images/Suspension & Fittings/Water Pump Replacement.png",
        warranty: "1 Month Warranty",
        recommended: "In case of Engine Overheating",
        features: [
          { name: "Water Pump Replacement (OES)", included: true },
          { name: "Coolant and Radiator Flush Cost Addtional", included: true },
          { name: "Spare Part Cost Only", included: true },
          { name: "Free Pickup & Drop", included: true }
        ],
        moreServicesCount: 0,
        originalPrice: 8379,
        discountedPrice: 7122,
        duration: "Takes 6 Hours",
        specialLabel: "",
        isRecommended: false
      },
      {
        id: "mud-flaps",
        name: "Mud Flaps",
        thumbnail: "/images/product_images/Suspension & Fittings/Mud Flaps.png",
        warranty: "1 Month Warranty on Fitting",
        recommended: "Excellent Durability",
        features: [
          { name: "Mud Flaps Set of 4", included: true },
          { name: "Protects Car Underbody", included: true },
          { name: "Prevents Soil Accumulation", included: true },
          { name: "Easy Fitment", included: true }
        ],
        moreServicesCount: 0,
        originalPrice: 824,
        discountedPrice: 700,
        duration: "Takes 2 Hours",
        specialLabel: "",
        isRecommended: false
      },
      {
        id: "door-latch-repair",
        name: "Door Latch Repair",
        thumbnail: "/images/product_images/Suspension & Fittings/Door Latch Repair.png",
        warranty: "1 Month Warranty",
        recommended: "Door not locking/closing properly",
        features: [
          { name: "Latch Repair/Adjustment", included: true },
          { name: "Greasing & Rod Link Check", included: true }
        ],
        moreServicesCount: 0,
        originalPrice: 1299,
        discountedPrice: 999,
        duration: "Takes 60 mins",
        specialLabel: "",
        isRecommended: false
      },
      {
        id: "power-window-repair",
        name: "Power Window Repair",
        thumbnail: "/images/product_images/Suspension & Fittings/Power Window Repair.png",
        warranty: "1 Month Warranty",
        recommended: "In Case of Window Not Working • In Case of Hard Window Functioning",
        features: [
          { name: "Power Window Mechanism Repair", included: true },
          { name: "Power Window Switch Cost Additional", included: true },
          { name: "Power Window Motor Cost Additional", included: true },
          { name: "Free Pickup & Drop", included: true }
        ],
        moreServicesCount: 0,
        originalPrice: 1443,
        discountedPrice: 1299,
        duration: "Takes 6 Hours",
        specialLabel: "",
        isRecommended: false
      },

      {
        id: "custom-issues-heading",
        name: "Custom Issues",
        thumbnail: "",
        warranty: "",
        recommended: "",
        features: [],
        moreServicesCount: 0,
        originalPrice: 0,
        discountedPrice: 0,
        duration: "",
        sectionTitle: "Custom Issues",
        isRecommended: false
      },
      {
        id: "noises-suspension-steering",
        name: "Noises with Car Suspension & Steering",
        thumbnail: "/images/product_images/Suspension & Fittings/Noises with Car Suspension & Steering.png",
        warranty: "",
        recommended: "In Case of Noise Coming from Suspension • In Case of Loose Steering Wheel",
        features: [
          { name: "Steering System Inspection", included: true },
          { name: "25 Points Check-List", included: true },
          { name: "Complete Suspension Inspection", included: true },
          { name: "Free Pickup & Drop", included: true }
        ],
        moreServicesCount: 0,
        originalPrice: 640,
        discountedPrice: 499,
        duration: "Takes 6 Hours",
        specialLabel: "",
        isRecommended: false
      },
      {
        id: "faulty-electricals",
        name: "Faulty Electricals",
        thumbnail: "/images/product_images/Suspension & Fittings/Faulty Electricals.png",
        warranty: "",
        recommended: "In Case of Electrical Malfunctioning • In Case of Dead Battery",
        features: [
          { name: "Full Car Scanning", included: true },
          { name: "Detailed Health Card", included: true },
          { name: "25 Points Check-List", included: true },
          { name: "Free Pickup & Drop", included: true }
        ],
        moreServicesCount: 0,
        originalPrice: 657,
        discountedPrice: 499,
        duration: "Takes 6 Hours",
        specialLabel: "",
        isRecommended: false
      }
    ],
    "clutch-body-parts": [
      {
        id: "clutch-heading",
        name: "Clutch",
        thumbnail: "",
        warranty: "",
        recommended: "",
        features: [],
        moreServicesCount: 0,
        originalPrice: 0,
        discountedPrice: 0,
        duration: "",
        sectionTitle: "Clutch",
        isRecommended: false
      },
      {
        id: "clutch-set-replacement",
        name: "Clutch Set Replacement",
        thumbnail: "/images/product_images/Clutch and Body parts/Clutch Set Replacement.png",
        warranty: "1 Month Warranty",
        recommended: "Juddering, slipping or hard clutch pedal",
        features: [
          { name: "Opening & Fitting of Clutch Assembly", included: true },
          { name: "Pressure Plate, Clutch Plate Replacement", included: true },
          { name: "Gearbox Opening & Refit", included: true }
        ],
        moreServicesCount: 0,
        originalPrice: 7999,
        discountedPrice: 6599,
        duration: "Takes 6-8 Hours",
        specialLabel: "",
        isRecommended: false
      },
      {
        id: "flywheel-replacement",
        name: "Flywheel Replacement",
        thumbnail: "/images/product_images/Clutch and Body parts/Flywheel Replacement.png",
        warranty: "1 Month Warranty",
        recommended: "Chatter, vibration or damaged flywheel",
        features: [
          { name: "Flywheel Replacement", included: true },
          { name: "Clutch Alignment", included: true }
        ],
        moreServicesCount: 0,
        originalPrice: 6499,
        discountedPrice: 5299,
        duration: "Takes 6 Hours",
        specialLabel: "",
        isRecommended: false
      },
      {
        id: "clutch-bearing-replacement",
        name: "Clutch Bearing Replacement",
        thumbnail: "/images/product_images/Clutch and Body parts/Clutch Bearing Replacement.png",
        warranty: "1 Month Warranty",
        recommended: "Whining/humming noise while pressing clutch",
        features: [
          { name: "Release/Throwout Bearing Replacement", included: true },
          { name: "Greasing & Pedal Free-play Adjust", included: true }
        ],
        moreServicesCount: 0,
        originalPrice: 3299,
        discountedPrice: 2799,
        duration: "Takes 4 Hours",
        specialLabel: "",
        isRecommended: false
      },
      {
        id: "flywheel-turning",
        name: "Flywheel Turning",
        thumbnail: "/images/product_images/Clutch and Body parts/Flywheel Turning.png",
        warranty: "Smooth surface finish",
        recommended: "Recommended with new clutch set (if required)",
        features: [
          { name: "Lathe Turning of Flywheel Surface", included: true },
          { name: "Runout Check & Cleaning", included: true }
        ],
        moreServicesCount: 0,
        originalPrice: 1999,
        discountedPrice: 1599,
        duration: "Takes 2 Hours",
        specialLabel: "",
        isRecommended: false
      },
      {
        id: "clutch-overhaul",
        name: "Clutch Overhaul",
        thumbnail: "/images/product_images/Clutch and Body parts/Clutch Overhaul.png",
        warranty: "1 Month Warranty",
        recommended: "Complete clutch refresh",
        features: [
          { name: "Clutch, Bearing & Cable/Fluid Check", included: true },
          { name: "Gearbox Seal Inspection", included: true }
        ],
        moreServicesCount: 0,
        originalPrice: 0,
        discountedPrice: 0,
        duration: "Takes 1 Day",
        specialLabel: "RECOMMENDED",
        isRecommended: false
      },

      {
        id: "body-parts-heading",
        name: "Body Parts",
        thumbnail: "",
        warranty: "",
        recommended: "",
        features: [],
        moreServicesCount: 0,
        originalPrice: 0,
        discountedPrice: 0,
        duration: "",
        sectionTitle: "Body Parts",
        isRecommended: false
      },
      {
        id: "front-bumper-replacement",
        name: "Front Bumper Replacement",
        thumbnail: "/images/product_images/Clutch and Body parts/Front Bumper Replacement.png",
        warranty: "Fitment Warranty",
        recommended: "Damaged or cracked bumper",
        features: [
          { name: "Bumper Removal & Fitting", included: true },
          { name: "Sensors/Brackets Transfer", included: true }
        ],
        moreServicesCount: 0,
        originalPrice: 0,
        discountedPrice: 0,
        duration: "Takes 2-3 Hours",
        specialLabel: "",
        isRecommended: false
      },
      {
        id: "rear-bumper-replacement",
        name: "Rear Bumper Replacement",
        thumbnail: "/images/product_images/Clutch and Body parts/Rear Bumper Replacement.png",
        warranty: "Fitment Warranty",
        recommended: "Damaged or cracked bumper",
        features: [
          { name: "Bumper Removal & Fitting", included: true },
          { name: "Sensors/Brackets Transfer", included: true }
        ],
        moreServicesCount: 0,
        originalPrice: 0,
        discountedPrice: 0,
        duration: "Takes 2-3 Hours",
        specialLabel: "",
        isRecommended: false
      },
      {
        id: "right-front-door-handle",
        name: "Right Front Door Replacement",
        thumbnail: "/images/product_images/Clutch and Body parts/Right Front Door Replacement.png",
        warranty: "Fitment Warranty",
        recommended: "Damaged door shell",
        features: [
          { name: "Door Trim Opening & Fitting", included: true },
          { name: "Handle Linkages Refit", included: true }
        ],
        moreServicesCount: 0,
        originalPrice: 0,
        discountedPrice: 0,
        duration: "Takes 60-90 mins",
        specialLabel: "",
        isRecommended: false
      },
      {
        id: "right-rear-door-handle",
        name: "Right Rear Door Replacement",
        thumbnail: "/images/product_images/Clutch and Body parts/Right Rear Door Replacement.png",
        warranty: "Fitment Warranty",
        recommended: "Damaged door shell",
        features: [
          { name: "Door Trim Opening & Fitting", included: true },
          { name: "Handle Linkages Refit", included: true }
        ],
        moreServicesCount: 0,
        originalPrice: 0,
        discountedPrice: 0,
        duration: "Takes 60-90 mins",
        specialLabel: "",
        isRecommended: false
      },
      {
        id: "right-fender-replacement",
        name: "Right Fender Replacement",
        thumbnail: "/images/product_images/Clutch and Body parts/fender.png",
        warranty: "Fitment Warranty",
        recommended: "Damaged fender panel",
        features: [
          { name: "Removal & Fitting of Fender", included: true },
          { name: "Alignment & Gaps Check", included: true }
        ],
        moreServicesCount: 0,
        originalPrice: 0,
        discountedPrice: 0,
        duration: "Takes 2 Hours",
        specialLabel: "",
        isRecommended: false
      },
      {
        id: "boot-replacement",
        name: "Boot Replacement",
        thumbnail: "/images/product_images/Clutch and Body parts/Boot Replacement.png",
        warranty: "Fitment Warranty",
        recommended: "In Case Corroded Boot • In Case Broken / Damaged Boot",
        features: [
          { name: "Boot Replacement", included: true },
          { name: "Opening & Fitting of Boot", included: true },
          { name: "Hinges, Rod Spring / Shocker Cost Additional", included: true },
          { name: "Paint Cost Additional", included: true },
          { name: "Free Pickup & Drop", included: true }
        ],
        moreServicesCount: 0,
        originalPrice: 7300,
        discountedPrice: 6570,
        duration: "Takes 6 Hours",
        specialLabel: "",
        isRecommended: false
      },
      {
        id: "bonnet-replacement",
        name: "Bonnet Replacement",
        thumbnail: "/images/product_images/Clutch and Body parts/Bonnet Replacement.png",
        warranty: "Fitment Warranty",
        recommended: "Damaged bonnet",
        features: [
          { name: "Hinges/Struts Transfer", included: true },
          { name: "Bonnet Latch Adjustment", included: true }
        ],
        moreServicesCount: 0,
        originalPrice: 0,
        discountedPrice: 0,
        duration: "Takes 3 Hours",
        specialLabel: "",
        isRecommended: false
      },
      {
        id: "left-front-door-replacement",
        name: "Left Front Door Replacement",
        thumbnail: "/images/product_images/Clutch and Body parts/Left Front Door Replacement.png",
        warranty: "Fitment Warranty",
        recommended: "In Case Corroded Door • In Case Broken / Damaged Door",
        features: [
          { name: "Left Front Door Replacement (Single Unit)", included: true },
          { name: "Opening & Fitting of Left Front Door", included: true },
          { name: "Hinges, Weatherstrip, Handle, Cost Additional", included: true },
          { name: "Trim, Lock, Window Glass & Channel Cost Additional", included: true },
          { name: "Paint Cost Additional", included: true },
          { name: "Free Pickup & Drop", included: true }
        ],
        moreServicesCount: 0,
        originalPrice: 10286,
        discountedPrice: 9257,
        duration: "Takes 6 Hours",
        specialLabel: "",
        isRecommended: false
      },
      {
        id: "rear-door-replacement-left",
        name: "Left Rear Door Replacement",
        thumbnail: "/images/product_images/Clutch and Body parts/Left Rear Door Replacement.png",
        warranty: "Fitment Warranty",
        recommended: "Damaged door shell",
        features: [
          { name: "Opening & Fitting of Door", included: true },
          { name: "Transfer of Locks/Glass/Trim", included: true }
        ],
        moreServicesCount: 0,
        originalPrice: 0,
        discountedPrice: 0,
        duration: "Takes 4-6 Hours",
        specialLabel: "",
        isRecommended: false
      },

      {
        id: "custom-issues-heading",
        name: "Custom Issues",
        thumbnail: "",
        warranty: "",
        recommended: "",
        features: [],
        moreServicesCount: 0,
        originalPrice: 0,
        discountedPrice: 0,
        duration: "",
        sectionTitle: "Custom Issues",
        isRecommended: false
      },
      {
        id: "clutch-transmission-trouble",
        name: "Clutch & Transmission Trouble",
        thumbnail: "/images/product_images/Clutch and Body parts/Clutch & Transmission Trouble.png",
        warranty: "Diagnosis Report",
        recommended: "Grinding gears, slipping clutch, hard shifts",
        features: [
          { name: "Road Test & Inspection", included: true },
          { name: "Recommendations & Estimate", included: true }
        ],
        moreServicesCount: 0,
        originalPrice: 999,
        discountedPrice: 799,
        duration: "Takes 60-90 mins",
        specialLabel: "",
        isRecommended: false
      },
      {
        id: "all-doors-adjustment",
        name: "All Doors Adjustment",
        thumbnail: "/images/product_images/Clutch and Body parts/All Doors Adjustment2.png",
        warranty: "",
        recommended: "In case of Door Alignment Issues",
        features: [
          { name: "All Door Adjustment (Alignment", included: true },
          { name: "and Lock Inspection)", included: true },
          { name: "Hinges", included: true }
        ],
        moreServicesCount: 0,
        originalPrice: 2499,
        discountedPrice: 249,
        duration: "Takes 1 Hour",
        specialLabel: "Under 249",
        isRecommended: false
      }

    ],
    "windshield-lights": [
      {
        id: "windshields-heading",
        name: "Windshields",
        thumbnail: "",

        warranty: "",
        recommended: "",
        features: [],
        moreServicesCount: 0,
        originalPrice: 0,
        discountedPrice: 0,
        duration: "",
        sectionTitle: "Windshields",
        isRecommended: false
      },
      {
        id: "front-windshield-replacement",
        name: "Front Windshield Replacement",
        thumbnail: "/images/product_images/Windshield & lights/Front Windshield Replacement.png",
        warranty: "1 Year Sealant Warranty",
        recommended: "OEM Spec Glass • Cashless Support Available",
        features: [
          { name: "Opening & Fitting of New Windshield", included: true },
          { name: "Demounting • Sensor/Bracket Refit", included: true },
          { name: "Leak Test & Cleaning", included: true }
        ],
        moreServicesCount: 0,
        originalPrice: 0,
        discountedPrice: 0,
        duration: "Takes 3-4 Hours",
        specialLabel: "",
        isRecommended: false
      },
      {
        id: "rear-windshield-replacement",
        name: "Rear Windshield Replacement",
        thumbnail: "/images/product_images/Windshield & lights/Rear Windshield Replacement.png",
        warranty: "1 Year Sealant Warranty",
        recommended: "OEM Spec Glass • Defogger Compatible",
        features: [
          { name: "Opening & Fitting of Rear Windshield", included: true },
          { name: "Demounting • Sensor/Heater Connectors", included: true },
          { name: "Leak & Noise Test", included: true }
        ],
        moreServicesCount: 0,
        originalPrice: 0,
        discountedPrice: 0,
        duration: "Takes 3-4 Hours",
        specialLabel: "",
        isRecommended: false
      },

      {
        id: "glasses-heading",
        name: "Glasses",
        thumbnail: "",
        warranty: "",
        recommended: "",
        features: [],
        moreServicesCount: 0,
        originalPrice: 0,
        discountedPrice: 0,
        duration: "",
        sectionTitle: "Glasses",
        isRecommended: false
      },
      {
        id: "door-glass-replacement",
        name: "Door Glass Replacement",
        thumbnail: "/images/product_images/Windshield & lights/Door Glass Replacement.png",
        warranty: "1 Month Fitment Warranty",
        recommended: "OEM Door Glass",
        features: [
          { name: "Opening & Fitting of Door Glass", included: true },
          { name: "Power Window Reset/Calibration", included: true }
        ],
        moreServicesCount: 0,
        originalPrice: 0,
        discountedPrice: 0,
        duration: "Takes 2 Hours",
        specialLabel: "",
        isRecommended: false
      },
      {
        id: "rear-quarter-glass-replacement",
        name: "Rear Quarter Glass Replacement",
        thumbnail: "/images/product_images/Windshield & lights/Rear Quarter Glass Replacement.png",
        warranty: "1 Month Fitment Warranty",
        recommended: "OEM Quarter Glass",
        features: [
          { name: "Opening & Fitting of Quarter Glass", included: true },
          { name: "Sealant/Beading Replacement", included: true }
        ],
        moreServicesCount: 0,
        originalPrice: 0,
        discountedPrice: 0,
        duration: "Takes 2 Hours",
        specialLabel: "",
        isRecommended: false
      },

      {
        id: "lights-heading",
        name: "Lights",
        thumbnail: "",
        warranty: "",
        recommended: "",
        features: [],
        moreServicesCount: 0,
        originalPrice: 0,
        discountedPrice: 0,
        duration: "",
        sectionTitle: "Lights",
        isRecommended: false
      },
      {
        id: "front-headlight",
        name: "Front Headlight",
        thumbnail: "/images/product_images/Windshield & lights/Front Headlight.png",
        warranty: "1 Month Fitment Warranty",
        recommended: "Headlamp Assembly Replacement",
        features: [
          { name: "Opening & Fitting of Headlight", included: true },
          { name: "Projector/LED Leveling (if applicable)", included: true }
        ],
        moreServicesCount: 0,
        originalPrice: 0,
        discountedPrice: 0,
        duration: "Takes 2 Hours",
        specialLabel: "",
        isRecommended: false
      },
      {
        id: "rear-taillight",
        name: "Rear Taillight",
        thumbnail: "/images/product_images/Windshield & lights/Rear Taillight.png",
        warranty: "1 Month Fitment Warranty",
        recommended: "Tail Lamp Assembly Replacement",
        features: [
          { name: "Opening & Fitting of Taillight", included: true },
          { name: "Brake/Indicator/Reverse Bulb Check", included: true }
        ],
        moreServicesCount: 0,
        originalPrice: 0,
        discountedPrice: 0,
        duration: "Takes 60-90 mins",
        specialLabel: "",
        isRecommended: false
      },
      {
        id: "fog-light",
        name: "Fog Light",
        thumbnail: "/images/product_images/Windshield & lights/For light.png",
        warranty: "1 Month Fitment Warranty",
        recommended: "Fog Lamp Assembly Replacement",
        features: [
          { name: "Opening & Fitting of Fog Lamp", included: true },
          { name: "Wiring & Alignment Check", included: true }
        ],
        moreServicesCount: 0,
        originalPrice: 0,
        discountedPrice: 0,
        duration: "Takes 60 mins",
        specialLabel: "",
        isRecommended: false
      },

      {
        id: "side-mirror-heading",
        name: "Side Mirror",
        thumbnail: "",
        warranty: "",
        recommended: "",
        features: [],
        moreServicesCount: 0,
        originalPrice: 0,
        discountedPrice: 0,
        duration: "",
        sectionTitle: "Side Mirror",
        isRecommended: false
      },
      {
        id: "side-mirror-replacement",
        name: "Side Mirror Replacement",
        thumbnail: "/images/product_images/Windshield & lights/Side Mirror Replacement.png",
        warranty: "1 Month Fitment Warranty",
        recommended: "ORVM Assembly/Glass Replacement",
        features: [
          { name: "Opening & Fitting of Mirror/ORVM", included: true },
          { name: "Power Fold/Heater Connector Refit", included: true }
        ],
        moreServicesCount: 0,
        originalPrice: 0,
        discountedPrice: 0,
        duration: "Takes 60-90 mins",
        specialLabel: "",
        isRecommended: false
      }
    ],
    "car-spa": [
      {
        id: "premium-top-wash",
        name: "Premium Top Wash",
        thumbnail: "/images/product_images/Spa & Cleaning/Premium Top Wash.png",
        warranty: "Pickup Charges Additional in Invoice",
        recommended: "Applicable on Walk-in Only",
        features: [
          { name: "Exterior Top Wash", included: true },
          { name: "Hand Drying", included: true },
          { name: "Rinsing", included: true },
          { name: "Tyre external wash", included: true }
        ],
        moreServicesCount: 0,
        originalPrice: 330,
        discountedPrice: 99,
        duration: "Revitalize Your Ride in Just 1 Hour",
        specialLabel: "",
        isRecommended: false
      },
      {
        id: "deep-all-round-spa",
        name: "Deep All Round Spa",
        thumbnail: "/images/product_images/Spa & Cleaning/Deep All Round Spa.png",
        warranty: "",
        recommended: "Every 6 Months (Recommended)",
        features: [
          { name: "Interior Vacuum Cleaning", included: true },
          { name: "Interior Wet Shampooing and Detailing", included: true },
          { name: "Rubbing with Compound", included: true },
          { name: "Dashboard Polishing", included: true },
          { name: "Pressure Car Wash", included: true }
        ],
        moreServicesCount: 4,
        originalPrice: 3124,
        discountedPrice: 2499,
        duration: "Takes 8 Hours",
        specialLabel: "RECOMMENDED",
        isRecommended: true
      },
      {
        id: "car-rubbing-polishing",
        name: "Car Rubbing & Polishing",
        thumbnail: "/images/product_images/Spa & Cleaning/Car Rubbing & Polishing.png",
        warranty: "",
        recommended: "Every 6 Months Recommended",
        features: [
          { name: "Machine Rubbing with Compound", included: true },
          { name: "Pressure Car Wash", included: true },
          { name: "Alloy Polishing", included: true },
          { name: "Wax Polishing", included: true },
          { name: "Tyre Dressing", included: true }
        ],
        moreServicesCount: 0,
        originalPrice: 1786,
        discountedPrice: 1429,
        duration: "Takes 6 Hours",
        specialLabel: "",
        isRecommended: false
      },
      {
        id: "car-interior-spa",
        name: "Car Interior Spa",
        thumbnail: "/images/product_images/Spa & Cleaning/Car Interior Spa.png",
        warranty: "",
        recommended: "Every 3 Months (Recommended)",
        features: [
          { name: "Pressure Car Wash", included: true },
          { name: "Interior Vacuum Cleaning", included: true },
          { name: "Interior Wet Shampooing and Detailing", included: true },
          { name: "Anti Viral & Bacterial Treatment", included: true },
          { name: "Dashboard Polishing", included: true }
        ],
        moreServicesCount: 0,
        originalPrice: 1999,
        discountedPrice: 1499,
        duration: "Takes 6 Hours",
        specialLabel: "",
        isRecommended: false
      },

      {
        id: "washing-heading",
        name: "Washing",
        thumbnail: "",
        warranty: "",
        recommended: "",
        features: [],
        moreServicesCount: 0,
        originalPrice: 0,
        discountedPrice: 0,
        duration: "",
        sectionTitle: "Washing",
        isRecommended: false
      },
      {
        id: "car-wash-wax",
        name: "Car Wash & Wax",
        thumbnail: "/images/product_images/Spa & Cleaning/car wash & wax copy.png",
        warranty: "",
        recommended: "Wash + wax protection",
        features: [
          { name: "Foam Wash", included: true },
          { name: "Wax Polishing", included: true },
          { name: "Interior Vacuuming", included: true }
        ],
        moreServicesCount: 0,
        originalPrice: 1299,
        discountedPrice: 999,
        duration: "Takes 2 Hours",
        specialLabel: "",
        isRecommended: false
      },

      {
        id: "sunroof-heading",
        name: "Sunroof",
        thumbnail: "",
        warranty: "",
        recommended: "",
        features: [],
        moreServicesCount: 0,
        originalPrice: 0,
        discountedPrice: 0,
        duration: "",
        sectionTitle: "Sunroof",
        isRecommended: false
      },
      {
        id: "sunroof-service",
        name: "Sunroof Service",
        thumbnail: "/images/product_images/Spa & Cleaning/Sunroof Service.png",
        warranty: "",
        recommended: "Smooth operation & leak prevention",
        features: [
          { name: "Sunroof Lubrication", included: true },
          { name: "Channel Cleaning", included: true },
          { name: "Drain Line Check", included: true }
        ],
        moreServicesCount: 0,
        originalPrice: 1999,
        discountedPrice: 1599,
        duration: "Takes 2 Hours",
        specialLabel: "",
        isRecommended: false
      }
    ],
    "detailing": [
      {
        id: "polishing-heading",
        name: "Polishing",
        thumbnail: "",
        warranty: "",
        recommended: "",
        features: [],
        moreServicesCount: 0,
        originalPrice: 0,
        discountedPrice: 0,
        duration: "",
        sectionTitle: "Polishing",
        isRecommended: false
      },
      {
        id: "rubbing-polishing-3m",
        name: "3M Car Rubbing & Polishing",
        thumbnail: "/images/product_images/Detailing Services/3M Car Rubbing & Polishing.png",
        warranty: "",
        recommended: "Every 6 Months (Recommended)",
        features: [
          { name: "Pressure Car Wash", included: true },
          { name: "Alloy Polishing", included: true },
          { name: "Rubbing with 3M Compound", included: true },
          { name: "Tyre Dressing", included: true },
          { name: "Machine Rubbing", included: true },
          { name: "3M Wax Polishing", included: true }
        ],
        moreServicesCount: 0,
        originalPrice: 2499,
        discountedPrice: 1999,
        duration: "Takes 6 Hours",
        specialLabel: "RECOMMENDED",
        isRecommended: true
      },

      {
        id: "ceramic-coating-heading",
        name: "Ceramic Coating",
        thumbnail: "",
        warranty: "",
        recommended: "",
        features: [],
        moreServicesCount: 0,
        originalPrice: 0,
        discountedPrice: 0,
        duration: "",
        sectionTitle: "Ceramic Coating",
        isRecommended: false
      },
      {
        id: "ceramic-coating-standard",
        name: "Ceramic Coating",
        thumbnail: "/images/product_images/Detailing Services/Ceramic Coating.png",
        warranty: "Up to 2 Years Protection (Depending on Package)",
        recommended: "High gloss, hydrophobic protection",
        features: [
          { name: "4 Layers of Coating", included: true },
          { name: "Gloss Enhancement", included: true },
          { name: "Hydrophobic Layer", included: true }
        ],
        moreServicesCount: 0,
        originalPrice: 19999,
        discountedPrice: 16999,
        duration: "Takes 1 Day",
        specialLabel: "",
        isRecommended: false
      },
      {
        id: "meguiars-ceramic-coating",
        name: "Graphene Coating - 10H",
        thumbnail: "/images/product_images/Detailing Services/Graphene Coating - 10H.png",
        warranty: "2 Years Warranty",
        recommended: "Free Pickup & Drop",
        features: [
          { name: "Protects Against UV Rays & Color Fading", included: true },
          { name: "Complete Car Detailing", included: true },
          { name: "Premium Gloss Finish", included: true },
          { name: "Free Annual Maintenance", included: true },
          { name: "Double Layer Graphene Protection", included: true }
        ],
        moreServicesCount: 0,
        originalPrice: 13646,
        discountedPrice: 11599,
        duration: "Takes 2 Days",
        specialLabel: "PREMIUM",
        isRecommended: false
      },

      {
        id: "teflon-coating-heading",
        name: "Teflon Coating",
        thumbnail: "",
        warranty: "",
        recommended: "",
        features: [],
        moreServicesCount: 0,
        originalPrice: 0,
        discountedPrice: 0,
        duration: "",
        sectionTitle: "Teflon Coating",
        isRecommended: false
      },
      {
        id: "meguiars-teflon-coating",
        name: "Meguiar's Teflon Coating",
        thumbnail: "/images/product_images/Detailing Services/Meguiar's Teflon Coating.png",
        warranty: "Up to 6 Months Protection",
        recommended: "Shine and basic paint protection",
        features: [
          { name: "Paint Sealant Layer", included: true },
          { name: "Gloss Enhancement", included: true },
          { name: "Water Beading Effect", included: true }
        ],
        moreServicesCount: 0,
        originalPrice: 6999,
        discountedPrice: 5499,
        duration: "Takes 6 Hours",
        specialLabel: "",
        isRecommended: false
      },
      {
        id: "3m-teflon-coating",
        name: "3M Teflon Coating",
        thumbnail: "/images/product_images/Detailing Services/3M Teflon Coating.png",
        warranty: "Up to 6 Months Protection",
        recommended: "Paint sealant and shine",
        features: [
          { name: "Gloss Shine Polishing", included: true },
          { name: "Colour Protection", included: true }
        ],
        moreServicesCount: 0,
        originalPrice: 6499,
        discountedPrice: 4999,
        duration: "Takes 6 Hours",
        specialLabel: "",
        isRecommended: false
      },

      {
        id: "ppf-heading",
        name: "PPF",
        thumbnail: "",
        warranty: "",
        recommended: "",
        features: [],
        moreServicesCount: 0,
        originalPrice: 0,
        discountedPrice: 0,
        duration: "",
        sectionTitle: "PPF",
        isRecommended: false
      },
      {
        id: "ppf-paint-protection-film",
        name: "PPF - Paint Protection Film",
        thumbnail: "/images/product_images/Detailing Services/PPF - Paint Protection Film.png",
        warranty: "Self-healing top coat",
        recommended: "Scratch and chip protection",
        features: [
          { name: "Self Healing Film", included: true },
          { name: "UV & Stain Resistance", included: true },
          { name: "High Gloss/Matte Options", included: true }
        ],
        moreServicesCount: 0,
        originalPrice: 0,
        discountedPrice: 0,
        duration: "Time depends on coverage",
        specialLabel: "",
        isRecommended: false
      },

      {
        id: "anti-rust-heading",
        name: "Anti Rust",
        thumbnail: "",
        warranty: "",
        recommended: "",
        features: [],
        moreServicesCount: 0,
        originalPrice: 0,
        discountedPrice: 0,
        duration: "",
        sectionTitle: "Anti Rust",
        isRecommended: false
      },
      {
        id: "anti-rust-underbody",
        name: "Anti Rust Underbody Coating",
        thumbnail: "/images/product_images/Detailing Services/Anti Rust Underbody Coating.png",
        warranty: "Prevents corrosion • Long lasting protection",
        recommended: "Recommended for monsoon & coastal areas",
        features: [
          { name: "Rubberized Underbody Coat", included: true },
          { name: "Noise Dampening", included: true },
          { name: "Corrosion Protection", included: true }
        ],
        moreServicesCount: 0,
        originalPrice: 3999,
        discountedPrice: 2999,
        duration: "Takes 6 Hours",
        specialLabel: "",
        isRecommended: false
      },

      {
        id: "silencer-coating",
        name: "Silencer Coating",
        thumbnail: "/images/product_images/Detailing Services/Silencer Coating.png",
        warranty: "Rust prevention for exhaust system",
        recommended: "Protects silencer from corrosion",
        features: [
          { name: "High Temperature Coat", included: true },
          { name: "Corrosion Protection", included: true }
        ],
        moreServicesCount: 0,
        originalPrice: 1799,
        discountedPrice: 1399,
        duration: "Takes 2 Hours",
        specialLabel: "",
        isRecommended: false
      }
    ],
    "denting": [
      {
        id: "front-side-heading",
        name: "Front Side",
        thumbnail: "",
        warranty: "",
        recommended: "",
        features: [],
        moreServicesCount: 0,
        originalPrice: 0,
        discountedPrice: 0,
        duration: "",
        sectionTitle: "Front Side",
        isRecommended: false
      },
      {
        id: "front-bumper-paint",
        name: "Front Bumper Paint",
        thumbnail: "/images/product_images/Denting & Painting/front_bumper.png",
        warranty: "2 Years Warranty on Paint",
        recommended: "Removal of Minor Dents & Scratches",
        features: [
          { name: "High Quality DuPont Paint", included: true },
          { name: "Panel Rubbing & Polishing", included: true },
          { name: "Grade A Primer Applied", included: true },
          { name: "Clear Coat Protective Layer Paint", included: true }
        ],
        moreServicesCount: 0,
        originalPrice: 7999,
        discountedPrice: 5999,
        duration: "Takes 24 Hours",
        specialLabel: "",
        isRecommended: false
      },
      {
        id: "bonnet-paint",
        name: "Bonnet Paint",
        thumbnail: "/images/product_images/Denting & Painting/ Bonnet Paint.png",
        warranty: "2 Years Warranty on Paint",
        recommended: "Removal of Minor Dents & Scratches",
        features: [
          { name: "High Quality DuPont Paint", included: true },
          { name: "Panel Rubbing & Polishing", included: true },
          { name: "Grade A Primer Applied", included: true },
          { name: "Clear Coat Protective Layer Paint", included: true }
        ],
        moreServicesCount: 0,
        originalPrice: 6999,
        discountedPrice: 5499,
        duration: "Takes 24 Hours",
        specialLabel: "",
        isRecommended: false
      },

      {
        id: "rear-side-heading",
        name: "Rear Side",
        thumbnail: "",
        warranty: "",
        recommended: "",
        features: [],
        moreServicesCount: 0,
        originalPrice: 0,
        discountedPrice: 0,
        duration: "",
        sectionTitle: "Rear Side",
        isRecommended: false
      },
      {
        id: "rear-bumper-paint",
        name: "Rear Bumper Paint",
        thumbnail: "/images/product_images/Denting & Painting/rear_bumper.png",
        warranty: "2 Years Warranty on Paint",
        recommended: "Removal of Minor Dents & Scratches",
        features: [
          { name: "High Quality DuPont Paint", included: true },
          { name: "Panel Rubbing & Polishing", included: true },
          { name: "Grade A Primer Applied", included: true },
          { name: "Clear Coat Protective Layer Paint", included: true }
        ],
        moreServicesCount: 0,
        originalPrice: 7999,
        discountedPrice: 5999,
        duration: "Takes 24 Hours",
        specialLabel: "",
        isRecommended: false
      },
      {
        id: "boot-paint",
        name: "Boot Paint",
        thumbnail: "/images/product_images/Denting & Painting/Boot Paint.png",
        warranty: "2 Years Warranty on Paint",
        recommended: "Removal of Minor Dents & Scratches",
        features: [
          { name: "High Quality DuPont Paint", included: true },
          { name: "Panel Rubbing & Polishing", included: true },
          { name: "Grade A Primer Applied", included: true },
          { name: "Clear Coat Protective Layer Paint", included: true }
        ],
        moreServicesCount: 0,
        originalPrice: 6499,
        discountedPrice: 5299,
        duration: "Takes 24 Hours",
        specialLabel: "",
        isRecommended: false
      },

      {
        id: "whole-body-heading",
        name: "Whole Body",
        thumbnail: "",
        warranty: "",
        recommended: "",
        features: [],
        moreServicesCount: 0,
        originalPrice: 0,
        discountedPrice: 0,
        duration: "",
        sectionTitle: "Whole Body",
        isRecommended: false
      },
      {
        id: "full-body-dent-paint",
        name: "Full Body Dent Paint",
        thumbnail: "/images/product_images/Denting & Painting/Full Body Dent Paint.png",
        warranty: "2 Years Warranty on Paint",
        recommended: "Removal of Minor Dents & Scratches",
        features: [
          { name: "High Quality DuPont Paint", included: true },
          { name: "Panel Rubbing & Polishing", included: true },
          { name: "Grade A Primer Applied", included: true },
          { name: "Clear Coat Protective Layer Paint", included: true }
        ],
        moreServicesCount: 0,
        originalPrice: 29999,
        discountedPrice: 24999,
        duration: "Takes 5 Days",
        specialLabel: "FREE DEEP ALL ROUND CLEANING",
        isRecommended: false
      },
      {
        id: "alloy-paint",
        name: "Alloy Paint",
        thumbnail: "/images/product_images/Denting & Painting/Alloy Paint.png",
        warranty: "1 Year Warranty",
        recommended: "Every 1 Year (Recommended)",
        features: [
          { name: "High Temperature Paint", included: true },
          { name: "Alloy Preservation", included: true },
          { name: "4 Layers of Polishing", included: true }
        ],
        moreServicesCount: 0,
        originalPrice: 1999,
        discountedPrice: 1499,
        duration: "Takes 24 Hours",
        specialLabel: "",
        isRecommended: false
      },

      {
        id: "left-side-heading",
        name: "Left Side",
        thumbnail: "",
        warranty: "",
        recommended: "",
        features: [],
        moreServicesCount: 0,
        originalPrice: 0,
        discountedPrice: 0,
        duration: "",
        sectionTitle: "Left Side",
        isRecommended: false
      },
      {
        id: "left-fender-paint",
        name: "Left Fender Paint",
        thumbnail: "/images/product_images/Denting & Painting/Left Fender Paint.png",
        warranty: "2 Years Warranty on Paint",
        recommended: "Removal of Minor Dents & Scratches",
        features: [
          { name: "High Quality DuPont Paint", included: true },
          { name: "Panel Rubbing & Polishing", included: true },
          { name: "Grade A Primer Applied", included: true },
          { name: "Clear Coat Protective Layer Paint", included: true }
        ],
        moreServicesCount: 0,
        originalPrice: 4999,
        discountedPrice: 3999,
        duration: "Takes 24 Hours",
        specialLabel: "",
        isRecommended: false
      },
      {
        id: "left-front-door-paint",
        name: "Left Front Door Paint",
        thumbnail: "/images/product_images/Denting & Painting/Left Front Door Paint.png",
        warranty: "2 Years Warranty on Paint",
        recommended: "Removal of Minor Dents & Scratches",
        features: [
          { name: "High Quality DuPont Paint", included: true },
          { name: "Panel Rubbing & Polishing", included: true },
          { name: "Grade A Primer Applied", included: true },
          { name: "Clear Coat Protective Layer Paint", included: true }
        ],
        moreServicesCount: 0,
        originalPrice: 6999,
        discountedPrice: 5499,
        duration: "Takes 24 Hours",
        specialLabel: "",
        isRecommended: false
      },
      {
        id: "left-rear-door-paint",
        name: "Left Rear Door Paint",
        thumbnail: "/images/product_images/Denting & Painting/Left Rear Door Paint.png",
        warranty: "2 Years Warranty on Paint",
        recommended: "Removal of Minor Dents & Scratches",
        features: [
          { name: "High Quality DuPont Paint", included: true },
          { name: "Panel Rubbing & Polishing", included: true },
          { name: "Grade A Primer Applied", included: true },
          { name: "Clear Coat Protective Layer Paint", included: true }
        ],
        moreServicesCount: 0,
        originalPrice: 6799,
        discountedPrice: 5299,
        duration: "Takes 24 Hours",
        specialLabel: "",
        isRecommended: false
      },
      {
        id: "left-quarter-panel-paint",
        name: "Left Quarter Panel Paint",
        thumbnail: "/images/product_images/Denting & Painting/Left Quarter Panel Paint.png",
        warranty: "2 Years Warranty on Paint",
        recommended: "Removal of Minor Dents & Scratches",
        features: [
          { name: "High Quality DuPont Paint", included: true },
          { name: "Panel Rubbing & Polishing", included: true },
          { name: "Grade A Primer Applied", included: true },
          { name: "Clear Coat Protective Layer Paint", included: true }
        ],
        moreServicesCount: 0,
        originalPrice: 7499,
        discountedPrice: 5899,
        duration: "Takes 24 Hours",
        specialLabel: "",
        isRecommended: false
      },
      {
        id: "left-running-board-paint",
        name: "Left Running Board Paint",
        thumbnail: "/images/product_images/Denting & Painting/Left Running Board Paint.png",
        warranty: "2 Years Warranty on Paint",
        recommended: "Removal of Minor Dents & Scratches",
        features: [
          { name: "High Quality DuPont Paint", included: true },
          { name: "Panel Rubbing & Polishing", included: true },
          { name: "Grade A Primer Applied", included: true },
          { name: "Clear Coat Protective Layer Paint", included: true }
        ],
        moreServicesCount: 0,
        originalPrice: 4999,
        discountedPrice: 3999,
        duration: "Takes 24 Hours",
        specialLabel: "",
        isRecommended: false
      },

      {
        id: "right-side-heading",
        name: "Right Side",
        thumbnail: "",
        warranty: "",
        recommended: "",
        features: [],
        moreServicesCount: 0,
        originalPrice: 0,
        discountedPrice: 0,
        duration: "",
        sectionTitle: "Right Side",
        isRecommended: false
      },
      {
        id: "right-fender-paint",
        name: "Right Fender Paint",
        thumbnail: "/images/product_images/Denting & Painting/Right Fender Paint.png",
        warranty: "2 Years Warranty on Paint",
        recommended: "Removal of Minor Dents & Scratches",
        features: [
          { name: "High Quality DuPont Paint", included: true },
          { name: "Panel Rubbing & Polishing", included: true },
          { name: "Grade A Primer Applied", included: true },
          { name: "Clear Coat Protective Layer Paint", included: true }
        ],
        moreServicesCount: 0,
        originalPrice: 4999,
        discountedPrice: 3999,
        duration: "Takes 24 Hours",
        specialLabel: "",
        isRecommended: false
      },
      {
        id: "right-front-door-paint",
        name: "Right Front Door Paint",
        thumbnail: "/images/product_images/Denting & Painting/Right Front Door Paint.png",
        warranty: "2 Years Warranty on Paint",
        recommended: "Removal of Minor Dents & Scratches",
        features: [
          { name: "High Quality DuPont Paint", included: true },
          { name: "Panel Rubbing & Polishing", included: true },
          { name: "Grade A Primer Applied", included: true },
          { name: "Clear Coat Protective Layer Paint", included: true }
        ],
        moreServicesCount: 0,
        originalPrice: 6999,
        discountedPrice: 5499,
        duration: "Takes 24 Hours",
        specialLabel: "",
        isRecommended: false
      },
      {
        id: "right-rear-door-paint",
        name: "Right Rear Door Paint",
        thumbnail: "/images/product_images/Denting & Painting/Right Rear Door Paint.png",
        warranty: "2 Years Warranty on Paint",
        recommended: "Removal of Minor Dents & Scratches",
        features: [
          { name: "High Quality DuPont Paint", included: true },
          { name: "Panel Rubbing & Polishing", included: true },
          { name: "Grade A Primer Applied", included: true },
          { name: "Clear Coat Protective Layer Paint", included: true }
        ],
        moreServicesCount: 0,
        originalPrice: 6799,
        discountedPrice: 5299,
        duration: "Takes 24 Hours",
        specialLabel: "",
        isRecommended: false
      },
      {
        id: "right-quarter-panel-paint",
        name: "Right Quarter Panel Paint",
        thumbnail: "/images/product_images/Denting & Painting/Right Quarter Panel Paint.png",
        warranty: "2 Years Warranty on Paint",
        recommended: "Removal of Minor Dents & Scratches",
        features: [
          { name: "High Quality DuPont Paint", included: true },
          { name: "Panel Rubbing & Polishing", included: true },
          { name: "Grade A Primer Applied", included: true },
          { name: "Clear Coat Protective Layer Paint", included: true }
        ],
        moreServicesCount: 0,
        originalPrice: 7499,
        discountedPrice: 5899,
        duration: "Takes 24 Hours",
        specialLabel: "",
        isRecommended: false
      },
      {
        id: "right-running-board-paint",
        name: "Right Running Board Paint",
        thumbnail: "/images/product_images/Denting & Painting/Right Running Board Paint.png",
        warranty: "2 Years Warranty on Paint",
        recommended: "Removal of Minor Dents & Scratches",
        features: [
          { name: "High Quality DuPont Paint", included: true },
          { name: "Panel Rubbing & Polishing", included: true },
          { name: "Grade A Primer Applied", included: true },
          { name: "Clear Coat Protective Layer Paint", included: true }
        ],
        moreServicesCount: 0,
        originalPrice: 4999,
        discountedPrice: 3999,
        duration: "Takes 24 Hours",
        specialLabel: "",
        isRecommended: false
      }
    ],
    "ac-service": [
      {
        id: "regular-ac-service",
        name: "Regular AC Service",
        thumbnail: "/images/product_images/Ac service & Repair/ac_service.png",
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
        thumbnail: "/images/product_images/Ac service & Repair/high_perform_ac_service.png",
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
        thumbnail: "/images/product_images/Ac service & Repair/Cooling Coil Replacement.png",
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
        thumbnail: "/images/product_images/Ac service & Repair/compressor.png",
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
        thumbnail: "/images/product_images/Ac service & Repair/heating_coil.png",
        warranty: "3 Months Warranty",
        recommended: "Recommended in case of heater not working",
        features: [
          { name: "Heating Coil Replacement (OES)", included: true },
          { name: "Spare Part Cost Only", included: true },
          { name: "Free Pickup & Drop", included: true },
          { name: "Hoses Additional (If Required)", included: true },
          { name: "Coolant & Radiator Flush Cost Additional", included: true }
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
        thumbnail: "/images/product_images/Ac service & Repair/v_belt_replacement.png",
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
        thumbnail: "/images/product_images/Ac service & Repair/ac_blower_motor.png",
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
        thumbnail: "/images/product_images/Ac service & Repair/radiator_replacement.png",
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
        thumbnail: "/images/product_images/Inspection/Radiator Fan Motor Replacement.png",
        warranty: "1 Month Warranty",
        recommended: "Recommended in case of radiator fan not working",
        features: [
          { name: "Radiator Fan Motor Replacement (OES)", included: true },
          { name: "Coolant & Radiator Flush Cost Additional", included: true },
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
        thumbnail: "/images/product_images/Ac service & Repair/Radiator Flush & Clean.png",
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
      // Removed duplicate 'cooling-coil-replacement' entry to avoid duplicate rendering on tab switch
    ],
    "batteries": [
      {
        id: "heading-amaron",
        name: "Amaron",
        thumbnail: "",
        warranty: "",
        recommended: "",
        features: [],
        moreServicesCount: 0,
        originalPrice: 0,
        discountedPrice: 0,
        duration: "",
        sectionTitle: "Amaron",
        isRecommended: false
      },
      {
        id: "amaron-55-35ah",
        name: "Amaron Go 35 Amp",
        thumbnail: "/images/product_images/Batteries/amazon_go.png",
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
        name: "Amaron Flo 35 Amp",
        thumbnail: "/images/product_images/Batteries/amazon_flo.png",
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

      {
        id: "heading-exide",
        name: "Exide",
        thumbnail: "",
        warranty: "",
        recommended: "",
        features: [],
        moreServicesCount: 0,
        originalPrice: 0,
        discountedPrice: 0,
        duration: "",
        sectionTitle: "Exide",
        isRecommended: false
      },
      {
        id: "exide-55-35ah",
        name: "Exide Mileage 35 Amp",
        thumbnail: "/images/product_images/Batteries/excide_millage_35.png",
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
        name: "Exide Epiq 35 Amp",
        thumbnail: "/images/product_images/Batteries/excide_epiq_35.png",
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
      {
        id: "heading-livguard",
        name: "Livguard",
        thumbnail: "",
        warranty: "",
        recommended: "",
        features: [],
        moreServicesCount: 0,
        originalPrice: 0,
        discountedPrice: 0,
        duration: "",
        sectionTitle: "Livguard",
        isRecommended: false
      },
      {
        id: "livguard-60-35ah",
        name: "Livguard Zing Aterna 35 Amp",
        thumbnail: "/images/product_images/Batteries/livegurd_zing.png",
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
        id: "heading-alternator",
        name: "Alternator",
        thumbnail: "",
        warranty: "",
        recommended: "",
        features: [],
        moreServicesCount: 0,
        originalPrice: 0,
        discountedPrice: 0,
        duration: "",
        sectionTitle: "Alternator",
        isRecommended: false
      },
      {
        id: "alternator-replacement",
        name: "Alternator Replacement",
        thumbnail: "/images/product_images/Batteries/alternator.png",
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
        thumbnail: "/images/product_images/Batteries/alternator_repair.png",
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
        id: "heading-apollo",
        name: "Apollo",
        thumbnail: "",
        warranty: "",
        recommended: "",
        features: [],
        moreServicesCount: 0,
        originalPrice: 0,
        discountedPrice: 0,
        duration: "",
        sectionTitle: "Apollo",
        isRecommended: false
      },
      {
        id: "apollo-amazer-4g",
        name: "Apollo Amazer 4G",
        thumbnail: "/images/product_images/Tyres & wheel cares/applo_amazer.png",
        warranty: "5 years warranty",
        recommended: "Size - 185/65 R15 • 5 years warranty • Tubeless • Fitting Cost Included",
        features: [
          { name: "Free Pickup & Drop", included: true },
          { name: "Tyre Replacement at Service Center", included: true },
          { name: "Tyres Inspection for Tread", included: true },
          { name: "Alignment & Balancing Charges Extra", included: true }
        ],
        moreServicesCount: 0,
        originalPrice: 7599,
        discountedPrice: 5711,
        duration: "",
        specialLabel: "RECOMMENDED",
        offer: undefined,
        isRecommended: true,
        expertRating: "4.2"
      },
      {
        id: "apollo-alnac-4g",
        name: "Apollo Alnac 4G",
        thumbnail: "/images/product_images/Tyres & wheel cares/applo__alnac.png",
        warranty: "Premium Quality",
        recommended: "55,000 Kms Warranty • Professional Installation",
        features: [
          { name: "Free Home Installation", included: true },
          { name: "Old Tyre Exchange", included: true },
          { name: "Puncture Protection", included: true },
          { name: "Wet Grip Performance", included: true }
        ],
        moreServicesCount: 0,
        originalPrice: 7499,
        discountedPrice: 6199,
        duration: "Expert Rating: 4.4",
        specialLabel: "RECOMMENDED",
        offer: undefined,
        isRecommended: true
      },

      {
        id: "heading-mrf",
        name: "MRF",
        thumbnail: "",
        warranty: "",
        recommended: "",
        features: [],
        moreServicesCount: 0,
        originalPrice: 0,
        discountedPrice: 0,
        duration: "",
        sectionTitle: "MRF",
        isRecommended: false
      },
      {
        id: "mrf-ecotred",
        name: "MRF Ecotred",
        thumbnail: "/images/product_images/Tyres & wheel cares/mrf__ecotread.png",
        warranty: "5 years warranty",
        recommended: "Size - 165/80 R14 • 5 years warranty • Tubeless • Fitting Cost Included",
        features: [
          { name: "Free Pickup & Drop", included: true },
          { name: "Tyre Replacement at Service Center", included: true },
          { name: "Tyres Inspection for Tread", included: true },
          { name: "Alignment & Balancing Charges Extra", included: true }
        ],
        moreServicesCount: 0,
        originalPrice: 5899,
        discountedPrice: 4430,
        duration: "",
        specialLabel: "",
        expertRating: "4.8",
        isRecommended: false
      },
      {
        id: "mrf-zvtv",
        name: "MRF Zvtv-A1",
        thumbnail: "/images/product_images/Tyres & wheel cares/mrf_zvtv_a1.png",
        warranty: "Premium Quality",
        recommended: "6 years warranty • Tubeless",
        features: [
          { name: "Free Pickup & Drop", included: true },
          { name: "Tyres Inspection for Tread", included: true },
          { name: "Tyre Replacement at Service Center", included: true },
          { name: "Alignment & Balancing Charges Extra", included: true }
        ],
        moreServicesCount: 0,
        originalPrice: 0,
        discountedPrice: 0,
        duration: "Expert Rating: 4.6",
        specialLabel: "",
        offer: undefined,
        isRecommended: false
      },
      {
        id: "mrf-zlx",
        name: "MRF ZIX",
        thumbnail: "/images/product_images/Tyres & wheel cares/mrf__zlx.png",
        warranty: "",
        recommended: "Tubeless",
        features: [
          { name: "Free Pickup & Drop", included: true },
          { name: "Tyre Replacement at Service Center", included: true },
          { name: "Tyres Inspection for Tread", included: true },
          { name: "Alignment & Balancing Charges Extra", included: true }
        ],
        moreServicesCount: 0,
        originalPrice: 9299,
        discountedPrice: 6918,
        duration: "",
        specialLabel: "",
        expertRating: "4.6",
        isRecommended: false
      },

      {
        id: "heading-ceat",
        name: "CEAT",
        thumbnail: "",
        warranty: "",
        recommended: "",
        features: [],
        moreServicesCount: 0,
        originalPrice: 0,
        discountedPrice: 0,
        duration: "",
        sectionTitle: "CEAT",
        isRecommended: false
      },
      {
        id: "ceat-secura-drive",
        name: "CEAT SecuraDrive",
        thumbnail: "/images/product_images/Tyres & wheel cares/ceat_sucuredrive.png",
        warranty: "Premium Quality",
        recommended: "50,000 Kms Warranty • Professional Installation",
        features: [
          { name: "Free Home Installation", included: true },
          { name: "Old Tyre Exchange", included: true },
          { name: "Wheel Balancing", included: true },
          { name: "Road Hazard Protection", included: true }
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
        id: "ceat-milaze",
        name: "Ceat Milaze",
        thumbnail: "/images/product_images/Tyres & wheel cares/ceat_milage.png",
        warranty: "Premium Quality",
        recommended: "Tubeless",
        features: [
          { name: "Free Pickup & Drop", included: true },
          { name: "Tyres Inspection for Tread", included: true },
          { name: "Tyre Replacement at Service Center", included: true },
          { name: "Alignment & Balancing Charges Extra", included: true }
        ],
        moreServicesCount: 0,
        originalPrice: 7399,
        discountedPrice: 5490,
        duration: "Expert Rating: 4.6",
        specialLabel: "",
        expertRating: "4.6",
        isRecommended: false
      },
      {
        id: "ceat-milaze-x3",
        name: "Ceat Milaze X3",
        thumbnail: "/images/product_images/Tyres & wheel cares/ceat_milage_x3.png",
        warranty: "Premium Quality",
        recommended: "Tubeless",
        features: [
          { name: "Free Pickup & Drop", included: true },
          { name: "Tyres Inspection for Tread", included: true },
          { name: "Tyre Replacement at Service Center", included: true },
          { name: "Alignment & Balancing Charges Extra", included: true }
        ],
        moreServicesCount: 0,
        originalPrice: 7399,
        discountedPrice: 5490,
        duration: "Expert Rating: 4.1",
        specialLabel: "",
        expertRating: "4.1",
        isRecommended: false
      },

      {
        id: "heading-goodyear",
        name: "Goodyear",
        thumbnail: "",
        warranty: "",
        recommended: "",
        features: [],
        moreServicesCount: 0,
        originalPrice: 0,
        discountedPrice: 0,
        duration: "",
        sectionTitle: "Goodyear",
        isRecommended: false
      },
      {
        id: "goodyear-assurance-triplemax",
        name: "Goodyear Assurance TripleMax",
        thumbnail: "/images/product_images/Tyres & wheel cares/goodyear_assurance_triplemax.png",
        warranty: "Premium Quality",
        recommended: "50,000 Kms Warranty • Professional Installation",
        features: [
          { name: "Free Home Installation", included: true },
          { name: "Old Tyre Exchange", included: true },
          { name: "Improved Braking Performance", included: true },
          { name: "HydroGrip Technology", included: true }
        ],
        moreServicesCount: 0,
        originalPrice: 6999,
        discountedPrice: 5599,
        duration: "Expert Rating: 4.3",
        specialLabel: "",
        offer: undefined,
        isRecommended: false
      },
      {
        id: "goodyear-duraplus",
        name: "Goodyear Duraplus",
        thumbnail: "/images/product_images/Tyres & wheel cares/goodyear_duraplus.png",
        warranty: "Premium Quality",
        recommended: "Tubeless",
        features: [
          { name: "Free Pickup & Drop", included: true },
          { name: "Tyres Inspection for Tread", included: true },
          { name: "Tyre Replacement at Service Center", included: true },
          { name: "Alignment & Balancing Charges Extra", included: true }
        ],
        moreServicesCount: 0,
        originalPrice: 7199,
        discountedPrice: 5364,
        duration: "Expert Rating: 4.6",
        specialLabel: "",
        expertRating: "4.6",
        isRecommended: false
      },

      {
        id: "heading-jk",
        name: "JK Tyre",
        thumbnail: "",
        warranty: "",
        recommended: "",
        features: [],
        moreServicesCount: 0,
        originalPrice: 0,
        discountedPrice: 0,
        duration: "",
        sectionTitle: "JK Tyre",
        isRecommended: false
      },
      {
        id: "jk-ux-royale",
        name: "JK UX Royale",
        thumbnail: "/images/product_images/Tyres & wheel cares/jk_ux_royale.png",
        warranty: "Premium Quality",
        recommended: "45,000 Kms Warranty • Professional Installation",
        features: [
          { name: "Free Home Installation", included: true },
          { name: "Old Tyre Exchange", included: true },
          { name: "Quiet & Comfortable Ride", included: true },
          { name: "Enhanced Dry & Wet Grip", included: true }
        ],
        moreServicesCount: 0,
        originalPrice: 6299,
        discountedPrice: 5099,
        duration: "Expert Rating: 4.2",
        specialLabel: "",
        offer: undefined,
        isRecommended: false
      },
      {
        id: "jk-ux",
        name: "JK UX",
        thumbnail: "/images/product_images/Tyres & wheel cares/jk_ux.png",
        warranty: "Premium Quality",
        recommended: "Tubeless",
        features: [
          { name: "Free Pickup & Drop", included: true },
          { name: "Tyre Replacement at Service Center", included: true },
          { name: "Tyres Inspection for Tread", included: true },
          { name: "Alignment & Balancing Charges Extra", included: true }
        ],
        moreServicesCount: 0,
        originalPrice: 6999,
        discountedPrice: 5228,
        duration: "",
        specialLabel: "",
        expertRating: "4.5",
        isRecommended: false
      },
      {
        id: "jk-taximax",
        name: "JK Taximax",
        thumbnail: "/images/product_images/Tyres & wheel cares/jk__taximax.png",
        warranty: "5 years warranty",
        recommended: "Size - 165/80 R14 • 5 years warranty • Tubeless • Fitting Cost Included",
        features: [
          { name: "Free Pickup & Drop", included: true },
          { name: "Tyre Replacement at Service Center", included: true },
          { name: "Tyres Inspection for Tread", included: true },
          { name: "Alignment & Balancing Charges Extra", included: true }
        ],
        moreServicesCount: 0,
        originalPrice: 5699,
        discountedPrice: 4260,
        duration: "",
        specialLabel: "",
        expertRating: "4.9",
        isRecommended: false
      },

      {
        id: "heading-continental",
        name: "Continental",
        thumbnail: "",
        warranty: "",
        recommended: "",
        features: [],
        moreServicesCount: 0,
        originalPrice: 0,
        discountedPrice: 0,
        duration: "",
        sectionTitle: "Continental",
        isRecommended: false
      },
      {
        id: "continental-ultracontact",
        name: "Continental Ultracontact",
        thumbnail: "/images/product_images/Tyres & wheel cares/continetal.png",
        warranty: "Premium Quality",
        recommended: "55,000 Kms Warranty • Professional Installation",
        features: [
          { name: "Free Home Installation", included: true },
          { name: "Old Tyre Exchange", included: true },
          { name: "Shorter Braking Distance", included: true },
          { name: "Superior Wet Handling", included: true }
        ],
        moreServicesCount: 0,
        originalPrice: 7999,
        discountedPrice: 6499,
        duration: "Expert Rating: 4.5",
        specialLabel: "",
        offer: undefined,
        isRecommended: false
      },

      {
        id: "heading-yokohama",
        name: "Yokohama",
        thumbnail: "",
        warranty: "",
        recommended: "",
        features: [],
        moreServicesCount: 0,
        originalPrice: 0,
        discountedPrice: 0,
        duration: "",
        sectionTitle: "Yokohama",
        isRecommended: false
      },
      {
        id: "yokohama-earth-1",
        name: "Yokohama Earth-1",
        thumbnail: "/images/product_images/Tyres & wheel cares/yokohma_earth_1.png",
        warranty: "Premium Quality",
        recommended: "50,000 Kms Warranty • Professional Installation",
        features: [
          { name: "Free Home Installation", included: true },
          { name: "Old Tyre Exchange", included: true },
          { name: "Long Tread Life", included: true },
          { name: "Low Rolling Resistance", included: true }
        ],
        moreServicesCount: 0,
        originalPrice: 6999,
        discountedPrice: 5699,
        duration: "Expert Rating: 4.3",
        specialLabel: "",
        offer: undefined,
        isRecommended: false
      }
    ],
   "car-inspections": [
      {
        id: "used-car-heading",
        name: "Used Car",
        thumbnail: "",
        warranty: "",
        recommended: "",
        features: [],
        moreServicesCount: 0,
        originalPrice: 0,
        discountedPrice: 0,
        duration: "",
        sectionTitle: "Used Car",
        isRecommended: false
      },
      {
        id: "second-hand-car-inspection",
        name: "Second Hand Car Inspection",
        thumbnail: "/images/product_images/Inspection/Second Hand Car Inspection.png",
        warranty: "Detailed Buyer Report",
        recommended: "Comprehensive used car evaluation",
        features: [
          { name: "200+ Checkpoint Inspection", included: true },
          { name: "Drive Test & OBD Scan", included: true },
          { name: "Accident/Flood Damage Check", included: true }
        ],
        moreServicesCount: 0,
        originalPrice: 5999,
        discountedPrice: 4499,
        duration: "Takes 6-8 hours",
        specialLabel: "",
        isRecommended: false
      },

      {
        id: "inspections-heading",
        name: "Inspections",
        thumbnail: "",
        warranty: "",
        recommended: "",
        features: [],
        moreServicesCount: 0,
        originalPrice: 0,
        discountedPrice: 0,
        duration: "",
        sectionTitle: "Inspections",
        isRecommended: false
      },
      {
        id: "road-trip-inspection",
        name: "Road Trip Inspection",
        thumbnail: "/images/product_images/Inspection/Road Trip Inspection.png",
        warranty: "Travel Readiness Checklist",
        recommended: "Before long outstation drives",
        features: [
          { name: "Tyres, Fluids & Lights Check", included: true },
          { name: "Brake & Suspension Health", included: true },
          { name: "Battery & Alternator Quick Test", included: true }
        ],
        moreServicesCount: 0,
        originalPrice: 1199,
        discountedPrice: 899,
        duration: "Takes 60-90 mins",
        specialLabel: "",
        isRecommended: false
      },
      {
        id: "engine-scanning",
        name: "Engine Scanning",
        thumbnail: "/images/product_images/Inspection/Engine Scanning.png",
        warranty: "Scan Report Included",
        recommended: "Diagnose engine warning lights",
        features: [
          { name: "Full OBD-II Scan", included: true },
          { name: "Error Code Analysis", included: true },
          { name: "Recommendations & Reset", included: true }
        ],
        moreServicesCount: 0,
        originalPrice: 1499,
        discountedPrice: 1199,
        duration: "Takes 60 mins",
        specialLabel: "",
        isRecommended: false
      },
      {
        id: "insurance-claim-inspection",
        name: "Insurance Claim Inspection",
        thumbnail: "/images/product_images/Inspection/Insurance Claim Inspection.png",
        warranty: "Photos & Estimate Support",
        recommended: "For insurance damage claims",
        features: [
          { name: "Damage Assessment", included: true },
          { name: "Photographic Evidence", included: true },
          { name: "Repair Estimate Preparation", included: true }
        ],
        moreServicesCount: 0,
        originalPrice: 0,
        discountedPrice: 0,
        duration: "Takes 60-90 mins",
        specialLabel: "",
        isRecommended: false
      },
      {
        id: "car-fluid-check",
        name: "Car Fluids Check",
        thumbnail: "/images/product_images/Inspection/Car Fluids Check.png",
        warranty: "Top-up recommendations",
        recommended: "Engine oil, coolant, brake, PS, washer",
        features: [
          { name: "All Fluids Health & Level Check", included: true },
          { name: "Leaks & Hoses Inspection", included: true }
        ],
        moreServicesCount: 0,
        originalPrice: 899,
        discountedPrice: 699,
        duration: "Takes 45 mins",
        specialLabel: "",
        isRecommended: false
      },
      {
        id: "complete-suspension-inspection",
        name: "Complete Suspension Inspection",
        thumbnail: "/images/product_images/Inspection/Complete Suspension Inspection.png",
        warranty: "Noise/Vibration Root-cause Report",
        recommended: "If you hear rattles, thuds or feel vibrations",
        features: [
          { name: "Arms, Bushes, Links, Joints Check", included: true },
          { name: "Struts/Shocks & Mounts Inspection", included: true }
        ],
        moreServicesCount: 0,
        originalPrice: 1599,
        discountedPrice: 1299,
        duration: "Takes 90 mins",
        specialLabel: "",
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
        thumbnail: "/images/product_images/Inspection/Radiator Replacement.png",
        warranty: "1 Month Warranty",
        recommended: "Overheating or coolant leakage",
        features: [
          { name: "OES Radiator Fitment", included: true },
          { name: "Coolant Refill (Additional)", included: true }
        ],
        moreServicesCount: 0,
        originalPrice: 6299,
        discountedPrice: 5299,
        duration: "Takes 6 Hours",
        specialLabel: "",
        isRecommended: false
      },
      {
        id: "radiator-fan-motor-replacement",
        name: "Radiator Fan Motor Replacement",
        thumbnail: "/images/product_images/Inspection/Radiator Fan Motor Replacement.png",
        warranty: "1 Month Warranty",
        recommended: "Fan not working / overheating in traffic",
        features: [
          { name: "OES Fan Motor Fitment", included: true },
          { name: "Electrical & Relay Check", included: true }
        ],
        moreServicesCount: 0,
        originalPrice: 3499,
        discountedPrice: 2999,
        duration: "Takes 3 Hours",
        specialLabel: "",
        isRecommended: false
      },
      {
        id: "radiator-flush-clean",
        name: "Radiator Flush & Clean",
        thumbnail: "/images/product_images/Ac service & Repair/Radiator Flush & Clean.png",
        warranty: "Rust protection",
        recommended: "Overheating / coolant degradation",
        features: [
          { name: "Chemical Flush & Cleaning", included: true },
          { name: "Coolant Replacement (Additional)", included: true }
        ],
        moreServicesCount: 0,
        originalPrice: 1999,
        discountedPrice: 1599,
        duration: "Takes 2 Hours",
        specialLabel: "",
        isRecommended: false
      },

      {
        id: "custom-issues-heading",
        name: "Custom Issues",
        thumbnail: "",
        warranty: "",
        recommended: "",
        features: [],
        moreServicesCount: 0,
        originalPrice: 0,
        discountedPrice: 0,
        duration: "",
        sectionTitle: "Custom Issues",
        isRecommended: false
      },
      {
        id: "car-warning-assistance",
        name: "Car Waterlog Assistance",
        thumbnail: "/images/product_images/Inspection/Car Waterlog Assistance.png",
        warranty: "Resolution Guidance",
        recommended: "Dashboard warning lights / alerts",
        features: [
          { name: "Fault Code Scan & Explanation", included: true },
          { name: "Next Steps & Repair Plan", included: true }
        ],
        moreServicesCount: 0,
        originalPrice: 999,
        discountedPrice: 799,
        duration: "Takes 60 mins",
        specialLabel: "",
        isRecommended: false
      },
      {
        id: "car-engine-issues",
        name: "Car Engine Issues",
        thumbnail: "/images/product_images/Inspection/Car Engine Issues.png",
        warranty: "Technician Diagnosis",
        recommended: "Misfire, power loss, stalling, smoke",
        features: [
          { name: "Engine Health Checks", included: true },
          { name: "OBD Scan & Compression Advice", included: true }
        ],
        moreServicesCount: 0,
        originalPrice: 1499,
        discountedPrice: 1199,
        duration: "Takes 90 mins",
        specialLabel: "",
        isRecommended: false
      },
      {
        id: "brakes-wheels-issues",
        name: "Problem with Car Brakes & Wheels",
        thumbnail: "/images/product_images/Inspection/Problem with Car Brakes & Wheels.png",
        warranty: "Safety Checklist",
        recommended: "Noise, vibration or wobble while driving",
        features: [
          { name: "Brake Pads/Discs/Drums Check", included: true },
          { name: "Alignment/Balancing Advice", included: true }
        ],
        moreServicesCount: 0,
        originalPrice: 1299,
        discountedPrice: 999,
        duration: "Takes 60-90 mins",
        specialLabel: "",
        isRecommended: false
      },
      {
        id: "damaged-body-or-interiors",
        name: "Damaged Car Body or Interiors",
        thumbnail: "/images/product_images/Inspection/Damaged Car Body or Interiors.png",
        warranty: "Repair Estimate",
        recommended: "Dents, scratches or interior damage",
        features: [
          { name: "Visual Assessment", included: true },
          { name: "Repair Scope & Quote", included: true }
        ],
        moreServicesCount: 0,
        originalPrice: 0,
        discountedPrice: 0,
        duration: "Takes 45-60 mins",
        specialLabel: "",
        isRecommended: false
      }
   ],
    "car-insurance": [
     {
       id: "policy-heading",
       name: "Know Your Policy",
       thumbnail: "",
       warranty: "",
       recommended: "",
       features: [],
       moreServicesCount: 0,
       originalPrice: 0,
       discountedPrice: 0,
       duration: "",
       sectionTitle: "Know Your Policy",
       isRecommended: false
     },
     {
       id: "know-your-policy",
       name: "Know Your Policy",
       thumbnail: "/images/product_images/Inurance/know_ur_polices.png",
       warranty: "Coverage & Claim Guidance",
       recommended: "Understand inclusions, exclusions and claim steps",
       features: [
         { name: "Explain Coverage & Endorsements", included: true },
         { name: "Claim Paperwork Checklist", included: true },
         { name: "Cashless / Reimbursement Process", included: true }
       ],
       moreServicesCount: 0,
       originalPrice: 0,
       discountedPrice: 0,
       duration: "Takes 30-45 mins",
       specialLabel: "",
       isRecommended: false
     },
 
     {
       id: "accidental-repairs-heading",
       name: "Accidental Repairs",
       thumbnail: "",
       warranty: "",
       recommended: "",
       features: [],
       moreServicesCount: 0,
       originalPrice: 0,
       discountedPrice: 0,
       duration: "",
       sectionTitle: "Accidental Repairs",
       isRecommended: false
     },
     {
       id: "accidental-denting-painting-insured",
       name: "Accidental Denting & Painting (For Insured Vehicles)",
       thumbnail: "/images/product_images/Inurance/Accidental Denting & Painting.png",
       warranty: "As per insurer",
       recommended: "Cashless repairs at network garages",
       features: [
         { name: "Panel Repair / Replacement as per Policy", included: true },
         { name: "Surveyor Coordination & Estimate", included: true },
         { name: "Cashless Billing Support", included: true }
       ],
       moreServicesCount: 0,
       originalPrice: 0,
       discountedPrice: 0,
       duration: "As per surveyor schedule",
       specialLabel: "",
       isRecommended: false
     },
     {
       id: "fire-damage-assistance",
       name: "Fire Damage Assistance (For Insured Vehicles)",
       thumbnail: "/images/product_images/Inurance/Fire Damage Assistance  copy.png",
       warranty: "As per insurer",
       recommended: "Claim assistance for fire related damage",
       features: [
         { name: "On-site/Towing Arrangement", included: true },
         { name: "Insurance Documentation Support", included: true },
         { name: "Repair Estimate & Cashless Help", included: true }
       ],
       moreServicesCount: 0,
       originalPrice: 0,
       discountedPrice: 0,
       duration: "Case dependent",
       specialLabel: "",
       isRecommended: false
     },
     {
       id: "car-flood-damage",
       name: "Car Flood Damage (For Insured Vehicles)",
       thumbnail: "/images/product_images/Inurance/Car Flood Damage.png",
       warranty: "As per insurer",
       recommended: "Assistance for water ingress damage",
       features: [
         { name: "Water Ingress & Drying Procedure", included: true },
         { name: "Electrical/Electronic Restoration", included: true },
         { name: "Surveyor Coordination & Claim", included: true }
       ],
       moreServicesCount: 0,
       originalPrice: 0,
       discountedPrice: 0,
       duration: "Case dependent",
       specialLabel: "",
       isRecommended: false
     },
     {
       id: "windshield-replacement-insured",
       name: "Windshield Replacement (For Insured Vehicles)",
       thumbnail: "/images/product_images/Inurance/Windshield Replacement .png",
       warranty: "As per insurer",
       recommended: "Cashless OEM glass replacement",
       features: [
         { name: "OEM Glass & Sealant", included: true },
         { name: "Cashless at Network Garages", included: true },
         { name: "Leak & Noise Test", included: true }
       ],
       moreServicesCount: 0,
       originalPrice: 0,
       discountedPrice: 0,
       duration: "Takes 3-4 hours",
       specialLabel: "",
       isRecommended: false
     },
 
     {
       id: "theft-lost-heading",
       name: "Theft / Lost",
       thumbnail: "",
       warranty: "",
       recommended: "",
       features: [],
       moreServicesCount: 0,
       originalPrice: 0,
       discountedPrice: 0,
       duration: "",
       sectionTitle: "Theft / Lost",
       isRecommended: false
     },
     {
       id: "car-theft-claim-insured",
       name: "Car Theft Claim (For Insured Vehicles)",
       thumbnail: "/images/product_images/Inurance/Car Theft Claim (For Insured Vehicles).png",
       warranty: "As per insurer",
       recommended: "End-to-end theft claim support",
       features: [
         { name: "FIR & Insurer Intimation Guidance", included: true },
         { name: "Documentation & Settlement Follow-up", included: true }
       ],
       moreServicesCount: 0,
       originalPrice: 0,
       discountedPrice: 0,
       duration: "As per authority timelines",
       specialLabel: "",
       isRecommended: false
     },
 
     {
       id: "insurance-inspection-heading",
       name: "Inspection",
       thumbnail: "",
       warranty: "",
       recommended: "",
       features: [],
       moreServicesCount: 0,
       originalPrice: 0,
       discountedPrice: 0,
       duration: "",
       sectionTitle: "Inspection",
       isRecommended: false
     },
     {
       id: "doorstep-accidental-inspection-insured",
       name: "Doorstep Accidental Inspection",
       thumbnail: "/images/product_images/Inurance/Doorstep Accidental Inspection.png",
       warranty: "Photo Checklist Provided",
       recommended: "Initial inspection before claim",
       features: [
         { name: "25+ Photos & Damage Notes", included: true },
         { name: "On-spot Rough Estimate", included: true }
       ],
       moreServicesCount: 0,
       originalPrice: 0,
       discountedPrice: 0,
       duration: "Takes 60-90 mins",
       specialLabel: "",
       isRecommended: false
     },
     {
       id: "towing-for-insured-vehicle",
       name: "Towing (For Insured Vehicle)",
       thumbnail: "/images/product_images/Inurance/Towing (For Insured Vehicle).png",
       warranty: "As per insurer",
       recommended: "Breakdown/accident towing assistance",
       features: [
         { name: "Flatbed/Crane Arrangement", included: true },
         { name: "Cashless at Partner Networks", included: true }
       ],
       moreServicesCount: 0,
       originalPrice: 0,
       discountedPrice: 0,
       duration: "As needed",
       specialLabel: "",
       isRecommended: false
    },
     {
       id: "insurance-claim-inspection-insured",
       name: "Insurance Claim Inspection",
       thumbnail: "/images/product_images/Inurance/Insurance Claim Inspection1.png",
       warranty: "Photos & Estimate Support",
       recommended: "For insurance damage claims",
       features: [
         { name: "Damage Assessment", included: true },
         { name: "Photographic Evidence", included: true },
         { name: "Repair Estimate Preparation", included: true }
       ],
       moreServicesCount: 0,
       originalPrice: 0,
       discountedPrice: 0,
       duration: "Takes 60-90 mins",
       specialLabel: "",
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
                   selectedCategory === "windshield-lights" ? "" :
                   selectedCategory === "car-spa" ? "Spa" :
                   selectedCategory === "detailing" ? "Polishing" :
                   selectedCategory === "suspension-fitting" ? "Suspension & Fitting" :
                   selectedCategory === "clutch-body-parts" ? "Clutch & Body Parts" :
                   selectedCategory === "car-inspections" ? "Car Inspections" :
                   selectedCategory === "car-insurance" ? "Insurance Claims" : "Scheduled Packages"}
                </h2>

          <div className="space-y-6">
                  {(servicePackages[selectedCategory as keyof typeof servicePackages] || servicePackages["car-services"])
                    .map((pkg) => (
                    <Fragment key={`${selectedCategory}-${pkg.id}`}>
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
                variant={
                  pkg.id === "front-brake-pads" 
                    ? "reference" 
                    : ["car-services", "batteries"].includes(selectedCategory) 
                    ? "gom" 
                    : "default"
                }
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
      <Footer />
    </div>
  );
};

export default Services;