import { useState, useEffect } from 'react';
import { useRoute, Link } from 'wouter';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowUpRight, Loader2, Calendar, Tag } from 'lucide-react';
import { Project, fetchProjects, ContentBlock } from '../utils/api';
import { BlockRenderer } from './BlockRenderer';

export function CaseStudy() {
  const [, params] = useRoute('/work/:id');
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects()
      .then(projects => {
        const found = projects.find(p => p.id === params?.id);
        if (found) {
          setProject(found);
        }
      })
      .catch((error) => {
        console.warn('Error loading project:', error);
      })
      .finally(() => setLoading(false));
  }, [params]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#e2a336]" size={32} />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex flex-col items-center justify-center text-[#f5f4f0]">
        <h1 className="text-3xl font-serif mb-4">Project not found</h1>
        <Link href="/work" className="text-[#e2a336] hover:underline">Back to all work</Link>
      </div>
    );
  }

  const hasBlocks = Array.isArray(project.content) && project.content.length > 0;

  return (
    <article className="min-h-screen bg-[#0f0f0f] text-[#f5f4f0] pb-24">
      {/* Hero Image */}
      <div className="w-full h-[50vh] sm:h-[60vh] lg:h-[70vh] relative overflow-hidden">
        <motion.img 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          src={project.image} 
          alt={project.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-[#0f0f0f]/50 to-transparent" />
        
        <div className="absolute bottom-0 left-0 w-full p-6 sm:p-12 lg:p-14 max-w-[1440px] mx-auto">
          <Link href="/work" className="inline-flex items-center gap-2 text-[#e2a336] hover:text-[#d19530] transition-colors mb-6 font-['Inter'] text-sm bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
            <ArrowLeft size={16} />
            Back to projects
          </Link>
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-[clamp(2.5rem,5vw,5rem)] leading-none font-['Instrument_Serif'] text-white"
          >
            {project.title}
          </motion.h1>
        </div>
      </div>

      <div className="max-w-[1000px] mx-auto px-6 sm:px-12 lg:px-14 mt-12">
        {/* Meta & Actions */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 border-b border-[#333] pb-12 mb-12">
          <div className="flex gap-8">
            <div>
              <div className="flex items-center gap-2 text-[#808080] mb-1 text-sm uppercase tracking-wider">
                <Tag size={14} /> Category
              </div>
              <div className="text-lg">{project.category}</div>
            </div>
            <div>
              <div className="flex items-center gap-2 text-[#808080] mb-1 text-sm uppercase tracking-wider">
                <Calendar size={14} /> Year
              </div>
              <div className="text-lg">{project.year}</div>
            </div>
          </div>

          {project.link && (
            <a 
              href={project.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#e2a336] text-[#f5f4f0] px-6 py-3 rounded-full hover:bg-[#d19530] transition-colors font-medium"
            >
              Visit Live Site <ArrowUpRight size={18} />
            </a>
          )}
        </div>

        {/* Content */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="prose prose-invert prose-lg max-w-none font-['Inter']"
        >
          {hasBlocks ? (
             <div className="space-y-12">
              {(project.content as ContentBlock[]).map((block: ContentBlock) => (
                  <BlockRenderer key={block.id} block={block} />
              ))}
             </div>
          ) : (
            // Simple formatting for legacy string content
            project.content && typeof project.content === 'string' ? (
              <div className="whitespace-pre-wrap leading-relaxed text-[#c0c0c0]">
                {project.content.split('\n').map((line, i) => {
                  if (line.startsWith('## ')) {
                    return <h2 key={i} className="text-3xl font-['Instrument_Serif'] text-[#f5f4f0] mt-12 mb-6">{line.replace('## ', '')}</h2>;
                  }
                  if (line.startsWith('- ')) {
                    return <li key={i} className="ml-4 list-disc marker:text-[#e2a336]">{line.replace('- ', '')}</li>;
                  }
                  if (line.trim() === '') {
                    return <br key={i} />;
                  }
                  return <p key={i} className="mb-4">{line}</p>;
                })}
              </div>
            ) : (
              <p className="text-[#808080] italic">No case study content available.</p>
            )
          )}
        </motion.div>
      </div>
    </article>
  );
}