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
        <div className="mt-12 pt-8 border-t border-gray-700">
          <div className="relative flex items-center justify-center">
            <p className="text-gray-400 text-sm text-center">
              © {new Date().getFullYear()} AutoMex. All rights reserved.
            </p>
            
            {/* Social Media Icons - Positioned to the right */}
            <div className="absolute right-0 flex items-center gap-5">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-all duration-300 hover:scale-110"
                aria-label="Facebook"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-all duration-300 hover:scale-110"
                aria-label="Instagram"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-all duration-300 hover:scale-110"
                aria-label="X (Twitter)"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

