import { Badge } from "@/components/ui/badge";

interface ServiceCardProps {
  title: string;
  icon: string;
  fallbackIcon?: string;
  isNew?: boolean;
}

const ServiceCard = ({ title, icon, fallbackIcon, isNew }: ServiceCardProps) => {
  return (
    <div className="relative group cursor-pointer">
      <div 
        className="bg-card rounded-lg p-8 flex flex-col items-center justify-center text-center transition-all duration-300"
        style={{
          boxShadow: 'var(--shadow-card)',
          minHeight: '240px',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = 'var(--shadow-card-hover)';
          e.currentTarget.style.transform = 'translateY(-4px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = 'var(--shadow-card)';
          e.currentTarget.style.transform = 'translateY(0)';
        }}
      >
        {isNew && (
          <Badge className="absolute top-4 right-4 bg-green-500 hover:bg-green-600 text-white">
            New
          </Badge>
        )}
        
        <div className="mb-6">
          <img 
            src={icon} 
            alt={title} 
            className="w-24 h-24 object-contain"
            onError={(e) => {
              if (fallbackIcon && e.currentTarget.src !== fallbackIcon) {
                e.currentTarget.src = fallbackIcon;
              }
            }}
          />
        </div>
        
        <h3 className="text-lg font-bold text-foreground">
          {title}
        </h3>
      </div>
    </div>
  );
};

export default ServiceCard;
