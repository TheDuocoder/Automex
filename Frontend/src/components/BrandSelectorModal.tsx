import { useEffect, useMemo, useState, useRef } from "react";
import { Search, X, Car, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useCarSelectionStore, type FuelType } from "@/stores/carSelectionStore";

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
  const triggerButtonRef = useRef<HTMLButtonElement>(null);
  const {
    catalog,
    selectedBrandId,
    selectedModelId,
    selectedFuelType,
    highlightTrigger,
    selectBrand,
    selectModel,
    selectFuelType,
    clearBrand,
    clearModel,
    clearHighlight,
  } = useCarSelectionStore();

  const selectedBrandEntity = useMemo(
    () => catalog.find((brand) => brand.id === selectedBrandId),
    [catalog, selectedBrandId]
  );

  const selectedModelEntity = useMemo(
    () => selectedBrandEntity?.models.find((model) => model.id === selectedModelId),
    [selectedBrandEntity, selectedModelId]
  );

  type Stage = "brand" | "model" | "fuel";

  const stage: Stage = selectedBrandEntity
    ? selectedModelEntity
      ? "fuel"
      : "model"
    : "brand";

  // Reset modal state when store is reset (when all selections are cleared)
  useEffect(() => {
    if (!selectedBrandId && !selectedModelId && !selectedFuelType) {
      setIsOpen(false);
      setSearchTerm("");
    }
  }, [selectedBrandId, selectedModelId, selectedFuelType]);

  useEffect(() => {
    setSearchTerm("");
  }, [stage]);

  // Handle highlight animation when validation fails
  useEffect(() => {
    if (highlightTrigger && triggerButtonRef.current) {
      const button = triggerButtonRef.current;

      // Add highlight animation classes
      button.classList.add("animate-pulse");
      button.style.borderColor = "#ef4444";
      button.style.boxShadow = "0 0 0 3px rgba(239, 68, 68, 0.3)";

      // Scroll to button if not visible
      button.scrollIntoView({ behavior: "smooth", block: "center" });

      // Remove animation after 2 seconds
      const timeout = setTimeout(() => {
        button.classList.remove("animate-pulse");
        button.style.borderColor = "";
        button.style.boxShadow = "";
        clearHighlight();
      }, 2000);

      return () => {
        clearTimeout(timeout);
        button.classList.remove("animate-pulse");
        button.style.borderColor = "";
        button.style.boxShadow = "";
      };
    }
  }, [highlightTrigger, clearHighlight]);

  const normalizedSearch = searchTerm.trim().toLowerCase();

  const filteredBrandList = useMemo(
    () =>
      catalog.filter((brand) =>
        brand.name.toLowerCase().includes(normalizedSearch)
      ),
    [catalog, normalizedSearch]
  );

  const filteredModelList = useMemo(
    () =>
      selectedBrandEntity
        ? selectedBrandEntity.models.filter((model) =>
          model.name.toLowerCase().includes(normalizedSearch)
        )
        : [],
    [selectedBrandEntity, normalizedSearch]
  );

  const searchPlaceholder =
    stage === "brand"
      ? "Search Brands"
      : stage === "model"
        ? "Search Models"
        : "";

  const showSearch = stage !== "fuel";

  const handleBrandClick = (brandId: string, brandName: string) => {
    selectBrand(brandId);
    onBrandSelect(brandName);
    // Store is automatically updated via selectBrand
  };

  const handleModelClick = (modelId: string) => {
    selectModel(modelId);
    // Store is automatically updated via selectModel
  };

  const handleFuelClick = (fuel: FuelType) => {
    selectFuelType(fuel);
    // Store is automatically updated via selectFuelType
    if (variant === "modal") {
      setIsOpen(false);
    }
  };

  const handleBack = () => {
    if (stage === "fuel") {
      clearModel();
    } else if (stage === "model") {
      clearBrand();
      onBrandSelect("");
    }
  };

  const renderEmptyState = (
    title: string,
    subtitle: string,
    layout: "sidebar" | "modal"
  ) => (
    <div
      className={cn(
        "text-center py-8 text-gray-500",
        layout === "sidebar" ? "col-span-2" : "col-span-3"
      )}
    >
      <Car className="h-10 w-10 mx-auto mb-2 text-gray-300" />
      <p className="text-sm">{title}</p>
      <p className="text-xs text-gray-400">{subtitle}</p>
    </div>
  );

  const renderBrandGrid = (layout: "sidebar" | "modal") => (
    <div
      className={cn(
        layout === "sidebar"
          ? "grid grid-cols-3 gap-3.5 max-h-[420px] overflow-y-auto pr-2"
          : "grid grid-cols-3 gap-4 pb-16"
      )}
      style={{
        scrollbarWidth: 'thin',
        scrollbarColor: '#cbd5e1 #f8fafc'
      }}
    >
      {filteredBrandList.map((brand) => {
        const isSelected = selectedBrandId === brand.id;
        return (
          <button
            key={brand.id}
            onClick={() => handleBrandClick(brand.id, brand.name)}
            className={cn(
              "flex flex-col items-center justify-center bg-white group",
              "w-full h-[108px] md:h-[112px] max-md:h-[100px] rounded-xl relative overflow-hidden",
              // Neumorphic soft shadows - subtle elevation
              "shadow-[2px_2px_6px_rgba(0,0,0,0.08),-2px_-2px_6px_rgba(255,255,255,0.9)]",
              // Hover state with red theme and enhanced neumorphic shadow
              "hover:border-[#E74A3B] hover:ring-2 hover:ring-inset hover:ring-[#E74A3B]",
              "hover:shadow-[3px_3px_10px_rgba(0,0,0,0.12),-3px_-3px_10px_rgba(255,255,255,0.95)]",
              "active:scale-[0.98] active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1)]",
              // Selection state with red border and warm background
              isSelected
                ? "border-[#E74A3B] border-2 bg-[#FFF9E5] shadow-[4px_4px_12px_rgba(0,0,0,0.1),-2px_-2px_8px_rgba(255,255,255,0.95)]"
                : "border border-gray-200"
            )}
            style={{ transition: 'all 0.10s ease' }}
          >
            <div className={cn(
              "w-15 h-15 max-md:w-13 max-md:h-13 rounded-lg flex items-center justify-center mb-2 transition-all duration-300",
              isSelected
                ? "bg-white shadow-sm"
                : "bg-white"
            )} style={{ backgroundColor: '#FFFFFF' }}>
              <img
                src={brand.logo}
                alt={`${brand.name} logo`}
                className={cn(
                  "h-14 w-14 max-md:h-12 max-md:w-12 object-contain transition-all duration-300",
                  isSelected ? "scale-110" : "scale-100",
                  "group-hover:scale-110"
                )}
                style={{
                  filter: isSelected ? 'brightness(1.1) contrast(1.2)' : 'brightness(1.05) contrast(1.1)',
                  background: '#FFFFFF',
                  borderRadius: '4px',
                  padding: '2px'
                }}
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.svg";
                }}
              />
            </div>
            <span className={cn(
              "text-[10px] text-center font-medium leading-tight px-0.5 transition-all duration-300 -translate-y-1",
              isSelected ? "text-[#E74A3B] font-semibold" : "text-gray-800"
            )}>
              {brand.name}
            </span>
          </button>
        );
      })}

      {filteredBrandList.length === 0 &&
        renderEmptyState("No brands found", "Try adjusting your search", layout)}
    </div>
  );

  const renderModelGrid = (layout: "sidebar" | "modal") => (
    <div
      className={cn(
        layout === "sidebar"
          ? "grid grid-cols-3 gap-3 pr-1.5 pb-4"
          : "grid grid-cols-3 gap-5 pb-6 min-h-[300px]"
      )}
    >
      {filteredModelList.map((model) => {
        const isSelected = selectedModelId === model.id;
        // Generate image path based on brand and model
        const brandName = selectedBrandEntity?.name.toLowerCase().replace(/\s+/g, '_') || '';
        const modelName = model.name.toLowerCase().replace(/\s+/g, '_');

        // Special handling for Skoda, Land Rover, and Audi - use correct folder paths
        let imagePath;
        if (brandName === 'skoda') {
          // Skoda images are in "Skoda" folder with proper capitalization
          let skodaFileName = model.name; // Use original name with proper capitalization
          imagePath = `/images/Car_images/Skoda/${skodaFileName}.png`;
        } else if (brandName === 'land_rover') {
          // Land Rover images are in "Land rover" folder with proper naming
          let landRoverFileName = model.name; // Use original name with proper capitalization

          // Normalize model name for matching
          const cleanLRName = modelName.replace(/[_\s-]/g, '').toLowerCase();

          // Map to exact filenames
          if (cleanLRName === 'rangerover') {
            landRoverFileName = 'Rang Rover';
          } else if (cleanLRName === 'rangeroversport') {
            landRoverFileName = 'Range Rover Sport';
          } else if (cleanLRName === 'rangerovervelar') {
            landRoverFileName = 'Range Rover Velar';
          } else if (cleanLRName === 'rangerovervogue') {
            landRoverFileName = 'Range Rover Vogue';
          } else if (cleanLRName === 'rangeroverevoque') {
            landRoverFileName = 'Range Rover Evoque';
          } else if (cleanLRName === 'freelander2') {
            landRoverFileName = 'Freelander 2';
          } else if (cleanLRName === 'discovery4') {
            landRoverFileName = 'Discovery 4';
          } else if (cleanLRName === 'discoverysport') {
            landRoverFileName = 'Discovery Sport';
          }

          imagePath = `/images/Car_images/Land rover/${landRoverFileName}.png`;
        } else if (brandName === 'audi') {
          // Audi images are in "Audi_car" folder
          // Files use proper capitalization: A3.png, A4.png, Q7.png, etc.
          // Exception: "e-tron.png" is lowercase

          const modelName = model.name;

          if (modelName.toLowerCase() === 'e-tron') {
            imagePath = `/images/Car_images/Audi_car/e-tron.png`;
          } else {
            // Use the model name as-is with proper capitalization (A3, A4, Q7, etc.)
            imagePath = `/images/Car_images/Audi_car/${modelName}.png`;
          }
        } else if (brandName === 'volkswagen') {
          // Volkswagen images are in "Volkswagen" folder
          // Most files are capitalized: Ameo.png, Vento.png, Jetta.png, Passat.png, etc.
          // Exceptions: "polo.png" is lowercase, "Cross Polo.png" and "T-Roc.png" have specific casing

          const modelName = model.name;
          const cleanName = modelName.toLowerCase().replace(/\s+/g, ' ');

          if (cleanName === 'cross polo') {
            imagePath = `/images/Car_images/Volkswagen/Cross Polo.png`;
          } else if (cleanName === 't-roc' || cleanName === 't roc') {
            imagePath = `/images/Car_images/Volkswagen/T-Roc.png`;
          } else if (cleanName === 'polo') {
            imagePath = `/images/Car_images/Volkswagen/polo.png`;
          } else {
            // Default to capitalized first letter for others (Ameo, Beetle, Jetta, Passat, Phaeton, Taigun, Tiguan, Vento, Virtus)
            const capitalizedName = modelName.charAt(0).toUpperCase() + modelName.slice(1).toLowerCase();
            imagePath = `/images/Car_images/Volkswagen/${capitalizedName}.png`;
          }
        } else if (brandName === 'bmw') {
          // BMW images are in "BMW" folder with spaces in filenames
          // Convert model name to have proper spacing and capitalization
          let bmwFileName = model.name; // Use original name with spaces
          imagePath = `/images/Car_images/BMW/${bmwFileName}.png`;
        } else if (brandName === 'mercedes-benz' || brandName === 'mercedes_benz') {
          // Mercedes-Benz images are in "Mercedes-Benz" folder with spaces and hyphens
          let mercedesFileName = model.name; // Use original name with spaces and hyphens
          // Special case: R Class uses space format
          if (modelName === 'r_class' || model.name === 'R Class') {
            mercedesFileName = 'R Class';
          }
          // Special case: S-Class uses hyphen format
          if (modelName === 's-class' || modelName === 's_class' || model.name === 'S-Class' || model.name === 'S Class') {
            mercedesFileName = 'S-Class';
          }
          // Special case: GLE43 AMG uses space and number format
          if (modelName === 'gle43_amg' || model.name === 'GLE43 AMG' || model.name === 'GLE 43 AMG') {
            mercedesFileName = 'GLE43 AMG';
          }
          // Special case: GLE Class uses space format
          if (modelName === 'gle_class' || model.name === 'GLE Class' || model.name === 'GLE-Class') {
            mercedesFileName = 'GLE Class';
          }
          imagePath = `/images/Car_images/Mercedes-Benz/${mercedesFileName}.png`;
        } else if (brandName === 'volvo') {
          // Volvo images are in "Volvo" folder with spaces in filenames
          let volvoFileName = model.name; // Use original name with spaces
          // Special case: XC 40 uses space before number
          if (modelName === 'xc_40' || modelName === 'xc40' || model.name === 'XC40') {
            volvoFileName = 'XC 40';
          }
          imagePath = `/images/Car_images/Volvo/${volvoFileName}.png`;
        } else if (brandName === 'kia') {
          // Kia images are in "Kia" folder with proper capitalization
          let kiaFileName = model.name; // Use original name with proper capitalization
          imagePath = `/images/Car_images/Kia/${kiaFileName}.png`;
        } else if (brandName === 'mg') {
          // MG images are in "MG" folder with proper capitalization
          let mgFileName = model.name; // Use original name with proper capitalization
          imagePath = `/images/Car_images/MG/${mgFileName}.png`;
        } else if (brandName === 'mini') {
          // Mini images are in "Mini" folder with proper capitalization
          let miniFileName = model.name; // Use original name with proper capitalization
          imagePath = `/images/Car_images/Mini/${miniFileName}.png`;
        } else if (brandName === 'jaguar') {
          // Jaguar images are in "Jaguar" folder with proper capitalization and hyphens
          let jaguarFileName = model.name; // Use original name with proper capitalization
          imagePath = `/images/Car_images/Jaguar/${jaguarFileName}.png`;
        } else if (brandName === 'jeep') {
          // Jeep images are in "Jeep" folder with proper capitalization
          let jeepFileName = model.name; // Use original name with proper capitalization
          imagePath = `/images/Car_images/Jeep/${jeepFileName}.png`;
        } else if (brandName === 'nissan') {
          // Nissan images are in "Nissan" folder with proper capitalization
          let nissanFileName = model.name; // Use original name with proper capitalization
          imagePath = `/images/Car_images/Nissan/${nissanFileName}.png`;
        } else if (brandName === 'maruti_suzuki' || brandName === 'maruti-suzuki') {
          // Maruti Suzuki images are in "Maruti Suzuki" folder with proper capitalization
          let marutiFileName = model.name; // Use original name with proper capitalization
          imagePath = `/images/Car_images/Maruti Suzuki/${marutiFileName}.png`;
        } else if (brandName === 'hyundai') {
          // Hyundai images are in "Hyundai" folder with proper capitalization
          let hyundaiFileName = model.name; // Use original name with proper capitalization (matches image filenames exactly)
          imagePath = `/images/Car_images/Hyundai/${hyundaiFileName}.png`;
        } else if (brandName === 'lexus') {
          // Lexus images are in "Lexus" folder with proper capitalization
          let lexusFileName = model.name; // Use original name with proper capitalization
          imagePath = `/images/Car_images/Lexus/${lexusFileName}.png`;
        } else if (brandName === 'mahindra') {
          // Mahindra images are in "Mahindra" folder with proper capitalization
          let mahindraFileName = model.name; // Use original name with proper capitalization
          imagePath = `/images/Car_images/Mahindra/${mahindraFileName}.png`;
        } else if (brandName === 'toyota') {
          // Toyota images are in "Toyota" folder with proper capitalization
          let toyotaFileName = model.name; // Use original name with proper capitalization
          // Special case: "Innova Hycross" uses full name with space
          if (modelName === 'innova_hycross' || model.name === 'Innova Hycross') {
            toyotaFileName = 'Innova Hycross';
          }
          imagePath = `/images/Car_images/Toyota/${toyotaFileName}.png`;
        } else {
          imagePath = `/images/Car_images/${brandName}_car/${modelName}.png`;
        }

        return (
          <button
            key={model.id}
            onClick={() => handleModelClick(model.id)}
            className={cn(
              "flex flex-col items-center justify-center transition-all duration-300 overflow-hidden group relative",
              "rounded-2xl",
              isSelected
                ? "border-2 border-[#E74A3B] scale-[1.02]"
                : "border border-gray-200/50 hover:border-[#E74A3B]/40"
            )}
            style={{
              aspectRatio: '0.95',
              padding: '8px',
              backgroundColor: '#FFFFFF',
              boxShadow: isSelected
                ? '0 8px 24px rgba(231, 74, 59, 0.15), 0 2px 8px rgba(0, 0, 0, 0.05)'
                : '0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            {/* Car Image Container - Pure White Background */}
            <div
              className="flex-1 flex items-center justify-center w-full mb-2 relative rounded-lg"
              style={{
                backgroundColor: '#FFFFFF'
              }}
            >
              <div className={cn(
                "relative w-full h-full flex items-center justify-center transition-transform duration-300 rounded-lg",
                isSelected ? "scale-105" : "group-hover:scale-[1.08]"
              )}
                style={{
                  backgroundColor: '#FFFFFF'
                }}
              >
                <img
                  src={imagePath}
                  alt={model.name}
                  className="w-full h-full object-contain"
                  style={{
                    filter: isSelected
                      ? 'drop-shadow(0 4px 12px rgba(231, 74, 59, 0.15))'
                      : 'drop-shadow(0 2px 6px rgba(0, 0, 0, 0.06))',
                    maxHeight: '100%',
                    backgroundColor: '#FFFFFF',
                    padding: '2px',
                    mixBlendMode: 'normal',
                    imageRendering: 'crisp-edges',
                    WebkitFontSmoothing: 'antialiased'
                  }}
                  onError={(e) => {
                    e.currentTarget.src = "/images/car_images/default_car.png";
                    e.currentTarget.style.filter = 'none';
                  }}
                  loading="lazy"
                />
              </div>
            </div>

            {/* Model Name - Clean Typography */}
            <div
              className={cn(
                "text-center w-full px-1 py-2 rounded-lg transition-all duration-200",
                isSelected && "bg-red-50/50"
              )}
              style={{
                backgroundColor: isSelected ? 'rgba(254, 242, 242, 0.5)' : 'transparent'
              }}
            >
              <span className={cn(
                "text-[9px] font-semibold tracking-tight leading-tight block whitespace-nowrap",
                isSelected
                  ? "text-[#E74A3B]"
                  : "text-gray-800 group-hover:text-[#E74A3B]"
              )}
                style={{
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                  letterSpacing: '-0.02em'
                }}
              >
                {model.name}
              </span>
            </div>

            {/* Selection Indicator - Minimal Premium */}
            {isSelected && (
              <div
                className="absolute top-3 right-3 w-6 h-6 bg-[#E74A3B] rounded-full flex items-center justify-center"
                style={{
                  boxShadow: '0 2px 8px rgba(231, 74, 59, 0.3)'
                }}
              >
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </button>
        );
      })}

      {filteredModelList.length === 0 &&
        renderEmptyState("No models found", "Try another brand or search", layout)}
    </div>
  );

  const renderFuelOptions = (layout: "sidebar" | "modal") => (
    <div className="space-y-4">
      <div className="text-[11px] text-gray-500 uppercase tracking-wide">
        Preferred fuel type
      </div>
      <div className="grid grid-cols-2 gap-3">
        {selectedModelEntity?.fuelTypes.map((fuel) => {
          const isSelected = selectedFuelType === fuel;
          return (
            <button
              key={fuel}
              onClick={() => handleFuelClick(fuel)}
              className={cn(
                "rounded-lg border py-2.5 text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2",
                isSelected
                  ? "border-[#D32F2F] bg-red-50 text-[#D32F2F] shadow-sm"
                  : "border-gray-200 text-gray-700 hover:border-[#D32F2F] hover:bg-red-50"
              )}
            >
              {fuel === 'Petrol' && (
                <img
                  src="/images/Car_images/Petrol_nozzle.png"
                  alt="Petrol"
                  className="w-5 h-5 object-contain"
                />
              )}
              {fuel === 'Diesel' && (
                <img
                  src="/images/Car_images/Diesel_nozzle.png"
                  alt="Diesel"
                  className="w-5 h-5 object-contain"
                />
              )}
              {fuel === 'Electric' && (
                <img
                  src="/images/Car_images/Electric.png"
                  alt="Electric"
                  className="w-5 h-5 object-contain"
                />
              )}
              {fuel}
            </button>
          );
        })}
      </div>
    </div>
  );

  const renderSelectionContent = (layout: "sidebar" | "modal") => {
    const paddingX = layout === "sidebar" ? "px-6" : "px-6";
    const searchContainerClasses = cn(
      paddingX,
      layout === "sidebar" ? "pt-4 pb-4" : "pb-2"
    );
    const summaryContainerClasses = cn(
      paddingX,
      layout === "sidebar" ? "py-3" : "py-4",
      "border-b border-gray-100 flex items-center justify-between gap-3"
    );
    const gridWrapperClasses = cn(
      paddingX,
      layout === "sidebar" ? "py-6 overflow-y-auto max-h-[420px]" : "pb-16 pt-6 overflow-y-auto max-h-[calc(75vh-120px)] min-h-[400px]"
    );

    return (
      <>
        {showSearch && (
          <div className={searchContainerClasses}>
            <div className="relative">
              <svg
                className={cn(
                  "absolute top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4 transition-all duration-300",
                  searchTerm && "text-[#E74A3B]"
                )}
                style={{ left: '12px' }}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <Input
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={cn(
                  "pl-10 border-gray-200 rounded-[16px] bg-white transition-all duration-300",
                  "focus:outline-none focus:ring-2 focus:ring-[#E74A3B] focus:border-[#E74A3B] focus:bg-white",
                  "hover:border-gray-300 hover:shadow-lg",
                  "shadow-[0_4px_16px_rgba(0,0,0,0.1)]",
                  "placeholder:text-gray-500 placeholder:font-medium",
                  searchTerm && "animate-in fade-in duration-300",
                  layout === "sidebar" ? "h-11" : "h-12"
                )}
                style={{
                  outline: 'none'
                }}
              />
            </div>
          </div>
        )}

        {stage !== "brand" && selectedBrandEntity && (
          <div className={summaryContainerClasses}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center overflow-hidden" style={{ backgroundColor: '#FFFFFF' }}>
                <img
                  src={selectedBrandEntity.logo}
                  alt={`${selectedBrandEntity.name} logo`}
                  className="h-7 w-7 object-contain"
                  style={{
                    filter: 'brightness(1.05) contrast(1.1)',
                    background: '#FFFFFF',
                    borderRadius: '50%',
                    padding: '1px'
                  }}
                />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-900 leading-tight">
                  {selectedBrandEntity.name}
                </span>
                {selectedModelEntity && (
                  <span className="text-xs text-gray-500">
                    {selectedModelEntity.name}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  clearBrand();
                  onBrandSelect("");
                }}
                className="text-xs font-semibold text-gray-600 hover:text-gray-900"
              >
                Change brand
              </button>
            </div>
          </div>
        )}

        <div
          className={gridWrapperClasses}
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#cbd5e1 #f8fafc'
          }}
        >
          {stage === "brand" && renderBrandGrid(layout)}
          {stage === "model" && renderModelGrid(layout)}
          {stage === "fuel" && renderFuelOptions(layout)}
        </div>
      </>
    );
  };

  // Handle highlight animation for sidebar variant
  useEffect(() => {
    if (variant === "sidebar" && highlightTrigger) {
      const sidebar = document.querySelector('[data-brand-selector-sidebar]');
      if (sidebar) {
        const titleElement = sidebar.querySelector('h3');
        if (titleElement) {
          // Add highlight animation
          titleElement.classList.add("animate-pulse");
          titleElement.style.color = "#ef4444";
          titleElement.style.textShadow = "0 0 8px rgba(239, 68, 68, 0.5)";

          // Scroll to sidebar if not visible
          sidebar.scrollIntoView({ behavior: "smooth", block: "center" });

          // Remove animation after 2 seconds
          const timeout = setTimeout(() => {
            titleElement.classList.remove("animate-pulse");
            titleElement.style.color = "";
            titleElement.style.textShadow = "";
            clearHighlight();
          }, 2000);

          return () => {
            clearTimeout(timeout);
            titleElement.classList.remove("animate-pulse");
            titleElement.style.color = "";
            titleElement.style.textShadow = "";
          };
        }
      }
    }
  }, [highlightTrigger, variant, clearHighlight]);

  if (variant === "sidebar") {
    return (
      <aside
        data-brand-selector-sidebar
        className={cn(
          "w-full h-full overflow-hidden bg-white",
          className,
          highlightTrigger && "ring-2 ring-red-500 ring-offset-2 rounded-2xl"
        )}
      >
        <div className="px-6 pt-5 pb-4 border-b border-gray-200">
          <h3 className={cn(
            "text-xl font-semibold text-gray-900 mb-4 transition-all duration-300",
            highlightTrigger && "text-red-500"
          )}>
            {stage === "brand"
              ? "Select Manufacturer"
              : stage === "model"
                ? "Select Model"
                : "Select Fuel Type"}
          </h3>
          {stage !== "brand" && (
            <button
              onClick={handleBack}
              className="inline-flex items-center gap-1 text-xs font-semibold text-gray-600 hover:text-gray-900"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </button>
          )}
        </div>

        {renderSelectionContent("sidebar")}
      </aside>
    );
  }

  const triggerLabel = (selectedBrandEntity?.name || selectedBrand) ? "Select Model" : "Select Brand";

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          ref={triggerButtonRef}
          variant="outline"
          className={cn(
            "flex items-center gap-2 h-12 px-4 font-medium border-gray-300 hover:border-gray-400 transition-all duration-300",
            highlightTrigger && "border-red-500 shadow-lg"
          )}
        >
          <Car className="h-4 w-4 text-gray-600" />
          <span className="text-gray-700">{triggerLabel}</span>
        </Button>
      </DialogTrigger>

      <DialogContent
        className="w-[400px] max-w-[400px] max-h-[80vh] p-0 gap-0 overflow-hidden flex flex-col"
        style={{
          background: 'linear-gradient(to bottom, #FFFFFF, #FAFAFA)'
        }}
      >
        <DialogHeader className="px-6 py-6" style={{ paddingBottom: '6px' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {stage !== "brand" && (
                <button
                  onClick={handleBack}
                  className="inline-flex items-center gap-1 text-sm font-semibold text-gray-600 hover:text-gray-900"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Back
                </button>
              )}
              <DialogTitle className="text-xl font-bold text-gray-900 mb-4">
                {stage === "brand"
                  ? "Select Brand"
                  : stage === "model"
                    ? "Select Model"
                    : "Select Fuel"}
              </DialogTitle>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </DialogHeader>

        {renderSelectionContent("modal")}
      </DialogContent>
    </Dialog>
  );
};

export default BrandSelectorModal;