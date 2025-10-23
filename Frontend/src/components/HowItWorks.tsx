const HowItWorks = () => {
  const steps = [
    {
      number: "1",
      title: "Select The Perfect Car Service",
      description: "From GoMechanic's broad portfolio of services",
      image: "https://gomechprod.blob.core.windows.net/websiteasset/New%20Website/components/Homepage/Select-The-Perfect-Car-Service.png",
    },
    {
      number: "2",
      title: "Schedule Free Doorstep Pick-up",
      description: "We offer free pick up and drop for all services booked",
      image: "https://gomechprod.blob.core.windows.net/websiteasset/New%20Website/components/Homepage/Schedule-Free-Doorstep-Pick-up.png",
    },
    {
      number: "3",
      title: "Track Your Car Service Real-Time",
      description: "We will take care of everything from here!",
      image: "https://gomechprod.blob.core.windows.net/websiteasset/New%20Website/components/Homepage/track-your-car-service-real-time.png",
    },
    {
      number: "4",
      title: "Earn While We Service",
      description: "Spread the word! You get Rs.750. Your friends get Rs.750!",
      image: "https://gomechprod.blob.core.windows.net/websiteasset/New%20Website/components/Homepage/Earn-While-We-Service.png",
    },
  ];

  return (
    <section className="py-16 bg-accent/30">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          How GoMechanic works?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step) => (
            <div key={step.number} className="text-center">
              <div className="mb-4">
                <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {step.number}
                </div>
                <img
                  src={step.image}
                  alt={step.title}
                  className="w-48 h-48 object-contain mx-auto"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
              <h3 className="text-lg font-bold mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <p className="text-3xl font-bold text-primary">3 Million+</p>
            <p className="text-sm text-muted-foreground mt-2">Cars Serviced</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-primary">25 Lacs+</p>
            <p className="text-sm text-muted-foreground mt-2">Happy Customers</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-primary">4.0⭐</p>
            <p className="text-sm text-muted-foreground mt-2">Average Rating</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-primary">1000+</p>
            <p className="text-sm text-muted-foreground mt-2">Touch Points In India</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
