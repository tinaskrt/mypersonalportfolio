import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { doc, setDoc, collection, addDoc } from 'firebase/firestore';
import { Mail, Phone, Send, CheckCircle } from 'lucide-react';

export default function Contact() {
  const { bio, isFirebaseConnected, db } = usePortfolio();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const socials = [
    { 
      name: 'GitHub', 
      value: bio.contact.github, 
      link: `https://github.com/${bio.contact.github}`, 
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
          <path d="M9 18c-4.51 2-5-2-7-2" />
        </svg>
      ) 
    },
    { 
      name: 'Instagram', 
      value: bio.contact.instagram, 
      link: `https://instagram.com/${bio.contact.instagram}`, 
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
        </svg>
      ) 
    },
    { 
      name: 'Facebook', 
      value: bio.contact.facebook, 
      link: `https://facebook.com/search/top/?q=${encodeURIComponent(bio.contact.facebook)}`, 
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
        </svg>
      ) 
    },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSubmitting(true);
    const newMessage = {
      ...formData,
      id: 'm_' + Date.now(),
      timestamp: new Date().toISOString()
    };

    try {
      if (isFirebaseConnected && db) {
        // Pushing to Firestore
        await addDoc(collection(db, 'messages'), newMessage);
      } else {
        // Save to local storage
        const currentMessages = JSON.parse(localStorage.getItem('maria-portfolio-messages') || '[]');
        currentMessages.push(newMessage);
        localStorage.setItem('maria-portfolio-messages', JSON.stringify(currentMessages));
      }

      setSubmitSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (err) {
      console.error("Error saving message:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="relative py-24 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[20%] left-[-10%] w-[35vw] h-[35vw] max-w-[380px] rounded-full bg-accent/5 glow-blob animate-pulse-glow" />
      <div className="absolute bottom-[10%] right-[-10%] w-[35vw] h-[35vw] max-w-[380px] rounded-full bg-pink-400/5 glow-blob animate-pulse-glow" style={{ animationDelay: '-2s' }} />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-text-main mb-3 relative inline-block">
            Get In Touch
            <span className="absolute bottom-0 left-[20%] right-[20%] h-[3px] bg-gradient-to-r from-accent to-pink-500 rounded-full" />
          </h2>
          <p className="text-text-muted mt-2 text-sm sm:text-base max-w-lg mx-auto">
            Let's collaborate on creative projects or design modern, clean front-end interfaces.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Contact Cards */}
          <div className="lg:col-span-5 flex flex-col gap-6 text-left">
            
            {/* Email Card */}
            <a 
              href={`mailto:${bio.contact.email}`}
              className="group glass-panel rounded-2xl p-6 border border-border-glass shadow-md hover:border-accent/30 hover:bg-accent/5 transition-all duration-300 flex items-center gap-5 cursor-pointer"
            >
              <div className="p-3.5 rounded-xl bg-accent/10 text-accent group-hover:scale-110 group-hover:bg-accent group-hover:text-white transition-all duration-300">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-mono font-bold text-accent uppercase tracking-wider">Email Address</p>
                <p className="text-sm sm:text-base font-bold text-text-main mt-0.5 break-all">{bio.contact.email}</p>
              </div>
            </a>

            {/* Phone Card */}
            <a 
              href={`tel:${bio.contact.phone}`}
              className="group glass-panel rounded-2xl p-6 border border-border-glass shadow-md hover:border-accent/30 hover:bg-accent/5 transition-all duration-300 flex items-center gap-5 cursor-pointer"
            >
              <div className="p-3.5 rounded-xl bg-pink-500/10 text-pink-500 group-hover:scale-110 group-hover:bg-pink-500 group-hover:text-white transition-all duration-300">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-mono font-bold text-pink-500 uppercase tracking-wider">Phone Number</p>
                <p className="text-sm sm:text-base font-bold text-text-main mt-0.5">{bio.contact.phone}</p>
              </div>
            </a>

            {/* Social Grid */}
            <div className="glass-panel rounded-2xl p-6 border border-border-glass shadow-md">
              <h4 className="font-extrabold text-sm text-text-main tracking-tight uppercase mb-4">Social Ecosystem</h4>
              <div className="flex flex-col gap-4">
                {socials.map((social) => (
                  <a
                    key={social.name}
                    href={social.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-xl border border-border-glass hover:border-accent/30 hover:bg-accent/5 transition-all group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-text-muted group-hover:text-accent transition-colors">
                        {social.icon}
                      </div>
                      <span className="text-sm font-semibold text-text-main">{social.name}</span>
                    </div>
                    <span className="text-xs font-mono text-text-muted group-hover:text-accent transition-colors">{social.value}</span>
                  </a>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-border-glass shadow-premium">
              
              <h3 className="text-xl font-extrabold text-text-main tracking-tight text-left mb-6">Send a Message</h3>
              
              <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-left">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="name" className="text-xs font-bold text-text-muted uppercase tracking-wider">Your Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g. Maria Florida"
                      className="px-4 py-3 rounded-xl bg-bg-base border border-border-glass focus:border-accent/50 focus:ring-1 focus:ring-accent outline-none text-text-main text-sm transition-all shadow-inner"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="text-xs font-bold text-text-muted uppercase tracking-wider">Your Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="e.g. name@example.com"
                      className="px-4 py-3 rounded-xl bg-bg-base border border-border-glass focus:border-accent/50 focus:ring-1 focus:ring-accent outline-none text-text-main text-sm transition-all shadow-inner"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="subject" className="text-xs font-bold text-text-muted uppercase tracking-wider">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="e.g. UI/UX Collaboration"
                    className="px-4 py-3 rounded-xl bg-bg-base border border-border-glass focus:border-accent/50 focus:ring-1 focus:ring-accent outline-none text-text-main text-sm transition-all shadow-inner"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="message" className="text-xs font-bold text-text-muted uppercase tracking-wider">Message Details</label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows="5"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Describe your project goals or inquiries..."
                    className="px-4 py-3 rounded-xl bg-bg-base border border-border-glass focus:border-accent/50 focus:ring-1 focus:ring-accent outline-none text-text-main text-sm transition-all shadow-inner resize-none"
                  />
                </div>

                {submitSuccess ? (
                  <div className="flex items-center gap-2 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-500 text-sm font-semibold animate-[fadeIn_0.3s_ease]">
                    <CheckCircle className="w-5 h-5 flex-shrink-0" />
                    <span>Your message has been sent successfully! The owner will contact you shortly.</span>
                  </div>
                ) : null}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center justify-center gap-2 mt-2 w-full py-4 rounded-xl bg-accent text-white font-bold tracking-wide shadow-[0_10px_25px_-5px_rgba(255,46,147,0.3)] hover:bg-accent/90 hover:shadow-[0_10px_25px_-2px_rgba(255,46,147,0.45)] hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 transition-all duration-300 cursor-pointer"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Send Message</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
