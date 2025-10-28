import { Card, CardContent } from "@/components/ui/card";
import { Quote } from "lucide-react";

const Reviews = () => {
  const reviews = [
    {
      title: "Great Experience with AutoMex",
      text: "Did regular servicing at their Borivali workshop. They gave me a proper inspection report, told me what needs fixing now and what can wait which honestly felt honest because most garages just try to push everything at once.",
      author: "Hardik Chopra",
      platform: "Twitter",
      workshop: "AutoMex - Patia, Bhubaneswar",
    },
    {
      title: "Spotless Car Finish",
      text: "Booked a car spa after weeks of driving through rain and dust, and man the difference is crazy. The interiors smell fresh, stains on the seats gone, and the exterior polish brought back the shine.",
      author: "Varun Chaudhary",
      platform: "Facebook",
      workshop: "AutoMex - Chandrasekharpur, Bhubaneswar",
    },
    {
      title: "Impressive Professionalism",
      text: "Booked my service in Andheri and honestly it was smoother than I thought. They picked up the car right on time, sent me updates during the day, and dropped it back cleaner than I left it.",
      author: "Gurkirat Singh",
      platform: "Twitter",
      workshop: "AutoMex - Saheed Nagar, Bhubaneswar",
    },
    {
      title: "Top-Notch Service",
      text: "Got my AC serviced in Powai. Cooling is back to proper chill now which was badly needed in this weather. The pickup and drop thing is a lifesaver.",
      author: "Ankur Singh",
      platform: "Facebook",
      workshop: "AutoMex - Master Canteen, Bhubaneswar",
    },
  ];

  return (
    <section id="reviews" className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          What Car Owners In Bhubaneswar Say
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((review, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <Quote className="w-8 h-8 text-primary mb-4" />
                <h3 className="text-lg font-bold mb-3">{review.title}</h3>
                <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                  {review.text}
                </p>
                <div className="flex items-center justify-between pt-4 border-t">
                  <div>
                    <p className="font-semibold">{review.author}</p>
                    <p className="text-sm text-muted-foreground">{review.platform}</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  Workshop: {review.workshop}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Reviews;
