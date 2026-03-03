import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, ChevronRight, Volume2, Play, Pause, RotateCcw } from 'lucide-react';
import { Project, ContentBlock } from '../utils/api';
import { useEffect, useState, useCallback } from 'react';

interface BookModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export function BookModal({ project, isOpen, onClose }: BookModalProps) {
  const [currentSpread, setCurrentSpread] = useState(0);
  const [pages, setPages] = useState<string[]>([]);
  const [isReading, setIsReading] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [hasStartedReading, setHasStartedReading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setCurrentSpread(0);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    if (!project) return;

    // Parse content - if it's ContentBlocks, convert to simple text
    let displayContent = project.description || 'No description available';
    
    if (Array.isArray(project.content) && project.content.length > 0) {
      const textContent = project.content
        .filter((block: ContentBlock) => block && block.type === 'text')
        .map((block: ContentBlock) => block.content)
        .join('\n\n');
      if (textContent) {
        displayContent = textContent;
      }
    } else if (typeof project.content === 'string' && project.content) {
      displayContent = project.content;
    }

    // Split content into individual pages
    const paragraphs = displayContent.split('\n\n');
    const pagesArray: string[] = [];
    let currentPageContent = '';
    const maxParagraphsPerPage = 5; // Paragraphs per page (not spread)
    
    paragraphs.forEach((paragraph, index) => {
      const testContent = currentPageContent ? `${currentPageContent}\n\n${paragraph}` : paragraph;
      const paragraphCount = testContent.split('\n\n').length;
      
      if (paragraphCount > maxParagraphsPerPage && currentPageContent) {
        pagesArray.push(currentPageContent);
        currentPageContent = paragraph;
      } else {
        currentPageContent = testContent;
      }
      
      // Last paragraph
      if (index === paragraphs.length - 1 && currentPageContent) {
        pagesArray.push(currentPageContent);
      }
    });

    setPages(pagesArray.length > 0 ? pagesArray : [displayContent]);
  }, [project]);

  const handleStopReading = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsReading(false);
    setIsPaused(false);
    setHasStartedReading(false);
  }, []);

  // Stop reading when page changes or modal closes
  useEffect(() => {
    handleStopReading();
  }, [currentSpread, isOpen, handleStopReading]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  if (!project) return null;

  const coverColor = project.coverColor || '#F9D27D';
  const textColor = project.textColor || '#ffffff';
  
  // Calculate total spreads
  const totalSpreads = Math.ceil((pages.length + 1) / 2);

  const handleNextSpread = () => {
    if (currentSpread < totalSpreads - 1) {
      setCurrentSpread(prev => prev + 1);
    }
  };

  const handlePrevSpread = () => {
    if (currentSpread > 0) {
      setCurrentSpread(prev => prev - 1);
    }
  };

  // Get content for current spread
  const getLeftPageContent = () => {
    if (currentSpread === 0) {
      return 'cover';
    } else {
      const pageIndex = currentSpread * 2 - 1;
      return pages[pageIndex] || '';
    }
  };

  const getRightPageContent = () => {
    const pageIndex = currentSpread * 2;
    return pages[pageIndex] || '';
  };

  const leftContent = getLeftPageContent();
  const rightContent = getRightPageContent();

  // Text-to-speech functionality
  const getCurrentPageText = () => {
    let textToRead = '';
    
    if (leftContent === 'cover') {
      textToRead += `${project.title}. ${project.description}. `;
    }
    
    if (leftContent && leftContent !== 'cover') {
      textToRead += leftContent + ' ';
    }
    
    if (rightContent) {
      textToRead += rightContent;
    }
    
    return textToRead;
  };

  const handleStartReading = () => {
    window.speechSynthesis.cancel();
    
    const textToRead = getCurrentPageText();
    
    if (textToRead) {
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;
      
      utterance.onend = () => {
        setIsReading(false);
        setIsPaused(false);
      };
      
      window.speechSynthesis.speak(utterance);
      setIsReading(true);
      setIsPaused(false);
      setHasStartedReading(true);
    }
  };

  const handlePauseReading = () => {
    if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  const handleResumeReading = () => {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    }
  };

  const handleRestartReading = () => {
    window.speechSynthesis.cancel();
    setIsReading(false);
    setIsPaused(false);
    setTimeout(() => handleStartReading(), 100);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Book Modal */}
          <div className="fixed inset-0 z-[51] flex items-center justify-center p-4 lg:p-8 overflow-y-auto" onClick={onClose}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 25
              }}
              className="relative w-full max-w-[900px] my-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute -top-12 right-0 w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-gray-100 transition-colors z-10"
              >
                <X size={20} className="text-black" />
              </button>

              {/* Read Button - Top Right (next to Close) */}
              <div className="absolute -top-12 right-14 z-10">
                {!hasStartedReading ? (
                  <button
                    onClick={handleStartReading}
                    className="px-5 py-2 rounded-full bg-white flex items-center gap-2 hover:bg-gray-100 transition-colors"
                  >
                    <Volume2 size={18} className="text-black" />
                    <span className="font-['Gloria_Hallelujah',cursive] text-[14px] text-black">Read</span>
                  </button>
                ) : (
                  <div className="flex gap-2">
                    {/* Restart Button */}
                    <button
                      onClick={handleRestartReading}
                      className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-gray-100 transition-colors"
                      title="Restart"
                    >
                      <RotateCcw size={18} className="text-black" />
                    </button>
                    
                    {/* Play/Pause Button */}
                    <button
                      onClick={isPaused ? handleResumeReading : handlePauseReading}
                      className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-gray-100 transition-colors"
                      title={isPaused ? "Play" : "Pause"}
                    >
                      {isPaused ? (
                        <Play size={18} className="text-black" />
                      ) : (
                        <Pause size={18} className="text-black" />
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* Desktop Layout - Full book spread */}
              <div className="hidden lg:block">
                <div 
                  className="relative w-full rounded-[53px] overflow-hidden shadow-2xl border-[3px] border-white/20"
                  style={{ backgroundColor: coverColor }}
                >
                  <div className="flex h-[600px] relative">
                    <AnimatePresence mode="wait" custom={currentSpread}>
                      <motion.div
                        key={currentSpread}
                        custom={currentSpread}
                        initial={{ rotateY: 90, opacity: 0 }}
                        animate={{ rotateY: 0, opacity: 1 }}
                        exit={{ rotateY: -90, opacity: 0 }}
                        transition={{ 
                          duration: 0.6,
                          ease: [0.43, 0.13, 0.23, 0.96]
                        }}
                        className="flex w-full h-full absolute inset-0"
                        style={{ transformOrigin: 'center', transformStyle: 'preserve-3d' }}
                      >
                        {/* Left Page */}
                        <div className="w-1/2 p-8 pb-20 flex flex-col gap-6 border-r-2 border-white/10 overflow-y-auto">
                          {leftContent === 'cover' ? (
                            <>
                              {/* Logo - top left */}
                              {project.logo && (
                                <div className="w-[30px] h-[30px] mb-2">
                                  <img src={project.logo} alt="" className="w-full h-full object-contain" />
                                </div>
                              )}

                              {/* Image */}
                              <div className="bg-[#c9c9c9] min-h-[160px] max-h-[280px] flex-1 rounded-[24px] overflow-hidden flex-shrink">
                                <img
                                  src={project.image}
                                  alt={project.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>

                              {/* Title and Description */}
                              <div 
                                className="flex flex-col gap-4 font-['Gloria_Hallelujah',cursive]"
                                style={{ color: textColor }}
                              >
                                <div className="flex flex-col gap-2">
                                  <h2 className="text-[28px] leading-normal">{project.title}</h2>
                                  <p className="text-[16px] leading-relaxed">{project.description}</p>
                                </div>
                              </div>

                              {/* Buttons */}
                              <div className="flex flex-col gap-3 mt-auto flex-shrink-0">
                                {project.link && (
                                  <a
                                    href={project.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-white rounded-full px-5 py-2 text-center hover:bg-gray-100 transition-colors w-full"
                                  >
                                    <p className="font-['Gloria_Hallelujah',cursive] text-[16px] text-[#2d2d2d] leading-normal">View live site</p>
                                  </a>
                                )}
                                <a
                                  href={`/work/${project.id}`}
                                  className="border border-[#e2e2e2] rounded-full px-5 py-2 text-center hover:bg-white/10 transition-colors"
                                >
                                  <p className="font-['Gloria_Hallelujah',cursive] text-[16px] leading-normal" style={{ color: textColor }}>Read case study</p>
                                </a>
                              </div>
                            </>
                          ) : (
                            <div className="pt-6 pb-20 h-full">
                              <div 
                                className="font-['Gloria_Hallelujah',cursive] text-[16px] leading-relaxed whitespace-pre-wrap"
                                style={{ color: textColor }}
                              >
                                {leftContent}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Right Page */}
                        <div className="w-1/2 p-8 pt-14 pb-20 relative overflow-y-auto">
                          <div 
                            className="font-['Gloria_Hallelujah',cursive] text-[16px] leading-relaxed whitespace-pre-wrap"
                            style={{ color: textColor }}
                          >
                            {rightContent}
                          </div>
                        </div>
                      </motion.div>
                    </AnimatePresence>

                    {/* Page Navigation - Bottom Right */}
                    <div className="absolute bottom-6 right-6 flex gap-3 items-center z-10">
                      <button
                        onClick={handlePrevSpread}
                        disabled={currentSpread === 0}
                        className={`w-9 h-9 rounded-full bg-white/90 flex items-center justify-center transition-all ${
                          currentSpread === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white hover:scale-110'
                        }`}
                      >
                        <ChevronLeft size={18} className="text-black" />
                      </button>
                      <p className="font-['Gloria_Hallelujah',cursive] text-[18px]" style={{ color: textColor }}>
                        <span className="opacity-100">{currentSpread + 1}</span>
                        <span className="opacity-50">/{totalSpreads}</span>
                      </p>
                      <button
                        onClick={handleNextSpread}
                        disabled={currentSpread === totalSpreads - 1}
                        className={`w-9 h-9 rounded-full bg-white/90 flex items-center justify-center transition-all ${
                          currentSpread === totalSpreads - 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white hover:scale-110'
                        }`}
                      >
                        <ChevronRight size={18} className="text-black" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile Layout - Single page view with swipe between pages */}
              <div className="lg:hidden">
                <div 
                  className="relative w-full rounded-[40px] overflow-hidden shadow-2xl border-[3px] border-white/20 max-h-[550px]"
                  style={{ backgroundColor: coverColor }}
                >
                  <AnimatePresence mode="wait" custom={currentSpread}>
                    <motion.div
                      key={`mobile-${currentSpread}`}
                      custom={currentSpread}
                      initial={{ rotateY: 90, opacity: 0 }}
                      animate={{ rotateY: 0, opacity: 1 }}
                      exit={{ rotateY: -90, opacity: 0 }}
                      transition={{ 
                        duration: 0.6,
                        ease: [0.43, 0.13, 0.23, 0.96]
                      }}
                      className="flex flex-col p-6 gap-6 h-[550px] pb-20 overflow-y-auto"
                      style={{ transformOrigin: 'center' }}
                    >
                      {leftContent === 'cover' ? (
                        <>
                          {/* Logo - top left */}
                          {project.logo && (
                            <div className="w-[24px] h-[24px]">
                              <img src={project.logo} alt="" className="w-full h-full object-contain" />
                            </div>
                          )}

                          {/* Image */}
                          <div className="bg-[#c9c9c9] h-[200px] rounded-[20px] overflow-hidden flex-shrink-0">
                            <img 
                              src={project.image} 
                              alt={project.title}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          {/* Title and Description */}
                          <div 
                            className="flex flex-col gap-3 font-['Gloria_Hallelujah',cursive]"
                            style={{ color: textColor }}
                          >
                            <div className="flex flex-col gap-2">
                              <h2 className="text-[22px] leading-[150%]">{project.title}</h2>
                              <p className="text-[14px] leading-[150%]">{project.description}</p>
                            </div>
                          </div>

                          {/* Show first page content on mobile */}
                          {rightContent && (
                            <div className="pt-2">
                              <div 
                                className="font-['Gloria_Hallelujah',cursive] text-[14px] leading-[150%] whitespace-pre-wrap"
                                style={{ color: textColor }}
                              >
                                {rightContent}
                              </div>
                            </div>
                          )}

                          {/* Button */}
                          <div className="flex flex-col gap-3 flex-shrink-0">
                            {project.link && (
                              <a
                                href={project.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-white rounded-full px-5 py-2 text-center"
                              >
                                <p className="font-['Gloria_Hallelujah',cursive] text-[14px] text-[#2d2d2d] leading-[150%]">View live site</p>
                              </a>
                            )}
                          </div>
                        </>
                      ) : (
                        <>
                          {/* Content pages - show both left and right */}
                          <div className="pt-4 space-y-8">
                            {/* Left page */}
                            {leftContent && (
                              <div>
                                <div 
                                  className="font-['Gloria_Hallelujah',cursive] text-[14px] leading-[150%] whitespace-pre-wrap"
                                  style={{ color: textColor }}
                                >
                                  {leftContent}
                                </div>
                              </div>
                            )}
                            
                            {/* Divider if both pages exist */}
                            {leftContent && rightContent && (
                              <div className="border-t border-white/20 my-6" />
                            )}
                            
                            {/* Right page */}
                            {rightContent && (
                              <div>
                                <div 
                                  className="font-['Gloria_Hallelujah',cursive] text-[14px] leading-[150%] whitespace-pre-wrap"
                                  style={{ color: textColor }}
                                >
                                  {rightContent}
                                </div>
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </motion.div>
                  </AnimatePresence>

                  {/* Page Navigation - Bottom Center */}
                  <div className="absolute bottom-6 left-0 right-0 flex gap-3 items-center justify-center z-10">
                    <button
                      onClick={handlePrevSpread}
                      disabled={currentSpread === 0}
                      className={`w-9 h-9 rounded-full bg-white/90 flex items-center justify-center transition-all ${
                        currentSpread === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white hover:scale-110'
                      }`}
                    >
                      <ChevronLeft size={18} className="text-black" />
                    </button>
                    <p className="font-['Gloria_Hallelujah',cursive] text-[16px]" style={{ color: textColor }}>
                      <span className="opacity-100">{currentSpread + 1}</span>
                      <span className="opacity-50">/{totalSpreads}</span>
                    </p>
                    <button
                      onClick={handleNextSpread}
                      disabled={currentSpread === totalSpreads - 1}
                      className={`w-9 h-9 rounded-full bg-white/90 flex items-center justify-center transition-all ${
                        currentSpread === totalSpreads - 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white hover:scale-110'
                      }`}
                    >
                      <ChevronRight size={18} className="text-black" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
