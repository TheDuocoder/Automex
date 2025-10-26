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
    <section id="about-us" className="py-16 bg-gradient-to-b from-white via-gray-50 to-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            About <span className="text-primary">AutoMex</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Your trusted partner for comprehensive car care and maintenance services in Bhubaneswar
          </p>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          {/* Left side - Image */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-2xl blur-2xl"></div>
            <img
              src="https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&q=80&w=800"
              alt="AutoMex Service Center"
              className="relative w-full h-auto rounded-2xl shadow-2xl"
            />
            <div className="absolute -bottom-6 -right-6 bg-gradient-to-br from-orange-500 to-red-600 text-white rounded-xl p-6 shadow-xl">
              <p className="text-4xl font-bold">10+</p>
              <p className="text-sm font-semibold">Years Experience</p>
            </div>
          </div>

          {/* Right side - Content */}
          <div className="space-y-6">
            <h3 className="text-3xl font-bold text-gray-900">
              Leading Car Service Provider in Bhubaneswar
            </h3>
            <p className="text-gray-600 leading-relaxed">
              AutoMex is revolutionizing car care services in Bhubaneswar with our commitment to 
              quality, transparency, and customer satisfaction. Since our inception, we've served 
              over 2 million happy customers and completed 3 million+ car services.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Our mission is simple: <strong>"Your Car's Health, Our Priority"</strong>. We believe 
              in providing hassle-free, doorstep car services with complete transparency in pricing 
              and using only genuine parts for all repairs and maintenance.
            </p>
            <p className="text-gray-600 leading-relaxed">
              With a network of 1000+ touch points across India and a team of certified technicians, 
              we ensure your vehicle receives the care it deserves. From routine maintenance to 
              complex repairs, we've got you covered.
            </p>
            
            {/* Key Stats */}
            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">3M+</p>
                <p className="text-xs text-gray-600">Cars Serviced</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">2M+</p>
                <p className="text-xs text-gray-600">Happy Customers</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">4.0⭐</p>
                <p className="text-xs text-gray-600">Average Rating</p>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center mb-4">
                <feature.icon className="w-7 h-7 text-white" />
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h4>
              <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Why Choose Us */}
        <div className="mt-16 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-8 md:p-12 text-white">
          <h3 className="text-3xl font-bold mb-6 text-center">Why Choose AutoMex?</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <Users className="w-12 h-12 mx-auto mb-4 text-orange-400" />
              <h4 className="font-bold text-xl mb-2">Customer First</h4>
              <p className="text-sm text-gray-300">
                Your satisfaction is our top priority with 24/7 customer support
              </p>
            </div>
            <div className="text-center">
              <Shield className="w-12 h-12 mx-auto mb-4 text-orange-400" />
              <h4 className="font-bold text-xl mb-2">100% Transparency</h4>
              <p className="text-sm text-gray-300">
                No hidden charges, complete transparency in pricing and services
              </p>
            </div>
            <div className="text-center">
              <Car className="w-12 h-12 mx-auto mb-4 text-orange-400" />
              <h4 className="font-bold text-xl mb-2">Free Pick & Drop</h4>
              <p className="text-sm text-gray-300">
                Complimentary doorstep pickup and delivery for all services
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;

