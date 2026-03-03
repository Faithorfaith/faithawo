import { useEffect, useState, useRef } from 'react';
import { PlaygroundItem, fetchPlaygroundItems } from '../utils/api';
import { Link } from 'wouter';

export function Playground() {
  const [items, setItems] = useState<PlaygroundItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlaygroundItems()
      .then((data) => {
        setItems(data);
        setLoading(false);
      })
      .catch(() => {
        setItems([]);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf7ed] flex items-center justify-center">
        <p className="font-['Gloria_Hallelujah',sans-serif] text-[16px] text-black">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf7ed]">
      {/* Desktop Header */}
      <div className="hidden lg:flex items-center justify-between px-[120px] py-[47px]">
        {/* Left - Domain */}
        <Link href="/">
          <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid items-[start] justify-items-[start] leading-[0] shrink-0 cursor-pointer">
            <div className="bg-[#e2e2e2] col-1 content-stretch flex items-center justify-center ml-px mt-[7px] px-[24px] py-[10px] rounded-[50px] row-1" />
            <div className="bg-white col-1 content-stretch flex items-center justify-center ml-0 mt-0 px-[24px] py-[10px] rounded-[50px] row-1">
              <div className="flex flex-col font-['Give_You_Glory',sans-serif] justify-center leading-[0] not-italic text-[12px] text-black whitespace-nowrap">
                <p className="leading-[normal]">FaithAwokunle.com</p>
              </div>
            </div>
          </div>
        </Link>

        {/* Right - Buttons */}
        <div className="flex gap-[16px] items-center shrink-0">
          {/* My playground */}
          <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid items-[start] justify-items-[start] leading-[0] shrink-0">
            <div className="bg-[#dedede] col-1 h-[48px] ml-0 mt-[6px] rounded-[500px] row-1 w-[153px]" />
            <div className="bg-white col-1 content-stretch flex items-center justify-center ml-[5px] mt-0 px-[20px] py-[8px] rounded-[500px] row-1 whitespace-nowrap">
              <div className="flex flex-col font-['Gloria_Hallelujah',sans-serif] justify-center leading-[0] not-italic text-[#4b4a4a] text-[16px]">
                <p className="leading-[normal]">My playground</p>
              </div>
            </div>
          </div>

          {/* Let's work */}
          <Link href="/contact">
            <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid items-[start] justify-items-[start] leading-[0] shrink-0">
              <div className="bg-[#8e8e8e] col-1 h-[48px] ml-0 mt-[6px] rounded-[500px] row-1 w-[127px]" />
              <div className="bg-[#272727] col-1 content-stretch flex items-center justify-center ml-[7px] mt-0 px-[20px] py-[8px] rounded-[500px] row-1 cursor-pointer hover:bg-[#1a1a1a] transition-colors whitespace-nowrap">
                <div className="flex flex-col font-['Gloria_Hallelujah',sans-serif] justify-center leading-[0] not-italic text-[16px] text-white">
                  <p className="leading-[normal]">Let's work</p>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between px-4 py-8">
        {/* Domain badge */}
        <Link href="/">
          <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid items-[start] justify-items-[start] leading-[0] cursor-pointer">
            <div className="bg-[#e2e2e2] col-1 flex items-center justify-center ml-px mt-[7px] px-5 py-2.5 rounded-[50px] row-1">
              <p className="font-['Give_You_Glory',sans-serif] text-[11px] text-black whitespace-nowrap leading-[normal]">FaithAwokunle.com</p>
            </div>
            <div className="bg-white col-1 flex items-center justify-center ml-0 mt-0 px-5 py-2.5 rounded-[50px] row-1">
              <p className="font-['Give_You_Glory',sans-serif] text-[11px] text-black whitespace-nowrap leading-[normal]">FaithAwokunle.com</p>
            </div>
          </div>
        </Link>

        {/* Let's work button */}
        <Link href="/contact">
          <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid items-[start] justify-items-[start] leading-[0]">
            <div className="bg-[#8e8e8e] col-1 h-[42px] ml-0 mt-[5px] rounded-[500px] row-1 w-[110px]" />
            <div className="bg-[#272727] col-1 flex items-center justify-center ml-[6px] mt-0 px-5 py-2 rounded-[500px] row-1 cursor-pointer">
              <p className="font-['Gloria_Hallelujah',sans-serif] text-[14px] text-white whitespace-nowrap leading-[normal]">Let's work</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Title */}
      <div className="px-4 lg:px-[120px] pb-8">
        <h1 className="font-['Gloria_Hallelujah',sans-serif] text-[24px] lg:text-[32px] text-black leading-normal">
          My playground
        </h1>
        <p className="font-['Give_You_Glory',sans-serif] text-[16px] lg:text-[18px] text-black/70 mt-2">
          A collection of experiments, designs, and creative explorations.
        </p>
      </div>

      {/* Desktop Grid - Endless scrolling both vertically and horizontally */}
      <div className="hidden lg:block px-[120px] pb-20">
        <div className="columns-5 gap-4 space-y-4">
          {items.map((item) => (
            <div 
              key={item.id} 
              className="break-inside-avoid mb-4"
            >
              <div className="relative rounded-[20px] overflow-hidden bg-white shadow-sm">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Grid - Vertical scrolling with 2 columns */}
      <div className="lg:hidden px-4 pb-12">
        <div className="columns-2 gap-3 space-y-3">
          {items.map((item) => (
            <div 
              key={item.id} 
              className="break-inside-avoid mb-3"
            >
              <div className="relative rounded-[16px] overflow-hidden bg-white shadow-sm">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}