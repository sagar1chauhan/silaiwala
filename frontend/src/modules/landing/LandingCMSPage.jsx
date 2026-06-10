import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Instagram, Facebook, Twitter, Mail, Phone, MapPin, Send, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';

const LandingCMSPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [content, setContent] = useState(null);
  const [settings, setSettings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  
  // Contact Form State
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await api.post('/cms/contact', formData);
      if (res.data.success) {
        toast.success('Thank you for reaching out. Our concierge will contact you shortly.');
        setFormData({ firstName: '', lastName: '', email: '', message: '' });
      } else {
        toast.error(res.data.message || 'Failed to send message');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'An error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchContent = async () => {
      setIsLoading(true);
      try {
        const [contentRes, settingsRes] = await Promise.all([
          api.get(`/cms/content/${slug}`).catch(() => ({ data: { success: false } })),
          api.get(`/cms/settings`).catch(() => ({ data: { success: false } }))
        ]);

        if (contentRes.data?.success) {
          setContent(contentRes.data.data);
        } else {
          setContent(null);
        }

        if (settingsRes.data?.success) {
          setSettings(settingsRes.data.data);
        }
      } catch (error) {
        console.error('Error fetching CMS content:', error);
        setContent(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    // Scroll to top on load
    window.scrollTo(0, 0);
    fetchContent();
  }, [slug]);

  return (
    <div className="font-body bg-[var(--color-alabaster)] text-[var(--color-evergreen)] min-h-screen flex flex-col selection:bg-[var(--color-evergreen)] selection:text-[var(--color-gold)] overflow-x-hidden">
      
      {/* Navbar */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 border-b ${scrolled ? 'bg-[var(--color-evergreen)] border-[var(--color-evergreen-container)] py-4 shadow-lg' : 'bg-[var(--color-evergreen)] border-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-8 md:px-16 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="text-white hover:text-[var(--color-gold)] transition-colors">
              <ArrowLeft size={24} />
            </button>
            <Link to="/" className="flex items-center gap-2 group">
              <h1 className="font-serif text-2xl tracking-wide text-[var(--color-gold)]">
                SewZella
              </h1>
            </Link>
          </div>
          
          <div className="hidden md:flex gap-10 items-center">
            {['Services', 'Artisans', 'Portfolio', 'Contact'].map((item) => (
              <Link key={item} to={`/#${item.toLowerCase()}`} className="text-sm tracking-widest uppercase transition-colors hover:text-white text-white/80">
                {item}
              </Link>
            ))}
          </div>

          <div className="flex gap-4 items-center">
            <a href="https://play.google.com/store" target="_blank" rel="noopener noreferrer" className="bg-[var(--color-gold)] text-[var(--color-evergreen)] px-6 py-2.5 rounded text-sm tracking-widest uppercase font-semibold hover:bg-white transition-all duration-300">
              Book Consultation
            </a>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 pt-32 pb-24 md:pt-40 md:pb-32 bg-[var(--color-alabaster)]">
        <div className="max-w-4xl mx-auto px-8 md:px-16">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="w-10 h-10 border-4 border-[var(--color-evergreen)] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : !content && slug !== 'contact-us' ? (
            <div className="text-center py-20">
              <h2 className="font-serif text-4xl text-[var(--color-evergreen)] mb-6">Page Not Found</h2>
              <p className="text-[var(--color-sage)] mb-8">The content you are looking for does not exist or has been removed.</p>
              <Link to="/" className="bg-[var(--color-evergreen)] text-white px-8 py-3.5 rounded text-sm tracking-widest uppercase font-semibold hover:bg-[var(--color-gold)] transition-colors">
                Return Home
              </Link>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className="text-center mb-16">
                <span className="text-[var(--color-sage)] uppercase tracking-[0.2em] text-xs font-semibold block mb-4">
                  {slug === 'contact-us' ? 'Get In Touch' : 'Official Information'}
                </span>
                <h1 className="font-serif text-4xl md:text-5xl text-[var(--color-evergreen)] mb-6">
                  {content?.title || (slug === 'contact-us' ? 'Contact Us' : 'Information')}
                </h1>
                <div className="w-16 h-1 bg-[var(--color-gold)] mx-auto rounded-full"></div>
              </div>

              {content && (
                <div 
                  className="prose prose-lg max-w-none text-[var(--color-evergreen)] prose-headings:font-serif prose-headings:text-[var(--color-evergreen)] prose-a:text-[var(--color-gold)] prose-strong:text-[var(--color-evergreen)] prose-li:marker:text-[var(--color-gold)] leading-relaxed mb-16"
                  dangerouslySetInnerHTML={{ __html: content.content }}
                />
              )}

              {slug === 'contact-us' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
                  {/* Contact Info */}
                  <div className="space-y-10">
                    <div>
                      <h3 className="font-serif text-3xl text-[var(--color-evergreen)] mb-6">We're Here for You</h3>
                      <p className="text-[var(--color-sage)] leading-relaxed">
                        Whether you have a question about our bespoke process, want to book a consultation, or need assistance with an ongoing order, our concierge team is at your service.
                      </p>
                    </div>

                    <div className="space-y-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-[var(--color-evergreen)] text-[var(--color-gold)] flex items-center justify-center rounded-lg shrink-0 shadow-lg">
                          <Mail size={20} />
                        </div>
                        <div>
                          <h4 className="text-sm tracking-widest uppercase font-semibold text-[var(--color-evergreen)] mb-1">Email</h4>
                          <p className="text-[var(--color-sage)]">{settings?.general?.supportEmail || 'concierge@sewzella.com'}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-[var(--color-evergreen)] text-[var(--color-gold)] flex items-center justify-center rounded-lg shrink-0 shadow-lg">
                          <Phone size={20} />
                        </div>
                        <div>
                          <h4 className="text-sm tracking-widest uppercase font-semibold text-[var(--color-evergreen)] mb-1">Phone</h4>
                          <p className="text-[var(--color-sage)]">{settings?.general?.supportPhone || '+1 (800) 555-0199'}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-[var(--color-evergreen)] text-[var(--color-gold)] flex items-center justify-center rounded-lg shrink-0 shadow-lg">
                          <MapPin size={20} />
                        </div>
                        <div>
                          <h4 className="text-sm tracking-widest uppercase font-semibold text-[var(--color-evergreen)] mb-1">Headquarters</h4>
                          <p className="text-[var(--color-sage)] leading-relaxed">123 Savile Row, Suite 400<br/>London, UK W1S 3PR</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Contact Form */}
                  <div className="bg-white p-8 md:p-10 rounded-2xl shadow-xl border border-gray-100">
                    <h3 className="font-serif text-2xl text-[var(--color-evergreen)] mb-8">Send a Message</h3>
                    <form className="space-y-6" onSubmit={handleContactSubmit}>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-xs font-bold text-[var(--color-evergreen)] uppercase tracking-widest mb-2">First Name</label>
                          <input type="text" required value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-[var(--color-gold)] transition-colors" placeholder="John" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-[var(--color-evergreen)] uppercase tracking-widest mb-2">Last Name</label>
                          <input type="text" required value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-[var(--color-gold)] transition-colors" placeholder="Doe" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[var(--color-evergreen)] uppercase tracking-widest mb-2">Email Address</label>
                        <input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-[var(--color-gold)] transition-colors" placeholder="john@example.com" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[var(--color-evergreen)] uppercase tracking-widest mb-2">Message</label>
                        <textarea required rows="4" value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-[var(--color-gold)] transition-colors resize-none" placeholder="How can we assist you?"></textarea>
                      </div>
                      <button type="submit" disabled={isSubmitting} className="w-full flex items-center justify-center gap-2 bg-[var(--color-evergreen)] text-white px-8 py-4 rounded-lg text-sm tracking-widest uppercase font-semibold hover:bg-[var(--color-gold)] transition-colors group disabled:opacity-70">
                        {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : 'Send Message'} {!isSubmitting && <Send size={16} className="group-hover:translate-x-1 transition-transform" />}
                      </button>
                    </form>
                  </div>
                </div>
              )}

              {content && (
                <div className="mt-16 pt-8 border-t border-[var(--color-sage)]/20 text-center">
                  <p className="text-sm text-[var(--color-sage)] uppercase tracking-widest">
                    Last Updated: {new Date(content.updatedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Luxury Footer */}
      <footer id="contact" className="bg-[var(--color-evergreen)] text-white pt-24 pb-12 mt-auto">
        <div className="max-w-7xl mx-auto px-8 md:px-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
            <div className="lg:col-span-1">
              <h2 className="font-serif text-3xl text-[var(--color-gold)] mb-6">SewZella</h2>
              <p className="text-white/60 text-sm leading-relaxed mb-8">
                Defining the future of bespoke tailoring through sustainable practices and heritage craftsmanship.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded border border-white/20 flex items-center justify-center text-white/60 hover:text-[var(--color-gold)] hover:border-[var(--color-gold)] transition-colors">
                  <Instagram size={18} />
                </a>
                <a href="#" className="w-10 h-10 rounded border border-white/20 flex items-center justify-center text-white/60 hover:text-[var(--color-gold)] hover:border-[var(--color-gold)] transition-colors">
                  <Facebook size={18} />
                </a>
                <a href="#" className="w-10 h-10 rounded border border-white/20 flex items-center justify-center text-white/60 hover:text-[var(--color-gold)] hover:border-[var(--color-gold)] transition-colors">
                  <Twitter size={18} />
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm tracking-widest uppercase font-semibold mb-6 text-white">Discover</h4>
              <ul className="space-y-4">
                <li><Link to="/#artisans" className="text-white/60 hover:text-[var(--color-gold)] transition-colors text-sm">Artisans</Link></li>
                <li><Link to="/#materials" className="text-white/60 hover:text-[var(--color-gold)] transition-colors text-sm">Materials</Link></li>
                <li><Link to="/#sustainability" className="text-white/60 hover:text-[var(--color-gold)] transition-colors text-sm">Sustainability</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm tracking-widest uppercase font-semibold mb-6 text-white">Partners</h4>
              <ul className="space-y-4">
                <li><a href="https://play.google.com/store" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-[var(--color-gold)] transition-colors text-sm">Artisan Portal</a></li>
                <li><a href="https://play.google.com/store" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-[var(--color-gold)] transition-colors text-sm">Delivery Partners</a></li>
                <li><a href="#" className="text-white/60 hover:text-[var(--color-gold)] transition-colors text-sm">Corporate</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm tracking-widest uppercase font-semibold mb-6 text-white">Contact</h4>
              <ul className="space-y-4">
                <li className="text-white/60 text-sm">{settings?.general?.supportEmail || 'concierge@sewzella.com'}</li>
                <li className="text-white/60 text-sm">{settings?.general?.supportPhone || '+1 (800) 555-0199'}</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/40 text-xs tracking-wider uppercase">
              &copy; {new Date().getFullYear()} SewZella Bespoke Tailoring. Handcrafted Excellence.
            </p>
            <div className="flex gap-6 text-white/40 text-xs tracking-wider uppercase">
              <Link to="/page/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link to="/page/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link>
              <Link to="/page/accessibility-report" className="hover:text-white transition-colors">Accessibility Report</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingCMSPage;
