import { Car, Shield, Clock, Award, Users, Wrench } from "lucide-react";

const AboutUs = () => {
  const features = [
    {
      icon: Shield,
      title: "Trusted Service",
      description: "Over 2 million satisfied customers trust AutoMex for their car care needs"
    },
    {
      icon: Award,
      title: "Certified Experts",
      description: "Our technicians are certified professionals with 10+ years of experience"
    },
    {
      icon: Clock,
      title: "Quick Turnaround",
      description: "Fast and efficient service with free doorstep pick-up and drop facility"
    },
    {
      icon: Wrench,
      title: "Quality Parts",
      description: "We use only genuine OEM parts with warranty for all repairs"
    }
  ];

  return (
    <section id="about-us" className="py-8 md:py-12 lg:py-16 bg-gradient-to-b from-white via-gray-50 to-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4 text-gray-900">
            About <span style={{ color: '#D62828', fontWeight: 900, textShadow: '0 2px 6px rgba(0,0,0,0.25)' }}>AUTO</span><span style={{ color: '#C0C5CD', fontWeight: 900, textShadow: '0 2px 6px rgba(0,0,0,0.25)' }}>MEX</span>
          </h2>
          <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto px-4">
            Your trusted partner for comprehensive car care and maintenance services in Bhubaneswar
          </p>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-6 md:gap-12 items-center mb-8 md:mb-16">
          {/* Left side - Image */}
          <div className="relative mb-8 md:mb-0">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-xl md:rounded-2xl blur-2xl"></div>
            <img 
              src="/images/Landing_page_images/aboutautomex.png"
              alt="AutoMex Service Center"
              className="relative w-full h-auto rounded-xl md:rounded-2xl shadow-2xl"
              onError={(e) => {
                e.currentTarget.src = "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&q=80&w=800";
              }}
            />
            <div className="absolute -bottom-4 -right-4 md:-bottom-6 md:-right-6 text-white rounded-lg md:rounded-xl p-4 md:p-6"
              style={{
                background: 'linear-gradient(135deg, #E84057 0%, #C4308A 50%, #8B1FB4 100%)',
                boxShadow: '0 10px 30px rgba(255, 0, 100, 0.25)'
              }}
            >
              <p className="text-2xl md:text-4xl font-bold">10+</p>
              <p className="text-xs md:text-sm font-semibold">Years Experience</p>
            </div>
          </div>

          {/* Right side - Content */}
          <div className="space-y-4 md:space-y-6">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
              Leading Car Service Provider in Bhubaneswar
            </h3>
            <p className="text-sm md:text-base text-gray-600 leading-relaxed">
              AutoMex is revolutionizing car care services in Bhubaneswar with our commitment to 
              quality, transparency, and customer satisfaction. Since our inception, we've served 
              over 2 million happy customers and completed 3 million+ car services.
            </p>
            <p className="text-sm md:text-base text-gray-600 leading-relaxed">
              Our mission is simple: <strong>"Your Car's Health, Our Priority"</strong>. We believe 
              in providing hassle-free, doorstep car services with complete transparency in pricing 
              and using only genuine parts for all repairs and maintenance.
            </p>
            <p className="text-sm md:text-base text-gray-600 leading-relaxed">
              With a network of 1000+ touch points across India and a team of certified technicians, 
              we ensure your vehicle receives the care it deserves. From routine maintenance to 
              complex repairs, we've got you covered.
            </p>
            
            {/* Key Stats */}
            <div className="grid grid-cols-3 gap-3 md:gap-4 pt-3 md:pt-4">
              <div className="text-center">
                <p className="text-2xl md:text-3xl font-bold text-primary">3M+</p>
                <p className="text-[10px] md:text-xs text-gray-600">Cars Serviced</p>
              </div>
              <div className="text-center">
                <p className="text-2xl md:text-3xl font-bold text-primary">2M+</p>
                <p className="text-[10px] md:text-xs text-gray-600">Happy Customers</p>
              </div>
              <div className="text-center">
                <p className="text-2xl md:text-3xl font-bold text-primary">4.0⭐</p>
                <p className="text-[10px] md:text-xs text-gray-600">Average Rating</p>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group bg-white p-8 md:p-10 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:shadow-[0_15px_50px_rgba(199,78,137,0.2)] transition-all duration-500 transform hover:-translate-y-3 border border-gray-100/50 hover:border-pink-200/50 relative overflow-hidden"
            >
              {/* Subtle gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-pink-50/30 via-white to-purple-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Icon Container with enhanced gradient and glow */}
              <div className="relative w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center mb-6 md:mb-8 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3"
                style={{
                  background: 'linear-gradient(135deg, #E84057 0%, #C4308A 50%, #8B1FB4 100%)',
                  boxShadow: '0 10px 30px rgba(255, 0, 100, 0.25)'
                }}
              >
                {/* Glow effect */}
                <div className="absolute inset-0 rounded-2xl blur-md opacity-50 group-hover:opacity-75 transition-opacity duration-500"
                  style={{
                    background: 'linear-gradient(135deg, #E84057 0%, #C4308A 50%, #8B1FB4 100%)'
                  }}
                ></div>
                <feature.icon className="relative w-6 h-6 md:w-7 md:h-7 text-white stroke-[2.5] group-hover:scale-110 transition-transform duration-500" />
              </div>
              
              {/* Title */}
              <h4 className="relative text-xl md:text-2xl font-bold text-gray-900 mb-4 tracking-tight group-hover:text-gray-800 transition-colors duration-300">
                {feature.title}
              </h4>
              
              {/* Description */}
              <p className="relative text-sm md:text-base text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                {feature.description}
              </p>
              
              {/* Decorative corner accent */}
              <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-pink-100/40 to-transparent rounded-tl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
          ))}
        </div>

        {/* Why Choose Us */}
        <div className="mt-8 md:mt-12 lg:mt-16 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-xl md:rounded-2xl p-6 md:p-8 lg:p-12 text-white">
          <h3 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-center">Why Choose AutoMex?</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8">
            <div className="text-center">
              <div className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-3 md:mb-4 rounded-lg flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #E84057 0%, #C4308A 50%, #8B1FB4 100%)',
                  boxShadow: '0 10px 30px rgba(255, 0, 100, 0.25)'
                }}
              >
                <Users className="w-6 h-6 md:w-7 md:h-7 text-white" />
              </div>
              <h4 className="font-bold text-lg md:text-xl mb-2">Customer First</h4>
              <p className="text-xs md:text-sm text-gray-300">
                Your satisfaction is our priority, with support available from 9 AM to 7 PM.
              </p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-3 md:mb-4 rounded-lg flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #E84057 0%, #C4308A 50%, #8B1FB4 100%)',
                  boxShadow: '0 10px 30px rgba(255, 0, 100, 0.25)'
                }}
              >
                <Shield className="w-6 h-6 md:w-7 md:h-7 text-white" />
              </div>
              <h4 className="font-bold text-lg md:text-xl mb-2">100% Transparency</h4>
              <p className="text-xs md:text-sm text-gray-300">
                No hidden charges — we ensure total transparency in all pricing and services.
              </p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-3 md:mb-4 rounded-lg flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #E84057 0%, #C4308A 50%, #8B1FB4 100%)',
                  boxShadow: '0 10px 30px rgba(255, 0, 100, 0.25)'
                }}
              >
                <Car className="w-6 h-6 md:w-7 md:h-7 text-white" />
              </div>
              <h4 className="font-bold text-lg md:text-xl mb-2">Free Pick & Drop</h4>
              <p className="text-xs md:text-sm text-gray-300">
                Enjoy complimentary doorstep pickup and delivery with every service.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;

