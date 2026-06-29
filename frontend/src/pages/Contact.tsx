<<<<<<< HEAD

const Contact = () => {
    return(
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
        <p className="text-lg text-gray-700">
            For any inquiries or support, please reach out to us at
            <a href="mailto:abc@gmail.com" className="text-blue-500 hover:underline">abc@gmail.com</a> or call us at <a href="tel:+1234567890" className="text-blue-500 hover:underline">+1234567890</a>.
        </p>
    </div>
    )
    
}
=======
import { useState } from "react";
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaPaperPlane, FaCheckCircle } from "react-icons/fa";
import Footer from "../layout/Footer";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFormData({ name: "", email: "", subject: "", message: "" });
      }, 3000);
    }
  };

  return (
    <div className="bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-500 min-h-screen pt-24 flex flex-col justify-between">
      <div className="max-w-7xl mx-auto w-full px-4 md:px-8 flex-grow">
        
        {/* Header Title */}
        <div className="text-center mb-16">
          <span className="text-green-600 dark:text-green-400 font-semibold tracking-widest text-xs uppercase bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
            Get in touch
          </span>
          <h1 className="text-4xl md:text-6xl font-black mt-3">
            Contact Support
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mx-auto mt-4" />
        </div>

        {/* Form and Info Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-20">
          
          {/* LEFT: Info Cards */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Info items */}
            {[
              {
                icon: <FaEnvelope className="text-green-500" />,
                title: "Email Us",
                detail: "support@turfhub.com",
                sub: "Response within 24 hours",
                href: "mailto:support@turfhub.com",
              },
              {
                icon: <FaPhoneAlt className="text-emerald-500" />,
                title: "Call Us",
                detail: "+1 (800) 555-PLAY",
                sub: "Mon - Sun: 7:00 AM - 11:00 PM",
                href: "tel:+18005557529",
              },
              {
                icon: <FaMapMarkerAlt className="text-teal-500" />,
                title: "Headquarters",
                detail: "100 Sports Avenue, Sector 5",
                sub: "New York, NY 10001",
                href: "https://maps.google.com",
              },
            ].map((info, i) => (
              <a
                key={i}
                href={info.href}
                target={info.href.startsWith("http") ? "_blank" : "_self"}
                rel="noreferrer"
                className="block bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.02)] hover:border-green-500/30 dark:hover:border-green-500/30 transition-all duration-300 group hover:translate-y-[-2px]"
              >
                <div className="flex gap-4 items-center">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-100 dark:border-slate-850 flex items-center justify-center text-xl shadow-sm">
                    {info.icon}
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                      {info.title}
                    </h3>
                    <p className="text-base font-extrabold text-slate-800 dark:text-white mt-1 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300">
                      {info.detail}
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-550 mt-0.5">
                      {info.sub}
                    </p>
                  </div>
                </div>
              </a>
            ))}

          </div>

          {/* RIGHT: Contact Form Card */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900/40 backdrop-blur-md border border-slate-200 dark:border-slate-800 p-8 rounded-3xl shadow-[0_12px_40px_rgba(0,0,0,0.03)]">
            <h2 className="text-2xl font-black text-slate-805 dark:text-white mb-6">
              Send Us a Message
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Row 1: Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Your Name
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="Enter name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 py-3 px-4 rounded-xl focus:outline-none focus:ring-1 focus:ring-green-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Email Address
                  </label>
                  <input
                    required
                    type="email"
                    placeholder="name@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 py-3 px-4 rounded-xl focus:outline-none focus:ring-1 focus:ring-green-500 transition-all"
                  />
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Subject Line
                </label>
                <input
                  type="text"
                  placeholder="How can we help you?"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 py-3 px-4 rounded-xl focus:outline-none focus:ring-1 focus:ring-green-500 transition-all"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Message Description
                </label>
                <textarea
                  required
                  rows={5}
                  placeholder="Describe your inquiry details..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 py-3.5 px-4 rounded-xl focus:outline-none focus:ring-1 focus:ring-green-500 transition-all"
                />
              </div>

              {/* Submit CTA button */}
              <button
                type="submit"
                disabled={submitted}
                className={`w-full py-3.5 px-4 rounded-xl font-bold transition flex items-center justify-center gap-2 text-sm shadow-md cursor-pointer ${
                  submitted
                    ? "bg-green-500/10 border border-green-500/20 text-green-500 dark:text-green-400 cursor-not-allowed shadow-none"
                    : "bg-green-500 hover:bg-green-600 text-white shadow-green-500/10"
                }`}
              >
                {submitted ? (
                  <>
                    <FaCheckCircle className="animate-ping" />
                    <span>Message Sent Successfully!</span>
                  </>
                ) : (
                  <>
                    <FaPaperPlane className="text-xs" />
                    <span>Send Message</span>
                  </>
                )}
              </button>

            </form>
          </div>

        </div>

      </div>
      <Footer />
    </div>
  );
};

>>>>>>> 4c73f818b928dfa2ae71ce893db608d2b28c7fa7
export default Contact;