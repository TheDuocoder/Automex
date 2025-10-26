import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

const SummerServices = () => {
  const services = [
    {
      title: "Front Bumper Paint",
      description: "Restore your bumper to a factory-fresh look with precision prep, priming, and multi‑stage paint matching.",
      image: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&q=80&w=600",
      features: ["Color matching", "Premium coating", "UV protection"]
    },
    {
      title: "Rubbing & Polishing",
      description: "Remove oxidation, swirl marks, and light scratches to reveal a deep, glossy finish.",
      image: "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&q=80&w=600",
      features: ["Machine polishing", "Swirl reduction", "Mirror finish"]
    },
    {
      title: "Deep All Round Spa",
      description: "Thorough interior and exterior spa that sanitizes the cabin and restores the exterior sheen.",
      image: "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&q=80&w=600",
      features: ["Steam sanitization", "Deep cleaning", "Wax protection"]
    },
    {
      title: "Periodic Service",
      description: "Seasonal maintenance package covering fluids, filters, and safety systems for summer reliability.",
      image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&q=80&w=600",
      features: ["AC check", "Coolant top-up", "Battery health"]
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-orange-50 via-white to-orange-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            Get Summer Ready With AutoMex
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Beat the heat with our specialized summer car care packages designed to keep your vehicle performing at its best
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {services.map((service, index) => (
            <Card 
              key={index} 
              className="group relative hover:shadow-2xl transition-all duration-500 overflow-hidden border-0 bg-white animate-slide-up cursor-pointer"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 to-red-500/0 group-hover:from-orange-500/10 group-hover:to-red-500/10 transition-all duration-500 z-10 pointer-events-none"></div>
              
              <div className="relative h-56 overflow-hidden">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover transform group-hover:scale-110 group-hover:rotate-2 transition-all duration-700"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = "/placeholder.svg";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent group-hover:from-black/90 transition-all duration-500"></div>
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3 className="text-white font-bold text-xl mb-1 transform group-hover:translate-y-[-4px] transition-transform duration-300">{service.title}</h3>
                  <div className="h-1 w-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full transform origin-left group-hover:scale-x-150 transition-transform duration-500"></div>
                </div>
              </div>
              <div className="p-6 relative z-20">
                <p className="text-gray-600 text-sm mb-4 leading-relaxed group-hover:text-gray-700 transition-colors">{service.description}</p>
                <div className="space-y-2.5">
                  {service.features.map((feature, idx) => (
                    <div 
                      key={idx} 
                      className="flex items-center gap-2 transform translate-x-0 group-hover:translate-x-1 transition-transform duration-300"
                      style={{ transitionDelay: `${idx * 50}ms` }}
                    >
                      <div className="relative">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <div className="absolute inset-0 bg-green-500 rounded-full blur-sm opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                      </div>
                      <span className="text-xs text-gray-700 font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Corner decoration */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-orange-500/10 to-transparent rounded-bl-full transform scale-0 group-hover:scale-100 transition-transform duration-500"></div>
            </Card>
          ))}
        </div>

        {/* Special Offer Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 shadow-2xl border border-orange-500/20 animate-fade-in">
          {/* Animated background */}
          <div className="absolute inset-0 overflow-hidden opacity-10">
            <div className="absolute -right-20 -top-20 w-96 h-96 bg-orange-500 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-red-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>
          
          <div className="relative px-8 md:px-12 py-12 flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Left side - Content */}
            <div className="flex-1 text-white space-y-6">
              <div>
                <div className="inline-block bg-orange-500/20 backdrop-blur-sm rounded-full px-4 py-1 mb-4 animate-bounce">
                  <span className="text-orange-400 font-semibold text-sm">🔥 LIMITED TIME OFFER</span>
                </div>
                <h3 className="text-3xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-orange-400 via-orange-300 to-red-500 bg-clip-text text-transparent">
                  Complete Summer Care Package
                </h3>
                <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
                  Premium service package including AC maintenance, coolant system check, battery diagnostics, 
                  brake inspection, and complete vehicle health assessment
                </p>
              </div>
              
              {/* Features list */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span className="text-sm text-gray-300">AC Service & Gas Refill</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span className="text-sm text-gray-300">Battery Health Check</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span className="text-sm text-gray-300">Coolant Top-up</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span className="text-sm text-gray-300">Brake System Check</span>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-4">
                <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-sm rounded-xl px-6 py-4 border border-orange-500/30">
                  <div className="text-3xl font-bold text-orange-400">₹2,499</div>
                  <div className="text-sm line-through text-gray-400">₹3,999</div>
                </div>
                <Button size="lg" className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold shadow-lg shadow-orange-500/50 transform hover:scale-105 transition-all">
                  Save 37% - Book Now
                </Button>
              </div>
            </div>

            {/* Right side - Image */}
            <div className="flex-shrink-0 w-full md:w-2/5">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/20 to-red-500/20 rounded-xl blur-xl"></div>
                <img
                  src="https://images.unsplash.com/photo-1625047509168-a7026f36de04?auto=format&fit=crop&q=80&w=800"
                  alt="Professional AUTOMEX car service"
                  className="relative w-full h-auto rounded-xl shadow-2xl border-2 border-orange-500/30 transform hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&q=80&w=800";
                  }}
                />
                {/* Overlay badge */}
                <div className="absolute -bottom-4 -right-4 bg-gradient-to-br from-red-600 to-red-700 text-white rounded-full w-24 h-24 flex flex-col items-center justify-center shadow-xl border-4 border-slate-900 animate-pulse">
                  <span className="text-2xl font-bold">37%</span>
                  <span className="text-xs font-semibold">OFF</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }
        
        .animate-slide-up {
          animation: slideUp 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </section>
  );
};

export default SummerServices;

