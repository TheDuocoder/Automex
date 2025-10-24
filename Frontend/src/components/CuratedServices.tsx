import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const CuratedServices = () => {
  const services = [
    {
      title: "Front Bumper Paint",
      image: "https://gomechprod.blob.core.windows.net/websiteasset/New%20Website/components/Admin/carouselPlaceholder.png",
    },
    {
      title: "Rubbing & Polishing",
      image: "https://gomechprod.blob.core.windows.net/websiteasset/New%20Website/components/Admin/carouselPlaceholder.png",
    },
    {
      title: "Deep All Round Spa",
      image: "https://gomechprod.blob.core.windows.net/websiteasset/New%20Website/components/Admin/carouselPlaceholder.png",
    },
    {
      title: "Periodic Service",
      image: "https://gomechprod.blob.core.windows.net/websiteasset/New%20Website/components/Admin/carouselPlaceholder.png",
    },
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Get Summer Ready With AutoMex
        </h2>

        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-12">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-card rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all cursor-pointer"
              >
                <div className="aspect-video bg-gray-200">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-center">{service.title}</h3>
                </div>
              </div>
            ))}
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full"
          >
            <ChevronRight className="w-6 h-6" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CuratedServices;
