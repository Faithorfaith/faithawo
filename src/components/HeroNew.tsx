import { useEffect, useState } from 'react';
import svgPaths from "../imports/svg-seo0locw9h";
import imgImage1701 from "figma:asset/bdb34d0de30b9277b752a94165164efe2a250aca.png";
import { Profile, fetchProfile, Project, fetchProjects, HeroCard } from '../utils/api';
import { BookModal } from './BookModal';
import { PlaygroundCTA } from './PlaygroundCTA';

const DEFAULT_PROFILE: Profile = {
  id: 'default',
  tagline1: "Product Designer & Builder",
  heroGreeting: "Hey, I'm ",
  heroName: "Faith",
  bodyText: "A product designer focused on digital experiences and AI tools.",
  ctaText: "Message me",
  heroFontSize: 96,
  bodyFontSize: 20,
  status: "Available",
  statusMessage: "I'm currently available for new projects",
  availability: true,
  email: "faithawokunle1@gmail.com",
  heroCards: [],
  heroImage: ''
};

function ChevronLeft() {
  return (
    <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[19.6px] top-1/2">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.6 19.6">
        <g>
          <path d={svgPaths.p8233a00} fill="#505050" />
        </g>
      </svg>
    </div>
  );
}

function ChevronButton() {
  return (
    <div className="relative rounded-[70px] shrink-0 size-[28px]">
      <div className="overflow-clip relative rounded-[inherit] size-full">
        <ChevronLeft />
      </div>
      <div aria-hidden="true" className="absolute border-[0.7px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[70px]" />
    </div>
  );
}

function PaginationControls({ currentIndex, total, onPrev, onNext }: { currentIndex: number; total: number; onPrev: () => void; onNext: () => void }) {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
      <button onClick={onPrev} disabled={total === 0}>
        <ChevronButton />
      </button>
      <div className="flex flex-col font-['Glory',sans-serif] font-normal justify-center leading-[0] relative shrink-0 lg:text-[24px] text-[18px] text-black whitespace-nowrap">
        <p className="leading-[normal]">{total > 0 ? `${currentIndex + 1}/${total}` : '0/0'}</p>
      </div>
      <button onClick={onNext} disabled={total === 0}>
        <div className="flex items-center justify-center relative shrink-0">
          <div className="-scale-y-100 flex-none rotate-180">
            <ChevronButton />
          </div>
        </div>
      </button>
    </div>
  );
}

// Returns white or black text depending on background luminance
function getContrastText(bgColor: string): string {
  const hex = bgColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  // Relative luminance formula
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
}

