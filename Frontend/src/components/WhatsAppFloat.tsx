import { MessageCircle } from "lucide-react";
import { useState } from "react";

const WhatsAppFloat = () => {
  const [isHovered, setIsHovered] = useState(false);

  const handleWhatsAppClick = () => {
    // WhatsApp number with country code (91 for India)
    const phoneNumber = "918249614004";
    const message = "Hello! I'm interested in your car services.";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div
      onClick={handleWhatsAppClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="fixed bottom-24 right-6 cursor-pointer group"
      style={{
        filter: 'drop-shadow(0 8px 24px rgba(37, 211, 102, 0.3))',
        zIndex: 40
      }}
    >
      {/* Tooltip */}
      <div
        className={`absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap transition-all duration-300 ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2 pointer-events-none'
          }`}
      >
        <div className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-xl">
          Chat with us on WhatsApp
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full">
            <div className="w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-[6px] border-l-gray-900"></div>
          </div>
        </div>
      </div>

      {/* Main Circle Button */}
      <div
        className={`relative w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 ${isHovered ? 'scale-110' : 'scale-100'
          }`}
        style={{
          background: 'linear-gradient(135deg, #25D366 0%, #20BA5A 100%)',
          boxShadow: isHovered
            ? '0 10px 28px rgba(37, 211, 102, 0.4), 0 0 0 6px rgba(37, 211, 102, 0.1)'
            : '0 6px 20px rgba(37, 211, 102, 0.3), 0 0 0 0px rgba(37, 211, 102, 0.1)',
        }}
      >
        {/* Glassmorphic overlay */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 100%)',
            backdropFilter: 'blur(10px)',
          }}
        />

        {/* WhatsApp Icon */}
        <svg
          viewBox="0 0 24 24"
          className="w-8 h-8 relative z-10 text-white"
          fill="currentColor"
          style={{
            filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))'
          }}
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        </svg>

        {/* Pulse animation ring */}
        <div
          className={`absolute inset-0 rounded-full bg-[#25D366] animate-ping ${isHovered ? 'opacity-0' : 'opacity-30'
            }`}
          style={{
            animationDuration: '2s',
            animationIterationCount: 'infinite',
          }}
        />
      </div>

      {/* Notification badge (optional - uncomment if needed) */}
      {/* <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg">
        1
      </div> */}
    </div>
  );
};

export default WhatsAppFloat;
