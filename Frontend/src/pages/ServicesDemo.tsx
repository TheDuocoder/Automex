import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ServiceSearch from '@/components/ServiceSearch';
import { useServicesStore } from '@/stores/servicesStore';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const ServicesDemo = () => {
    const { filteredServices, searchQuery, setSelectedCategory, selectedCategory } = useServicesStore();
    const [selectedService, setSelectedService] = useState<string | null>(null);

    const categories = [
        { value: null, label: 'All Services' },
        { value: 'regular', label: 'Regular Services' },
        { value: 'summer', label: 'Summer Services' },
        { value: 'premium', label: 'Premium Offers' },
        { value: 'curated', label: 'Curated Services' },
    ];

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <div className="container mx-auto px-4 py-8">
                {/* Page Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold mb-4">Search Our Services</h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Find the perfect service for your vehicle. Search by name, description, or features.
                    </p>
                </div>

                {/* Search Component */}
                <div className="mb-8">
                    <ServiceSearch />
                </div>

                {/* Category Filters */}
                <div className="flex flex-wrap gap-2 mb-8 justify-center">
                    {categories.map((cat) => (
                        <Button
                            key={cat.value || 'all'}
                            variant={selectedCategory === cat.value ? 'default' : 'outline'}
                            onClick={() => setSelectedCategory(cat.value)}
                            className="rounded-full"
                        >
                            {cat.label}
                        </Button>
                    ))}
                </div>

                {/* Results Count */}
                {searchQuery && (
                    <div className="text-center mb-6">
                        <p className="text-gray-600">
                            Found <span className="font-semibold text-primary">{filteredServices.length}</span> service{filteredServices.length !== 1 ? 's' : ''}
                            {searchQuery && ` for "${searchQuery}"`}
                        </p>
                    </div>
                )}

                {/* Services Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredServices.map((service) => (
                        <Card
                            key={service.id}
                            className="group hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer"
                            onClick={() => setSelectedService(service.id)}
                        >
                            <div className="relative h-48 overflow-hidden">
                                <img
                                    src={service.image}
                                    alt={service.title}
                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                    onError={(e) => {
                                        (e.currentTarget as HTMLImageElement).src = '/placeholder.svg';
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent">
                                    <div className="absolute bottom-4 left-4 right-4">
                                        <h3 className="text-white font-bold text-lg mb-1">{service.title}</h3>
                                        <div className="flex gap-2 flex-wrap">
                                            <Badge variant="secondary" className="capitalize text-xs">
                                                {service.category}
                                            </Badge>
                                            {service.isNew && (
                                                <Badge className="bg-green-500 text-white text-xs">New</Badge>
                                            )}
                                            {service.discount && (
                                                <Badge className="bg-red-500 text-white text-xs">{service.discount} OFF</Badge>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4">
                                <p className="text-gray-600 text-sm line-clamp-3 mb-3">
                                    {service.description}
                                </p>

                                {service.features && service.features.length > 0 && (
                                    <div className="space-y-1">
                                        {service.features.slice(0, 3).map((feature, idx) => (
                                            <div key={idx} className="flex items-center gap-2 text-xs text-gray-500">
                                                <span className="text-primary">✓</span>
                                                <span>{feature}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {service.price && (
                                    <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
                                        <div>
                                            <span className="text-2xl font-bold text-primary">{service.price}</span>
                                            {service.originalPrice && (
                                                <span className="text-sm text-gray-400 line-through ml-2">
                                                    {service.originalPrice}
                                                </span>
                                            )}
                                        </div>
                                        <Button size="sm">Book Now</Button>
                                    </div>
                                )}
                            </div>
                        </Card>
                    ))}
                </div>

                {/* No Results */}
                {filteredServices.length === 0 && (
                    <div className="text-center py-16">
                        <div className="text-gray-400 mb-4">
                            <svg
                                className="h-24 w-24 mx-auto opacity-50"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">No services found</h3>
                        <p className="text-gray-500">Try adjusting your search or filters</p>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default ServicesDemo;
