import { useEffect, useMemo, useState } from "react";
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
  const {
    catalog,
    selectedBrandId,
    selectedModelId,
    selectedFuelType,
    selectBrand,
    selectModel,
    selectFuelType,
    clearBrand,
    clearModel,
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

  useEffect(() => {
    setSearchTerm("");
  }, [stage]);

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
  };

  const handleModelClick = (modelId: string) => {
    selectModel(modelId);
  };

  const handleFuelClick = (fuel: FuelType) => {
    selectFuelType(fuel);
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
          ? "grid grid-cols-3 gap-3.5 max-h-[460px] overflow-y-auto pr-2"
          : "grid grid-cols-3 gap-4 max-h-60 overflow-y-auto"
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
              "flex flex-col items-center justify-center bg-white",
              "w-[96px] h-[96px] md:w-[100px] md:h-[100px] max-md:w-[88px] max-md:h-[88px] rounded-xl relative overflow-hidden",
              // Hover state with red theme
              "hover:border-[#E74A3B] hover:ring-2 hover:ring-inset hover:ring-[#E74A3B] hover:shadow-sm",
              "active:scale-[0.98] active:shadow-sm",
              // Selection state with red border and warm background
              isSelected
                ? "border-[#E74A3B] border-2 bg-[#FFF9E5] shadow-[0_4px_25px_rgba(0,0,0,0.06)]"
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
                  "h-11 w-11 max-md:h-10 max-md:w-10 object-contain transition-all duration-300",
                  isSelected ? "scale-110" : "scale-100"
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
              "text-[10px] text-center font-medium leading-tight px-0.5 transition-all duration-300",
              isSelected ? "text-[#E74A3B] font-semibold" : "text-gray-700"
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
          ? "grid grid-cols-2 gap-3 max-h-[380px] overflow-y-auto pr-1.5"
          : "grid grid-cols-3 gap-4 max-h-60 overflow-y-auto"
      )}
    >
      {filteredModelList.map((model) => {
        const isSelected = selectedModelId === model.id;
        return (
          <button
            key={model.id}
            onClick={() => handleModelClick(model.id)}
            className={cn(
              "flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all duration-200 text-xs sm:text-sm font-medium",
              isSelected
                ? "border-[#D32F2F] bg-red-50 text-[#D32F2F] shadow-sm"
                : "border-gray-200 hover:border-[#D32F2F] hover:bg-red-50 hover:shadow"
            )}
          >
            <span className="text-xs text-center leading-tight">
              {model.name}
            </span>
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
                "rounded-lg border py-2.5 text-sm font-semibold transition-all duration-200",
                isSelected
                  ? "border-[#D32F2F] bg-red-50 text-[#D32F2F] shadow-sm"
                  : "border-gray-200 text-gray-700 hover:border-[#D32F2F] hover:bg-red-50"
              )}
            >
              {fuel}
            </button>
          );
        })}
      </div>
    </div>
  );

  const renderSelectionContent = (layout: "sidebar" | "modal") => {
    const paddingX = layout === "sidebar" ? "px-5" : "px-6";
    const searchContainerClasses = cn(
      paddingX,
      layout === "sidebar" ? "py-2.5" : "pb-2",
      "border-b border-gray-100"
    );
    const summaryContainerClasses = cn(
      paddingX,
      layout === "sidebar" ? "py-3" : "py-4",
      "border-b border-gray-100 flex items-center justify-between gap-3"
    );
    const gridWrapperClasses = cn(
      paddingX,
      layout === "sidebar" ? "py-5" : "pb-6"
    );

    return (
      <>
        {showSearch && (
          <div className={searchContainerClasses}>
            <div className="relative">
              <svg 
                className="absolute top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4"
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
                  "pl-10 border-gray-200 rounded-xl bg-white transition-all duration-200",
                  "focus:outline-none focus:ring-2 focus:ring-[#E74A3B] focus:border-[#E74A3B] focus:bg-white",
                  "hover:border-gray-300 hover:shadow-sm",
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
              {stage === "fuel" && (
                <button
                  onClick={() => clearModel()}
                  className="text-xs font-semibold text-gray-600 hover:text-gray-900"
                >
                  Change model
                </button>
              )}
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

        <div className={gridWrapperClasses}>
          {stage === "brand" && renderBrandGrid(layout)}
          {stage === "model" && renderModelGrid(layout)}
          {stage === "fuel" && renderFuelOptions(layout)}
        </div>
      </>
    );
  };

  if (variant === "sidebar") {
    return (
      <aside
        className={cn(
          "w-full h-full overflow-hidden",
          className
        )}
        style={{
          background: 'linear-gradient(to bottom, #FFFFFF, #FAFAFA)'
        }}
      >
        <div className="px-5 pt-3 pb-3 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Select Manufacturer</h3>
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
          variant="outline"
          className="flex items-center gap-2 h-12 px-4 font-medium border-gray-300 hover:border-gray-400"
        >
          <Car className="h-4 w-4 text-gray-600" />
          <span className="text-gray-700">{triggerLabel}</span>
        </Button>
      </DialogTrigger>

      <DialogContent 
        className="w-[400px] max-w-[400px] p-0 gap-0"
        style={{
          background: 'linear-gradient(to bottom, #FFFFFF, #FAFAFA)'
        }}
      >
        <DialogHeader className="px-6 py-6" style={{paddingBottom: '6px'}}>
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