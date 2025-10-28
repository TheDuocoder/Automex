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
    { title: "Car Services", icon: serviceGeneral },
    // Use the AC repair image from public/Images folder
    { title: "AC Service & Repair", icon: "/Images/Ac repair.png", fallbackIcon: serviceAc },
    { title: "Batteries", icon: serviceBattery },
    { title: "Tyres & Wheel Care", icon: "/Images/Services/Tyre service.png", fallbackIcon: serviceTyres },
    { title: "Denting & Painting", icon: servicePainting },
    { title: "Detailing Services", icon: serviceDetailing },
    { title: "Car Spa & Cleaning", icon: serviceSpa },
    { title: "Car Inspections", icon: serviceInspection, isNew: true },
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