function BookCard({ project, onClick }: { project: Project; onClick: () => void }) {
  const color = project.coverColor || '#F9D27D';
  const textColor = project.textColor || getContrastText(color);
  
  return (
    <>
      {/* Desktop version - Figma exact size */}
      <div
        onClick={onClick}
        className="hidden lg:block h-[212px] overflow-clip relative rounded-br-[24px] rounded-tr-[24px] shrink-0 w-[165px] cursor-pointer hover:scale-105 transition-transform"
        style={{ backgroundColor: color }}
      >
        <div className="absolute h-[180px] left-0 top-[56px] w-[165px]">
          <div className="absolute inset-[-0.28%_0_0_0]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 165 180.5">
              <g>
                <line stroke="#6C6C6C" strokeOpacity="0.18" strokeWidth="0.5" x2="165" y1="0.25" y2="0.25" />
                <line stroke="#6C6C6C" strokeOpacity="0.18" strokeWidth="0.5" x2="165" y1="20.25" y2="20.25" />
                <line stroke="#6C6C6C" strokeOpacity="0.18" strokeWidth="0.5" x2="165" y1="40.25" y2="40.25" />
                <line stroke="#6C6C6C" strokeOpacity="0.18" strokeWidth="0.5" x2="165" y1="60.25" y2="60.25" />
                <line stroke="#6C6C6C" strokeOpacity="0.18" strokeWidth="0.5" x2="165" y1="80.25" y2="80.25" />
                <line stroke="#6C6C6C" strokeOpacity="0.18" strokeWidth="0.5" x2="165" y1="100.25" y2="100.25" />
                <line stroke="#6C6C6C" strokeOpacity="0.18" strokeWidth="0.5" x2="165" y1="120.25" y2="120.25" />
                <line stroke="#6C6C6C" strokeOpacity="0.18" strokeWidth="0.5" x2="165" y1="140.25" y2="140.25" />
                <line stroke="#6C6C6C" strokeOpacity="0.18" strokeWidth="0.5" x2="165" y1="160.25" y2="160.25" />
                <line stroke="#6C6C6C" strokeOpacity="0.18" strokeWidth="0.5" x2="165" y1="180.25" y2="180.25" />
              </g>
            </svg>
          </div>
        </div>
        <div className="absolute flex h-[165px] items-center justify-center left-[-7px] top-[56px] w-[180px]">
          <div className="flex-none rotate-90">
            <div className="h-[180px] relative w-[165px]">
              <div className="absolute inset-[-0.28%_0_0_0]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 165 180.5">
                  <g opacity="0.44">
                    <line stroke="#6C6C6C" strokeOpacity="0.18" strokeWidth="0.5" x2="165" y1="0.25" y2="0.25" />
                    <line stroke="#6C6C6C" strokeOpacity="0.18" strokeWidth="0.5" x2="165" y1="20.25" y2="20.25" />
                    <line stroke="#6C6C6C" strokeOpacity="0.18" strokeWidth="0.5" x2="165" y1="40.25" y2="40.25" />
                    <line stroke="#6C6C6C" strokeOpacity="0.18" strokeWidth="0.5" x2="165" y1="60.25" y2="60.25" />
                    <line stroke="#6C6C6C" strokeOpacity="0.18" strokeWidth="0.5" x2="165" y1="80.25" y2="80.25" />
                    <line stroke="#6C6C6C" strokeOpacity="0.18" strokeWidth="0.5" x2="165" y1="100.25" y2="100.25" />
                    <line stroke="#6C6C6C" strokeOpacity="0.18" strokeWidth="0.5" x2="165" y1="120.25" y2="120.25" />
                    <line stroke="#6C6C6C" strokeOpacity="0.18" strokeWidth="0.5" x2="165" y1="140.25" y2="140.25" />
                    <line stroke="#6C6C6C" strokeOpacity="0.18" strokeWidth="0.5" x2="165" y1="160.25" y2="160.25" />
                    <line stroke="#6C6C6C" strokeOpacity="0.18" strokeWidth="0.5" x2="165" y1="180.25" y2="180.25" />
                  </g>
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute content-stretch flex flex-col font-['Gloria_Hallelujah',sans-serif] items-start leading-[0] left-[13px] not-italic top-[148px] w-[120px]">
          <div className="flex flex-col justify-center relative shrink-0 text-[16px] w-full" style={{ color: textColor }}>
            <p className="leading-[normal] whitespace-pre-wrap">{project.title}</p>
          </div>
          <div className="flex flex-col justify-center relative shrink-0 text-[13px] w-full" style={{ color: textColor, opacity: 0.7 }}>
            <p className="leading-[normal] whitespace-pre-wrap">{project.year}</p>
          </div>
        </div>
        <div className="absolute left-[13px] size-[16px] top-[13px]">
          {project.logo ? (
            <img alt="" className="absolute inset-0 max-w-none object-contain pointer-events-none size-full" src={project.logo} />
          ) : (
            <div className="w-full h-full bg-black/10 rounded-sm" />
          )}
        </div>
        <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_2px_-1px_4px_0px_rgba(255,255,255,0.25)]" />
      </div>

      {/* Mobile version - original size */}
      <div 
        onClick={onClick}
        className="lg:hidden aspect-[165/212] overflow-clip relative rounded-br-[24px] rounded-tr-[24px] w-full cursor-pointer"
        style={{ backgroundColor: color }}
      >
        <div className="absolute h-[180px] left-0 top-[56px] w-full">
          <div className="absolute inset-[-0.28%_0_0_0]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 165 180.5">
              <g>
                <line stroke="#6C6C6C" strokeOpacity="0.18" strokeWidth="0.5" x2="165" y1="0.25" y2="0.25" />
                <line stroke="#6C6C6C" strokeOpacity="0.18" strokeWidth="0.5" x2="165" y1="20.25" y2="20.25" />
                <line stroke="#6C6C6C" strokeOpacity="0.18" strokeWidth="0.5" x2="165" y1="40.25" y2="40.25" />
                <line stroke="#6C6C6C" strokeOpacity="0.18" strokeWidth="0.5" x2="165" y1="60.25" y2="60.25" />
                <line stroke="#6C6C6C" strokeOpacity="0.18" strokeWidth="0.5" x2="165" y1="80.25" y2="80.25" />
                <line stroke="#6C6C6C" strokeOpacity="0.18" strokeWidth="0.5" x2="165" y1="100.25" y2="100.25" />
                <line stroke="#6C6C6C" strokeOpacity="0.18" strokeWidth="0.5" x2="165" y1="120.25" y2="120.25" />
                <line stroke="#6C6C6C" strokeOpacity="0.18" strokeWidth="0.5" x2="165" y1="140.25" y2="140.25" />
                <line stroke="#6C6C6C" strokeOpacity="0.18" strokeWidth="0.5" x2="165" y1="160.25" y2="160.25" />
                <line stroke="#6C6C6C" strokeOpacity="0.18" strokeWidth="0.5" x2="165" y1="180.25" y2="180.25" />
              </g>
            </svg>
          </div>
        </div>
        <div className="absolute flex h-[165px] items-center justify-center left-[-7px] top-[56px] w-[180px]">
          <div className="flex-none rotate-90">
            <div className="h-[180px] relative w-[165px]">
              <div className="absolute inset-[-0.28%_0_0_0]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 165 180.5">
                  <g opacity="0.44">
                    <line stroke="#6C6C6C" strokeOpacity="0.18" strokeWidth="0.5" x2="165" y1="0.25" y2="0.25" />
                    <line stroke="#6C6C6C" strokeOpacity="0.18" strokeWidth="0.5" x2="165" y1="20.25" y2="20.25" />
                    <line stroke="#6C6C6C" strokeOpacity="0.18" strokeWidth="0.5" x2="165" y1="40.25" y2="40.25" />
                    <line stroke="#6C6C6C" strokeOpacity="0.18" strokeWidth="0.5" x2="165" y1="60.25" y2="60.25" />
                    <line stroke="#6C6C6C" strokeOpacity="0.18" strokeWidth="0.5" x2="165" y1="80.25" y2="80.25" />
                    <line stroke="#6C6C6C" strokeOpacity="0.18" strokeWidth="0.5" x2="165" y1="100.25" y2="100.25" />
                    <line stroke="#6C6C6C" strokeOpacity="0.18" strokeWidth="0.5" x2="165" y1="120.25" y2="120.25" />
                    <line stroke="#6C6C6C" strokeOpacity="0.18" strokeWidth="0.5" x2="165" y1="140.25" y2="140.25" />
                    <line stroke="#6C6C6C" strokeOpacity="0.18" strokeWidth="0.5" x2="165" y1="160.25" y2="160.25" />
                    <line stroke="#6C6C6C" strokeOpacity="0.18" strokeWidth="0.5" x2="165" y1="180.25" y2="180.25" />
                  </g>
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute content-stretch flex flex-col font-['Gloria_Hallelujah',sans-serif] items-start leading-[0] left-[8%] not-italic bottom-[14%] right-[8%]">
          <div className="flex flex-col justify-center relative shrink-0 text-[min(4vw,16px)]" style={{ color: textColor }}>
            <p className="leading-[1.2] break-words">{project.title}</p>
          </div>
          <div className="flex flex-col justify-center relative shrink-0 text-[min(3.2vw,13px)] mt-[2px]" style={{ color: textColor, opacity: 0.7 }}>
            <p className="leading-[normal] whitespace-pre-wrap">{project.year}</p>
          </div>
        </div>
        <div className="absolute left-[8%] w-[7.3%] aspect-square top-[6%]">
          {project.logo ? (
            <img alt="" className="absolute inset-0 max-w-none object-contain pointer-events-none size-full" src={project.logo} />
          ) : (
            <div className="w-full h-full bg-black/10 rounded-sm" />
          )}
        </div>
        <div className="absolute inset-0 pointer-events-none rounded-[inherit] shadow-[inset_2px_-1px_4px_0px_rgba(255,255,255,0.25)]" />
      </div>
    </>
  );
}

