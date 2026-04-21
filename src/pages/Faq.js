import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const FAQ = () => {
  const faqs = [
    {
      question: "What can Astrology do for me?",
      answer: "Astrology can help you understand the pattern of a person’s life, the inner drive and meaning behind their behavior, their compatibility and ability with others to get along."
    },
    {
      question: "Why is my Birth time important?",
      answer: "Birth time is important because the planetary and cosmic forces that govern Astrology are in constant motion. The difference of even an hour can affect the accuracy of your horoscope depending upon the specifics of your unique situation."
    },
    {
      question: "What is the methodology you follow for Gem recommendation?",
      answer: "We follow the methodology of Indian Vedic Astrology for Gem recommendation as per individual’s birth chart/ horoscope."
    },
    {
      question: "Does Gemstone have an Expiry date?",
      answer: "They don’t have any expiry date. But their effectiveness can affect the person overtime. For instance, never wear broken gemstones."
    },
    {
      question: "How much will it take to benefit the wearer?",
      answer: "There are different opinions about this as the benefits of the gemstone solely depend on their purity, quality, origin and prescription."
    },
    {
      question: "Can we order anywhere in India?",
      answer: "Yes, SK Mystic provides you with service all over India."
    },
    {
      question: "Do we have cash on delivery COD?",
      answer: "Yes, SK Mystic provides you with a facility of cash on delivery on all your orders."
    }
  ];

  return (
    <div className="container my-5">
      <h2 className="mb-4 text-center">Frequently Asked Questions</h2>
      {faqs.map((faq, index) => (
        <div key={index} className="mb-3">
          <div className="d-flex align-items-start" style={{ backgroundColor: "orange", padding: "0.5rem" }}>
            <span
              className="me-2"
              style={{
                fontWeight: "bold",
                color: "white",
                backgroundColor: "#ff9900",
                padding: "0.3rem 0.5rem",
                borderRadius: "4px",
                flexShrink: 0
              }}
            >
              Q.{index + 1}
            </span>
            <strong style={{ color: "white" }}>{faq.question}</strong>
          </div>
          <div className="p-3 border" style={{ borderTop: "0" }}>
            {faq.answer}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FAQ;