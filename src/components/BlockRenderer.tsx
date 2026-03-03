import { ContentBlock } from '../utils/api';
import { Button } from './ui/button';
import { ArrowUpRight } from 'lucide-react';

interface BlockRendererProps {
  block: ContentBlock;
}

export function BlockRenderer({ block }: BlockRendererProps) {
  const { type, content, style } = block;

  switch (type) {
    case 'text':
      return (
        <div className={`mb-6 prose prose-invert prose-lg max-w-none ${style?.align === 'center' ? 'text-center' : style?.align === 'right' ? 'text-right' : 'text-left'}`}>
           <div className="whitespace-pre-wrap leading-relaxed text-[#c0c0c0] font-['Inter']">
               {content.text}
           </div>
        </div>
      );
    case 'image':
      return (
        <figure className={`mb-8 ${style?.align === 'center' ? 'flex flex-col items-center' : ''}`}>
          <img 
            src={content.src} 
            alt={content.caption || ''} 
            className="rounded-2xl border border-[#333] w-full max-w-full" 
          />
          {content.caption && (
            <figcaption className="mt-2 text-sm text-[#808080] text-center italic font-['Inter']">
              {content.caption}
            </figcaption>
          )}
        </figure>
      );
    case 'video':
      return (
        <div className={`mb-8 ${style?.align === 'center' ? 'flex flex-col items-center' : ''}`}>
            <video 
                src={content.src} 
                controls 
                className="rounded-2xl border border-[#333] w-full max-w-full" 
            />
            {content.caption && (
                <p className="mt-2 text-sm text-[#808080] text-center italic font-['Inter']">
                    {content.caption}
                </p>
            )}
        </div>
      );
    case 'button':
      return (
        <div className={`mb-8 flex ${style?.align === 'center' ? 'justify-center' : style?.align === 'right' ? 'justify-end' : 'justify-start'}`}>
          <a
            href={content.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#e2a336] text-[#f5f4f0] px-6 py-3 rounded-full hover:bg-[#d19530] transition-colors font-medium font-['Inter']"
          >
            {content.label} <ArrowUpRight size={18} />
          </a>
        </div>
      );
    default:
      return null;
  }
}
