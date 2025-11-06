import React, { useState } from 'react';
import { MailIcon, PhoneIcon } from './icons';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setFormData({ name: '', email: '', message: '' });
  };
  
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 animate-fade-in">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-bold uppercase tracking-wider text-white">Contact Us</h1>
        <p className="mt-4 text-lg text-gray-300">
          Have questions or feedback? We’re here to help. Reach out to our support team for quick assistance — because your satisfaction means everything.
        </p>
      </div>

      <div className="mt-16 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="bg-gray-900 border border-gray-800 p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Send us a message</h2>
          {submitted ? (
             <div className="text-center bg-green-900/50 border border-green-500 p-6 text-green-300">
                <h3 className="font-bold">Thank you!</h3>
                <p className="mt-2 text-sm">Your message has been sent. We'll get back to you shortly.</p>
             </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300">Full Name</label>
                <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full bg-gray-800 border-gray-700 text-white p-3 focus:ring-white focus:border-white" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email Address</label>
                <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} required className="mt-1 block w-full bg-gray-800 border-gray-700 text-white p-3 focus:ring-white focus:border-white" />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-300">Message</label>
                <textarea name="message" id="message" rows={4} value={formData.message} onChange={handleChange} required className="mt-1 block w-full bg-gray-800 border-gray-700 text-white p-3 focus:ring-white focus:border-white"></textarea>
              </div>
              <div>
                <button type="submit" className="w-full px-8 py-3 bg-white text-black font-bold uppercase tracking-wider hover:bg-gray-200 transition-colors duration-300">
                  Send Message
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="text-gray-300">
            <h3 className="text-2xl font-bold text-white">Contact Information</h3>
            <p className="mt-4">You can also reach us via the following methods:</p>
            <div className="mt-6 space-y-4">
                <div className="flex items-center gap-4">
                    <MailIcon className="w-6 h-6 text-gray-400" />
                    <div>
                        <h4 className="font-semibold text-white">Email</h4>
                        <a href="mailto:support@urbanedge.com" className="hover:text-white">support@urbanedge.com</a>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <PhoneIcon className="w-6 h-6 text-gray-400" />
                    <div>
                        <h4 className="font-semibold text-white">Phone</h4>
                        <p>+1 (555) 123-4567</p>
                    </div>
                </div>
            </div>
            <h3 className="text-xl font-bold text-white mt-10">Business Hours</h3>
            <p className="mt-2">Monday - Friday: 9:00 AM - 6:00 PM EST</p>
            <p className="mt-1">Saturday: 10:00 AM - 4:00 PM EST</p>
            <p className="mt-1">Sunday: Closed</p>
        </div>
      </div>
    </div>
  );
};

export default Contact;
