import { useState } from 'react';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { Loader2, Send, CheckCircle2 } from 'lucide-react';

const BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-c4cf44c5`;

export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch(`${BASE_URL}/contact`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      setIsSuccess(true);
      setFormData({ name: '', email: '', message: '' });
      
      // Reset success message after 3 seconds
      setTimeout(() => setIsSuccess(false), 3000);
    } catch (err) {
      console.error('Contact form error:', err);
      setError('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf7ed] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8 lg:mb-12">
          <h1 className="text-4xl lg:text-5xl font-['Gloria_Hallelujah',sans-serif] text-black mb-4">
            Let's work together
          </h1>
          <p className="text-lg text-[#4b4a4a] font-['Give_You_Glory',sans-serif]">
            Have a project in mind? I'd love to hear about it!
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-[24px] p-6 sm:p-8 lg:p-12 shadow-lg relative overflow-hidden">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div>
              <label 
                htmlFor="name" 
                className="block text-sm font-['Gloria_Hallelujah',sans-serif] text-[#4b4a4a] mb-2"
              >
                Your Name
              </label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="John Doe"
                className="w-full px-4 py-3 rounded-lg border-2 border-[#e2e2e2] focus:border-[#e2a336] outline-none transition-colors font-['Give_You_Glory',sans-serif] text-black placeholder:text-[#c0c0c0]"
              />
            </div>

            {/* Email Field */}
            <div>
              <label 
                htmlFor="email" 
                className="block text-sm font-['Gloria_Hallelujah',sans-serif] text-[#4b4a4a] mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                placeholder="john@example.com"
                className="w-full px-4 py-3 rounded-lg border-2 border-[#e2e2e2] focus:border-[#e2a336] outline-none transition-colors font-['Give_You_Glory',sans-serif] text-black placeholder:text-[#c0c0c0]"
              />
            </div>

            {/* Message Field */}
            <div>
              <label 
                htmlFor="message" 
                className="block text-sm font-['Gloria_Hallelujah',sans-serif] text-[#4b4a4a] mb-2"
              >
                Message
              </label>
              <textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
                rows={6}
                placeholder="Tell me about your project..."
                className="w-full px-4 py-3 rounded-lg border-2 border-[#e2e2e2] focus:border-[#e2a336] outline-none transition-colors font-['Give_You_Glory',sans-serif] text-black placeholder:text-[#c0c0c0] resize-none"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
                <p className="text-red-600 text-sm font-['Give_You_Glory',sans-serif]">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || isSuccess}
              className="w-full bg-[#272727] text-white font-['Gloria_Hallelujah',sans-serif] px-8 py-4 rounded-full hover:bg-[#1a1a1a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Sending...
                </>
              ) : isSuccess ? (
                <>
                  <CheckCircle2 size={20} />
                  Message Sent!
                </>
              ) : (
                <>
                  <Send size={20} />
                  Send Message
                </>
              )}
            </button>
          </form>

          {/* Decorative Border */}
          <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[24px]" />
        </div>

        {/* Back Link */}
        <div className="text-center mt-8">
          <a 
            href="/" 
            className="text-[#4b4a4a] font-['Give_You_Glory',sans-serif] hover:text-black transition-colors inline-flex items-center gap-2"
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}
