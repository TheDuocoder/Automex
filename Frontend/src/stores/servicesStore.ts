/**
 * Zustand Services Store
 * Manages all car services data with search and filter functionality
 */

import { create } from 'zustand';

export interface Service {
    id: string;
    title: string;
    description: string;
    image: string;
    category: 'regular' | 'summer' | 'premium' | 'curated';
    features?: string[];
    isNew?: boolean;
    isIcon?: boolean;
    price?: string;
    originalPrice?: string;
    discount?: string;
}

interface ServicesState {
    services: Service[];
    searchQuery: string;
    selectedCategory: string | null;
    filteredServices: Service[];

    // Actions
    setSearchQuery: (query: string) => void;
    setSelectedCategory: (category: string | null) => void;
    getServiceById: (id: string) => Service | undefined;
    getServicesByCategory: (category: string) => Service[];
    clearSearch: () => void;
}

// All services data
const allServices: Service[] = [
    // Regular Services
    {
        id: 'premium-car-services',
        title: 'Premium Car Services',
        image: 'https://automex-bhubaneswar.s3.ap-south-2.amazonaws.com/Frontend/images/Services/Premium car service.png',
        description: 'Specialized maintenance for luxury vehicles including BMW, Mercedes-Benz, and Audi. Our certified technicians use advanced diagnostic tools and genuine parts to ensure premium performance. Services include engine diagnostics, transmission service, brake systems, and electronic systems calibration.',
        category: 'regular',
    },
    {
        id: 'ac-service-repair',
        title: 'AC Service & Repair',
        image: 'https://automex-bhubaneswar.s3.ap-south-2.amazonaws.com/Frontend/images/Landing_page_images/Ac repair.png',
        description: 'Expert AC system diagnosis, repair, and maintenance. We handle gas refilling, component replacement, and ensure optimal cooling performance for your comfort.',
        category: 'regular',
    },
    {
        id: 'batteries',
        title: 'Batteries',
        image: 'https://automex-bhubaneswar.s3.ap-south-2.amazonaws.com/Frontend/images/Services/Battery service.png',
        isIcon: false,
        description: 'Complete battery solutions including health check, charging system diagnosis, replacement with genuine batteries, and warranty support for all car models.',
        category: 'regular',
    },
    {
        id: 'tyres-wheel-care',
        title: 'Tyres & Wheel Care',
        image: 'https://automex-bhubaneswar.s3.ap-south-2.amazonaws.com/Frontend/images/Services/Tyre service.png',
        isIcon: false,
        description: 'Professional wheel alignment, balancing, rotation, and tyre replacement services. We ensure optimal tyre pressure and tread life for safe driving.',
        category: 'regular',
    },
    {
        id: 'denting-painting',
        title: 'Denting & Painting',
        image: 'https://automex-bhubaneswar.s3.ap-south-2.amazonaws.com/Frontend/images/Services/denting and painting service.png',
        description: 'Expert dent removal, scratch repair, and premium paint jobs. Our skilled technicians use advanced techniques and quality materials for a factory-like finish.',
        category: 'regular',
    },
    {
        id: 'detailing-services',
        title: 'Detailing Services',
        image: 'https://automex-bhubaneswar.s3.ap-south-2.amazonaws.com/Frontend/images/Services/detailing service.png',
        description: 'Premium car detailing including paint correction, ceramic coating, interior deep cleaning, and exterior protection for that showroom-like appearance.',
        category: 'regular',
    },
    {
        id: 'car-spa-cleaning',
        title: 'Car Spa & Cleaning',
        image: 'https://automex-bhubaneswar.s3.ap-south-2.amazonaws.com/Frontend/images/Services/Car spa.png',
        description: 'Thorough interior and exterior cleaning, steam wash, upholstery care, and protective coating. We restore your car\'s shine and freshness.',
        category: 'regular',
    },
    {
        id: 'car-inspections',
        title: 'Car Inspections',
        image: 'https://automex-bhubaneswar.s3.ap-south-2.amazonaws.com/Frontend/images/Services/inspection service.png',
        description: 'Detailed 50-point inspection covering safety, performance, and compliance checks. Get a comprehensive report of your vehicle\'s condition.',
        isNew: true,
        category: 'regular',
    },

    // Summer Services
    {
        id: 'front-bumper-paint',
        title: 'Front Bumper Paint',
        description: 'Restore your bumper to a factory-fresh look with precision prep, priming, and multi‑stage paint matching.',
        image: 'https://automex-bhubaneswar.s3.ap-south-2.amazonaws.com/Frontend/images/Services/front bomper paint service.png',
        features: ['Color matching', 'Premium coating', 'UV protection'],
        category: 'summer',
    },
    {
        id: 'rubbing-polishing',
        title: 'Rubbing & Polishing',
        description: 'Remove oxidation, swirl marks, and light scratches to reveal a deep, glossy finish.',
        image: 'https://automex-bhubaneswar.s3.ap-south-2.amazonaws.com/Frontend/images/Services/rubbing and polish service.png',
        features: ['Machine polishing', 'Swirl reduction', 'Mirror finish'],
        category: 'summer',
    },
    {
        id: 'deep-all-round-spa',
        title: 'Deep All Round Spa',
        description: 'Thorough interior and exterior spa that sanitizes the cabin and restores the exterior sheen.',
        image: 'https://automex-bhubaneswar.s3.ap-south-2.amazonaws.com/Frontend/images/Services/deep all round spa service.png',
        features: ['Steam sanitization', 'Deep cleaning', 'Wax protection'],
        category: 'summer',
    },
    {
        id: 'periodic-service',
        title: 'Periodic Service',
        description: 'Seasonal maintenance package covering fluids, filters, and safety systems for summer reliability.',
        image: 'https://automex-bhubaneswar.s3.ap-south-2.amazonaws.com/Frontend/images/Services/Premium car service.png',
        features: ['AC check', 'Coolant top-up', 'Battery health'],
        category: 'summer',
    },

    // Premium Offers
    {
        id: 'premium-detailing-package',
        title: 'Premium Detailing Package',
        description: 'Professional interior & exterior detailing with ceramic coating, steam wash, paint correction, and premium wax protection for ultimate shine',
        features: ['Ceramic Coating', 'Paint Correction', 'Steam Sanitization', 'Interior Deep Clean'],
        price: '₹3,499',
        originalPrice: '₹5,999',
        discount: '42%',
        image: 'https://automex-bhubaneswar.s3.ap-south-2.amazonaws.com/Frontend/images/Services/detailing service.png',
        category: 'premium',
    },
    {
        id: 'complete-tyre-care-package',
        title: 'Complete Tyre Care Package',
        description: 'Comprehensive tyre service including wheel alignment, balancing, rotation, nitrogen filling, and complete tread inspection',
        features: ['4-Wheel Alignment', 'Wheel Balancing', 'Nitrogen Filling', 'Tread Inspection'],
        price: '₹1,799',
        originalPrice: '₹2,999',
        discount: '40%',
        image: 'https://automex-bhubaneswar.s3.ap-south-2.amazonaws.com/Frontend/images/Services/Tyre service.png',
        category: 'premium',
    },
    {
        id: 'engine-care-specialist',
        title: 'Engine Care Specialist',
        description: 'Complete engine diagnostics, oil change, filter replacement, fuel system cleaning, and performance optimization for peak efficiency',
        features: ['Engine Diagnostics', 'Oil & Filter Change', 'Fuel System Clean', 'Performance Check'],
        price: '₹2,199',
        originalPrice: '₹3,499',
        discount: '37%',
        image: 'https://automex-bhubaneswar.s3.ap-south-2.amazonaws.com/Frontend/images/Services/Premium car service.png',
        category: 'premium',
    },

    // Curated Services
    {
        id: 'comprehensive-inspection-pack',
        title: 'Comprehensive Inspection Pack',
        image: 'https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&q=80&w=1600',
        description: 'A 50+ point inspection with digital report, prioritised repairs and a tailored service plan to keep your vehicle safe and performing.',
        features: ['Engine & transmission health check', 'Brake & suspension assessment', 'Electrical systems scan'],
        category: 'curated',
    },
    {
        id: 'priority-warranty-parts',
        title: 'Priority Warranty & Parts',
        image: 'https://images.unsplash.com/photo-1511910429153-6f6d7a0b7f54?auto=format&fit=crop&q=80&w=1600',
        description: 'Get priority sourcing of OEM parts, extended warranty options and fast-track repairs for premium vehicles.',
        features: ['Genuine OEM parts', 'Fast-tracked fulfillment', 'Extended warranty packages'],
        category: 'curated',
    },
    {
        id: 'concierge-onsite-service',
        title: 'Concierge & On-site Service',
        image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1600',
        description: 'Doorstep inspections and repairs at your convenience with certified technicians and full transparency via our app.',
        features: ['Home pick-up & drop-off', 'Real-time technician updates', 'Secure payments & records'],
        category: 'curated',
    },
    {
        id: 'paint-protection-coating',
        title: 'Paint Protection & Coating',
        image: 'https://images.unsplash.com/photo-1549924231-f129b911e442?auto=format&fit=crop&q=80&w=1600',
        description: 'Protect your paint with advanced sealants and ceramic coatings that resist UV and environmental damage.',
        features: ['Ceramic coatings', 'UV protection', 'Long-lasting gloss'],
        category: 'curated',
    },
    {
        id: 'mobile-repair-support',
        title: 'Mobile Repair & Support',
        image: 'https://images.unsplash.com/photo-1519148246706-6f2d8b1e1a3a?auto=format&fit=crop&q=80&w=1600',
        description: 'On-demand mechanical support for minor repairs and troubleshooting at your location.',
        features: ['Minor repairs on-site', 'Battery & tyre support', 'Quick diagnostics'],
        category: 'curated',
    },
];

