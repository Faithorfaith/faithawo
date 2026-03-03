import { motion } from 'motion/react';
import { Construction, Mail } from 'lucide-react';

export function MaintenancePage() {
  return (
    <div className="fixed inset-0 z-[100] bg-[#0f0f0f] flex flex-col items-center justify-center p-6 text-center">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[rgba(226,163,54,0.05)] rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 max-w-lg"
      >
        <motion.div 
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, repeatDelay: 1 }}
          className="mx-auto w-16 h-16 mb-8 text-[#e2a336] flex items-center justify-center bg-[rgba(226,163,54,0.1)] rounded-full border border-[rgba(226,163,54,0.2)]"
        >
          <Construction size={32} />
        </motion.div>

        <h1 className="text-[#f5f4f0] font-['Instrument_Serif'] text-5xl md:text-6xl mb-6">
          Work in Progress
        </h1>

        <p className="text-[#808080] font-['Inter'] text-lg leading-relaxed mb-8">
          We're currently making some improvements to our portfolio. 
          Please check back soon for the new experience.
        </p>

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1a1a1a] border border-[#333] text-[#808080] text-sm font-['Inter']">
          <span className="w-2 h-2 rounded-full bg-[#e2a336] animate-pulse" />
          System Maintenance
        </div>
      </motion.div>

      {/* Footer Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="absolute bottom-8 left-0 right-0 z-10 flex justify-center px-6"
      >
        {/* Breaks to 2 rows under 370px */}
        <div className="flex max-[370px]:flex-col items-center gap-4">
          {/* Profile Card */}
          <div className="flex items-center gap-3">
            {/* Circular Profile Image */}
            <div className="w-12 h-12 rounded-full overflow-hidden border border-[#333]">
              <img
                src="https://i.postimg.cc/4nKfNtmX/favicon.png"
                alt="Faith Awokunle"
                className="w-full h-full object-cover rounded-full"
              />
            </div>

            {/* Name */}
            <div className="text-left">
              <div className="text-[#f5f4f0] font-['Inter'] text-sm">Faith Awokunle</div>
              <div className="text-[#808080] font-['Inter'] text-xs">Product Designer</div>
            </div>
          </div>

          {/* Divider - hidden on very small screens */}
          <div className="h-4 w-px bg-[#333] mx-2 max-[370px]:hidden" />

          {/* Get in Touch */}
          <a
            href="mailto:faithawokunle1@gmail.com"
            className="flex items-center gap-2 text-[#e2a336] hover:text-[#d49730] font-['Inter'] text-xs transition-colors"
          >
            <Mail size={14} />
            Get in Touch
          </a>
        </div>
      </motion.div>
    </div>
  );
}