// Pen writing animation component
function AnimatedText({ text, delay = 0 }: { text: string; delay?: number }) {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    // Wait for delay before starting
    if (!started) {
      const startTimeout = setTimeout(() => {
        setStarted(true);
      }, delay);
      return () => clearTimeout(startTimeout);
    }
  }, [delay, started]);

  useEffect(() => {
    if (started && currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 50); // 50ms per character for smooth writing effect
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, started]);

  return (
    <span>
      {displayedText}
      {started && currentIndex < text.length && (
        <span className="inline-block w-0.5 h-5 bg-black ml-0.5 animate-pulse" />
      )}
    </span>
  );
}

export function HeroNew() {
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE);
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchProfile().catch(() => DEFAULT_PROFILE),
      fetchProjects().catch(() => [])
    ]).then(([profileData, projectsData]) => {
      if (profileData) setProfile(profileData);
      if (projectsData) setProjects(projectsData);
      setLoading(false);
    });
  }, []);

  const handleNext = () => {
    const totalItems = (profile.heroCards && profile.heroCards.length > 0) ? profile.heroCards.length : Math.max(projects.length, 1);
    setCurrentIndex((prev) => (prev + 1) % totalItems);
  };

  const handlePrev = () => {
    const totalItems = (profile.heroCards && profile.heroCards.length > 0) ? profile.heroCards.length : Math.max(projects.length, 1);
    setCurrentIndex((prev) => (prev - 1 + totalItems) % totalItems);
  };

  if (loading) return null;

  // Get 4 books for desktop
  const visibleProjects = projects.slice(0, 4);
  
  // Determine the total count for pagination
  const totalContentCount = (profile.heroCards && profile.heroCards.length > 0) ? profile.heroCards.length : projects.length;

  return (
    <>
      {/* Desktop Layout */}
      <div className="hidden lg:block relative h-screen w-screen overflow-hidden bg-[#efefef]">
        {/* Background with photo */}
        <div className="-translate-x-1/2 absolute left-[54.17%] top-[8.5%]">
          <div className="-translate-x-1/2 absolute h-[1507px] left-[54.17%] top-[4px] w-[53.75vw] max-w-[774px]">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <img alt="" className="absolute h-full w-full object-cover" src={profile.heroImage || imgImage1701} />
            </div>
          </div>
        </div>

        {/* Stacked cards behind (depth effect) */}
        <div className="-translate-x-1/2 -translate-y-1/2 absolute bg-white border border-[rgba(0,0,0,0.1)] border-solid left-[calc(50%+0.5px)] overflow-clip p-[24px] rounded-[24px] top-[calc(50%+17vh)] w-[min(473px,33vw)] pointer-events-none" />
        <div className="-translate-x-1/2 -translate-y-1/2 absolute bg-white border border-[rgba(0,0,0,0.1)] border-solid left-1/2 overflow-clip p-[24px] rounded-[24px] top-[calc(50%+15.3vh)] w-[min(488px,33.9vw)] pointer-events-none" />

        {/* Center card with intro text */}
        <div className="-translate-x-1/2 -translate-y-1/2 absolute bg-white border border-[rgba(0,0,0,0.1)] border-solid left-1/2 rounded-[24px] top-[calc(50%+8.9vh)] w-[min(500px,34.7vw)]">
          <div className="content-stretch flex flex-col gap-[48px] items-start overflow-clip p-[24px] relative rounded-[inherit] w-full">
            {/* Check if heroCards exist and have content */}
            {profile.heroCards && profile.heroCards.length > 0 ? (
              // Render dynamic hero cards
              profile.heroCards.map((card, index) => (
                <div key={card.id} className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full">
                  {index === 0 && (
                    <div className="flex justify-end w-full">
                      <PaginationControls 
                        currentIndex={currentIndex} 
                        total={totalContentCount} 
                        onPrev={handlePrev} 
                        onNext={handleNext} 
                      />
                    </div>
                  )}
                  <div className="flex flex-col font-['Gloria_Hallelujah',sans-serif] justify-center leading-[0] min-w-full not-italic relative shrink-0 text-[20px] text-black w-[min-content]">
                    <p className="leading-[1.4] whitespace-pre-wrap">
                      <AnimatedText text={card.text} delay={index * 100} />
                    </p>
                  </div>
                  {card.ctaText && card.ctaLink && (
                    <a 
                      href={card.ctaLink}
                      className="bg-[#272727] content-stretch flex items-center justify-center px-[20px] py-[8px] relative rounded-[500px] shrink-0 cursor-pointer hover:bg-[#1a1a1a] transition-colors"
                    >
                      <div className="flex flex-col font-['Gloria_Hallelujah',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-white whitespace-nowrap">
                        <p className="leading-[normal]">{card.ctaText}</p>
                      </div>
                    </a>
                  )}
                </div>
              ))
            ) : (
              // Fallback to old single card format
              <>
                <div className="content-stretch flex flex-col gap-[16px] items-end relative shrink-0 w-full">
                  <PaginationControls 
                    currentIndex={currentIndex} 
                    total={totalContentCount} 
                    onPrev={handlePrev} 
                    onNext={handleNext} 
                  />
                  <div className="flex flex-col font-['Gloria_Hallelujah',sans-serif] justify-center leading-[0] min-w-full not-italic relative shrink-0 text-[24px] text-black w-[min-content]">
                    <p className="leading-[normal] whitespace-pre-wrap">
                      <AnimatedText text={`${profile.heroGreeting}${profile.heroName}, ${profile.bodyText}`} />
                    </p>
                  </div>
                </div>
                <div className="bg-[#272727] content-stretch flex items-center justify-center px-[20px] py-[8px] relative rounded-[500px] shrink-0 cursor-pointer hover:bg-[#1a1a1a] transition-colors">
                  <div className="flex flex-col font-['Gloria_Hallelujah',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-white whitespace-nowrap">
                    <p className="leading-[normal]">{profile.ctaText || 'Message me'}</p>
                  </div>
                </div>
              </>
            )}
          </div>
          <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[24px]" />
        </div>

        {/* Left side - Recent works with books */}
        <div className="absolute content-stretch flex flex-col items-start left-[14%] top-[16.6%] w-[166.537px] lg:scale-[0.85] lg:origin-top-left xl:scale-100">
          <div className="content-stretch flex flex-col gap-[12px] items-center relative shrink-0 w-full">
            <div className="flex flex-col font-['Gloria_Hallelujah',sans-serif] justify-center leading-[0] min-w-full not-italic relative shrink-0 text-[18px] text-black w-[min-content]">
              <p className="leading-[normal] whitespace-pre-wrap">Recent works</p>
            </div>
            <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0">
              {visibleProjects.slice(0, 2).map((project) => (
                <BookCard key={project.id} project={project} onClick={() => setSelectedProject(project)} />
              ))}
            </div>
          </div>
        </div>

        {/* Right side - Recent works with books */}
        <div className="absolute content-stretch flex flex-col items-start right-[14%] top-[16.6%] w-[166.537px] lg:scale-[0.85] lg:origin-top-right xl:scale-100">
          <div className="content-stretch flex flex-col gap-[12px] items-center relative shrink-0 w-full">
            <div className="flex flex-col font-['Gloria_Hallelujah',sans-serif] justify-center leading-[0] min-w-full not-italic relative shrink-0 text-[18px] text-black w-[min-content]">
              <p className="leading-[normal] whitespace-pre-wrap">Recent works</p>
            </div>
            <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0">
              {visibleProjects.slice(2, 4).map((project) => (
                <BookCard key={project.id} project={project} onClick={() => setSelectedProject(project)} />
              ))}
            </div>
          </div>
        </div>

        {/* Top navigation */}
        <div className="absolute flex items-center justify-between left-[14%] right-[14%] top-[47px]">
          {/* Left - Domain */}
          <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid items-[start] justify-items-[start] leading-[0] shrink-0">
            <div className="bg-[#e2e2e2] col-1 content-stretch flex items-center justify-center ml-px mt-[7px] px-[24px] py-[10px] rounded-[50px] row-1" />
            <div className="bg-white col-1 content-stretch flex items-center justify-center ml-0 mt-0 px-[24px] py-[10px] rounded-[50px] row-1">
              <div className="flex flex-col font-['Give_You_Glory',sans-serif] justify-center leading-[0] not-italic text-[16px] text-black whitespace-nowrap">
                <p className="leading-[normal]">FaithAwokunle.com</p>
              </div>
            </div>
          </div>

          {/* Right - Buttons */}
          <div className="flex gap-[16px] items-center shrink-0">
            {/* My playground */}
            <a href="/playground" className="grid-cols-[max-content] grid-rows-[max-content] inline-grid items-[start] justify-items-[start] leading-[0] shrink-0">
              <div className="bg-[#dedede] col-1 h-[48px] ml-0 mt-[6px] rounded-[500px] row-1 w-[153px]" />
              <div className="bg-white col-1 content-stretch flex items-center justify-center ml-[5px] mt-0 px-[20px] py-[8px] rounded-[500px] row-1 cursor-pointer hover:bg-gray-50 transition-colors whitespace-nowrap">
                <div className="flex flex-col font-['Gloria_Hallelujah',sans-serif] justify-center leading-[0] not-italic text-[#4b4a4a] text-[16px]">
                  <p className="leading-[normal]">My playground</p>
                </div>
              </div>
            </a>

            {/* Let's work */}
            <a href="/contact" className="grid-cols-[max-content] grid-rows-[max-content] inline-grid items-[start] justify-items-[start] leading-[0] shrink-0">
              <div className="bg-[#8e8e8e] col-1 h-[48px] ml-0 mt-[6px] rounded-[500px] row-1 w-[127px]" />
              <div className="bg-[#272727] col-1 content-stretch flex items-center justify-center ml-[7px] mt-0 px-[20px] py-[8px] rounded-[500px] row-1 cursor-pointer hover:bg-[#1a1a1a] transition-colors whitespace-nowrap">
                <div className="flex flex-col font-['Gloria_Hallelujah',sans-serif] justify-center leading-[0] not-italic text-[16px] text-white">
                  <p className="leading-[normal]">Let's work</p>
                </div>
              </div>
            </a>
          </div>
        </div>

        {/* Bottom social links */}
        <div className="-translate-x-1/2 absolute content-stretch flex gap-[50px] items-center leading-[0] left-1/2 bottom-[10.6%]">
          {profile.socialLinks && profile.socialLinks.length > 0 ? (
            profile.socialLinks.map((social) => (
              <div key={social.id} className="grid-cols-[max-content] grid-rows-[max-content] inline-grid items-[start] justify-items-[start]">
                <div className="col-1 h-[48px] ml-px mt-[11px] rounded-[500px] row-1 px-[20px] py-[8px]" style={{ backgroundColor: '#8e8e8e', width: 'auto' }} />
                <a
                  href={
                    social.url?.startsWith('http')
                    ? social.url
                    : social.url
                  ? `https://${social.url}`
                    : '#'
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="col-1 content-stretch flex items-center justify-center ml-0 mt-0 px-[20px] py-[8px] rounded-[500px] row-1 cursor-pointer transition-opacity hover:opacity-80"
                  style={{ backgroundColor: social.bgColor }}
                >
                  <div className="flex flex-col font-['Gloria_Hallelujah',sans-serif] justify-center leading-[0] not-italic text-[16px] whitespace-nowrap" style={{ color: social.textColor }}>
                    <p className="leading-[normal]">{social.label}</p>
                  </div>
                </a>
              </div>
            ))
          ) : (
            <>
              {/* X */}
              <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid items-[start] justify-items-[start]">
                <div className="bg-[#8e8e8e] col-1 h-[48px] ml-px mt-[11px] rounded-[500px] row-1 w-[70px]" />
                <div className="bg-[#201d14] col-1 content-stretch flex items-center justify-center ml-0 mt-0 px-[20px] py-[8px] rounded-[500px] row-1 w-[71px] cursor-pointer hover:bg-[#000] transition-colors">
                  <div className="flex flex-col font-['Gloria_Hallelujah',sans-serif] justify-center leading-[0] not-italic text-[16px] text-white whitespace-nowrap">
                    <p className="leading-[normal]">X</p>
                  </div>
                </div>
              </div>

              {/* LinkedIn */}
              <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid items-[start] justify-items-[start]">
                <div className="bg-[#e6e6e6] col-1 h-[48px] ml-px mt-[11px] rounded-[500px] row-1 w-[110px]" />
                <div className="bg-[#0042af] col-1 content-stretch flex items-center justify-center ml-0 mt-0 px-[20px] py-[8px] rounded-[500px] row-1 cursor-pointer hover:bg-[#003080] transition-colors">
                  <div className="flex flex-col font-['Gloria_Hallelujah',sans-serif] justify-center leading-[0] not-italic text-[16px] text-white whitespace-nowrap">
                    <p className="leading-[normal]">LinkedIn</p>
                  </div>
                </div>
              </div>

              {/* Dribbble */}
              <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid items-[start] justify-items-[start]">
                <div className="bg-[#dedede] col-1 h-[48px] ml-px mt-[11px] rounded-[500px] row-1 w-[101px]" />
                <div className="bg-[#ea4c89] col-1 content-stretch flex items-center justify-center ml-0 mt-0 px-[20px] py-[8px] rounded-[500px] row-1 cursor-pointer hover:bg-[#d63a73] transition-colors">
                  <div className="flex flex-col font-['Gloria_Hallelujah',sans-serif] justify-center leading-[0] not-italic text-[16px] text-white whitespace-nowrap">
                    <p className="leading-[normal]">Dribbble</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Mobile Layout - Cleaned up and better spacing */}
      <div className="lg:hidden min-h-screen w-full bg-[#efefef] relative overflow-x-hidden">
        {/* Mobile Header - Fixed position */}
        <div className="absolute flex items-center justify-between left-4 right-4 top-8 z-10">
          {/* Domain badge */}
          <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid items-[start] justify-items-[start] leading-[0]">
            <div className="bg-[#e2e2e2] col-1 flex items-center justify-center ml-px mt-[7px] px-5 py-2.5 rounded-[50px] row-1">
              <p className="font-['Give_You_Glory',sans-serif] text-[14px] text-black whitespace-nowrap leading-[normal]">FaithAwokunle.com</p>
            </div>
            <div className="bg-white col-1 flex items-center justify-center ml-0 mt-0 px-5 py-2.5 rounded-[50px] row-1">
              <p className="font-['Give_You_Glory',sans-serif] text-[14px] text-black whitespace-nowrap leading-[normal]">FaithAwokunle.com</p>
            </div>
          </div>

          {/* Let's work button */}
          <a href="/contact" className="grid-cols-[max-content] grid-rows-[max-content] inline-grid items-[start] justify-items-[start] leading-[0]">
            <div className="bg-[#8e8e8e] col-1 h-[42px] ml-0 mt-[5px] rounded-[500px] row-1 w-[110px]" />
            <div className="bg-[#272727] col-1 flex items-center justify-center ml-[6px] mt-0 px-5 py-2 rounded-[500px] row-1 cursor-pointer hover:bg-[#1a1a1a] transition-colors">
              <p className="font-['Gloria_Hallelujah',sans-serif] text-[14px] text-white whitespace-nowrap leading-[normal]">Let's work</p>
            </div>
          </a>
        </div>

        {/* Image Section with Photo */}
        <div className="relative w-full pt-24 pb-8">
          <div className="relative mx-auto w-full max-w-[400px] h-[600px]">
            {/* Photo */}
            <div className="absolute left-1/2 -translate-x-1/2 top-0 w-[340px] h-[580px] overflow-hidden">
              <img alt="" className="absolute h-full w-full object-cover" src={profile.heroImage || imgImage1701} />
            </div>
          </div>

          {/* Intro Card - Positioned in middle of image (not covering face) */}
          <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-[calc(100%-2rem)] max-w-[360px] bg-white rounded-[20px] shadow-lg">
            <div className="flex flex-col gap-6 p-5">
              {/* Check if heroCards exist and have content */}
              {profile.heroCards && profile.heroCards.length > 0 ? (
                // Render dynamic hero cards
                <>
                  <div className="flex justify-end w-full">
                    <PaginationControls 
                      currentIndex={currentIndex} 
                      total={totalContentCount} 
                      onPrev={handlePrev} 
                      onNext={handleNext} 
                    />
                  </div>
                  {profile.heroCards.map((card, index) => (
                    currentIndex === index && (
                      <div key={card.id} className="flex flex-col gap-4">
                        <div className="font-['Give_You_Glory',sans-serif] text-[18px] text-black w-full">
                          <p className="leading-relaxed">
                            <AnimatedText text={card.text} />
                          </p>
                        </div>
                        {card.ctaText && card.ctaLink && (
                          <a 
                            href={card.ctaLink}
                            className="bg-[#272727] flex items-center justify-center px-5 py-2 rounded-full cursor-pointer hover:bg-[#1a1a1a] transition-colors"
                          >
                            <p className="font-['Gloria_Hallelujah',sans-serif] text-[14px] text-white whitespace-nowrap leading-[normal]">
                              {card.ctaText}
                            </p>
                          </a>
                        )}
                      </div>
                    )
                  ))}
                </>
              ) : (
                // Fallback to old single card format
                <>
                  <div className="flex flex-col gap-4 items-end">
                    <PaginationControls 
                      currentIndex={currentIndex} 
                      total={totalContentCount} 
                      onPrev={handlePrev} 
                      onNext={handleNext} 
                    />
                    <div className="font-['Give_You_Glory',sans-serif] text-[18px] text-black w-full">
                      <p className="leading-relaxed">
                        <AnimatedText text={`${profile.heroGreeting}${profile.heroName}, ${profile.bodyText}`} />
                      </p>
                    </div>
                  </div>
                  <div className="bg-[#272727] flex items-center justify-center px-5 py-2 rounded-full cursor-pointer">
                    <p className="font-['Gloria_Hallelujah',sans-serif] text-[14px] text-white whitespace-nowrap leading-[normal]">
                      {profile.ctaText || 'Message me'}
                    </p>
                  </div>
                </>
              )}
            </div>
            <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[20px]" />
          </div>
        </div>

        {/* Recent Works - 2 Columns Grid */}
        <div className="px-4 pb-8 pt-4">
          <p className="font-['Gloria_Hallelujah',sans-serif] text-[20px] text-black mb-5 leading-[normal]">Recent works</p>
          <div className="grid grid-cols-2 gap-4">
            {projects.slice(0, 4).map((project) => (
              <BookCard key={project.id} project={project} onClick={() => setSelectedProject(project)} />
            ))}
          </div>
          {projects.length > 8 &&
          }
        </div>

        {/* Playground CTA */}
        <PlaygroundCTA />

        {/* Social Links at Bottom */}
        <div className="flex gap-5 items-center justify-center pb-12 pt-4">
          {profile.socialLinks && profile.socialLinks.length > 0 ? (
            profile.socialLinks.map((social) => (
              <div key={social.id} className="grid-cols-[max-content] grid-rows-[max-content] inline-grid items-[start] justify-items-[start]">
                <div className="col-1 h-[42px] ml-px mt-[9px] rounded-[500px] row-1 px-4 py-2" style={{ backgroundColor: '#8e8e8e', width: 'auto' }} />
                <a
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="col-1 flex items-center justify-center ml-0 mt-0 px-4 py-2 rounded-[500px] row-1 cursor-pointer transition-opacity hover:opacity-80"
                  style={{ backgroundColor: social.bgColor }}
                >
                  <p className="font-['Gloria_Hallelujah',sans-serif] text-[14px] whitespace-nowrap leading-[normal]" style={{ color: social.textColor }}>{social.label}</p>
                </a>
              </div>
            ))
          ) : (
            <>
              {/* X */}
              <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid items-[start] justify-items-[start]">
                <div className="bg-[#8e8e8e] col-1 h-[42px] ml-px mt-[9px] rounded-[500px] row-1 w-[60px]" />
                <div className="bg-[#201d14] col-1 flex items-center justify-center ml-0 mt-0 px-4 py-2 rounded-[500px] row-1 w-[61px] cursor-pointer">
                  <p className="font-['Gloria_Hallelujah',sans-serif] text-[14px] text-white whitespace-nowrap leading-[normal]">X</p>
                </div>
              </div>

              {/* LinkedIn */}
              <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid items-[start] justify-items-[start]">
                <div className="bg-[#e6e6e6] col-1 h-[42px] ml-px mt-[9px] rounded-[500px] row-1 w-[95px]" />
                <div className="bg-[#0042af] col-1 flex items-center justify-center ml-0 mt-0 px-4 py-2 rounded-[500px] row-1 cursor-pointer">
                  <p className="font-['Gloria_Hallelujah',sans-serif] text-[14px] text-white whitespace-nowrap leading-[normal]">LinkedIn</p>
                </div>
              </div>

              {/* Dribbble */}
              <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid items-[start] justify-items-[start]">
                <div className="bg-[#dedede] col-1 h-[42px] ml-px mt-[9px] rounded-[500px] row-1 w-[88px]" />
                <div className="bg-[#ea4c89] col-1 flex items-center justify-center ml-0 mt-0 px-4 py-2 rounded-[500px] row-1 cursor-pointer">
                  <p className="font-['Gloria_Hallelujah',sans-serif] text-[14px] text-white whitespace-nowrap leading-[normal]">Dribbble</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <BookModal
        project={selectedProject}
        isOpen={selectedProject !== null}
        onClose={() => setSelectedProject(null)}
      />
    </>
  );
}
