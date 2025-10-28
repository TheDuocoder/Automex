import ServiceCard from "./ServiceCard";
import serviceGeneral from "@/assets/service-general.png";
import serviceAc from "@/assets/service-ac.png";
import serviceBattery from "@/assets/service-battery.png";
import serviceTyres from "@/assets/service-tyres.png";
import servicePainting from "@/assets/service-painting.png";
import serviceDetailing from "@/assets/service-detailing.png";
import serviceSpa from "@/assets/service-spa.png";
import serviceInspection from "@/assets/service-inspection.png";

const ServicesGrid = () => {
  const services = [
    { title: "Car Services", icon: "/images/Services/Premium car service.png", fallbackIcon: serviceGeneral },
    { title: "AC Service & Repair", icon: "/images/Ac repair.png", fallbackIcon: serviceAc },
    { title: "Batteries", icon: "/images/Services/Battery service.png", fallbackIcon: serviceBattery },
    { title: "Tyres & Wheel Care", icon: "/images/Services/Tyre service.png", fallbackIcon: serviceTyres },
    { title: "Denting & Painting", icon: "/images/Services/denting and painting service.png", fallbackIcon: servicePainting },
    { title: "Detailing Services", icon: "/images/Services/detailing service.png", fallbackIcon: serviceDetailing },
    { title: "Car Spa & Cleaning", icon: "/images/Services/Car spa.png", fallbackIcon: serviceSpa },
    { title: "Car Inspections", icon: "/images/Services/inspection service.png", fallbackIcon: serviceInspection, isNew: true },
  ];

  return (
    <section className="container mx-auto px-4 pb-16">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {services.map((service) => (
          <ServiceCard
            key={service.title}
            title={service.title}
            icon={service.icon}
            isNew={service.isNew}
            fallbackIcon={(service as any).fallbackIcon}
          />
        ))}
      </div>
    </section>
  );
};

export default ServicesGrid;
