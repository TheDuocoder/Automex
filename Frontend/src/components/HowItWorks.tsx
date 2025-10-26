const HowItWorks = () => {
  const steps = [
    {
      number: "1",
      title: "Select The Perfect Car Service",
      description: "From AutoMex's broad portfolio of services",
      icon: "🚗",
      image: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&q=80&w=400",
    },
    {
      number: "2",
      title: "Schedule Free Doorstep Pick-up",
      description: "We offer free pick up and drop for all services booked",
      icon: "🚙",
      image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&q=80&w=400",
    },
    {
      number: "3",
      title: "Track Your Car Service Real-Time",
      description: "We will take care of everything from here!",
      icon: "⚙️",
      image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&q=80&w=400",
    },
    {
      number: "4",
      title: "Earn While We Service",
      description: "Spread the word! You get Rs.750. Your friends get Rs.750!",
      icon: "🎁",
      image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=400",
    },
  ];

  return (
    <section className="pt-8 pb-4 bg-gray-50 shadow-lg">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-left mb-6 text-gray-900">
          How AutoMex works?
        </h2>

        <div className="space-y-0">
          {steps.map((step, index) => (
            <div key={step.number} className="relative">
              {/* Vertical line connecting steps */}
              {index < steps.length - 1 && (
                <div className="absolute left-5 top-10 w-0.5 h-full bg-gray-300 hidden md:block" style={{ height: 'calc(100% + 0.5rem)' }}></div>
              )}
              
              <div className="flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-4 pb-5 md:pb-6">
                {/* Number badge */}
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-gray-200 text-gray-800 rounded-lg flex items-center justify-center text-xl font-bold shadow-sm relative z-10">
                    {step.number}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="text-lg md:text-xl font-bold mb-0.5 text-gray-900">
                    {step.title}
                  </h3>
                  <p className="text-xs md:text-sm text-gray-600">
                    {step.description}
                  </p>
                </div>

                {/* Image/Icon */}
                <div className="flex-shrink-0 w-full md:w-36 lg:w-40">
                  <div className="relative group">
                    <img
                      src={step.image}
                      alt={step.title}
                      className="w-full h-24 md:h-28 object-cover rounded-md shadow-sm transform group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        const target = e.currentTarget as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          parent.innerHTML = `<div class="w-full h-24 md:h-28 bg-gradient-to-br from-blue-100 to-blue-200 rounded-md flex items-center justify-center text-4xl">${step.icon}</div>`;
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-6 pt-4 border-t border-gray-300">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="transform hover:scale-105 transition-transform duration-300">
              <p className="text-2xl md:text-3xl font-bold text-primary mb-0.5">3M+</p>
              <p className="text-[10px] md:text-xs text-gray-600">Cars Serviced</p>
            </div>
            <div className="transform hover:scale-105 transition-transform duration-300">
              <p className="text-2xl md:text-3xl font-bold text-primary mb-0.5">25L+</p>
              <p className="text-[10px] md:text-xs text-gray-600">Happy Customers</p>
            </div>
            <div className="transform hover:scale-105 transition-transform duration-300">
              <p className="text-2xl md:text-3xl font-bold text-primary mb-0.5">4.0⭐</p>
              <p className="text-[10px] md:text-xs text-gray-600">Average Rating</p>
            </div>
            <div className="transform hover:scale-105 transition-transform duration-300">
              <p className="text-2xl md:text-3xl font-bold text-primary mb-0.5">1000+</p>
              <p className="text-[10px] md:text-xs text-gray-600">Touch Points In India</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
