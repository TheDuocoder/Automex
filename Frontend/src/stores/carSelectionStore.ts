import { create } from "zustand";

export type FuelType = "Petrol" | "Diesel" | "CNG" | "Hybrid" | "Electric";

export interface CarModel {
  id: string;
  name: string;
  fuelTypes: FuelType[];
}

export interface CarBrand {
  id: string;
  name: string;
  logo: string;
  models: CarModel[];
}

const carCatalog: CarBrand[] = [
  {
    id: "audi",
    name: "Audi",
    logo: "/images/car_brands/audicarlogo.png",
    models: [
      { id: "audi-a3", name: "A3", fuelTypes: ["Petrol", "Diesel"] },
      { id: "audi-q3", name: "Q3", fuelTypes: ["Petrol", "Diesel"] },
      { id: "audi-e-tron", name: "E-tron", fuelTypes: ["Electric"] },
    ],
  },
  {
    id: "bmw",
    name: "BMW",
    logo: "/images/car_brands/bmwcarlogo.png",
    models: [
      { id: "bmw-3-series", name: "3 Series", fuelTypes: ["Petrol", "Diesel"] },
      { id: "bmw-x1", name: "X1", fuelTypes: ["Petrol", "Diesel"] },
      { id: "bmw-i4", name: "i4", fuelTypes: ["Electric"] },
    ],
  },
  {
    id: "fiat",
    name: "Fiat",
    logo: "/images/car_brands/fiatcarlogo.png",
    models: [
      { id: "fiat-punto", name: "Punto", fuelTypes: ["Petrol", "Diesel"] },
      { id: "fiat-linea", name: "Linea", fuelTypes: ["Petrol", "Diesel"] },
      { id: "fiat-500", name: "500", fuelTypes: ["Petrol", "Electric"] },
    ],
  },
  {
    id: "ford",
    name: "Ford",
    logo: "/images/car_brands/fordcarlogo.png",
    models: [
      { id: "ford-ecosport", name: "EcoSport", fuelTypes: ["Petrol", "Diesel"] },
      { id: "ford-endeavour", name: "Endeavour", fuelTypes: ["Diesel"] },
      { id: "ford-mustang", name: "Mustang", fuelTypes: ["Petrol"] },
    ],
  },
  {
    id: "hyundai",
    name: "Hyundai",
    logo: "/images/car_brands/hundaicarlogo.png",
    models: [
      { id: "hyundai-i20", name: "i20", fuelTypes: ["Petrol", "Diesel"] },
      { id: "hyundai-creta", name: "Creta", fuelTypes: ["Petrol", "Diesel"] },
      { id: "hyundai-venue", name: "Venue", fuelTypes: ["Petrol", "Diesel"] },
    ],
  },
  {
    id: "kia",
    name: "Kia",
    logo: "/images/car_brands/kiacarlogo.png",
    models: [
      { id: "kia-seltos", name: "Seltos", fuelTypes: ["Petrol", "Diesel"] },
      { id: "kia-sonet", name: "Sonet", fuelTypes: ["Petrol", "Diesel"] },
      { id: "kia-ev6", name: "EV6", fuelTypes: ["Electric"] },
    ],
  },
  {
    id: "maruti-suzuki",
    name: "Maruti Suzuki",
    logo: "/images/car_brands/suzukicarlogo.png",
    models: [
      { id: "maruti-baleno", name: "Baleno", fuelTypes: ["Petrol", "CNG"] },
      { id: "maruti-swift", name: "Swift", fuelTypes: ["Petrol", "CNG"] },
      { id: "maruti-vitara", name: "Grand Vitara", fuelTypes: ["Petrol", "Hybrid"] },
    ],
  },
  {
    id: "mg",
    name: "MG",
    logo: "/images/car_brands/mgcarlogo.png",
    models: [
      { id: "mg-hector", name: "Hector", fuelTypes: ["Petrol", "Diesel"] },
      { id: "mg-astor", name: "Astor", fuelTypes: ["Petrol"] },
      { id: "mg-zsev", name: "ZS EV", fuelTypes: ["Electric"] },
    ],
  },
  {
    id: "nissan",
    name: "Nissan",
    logo: "/images/car_brands/nissancarlogo.png",
    models: [
      { id: "nissan-magnite", name: "Magnite", fuelTypes: ["Petrol"] },
      { id: "nissan-kicks", name: "Kicks", fuelTypes: ["Petrol", "Diesel"] },
      { id: "nissan-leaf", name: "Leaf", fuelTypes: ["Electric"] },
    ],
  },
  {
    id: "skoda",
    name: "Skoda",
    logo: "/images/car_brands/skoda.png",
    models: [
      { id: "skoda-slavia", name: "Slavia", fuelTypes: ["Petrol"] },
      { id: "skoda-kushaq", name: "Kushaq", fuelTypes: ["Petrol"] },
      { id: "skoda-octavia", name: "Octavia", fuelTypes: ["Petrol", "Diesel"] },
    ],
  },
  {
    id: "tata",
    name: "Tata Motors",
    logo: "/images/car_brands/tatacarlogo.png",
    models: [
      { id: "tata-nexon", name: "Nexon", fuelTypes: ["Petrol", "Diesel", "Electric"] },
      { id: "tata-harrier", name: "Harrier", fuelTypes: ["Diesel"] },
      { id: "tata-altroz", name: "Altroz", fuelTypes: ["Petrol", "Diesel", "CNG"] },
    ],
  },
  {
    id: "toyota",
    name: "Toyota",
    logo: "/images/car_brands/toyotacarlogo.png",
    models: [
      { id: "toyota-fortuner", name: "Fortuner", fuelTypes: ["Petrol", "Diesel"] },
      { id: "toyota-hycross", name: "HyCross", fuelTypes: ["Hybrid"] },
      { id: "toyota-glanza", name: "Glanza", fuelTypes: ["Petrol", "CNG"] },
    ],
  },
  {
    id: "volkswagen",
    name: "Volkswagen",
    logo: "/images/car_brands/volkswagancarlogo.png",
    models: [
      { id: "vw-virtus", name: "Virtus", fuelTypes: ["Petrol"] },
      { id: "vw-taigun", name: "Taigun", fuelTypes: ["Petrol"] },
      { id: "vw-tiguan", name: "Tiguan", fuelTypes: ["Petrol"] },
    ],
  },
  {
    id: "volvo",
    name: "Volvo",
    logo: "/images/car_brands/volvocarlogo.png",
    models: [
      { id: "volvo-xc40", name: "XC40", fuelTypes: ["Petrol", "Electric"] },
      { id: "volvo-xc60", name: "XC60", fuelTypes: ["Petrol", "Hybrid"] },
      { id: "volvo-s60", name: "S60", fuelTypes: ["Petrol"] },
    ],
  },
  {
    id: "mercedes",
    name: "Mercedes-Benz",
    logo: "/images/car_brands/mercidiescarlogo.png",
    models: [
      { id: "mercedes-c-class", name: "C-Class", fuelTypes: ["Petrol", "Diesel"] },
      { id: "mercedes-gla", name: "GLA", fuelTypes: ["Petrol", "Diesel"] },
      { id: "mercedes-eqs", name: "EQS", fuelTypes: ["Electric"] },
    ],
  },
  {
    id: "lexus",
    name: "Lexus",
    logo: "/images/car_brands/lexuscarlogo.png",
    models: [
      { id: "lexus-nx", name: "NX", fuelTypes: ["Hybrid"] },
      { id: "lexus-es", name: "ES", fuelTypes: ["Hybrid"] },
      { id: "lexus-ux", name: "UX", fuelTypes: ["Electric"] },
    ],
  },
  {
    id: "land-rover",
    name: "Land Rover",
    logo: "/images/car_brands/landrover.png",
    models: [
      { id: "landrover-evoque", name: "Range Rover Evoque", fuelTypes: ["Petrol", "Diesel"] },
      { id: "landrover-defender", name: "Defender", fuelTypes: ["Petrol", "Diesel"] },
      { id: "landrover-velar", name: "Velar", fuelTypes: ["Petrol", "Diesel"] },
    ],
  },
];

