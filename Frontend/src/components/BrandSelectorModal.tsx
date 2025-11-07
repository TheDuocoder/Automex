import { useMemo, useState } from "react";
import { Search, X, Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface CarBrand {
  id: string;
  name: string;
  logo: string;
}

interface BrandSelectorModalProps {
  selectedBrand?: string;
  onBrandSelect: (brand: string) => void;
  variant?: "modal" | "sidebar";
  className?: string;
}

const BrandSelectorModal = ({
  selectedBrand,
  onBrandSelect,
  variant = "modal",
  className,
}: BrandSelectorModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const carBrands: CarBrand[] = [
    { id: "audi", name: "Audi", logo: "/images/car_brands/audicarlogo.png" },
    { id: "bmw", name: "BMW", logo: "/images/car_brands/bmwcarlogo.png" },
    { id: "fiat", name: "Fiat", logo: "/images/car_brands/fiatcarlogo.png" },
    { id: "ford", name: "Ford", logo: "/images/car_brands/fordcarlogo.png" },
    { id: "hyundai", name: "Hyundai", logo: "/images/car_brands/hundaicarlogo.png" },
    { id: "kia", name: "Kia", logo: "/images/car_brands/kiacarlogo.png" },
    { id: "land-rover", name: "Land Rover", logo: "/images/car_brands/landrover.png" },
    { id: "lexus", name: "Lexus", logo: "/images/car_brands/lexuscarlogo.png" },
    { id: "maruti-suzuki", name: "Maruti Suzuki", logo: "/images/car_brands/suzukicarlogo.png" },
    { id: "mercedes", name: "Mercedes-Benz", logo: "/images/car_brands/mercidiescarlogo.png" },
    { id: "mg", name: "MG", logo: "/images/car_brands/mgcarlogo.png" },
    { id: "nissan", name: "Nissan", logo: "/images/car_brands/nissancarlogo.png" },
    { id: "skoda", name: "Skoda", logo: "/images/car_brands/skoda.png" },
    { id: "tata", name: "Tata Motors", logo: "/images/car_brands/tatacarlogo.png" },
    { id: "toyota", name: "Toyota", logo: "/images/car_brands/toyotacarlogo.png" },
    { id: "volkswagen", name: "Volkswagen", logo: "/images/car_brands/volkswagancarlogo.png" },
    { id: "volvo", name: "Volvo", logo: "/images/car_brands/volvocarlogo.png" },
  ];

  const filteredBrands = useMemo(() => {
    return carBrands.filter((brand) =>
    brand.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  }, [searchTerm]);

  const handleBrandSelect = (brandName: string) => {
    onBrandSelect(brandName);
    if (variant === "modal") {
    setIsOpen(false);
    setSearchTerm("");
    }
  };

  if (variant === "sidebar") {
    return (
      <aside
        className={cn(
          "w-full rounded-2xl border border-gray-200 bg-white shadow-lg",
          "overflow-hidden",
          className
        )}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Select Model</h3>
        </div>

        <div className="px-5 py-3 border-b border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search Brands"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-10 border-gray-300 focus:border-red-500 focus:ring-red-500"
            />
          </div>
        </div>

        <div className="px-5 py-3">
          <div className="grid grid-cols-2 gap-3 max-h-[calc(100vh-14rem)] overflow-y-auto pr-1">
            {filteredBrands.map((brand) => {
              const isSelected = selectedBrand === brand.name;
              return (
                <button
                  key={brand.id}
                  onClick={() => handleBrandSelect(brand.name)}
                  className={cn(
                    "flex flex-col items-center p-2.5 rounded-xl border transition-all duration-200",
                    "bg-white",
                    isSelected
                      ? "border-red-500 bg-red-50 shadow-sm"
                      : "border-gray-200 hover:border-red-400 hover:bg-red-50 hover:shadow"
                  )}
                >
                  <div className="w-11 h-11 bg-gray-100 rounded-full flex items-center justify-center mb-2 overflow-hidden">
                    <img
                      src={brand.logo}
                      alt={`${brand.name} logo`}
                      className="h-9 w-9 object-contain"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg";
                      }}
                    />
                  </div>
                  <span className="text-xs text-center font-medium text-gray-700 leading-tight">
                    {brand.name}
                  </span>
                </button>
              );
            })}

            {filteredBrands.length === 0 && (
              <div className="col-span-2 text-center py-8 text-gray-500">
                <Car className="h-10 w-10 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">No brands found</p>
                <p className="text-xs text-gray-400">Try adjusting your search</p>
              </div>
            )}
          </div>
        </div>
      </aside>
    );
  }

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
              Select Model
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
                className="flex flex-col items-center p-3 rounded-lg border border-gray-200 hover:border-[#D32F2F] hover:bg-red-50 transition-all duration-200 hover:scale-105 cursor-pointer"
              >
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-2 overflow-hidden">
                  <img
                    src={brand.logo}
                    alt={`${brand.name} logo`}
                    className="h-9 w-9 object-contain"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg";
                    }}
                  />
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