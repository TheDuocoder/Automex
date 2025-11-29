import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  const faqs = [
    {
      question: "What services does AutoMex offer?",
      answer: "AutoMex offers a comprehensive range of car services including periodic servicing, AC service & repair, battery replacement, tyre replacement, denting & painting, car detailing, car spa & cleaning, car inspections, and more.",
    },
    {
      question: "Is pickup and drop service free?",
      answer: "Absolutely. Enjoy free doorstep pickup and drop for all our services across Bhubaneswar. We'll pick up your car from your preferred location and bring it back to you after the service is completed.",
    },
    {
      question: "How can I track my car service?",
      answer: "Stay updated in real time through our website. We share progress at every stage of your car's service, complete with photos and videos so you always know what's happening.",
    },
    {
      question: "Are your prices competitive?",
      answer: "Yes, we offer services at up to 40% less than authorized service centers without compromising on quality. We use genuine or OEM parts and provide transparent pricing with no hidden charges.",
    },
    {
      question: "Do you provide warranty on your services?",
      answer: "Absolutely. Every service we offer includes a warranty, with the duration varying by service type. We use only genuine or equivalent high-quality parts to ensure reliable and long-lasting results.",
    },
    {
      question: "How do I book a service?",
      answer: "You can easily book a service online through our website. Just select your car's manufacturer, model, and fuel type, choose the service you need, pick a suitable time slot, and confirm your booking. If you need help, our team is always available over the phone.",
    },
  ];

  return (
    <section id="faq" className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 max-w-4xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
          Frequently Asked Questions
        </h2>

        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="bg-white rounded-lg shadow-sm border border-gray-200 px-6 py-2">
              <AccordionTrigger className="text-left hover:text-primary transition-colors text-base md:text-lg font-semibold">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 leading-relaxed">
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
