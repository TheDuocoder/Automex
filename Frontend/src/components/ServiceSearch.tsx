import { useState } from 'react';
import { Search } from 'lucide-react';
import { useServicesStore } from '@/stores/servicesStore';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const ServiceSearch = () => {
    const { searchQuery, setSearchQuery, filteredServices, clearSearch } = useServicesStore();
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);
        setIsSearchOpen(query.trim().length > 0);
    };

    const handleClearSearch = () => {
        clearSearch();
        setIsSearchOpen(false);
    };

    return (
        <div className="relative w-full max-w-2xl mx-auto">
            {/* Search Input */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                    type="text"
                    placeholder="Search services..."
                    value={searchQuery}
                    onChange={handleSearch}
                    className="pl-12 pr-4 py-6 text-base rounded-full border-2 border-gray-200 focus:border-primary transition-all duration-300 shadow-sm hover:shadow-md"
                />
                {searchQuery && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleClearSearch}
                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full"
                    >
                        Clear
                    </Button>
                )}
            </div>

            {/* Search Results Dropdown */}
            {isSearchOpen && (
                <Card className="absolute top-full mt-2 w-full max-h-96 overflow-y-auto z-50 shadow-xl border-2 border-gray-100">
                    {filteredServices.length > 0 ? (
                        <div className="p-2">
                            <div className="text-xs text-gray-500 px-3 py-2 font-medium">
                                Found {filteredServices.length} service{filteredServices.length !== 1 ? 's' : ''}
                            </div>
                            {filteredServices.map((service) => (
                                <div
                                    key={service.id}
                                    className="p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors duration-200 border-b border-gray-100 last:border-0"
                                    onClick={() => {
                                        // You can add navigation or modal logic here
                                        console.log('Selected service:', service);
                                        setIsSearchOpen(false);
                                    }}
                                >
                                    <div className="flex items-start gap-3">
                                        <img
                                            src={service.image}
                                            alt={service.title}
                                            className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                                            onError={(e) => {
                                                (e.currentTarget as HTMLImageElement).src = '/placeholder.svg';
                                            }}
                                        />
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-semibold text-sm text-gray-900 mb-1">
                                                {service.title}
                                            </h4>
                                            <p className="text-xs text-gray-600 line-clamp-2">
                                                {service.description}
                                            </p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full capitalize">
                                                    {service.category}
                                                </span>
                                                {service.isNew && (
                                                    <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full">
                                                        New
                                                    </span>
                                                )}
                                                {service.discount && (
                                                    <span className="text-xs px-2 py-0.5 bg-red-100 text-red-700 rounded-full">
                                                        {service.discount} OFF
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-8 text-center">
                            <div className="text-gray-400 mb-2">
                                <Search className="h-12 w-12 mx-auto opacity-50" />
                            </div>
                            <p className="text-gray-600 font-medium">No services found</p>
                            <p className="text-sm text-gray-500 mt-1">
                                Try searching with different keywords
                            </p>
                        </div>
                    )}
                </Card>
            )}

            {/* Overlay to close search when clicking outside */}
            {isSearchOpen && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsSearchOpen(false)}
                />
            )}
        </div>
    );
};

export default ServiceSearch;
