import { Quote } from "lucide-react";

const Reviews = () => {
  const reviews = [
    {
      title: "AutoMex Delivered a Great Overall Experience",
      text: "I got my regular servicing done at their workshop. They provided a detailed inspection report and clearly explained what needed immediate attention and what could wait. It genuinely felt honest, because most garages try to push everything at once.",
      author: "Rakesh Kumar",
      platform: "Twitter",
      workshop: "AUTOMEX, Hanspal, Balianta market road",
    },
    {
      title: "A Finish That Looks Brand New",
      text: "Booked a car spa after weeks of driving through rain and dust, and the difference is unbelievable. The interiors smell fresh, the seat stains are gone, and the exterior polish has brought back the original shine.",
      author: "Sidharth Sahoo",
      platform: "Facebook",
      workshop: "AUTOMEX, Hanspal, Balianta market road",
    },
    {
      title: "Impressed by Their Professionalism",
      text: "Booked my service and the experience was smoother than I imagined. They arrived on time for pickup, kept me updated all day, and returned the car spotless.",
      author: "Tapas Parida",
      platform: "Twitter",
      workshop: "AUTOMEX, Hanspal, Balianta market road",
    },
    {
      title: "Service That's Truly Top-Notch",
      text: "Got my AC serviced and the cooling is finally back to chill, which was desperately needed in this weather. The pickup and drop feature is an absolute lifesaver.",
      author: "Bhabani shankar swain",
      platform: "Facebook",
      workshop: "AUTOMEX, Hanspal, Balianta market road",
    },
  ];

  return (
    <section 
      id="reviews" 
      className="py-20 md:py-24" 
      style={{ backgroundColor: '#F5F7FA' }}
    >
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 md:mb-16">
          What Car Owners In Bhubaneswar Say
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {reviews.map((review, index) => (
            <div key={index} className="testimonial-card">
              <div className="testimonial-content">
                <Quote className="quotes text-[#DC143C]" strokeWidth={1.5} />
                
                <div className="flex flex-col gap-4">
                  <h3 className="text-xl font-bold text-black">
                    {review.title}
                  </h3>
                  
                  <p className="para text-black/80">
                    {review.text}
                  </p>
                </div>

                <div className="footer">
                  <div className="flex flex-col gap-1">
                    <button className="testimonial-button">
                      <span>{review.author}</span>
                    </button>
                    <p className="text-sm text-black/60">
                      {review.platform}
                    </p>
                  </div>
                  
                  <p className="text-xs text-black/50">
                    Workshop: {review.workshop}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Reviews;
