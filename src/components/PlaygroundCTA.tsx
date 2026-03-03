import { useEffect, useState, useRef } from 'react';
import { PlaygroundItem, fetchPlaygroundItems } from '../utils/api';
import { Link } from 'wouter';

export function PlaygroundCTA() {
  const [images, setImages] = useState<PlaygroundItem[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchPlaygroundItems()
      .then((data) => setImages(data.slice(0, 4)))
      .catch(() => setImages([]));
  }, []);

  // Auto scroll effect
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer || images.length === 0) return;

    let scrollAmount = 0;
    const scrollStep = 0.5;
    const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth;

    const interval = setInterval(() => {
      scrollAmount += scrollStep;
      if (scrollAmount >= maxScroll) {
        scrollAmount = 0;
      }
      scrollContainer.scrollLeft = scrollAmount;
    }, 30);

    return () => clearInterval(interval);
  }, [images]);

  if (images.length === 0) return null;

  return (
    <div className="px-4 pb-8">
      <p className="font-['Gloria_Hallelujah',sans-serif] text-[16px] text-black mb-4 leading-normal">
        My playground
      </p>
      
      {/* Horizontal scrolling images */}
      <div 
        ref={scrollRef}
        className="flex gap-3 overflow-x-hidden mb-4"
      >
        {images.map((img) => (
          <div 
            key={img.id} 
            className="flex-shrink-0 w-[140px] h-[140px] rounded-[16px] overflow-hidden bg-gray-200"
          >
            <img 
              src={img.image} 
              alt={img.title || ''} 
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* View playground CTA */}
      <Link href="/playground">
        <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid items-[start] justify-items-[start] leading-[0] w-full">
          <div className="bg-[#dedede] col-1 h-[44px] ml-0 mt-[6px] rounded-[500px] row-1 w-full" />
          <div className="bg-white col-1 flex items-center justify-center ml-[5px] mt-0 px-5 py-2 rounded-[500px] row-1 cursor-pointer w-full">
            <p className="font-['Gloria_Hallelujah',sans-serif] text-[14px] text-[#4b4a4a] leading-normal whitespace-nowrap">
              View playground
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
}