export const useServicesStore = create<ServicesState>((set, get) => ({
    services: allServices,
    searchQuery: '',
    selectedCategory: null,
    filteredServices: allServices,

    setSearchQuery: (query: string) => {
        set({ searchQuery: query });

        const { services, selectedCategory } = get();
        let filtered = services;

        // Filter by category if selected
        if (selectedCategory) {
            filtered = filtered.filter(service => service.category === selectedCategory);
        }

        // Filter by search query
        if (query.trim()) {
            const lowerQuery = query.toLowerCase();
            filtered = filtered.filter(service =>
                service.title.toLowerCase().includes(lowerQuery) ||
                service.description.toLowerCase().includes(lowerQuery) ||
                service.features?.some(feature => feature.toLowerCase().includes(lowerQuery))
            );
        }

        set({ filteredServices: filtered });
    },

    setSelectedCategory: (category: string | null) => {
        set({ selectedCategory: category });

        const { services, searchQuery } = get();
        let filtered = services;

        // Filter by category
        if (category) {
            filtered = filtered.filter(service => service.category === category);
        }

        // Filter by search query if exists
        if (searchQuery.trim()) {
            const lowerQuery = searchQuery.toLowerCase();
            filtered = filtered.filter(service =>
                service.title.toLowerCase().includes(lowerQuery) ||
                service.description.toLowerCase().includes(lowerQuery) ||
                service.features?.some(feature => feature.toLowerCase().includes(lowerQuery))
            );
        }

        set({ filteredServices: filtered });
    },

    getServiceById: (id: string) => {
        return get().services.find(service => service.id === id);
    },

    getServicesByCategory: (category: string) => {
        return get().services.filter(service => service.category === category);
    },

    clearSearch: () => {
        set({
            searchQuery: '',
            selectedCategory: null,
            filteredServices: get().services
        });
    },
}));
