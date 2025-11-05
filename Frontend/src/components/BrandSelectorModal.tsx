import { useState } from "react";
import { Search, X, Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface CarBrand {
  id: string;
  name: string;
  logo: string;
}

interface BrandSelectorModalProps {
  selectedBrand?: string;
  onBrandSelect: (brand: string) => void;
}

const BrandSelectorModal = ({ selectedBrand, onBrandSelect }: BrandSelectorModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Car brands with their actual logos (using placeholder emojis for now)
  const carBrands: CarBrand[] = [
    { id: "maruti-suzuki", name: "Maruti Suzuki", logo: "🚗" },
    { id: "hyundai", name: "Hyundai", logo: "🚗" },
    { id: "honda", name: "Honda", logo: "🚗" },
    { id: "tata", name: "Tata", logo: "🚗" },
    { id: "ford", name: "Ford", logo: "🚗" },
    { id: "volkswagen", name: "Volkswagen", logo: "🚗" },
    { id: "mahindra", name: "Mahindra", logo: "🚗" },
    { id: "renault", name: "Renault", logo: "🚗" },
    { id: "chevrolet", name: "Chevrolet", logo: "🚗" },
    { id: "toyota", name: "Toyota", logo: "🚗" },
    { id: "nissan", name: "Nissan", logo: "🚗" },
    { id: "kia", name: "Kia", logo: "🚗" },
  ];

  const filteredBrands = carBrands.filter(brand =>
    brand.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBrandSelect = (brandName: string) => {
    onBrandSelect(brandName);
    setIsOpen(false);
    setSearchTerm("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="flex items-center gap-2 h-12 px-4 font-medium border-gray-300 hover:border-gray-400"
        >
          <Car className="h-4 w-4 text-gray-600" />
          <span className="text-gray-700">
            {selectedBrand || "Select Manufacturer"}
          </span>
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-md p-0 gap-0">
        <DialogHeader className="p-6 pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold text-gray-900">
              Select Manufacturer
            </DialogTitle>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </DialogHeader>
        
        {/* Search Input */}
        <div className="px-6 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search Brands"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 border-gray-300 focus:border-red-500 focus:ring-red-500"
            />
          </div>
        </div>
        
        {/* Brand Grid */}
        <div className="px-6 pb-6">
          <div className="grid grid-cols-3 gap-4 max-h-60 overflow-y-auto">
            {filteredBrands.map((brand) => (
              <button
                key={brand.id}
                onClick={() => handleBrandSelect(brand.name)}
                className="flex flex-col items-center p-3 rounded-lg border border-gray-200 hover:border-red-300 hover:bg-red-50 transition-all duration-200 hover:scale-105"
              >
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-2 text-xl">
                  {brand.logo}
                </div>
                <span className="text-xs text-center font-medium text-gray-700 leading-tight">
                  {brand.name}
                </span>
              </button>
            ))}
          </div>
          
          {filteredBrands.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Car className="h-12 w-12 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">No brands found</p>
              <p className="text-xs text-gray-400">Try adjusting your search</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BrandSelectorModal;