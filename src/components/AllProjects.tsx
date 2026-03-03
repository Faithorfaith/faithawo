import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, ArrowLeft, Loader2 } from 'lucide-react';
import { Link } from 'wouter';
import { Project, fetchProjects } from '../utils/api';

interface ProjectCardProps extends Project {
  index: number;
}

function ProjectCard({ id, image, category, year, title, description, link, index }: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link href={link || `/work/${id}`}>
      <motion.article 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, delay: index * 0.15 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className="group relative cursor-pointer"
      >
        <motion.div
          whileHover={{ y: -8 }}
          transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
          className="relative bg-[#0f0f0f] border border-[rgba(36,36,36,0.5)] hover:border-[rgba(226,163,54,0.3)] transition-all duration-500 rounded-[32px] overflow-hidden"
        >
          {/* Project image */}
          <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden group-hover:shadow-2xl transition-shadow duration-500">
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>

          {/* Project info - card style */}
          <div className="w-full px-8 sm:px-12 py-10">
            <div className="flex flex-col gap-4">
              {/* Tags */}
              <div className="flex items-center gap-3">
                <span className="text-[12.8px] text-[#e2a336] uppercase tracking-[1.2825px] font-['Inter']">{category}</span>
                <div className="w-1 h-1 bg-[#808080] rounded-full" />
                <span className="text-[12.1px] text-[#808080] tracking-[1.2825px] font-['Inter']">{year}</span>
              </div>

              {/* Title */}
              <h3 className="text-[clamp(1.75rem,3.5vw,2.5rem)] leading-tight tracking-[-0.01em] text-[#f5f4f0] font-['Instrument_Serif']">
                {title}
              </h3>

              {/* Description */}
              <p className="text-[15.9px] leading-[29px] text-[#808080] max-w-[547px] font-['Inter']">
                {description}
              </p>
            </div>
          </div>
        </motion.div>
      </motion.article>
    </Link>
  );
}

export function AllProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects()
      .then(setProjects)
      .catch((error) => {
        console.warn('Using default projects:', error);
        setProjects([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-[#f5f4f0] pt-32 pb-24 px-6 sm:px-12 lg:px-14">
      <style>{`
        @keyframes shine {
          0% { left: -100%; }
          100% { left: 200%; }
        }
        .group:hover .group-hover\\:animate-shine {
          animation: shine 1.5s ease-in-out forwards;
        }
      `}</style>

      <div className="max-w-[1000px] mx-auto">
        {/* Header */}
        <div className="mb-20">
          <Link href="/" className="inline-flex items-center gap-2 text-[#808080] hover:text-[#f5f4f0] transition-colors mb-10 font-['Inter'] text-sm">
            <ArrowLeft size={16} />
            Back to Home
          </Link>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[clamp(3rem,6vw,5rem)] leading-[1] font-['Instrument_Serif'] mb-6"
          >
            All Projects
          </motion.h1>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-[#808080] text-lg max-w-lg font-['Inter']"
          >
            A comprehensive archive of my work, experiments, and case studies.
          </motion.div>
        </div>

        {/* List */}
        {loading ? (
          <div className="flex justify-center py-24">
            <Loader2 className="animate-spin text-[#e2a336]" size={32} />
          </div>
        ) : (
          <div className="space-y-16">
            {projects.map((project, index) => (
              <ProjectCard key={project.id} {...project} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}