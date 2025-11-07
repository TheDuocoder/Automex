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
          ? "grid grid-cols-3 gap-5 max-h-[580px] overflow-y-auto pr-2"
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
              "flex flex-col items-center justify-center bg-white border border-[#f0f0f0] transition-all duration-200",
              "w-[100px] h-[100px] rounded-xl hover:border-gray-300",
              isSelected
                ? "shadow-[0_6px_18px_rgba(0,0,0,0.06)] border-blue-400 ring-2 ring-blue-200"
                : "hover:shadow-sm"
            )}
          >
            <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center mb-2">
              <img
                src={brand.logo}
                alt={`${brand.name} logo`}
                className="h-12 w-12 object-contain"
                style={{ 
                  filter: 'none',
                  background: 'white'
                }}
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.svg";
                }}
              />
            </div>
            <span className="text-[10px] text-center font-medium text-gray-700 leading-tight px-1">
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
          ? "grid grid-cols-2 gap-3 max-h-[calc(100vh-16rem)] overflow-y-auto pr-1"
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
              "flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-200 text-sm font-medium",
              isSelected
                ? "border-[#D32F2F] bg-red-50 text-[#D32F2F] shadow-sm"
                : "border-gray-200 hover:border-[#D32F2F] hover:bg-red-50 hover:shadow"
            )}
          >
            <span className="text-xs sm:text-sm text-center leading-tight">
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
      <div className="text-xs text-gray-500 uppercase tracking-wide">
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
                "rounded-lg border py-3 text-sm font-semibold transition-all duration-200",
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
      layout === "sidebar" ? "py-3" : "pb-4",
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
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search Brands"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={cn(
                  "pl-10 border-gray-200 focus:border-blue-400 focus:ring-0 rounded-xl bg-white",
                  layout === "sidebar" ? "h-11" : "h-12"
                )}
              />
            </div>
          </div>
        )}

        {stage !== "brand" && selectedBrandEntity && (
          <div className={summaryContainerClasses}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                <img
                  src={selectedBrandEntity.logo}
                  alt={`${selectedBrandEntity.name} logo`}
                  className="h-8 w-8 object-contain"
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
          "w-full h-full bg-white",
          "overflow-hidden",
          className
        )}
      >
        <div className="px-5 pt-6 pb-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Select Manufacturer</h3>
          {stage !== "brand" && (
            <button
              onClick={handleBack}
              className="inline-flex items-center gap-1 text-xs font-semibold text-gray-600 hover:text-gray-900 mt-2"
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

      <DialogContent className="max-w-md p-0 gap-0">
        <DialogHeader className="p-6 pb-4">
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
              <DialogTitle className="text-xl font-bold text-gray-900">
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