interface CarSelectionState {
  catalog: CarBrand[];
  selectedBrandId?: string;
  selectedModelId?: string;
  selectedFuelType?: FuelType;
  selectBrand: (brandId: string) => void;
  selectModel: (modelId: string) => void;
  selectFuelType: (fuel: FuelType) => void;
  clearBrand: () => void;
  clearModel: () => void;
  resetSelection: () => void;
}

export const useCarSelectionStore = create<CarSelectionState>()((set) => ({
  catalog: carCatalog,
  selectedBrandId: undefined,
  selectedModelId: undefined,
  selectedFuelType: undefined,
  selectBrand: (brandId) =>
    set({
      selectedBrandId: brandId,
      selectedModelId: undefined,
      selectedFuelType: undefined,
    }),
  selectModel: (modelId) =>
    set({
      selectedModelId: modelId,
      selectedFuelType: undefined,
    }),
  selectFuelType: (fuel) =>
    set({
      selectedFuelType: fuel,
    }),
  clearBrand: () =>
    set({
      selectedBrandId: undefined,
      selectedModelId: undefined,
      selectedFuelType: undefined,
    }),
  clearModel: () =>
    set({
      selectedModelId: undefined,
      selectedFuelType: undefined,
    }),
  resetSelection: () =>
    set({
      selectedBrandId: undefined,
      selectedModelId: undefined,
      selectedFuelType: undefined,
    }),
}));

export type CarSelectionStore = ReturnType<typeof useCarSelectionStore>;


