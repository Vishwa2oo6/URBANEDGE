
import React, { useState } from 'react';
import { FAQItem } from '../types';
import { PlusIcon, MinusIcon } from './icons';

interface FAQProps {
  faqs: FAQItem[];
}

const FAQ: React.FC<FAQProps> = ({ faqs }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 animate-fade-in">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-bold uppercase tracking-wider text-white">Frequently Asked Questions</h1>
        <p className="mt-4 text-lg text-gray-300">
          Need help with sizing, returns, or delivery? Find all the answers you need below — simple, fast, and hassle-free.
        </p>
      </div>

      <div className="mt-16 max-w-3xl mx-auto">
        <div className="divide-y divide-gray-800 border-t border-b border-gray-800">
          {faqs.map((faq, index) => (
            <div key={index}>
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex justify-between items-center text-left text-white py-6"
              >
                <span className="text-lg font-medium">{faq.question}</span>
                <span>
                  {openIndex === index ? (
                    <MinusIcon className="w-6 h-6" />
                  ) : (
                    <PlusIcon className="w-6 h-6" />
                  )}
                </span>
              </button>
              {openIndex === index && (
                <div className="pb-6 pr-12 text-gray-300 animate-fade-in-down">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;