const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white py-12 md:py-16">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* About Us Section */}
          <div className="flex flex-col">
            <h3 className="text-base md:text-lg font-bold mb-4 md:mb-6 text-white tracking-wide">ABOUT US</h3>
            <ul className="space-y-2.5">
              <li><a href="#" className="text-gray-300 hover:text-primary text-sm transition-colors duration-200 block">FAQs</a></li>
              <li><a href="#" className="text-gray-300 hover:text-primary text-sm transition-colors duration-200 block">Contact Us</a></li>
              <li><a href="#" className="text-gray-300 hover:text-primary text-sm transition-colors duration-200 block">Terms and Conditions</a></li>
              <li><a href="#" className="text-gray-300 hover:text-primary text-sm transition-colors duration-200 block">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-300 hover:text-primary text-sm transition-colors duration-200 block">Customer Grievance Policy</a></li>
              <li><a href="#" className="text-gray-300 hover:text-primary text-sm transition-colors duration-200 block">AutoMex Partners</a></li>
              <li><a href="#" className="text-gray-300 hover:text-primary text-sm transition-colors duration-200 block">Workshop Locator</a></li>
              <li><a href="#" className="text-gray-300 hover:text-primary text-sm transition-colors duration-200 block">Offers</a></li>
              <li><a href="#" className="text-gray-300 hover:text-primary text-sm transition-colors duration-200 block">Reviews</a></li>
              <li><a href="#" className="text-gray-300 hover:text-primary text-sm transition-colors duration-200 block">Directory</a></li>
            </ul>
          </div>

          {/* Our Services Section */}
          <div className="flex flex-col">
            <h3 className="text-base md:text-lg font-bold mb-4 md:mb-6 text-white tracking-wide">OUR SERVICES</h3>
            <ul className="space-y-2.5">
              <li><a href="#" className="text-gray-300 hover:text-primary text-sm transition-colors duration-200 block">Scheduled Services</a></li>
              <li><a href="#" className="text-gray-300 hover:text-primary text-sm transition-colors duration-200 block">AC Services</a></li>
              <li><a href="#" className="text-gray-300 hover:text-primary text-sm transition-colors duration-200 block">Cleaning & Detailing</a></li>
              <li><a href="#" className="text-gray-300 hover:text-primary text-sm transition-colors duration-200 block">Lights & Fitments</a></li>
              <li><a href="#" className="text-gray-300 hover:text-primary text-sm transition-colors duration-200 block">Denting Painting</a></li>
              <li><a href="#" className="text-gray-300 hover:text-primary text-sm transition-colors duration-200 block">Insurance Services</a></li>
              <li><a href="#" className="text-gray-300 hover:text-primary text-sm transition-colors duration-200 block">Custom Repair</a></li>
              <li><a href="#" className="text-gray-300 hover:text-primary text-sm transition-colors duration-200 block">Batteries</a></li>
              <li><a href="#" className="text-gray-300 hover:text-primary text-sm transition-colors duration-200 block">Tyres</a></li>
              <li><a href="#" className="text-gray-300 hover:text-primary text-sm transition-colors duration-200 block">Detailing Services</a></li>
              <li><a href="#" className="text-gray-300 hover:text-primary text-sm transition-colors duration-200 block">Windshields & Glass</a></li>
            </ul>
          </div>

          {/* Luxury Brands Section */}
          <div className="flex flex-col">
            <h3 className="text-base md:text-lg font-bold mb-4 md:mb-6 text-white tracking-wide">LUXURY BRANDS</h3>
            <ul className="space-y-2.5">
              <li><a href="#" className="text-gray-300 hover:text-primary text-sm transition-colors duration-200 block">Mercedes</a></li>
              <li><a href="#" className="text-gray-300 hover:text-primary text-sm transition-colors duration-200 block">BMW</a></li>
              <li><a href="#" className="text-gray-300 hover:text-primary text-sm transition-colors duration-200 block">Audi</a></li>
              <li><a href="#" className="text-gray-300 hover:text-primary text-sm transition-colors duration-200 block">Volvo</a></li>
              <li><a href="#" className="text-gray-300 hover:text-primary text-sm transition-colors duration-200 block">Mitsubishi</a></li>
              <li><a href="#" className="text-gray-300 hover:text-primary text-sm transition-colors duration-200 block">Jaguar</a></li>
              <li><a href="#" className="text-gray-300 hover:text-primary text-sm transition-colors duration-200 block">Porsche</a></li>
              <li><a href="#" className="text-gray-300 hover:text-primary text-sm transition-colors duration-200 block">Rolls Royce</a></li>
              <li><a href="#" className="text-gray-300 hover:text-primary text-sm transition-colors duration-200 block">Ferrari</a></li>
              <li><a href="#" className="text-gray-300 hover:text-primary text-sm transition-colors duration-200 block">Land Rover</a></li>
            </ul>
          </div>

          {/* Popular Brands Section */}
          <div className="flex flex-col">
            <h3 className="text-base md:text-lg font-bold mb-4 md:mb-6 text-white tracking-wide">POPULAR BRANDS</h3>
            <ul className="space-y-2.5">
              <li><a href="#" className="text-gray-300 hover:text-primary text-sm transition-colors duration-200 block">Maruti Suzuki</a></li>
              <li><a href="#" className="text-gray-300 hover:text-primary text-sm transition-colors duration-200 block">Hyundai</a></li>
              <li><a href="#" className="text-gray-300 hover:text-primary text-sm transition-colors duration-200 block">Honda</a></li>
              <li><a href="#" className="text-gray-300 hover:text-primary text-sm transition-colors duration-200 block">Toyota</a></li>
              <li><a href="#" className="text-gray-300 hover:text-primary text-sm transition-colors duration-200 block">Tata</a></li>
              <li><a href="#" className="text-gray-300 hover:text-primary text-sm transition-colors duration-200 block">Mahindra</a></li>
              <li><a href="#" className="text-gray-300 hover:text-primary text-sm transition-colors duration-200 block">Chevrolet</a></li>
              <li><a href="#" className="text-gray-300 hover:text-primary text-sm transition-colors duration-200 block">Fiat</a></li>
              <li><a href="#" className="text-gray-300 hover:text-primary text-sm transition-colors duration-200 block">Renault</a></li>
              <li><a href="#" className="text-gray-300 hover:text-primary text-sm transition-colors duration-200 block">Kia</a></li>
              <li><a href="#" className="text-gray-300 hover:text-primary text-sm transition-colors duration-200 block">Skoda</a></li>
              <li><a href="#" className="text-gray-300 hover:text-primary text-sm transition-colors duration-200 block">Volkswagen</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-gray-700 text-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} AutoMex. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

