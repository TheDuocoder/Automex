import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  const faqs = [
    {
      question: "What services does GoMechanic offer?",
      answer: "GoMechanic offers a comprehensive range of car services including periodic servicing, AC service & repair, battery replacement, tyre replacement, denting & painting, car detailing, car spa & cleaning, car inspections, and more.",
    },
    {
      question: "Is pickup and drop service free?",
      answer: "Yes, we offer complimentary doorstep pickup and drop service for all our car services across Mumbai. Our team will collect your car from your preferred location and deliver it back after the service is completed.",
    },
    {
      question: "How can I track my car service?",
      answer: "You can track your car service in real-time through our mobile app or website. We provide regular updates at each stage of the service, including photos and videos of the work being done on your vehicle.",
    },
    {
      question: "Are your prices competitive?",
      answer: "Yes, we offer services at up to 40% less than authorized service centers without compromising on quality. We use genuine or OEM parts and provide transparent pricing with no hidden charges.",
    },
    {
      question: "Do you provide warranty on your services?",
      answer: "Yes, all our services come with a comprehensive warranty. The warranty period varies depending on the type of service. We stand behind the quality of our work and use only genuine or equivalent parts.",
    },
    {
      question: "How do I book a service?",
      answer: "You can book a service online through our website or mobile app. Simply select your car model, choose the service you need, pick a convenient time slot, and confirm your booking. You can also call us for assistance.",
    },
  ];

  return (
    <section className="py-16 bg-accent/30">
      <div className="container mx-auto px-4 max-w-4xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Frequently Asked Questions
        </h2>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQ;
