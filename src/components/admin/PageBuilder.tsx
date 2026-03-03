import { useRef, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { GripVertical, X, Image as ImageIcon, Type, Video, MousePointerClick, AlignLeft, AlignCenter, AlignRight, Plus } from 'lucide-react';
import { ContentBlock } from '../../utils/api';
import { MediaUpload } from './MediaUpload';

interface PageBuilderProps {
  blocks: ContentBlock[];
  onChange: (blocks: ContentBlock[]) => void;
}

const BlockTypeButton = ({ icon: Icon, label, onClick }: any) => (
  <button
    type="button"
    onClick={onClick}
    className="flex flex-col items-center justify-center gap-2 p-4 bg-[#1a1a1a] border border-[#333] rounded-xl hover:border-[#e2a336] hover:bg-[#242424] transition-all text-[#808080] hover:text-[#f5f4f0]"
  >
    <Icon size={24} />
    <span className="text-xs font-medium">{label}</span>
  </button>
);

const DraggableBlock = ({ block, index, moveBlock, updateBlock, removeBlock }: any) => {
  const ref = useRef<HTMLDivElement>(null);

  const [{ handlerId }, drop] = useDrop({
    accept: 'BUILDER_BLOCK',
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: any, monitor) {
      if (!ref.current) return;
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;
      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = (clientOffset as any).y - hoverBoundingRect.top;
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;
      moveBlock(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: 'BUILDER_BLOCK',
    item: () => ({ id: block.id, index }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      data-handler-id={handlerId}
      className="relative group bg-[#1a1a1a] border border-[#333] rounded-xl p-4 mb-4"
    >
      <div className="absolute left-2 top-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing text-[#444] hover:text-[#808080] p-2">
        <GripVertical size={20} />
      </div>

      <div className="pl-10 pr-10">
        <div className="flex items-center justify-between mb-3">
            <span className="text-xs uppercase tracking-wider text-[#808080] font-medium flex items-center gap-2">
                {block.type === 'text' && <Type size={14} />}
                {block.type === 'image' && <ImageIcon size={14} />}
                {block.type === 'video' && <Video size={14} />}
                {block.type === 'button' && <MousePointerClick size={14} />}
                {block.type} Block
            </span>
             {block.type === 'text' && (
                <div className="flex bg-[#0f0f0f] rounded-lg border border-[#333] p-1">
                    <button type="button" onClick={() => updateBlock(index, { style: { ...block.style, align: 'left' } })} className={`p-1 rounded hover:bg-[#333] ${block.style?.align === 'left' ? 'text-[#e2a336]' : 'text-[#808080]'}`}><AlignLeft size={14} /></button>
                    <button type="button" onClick={() => updateBlock(index, { style: { ...block.style, align: 'center' } })} className={`p-1 rounded hover:bg-[#333] ${block.style?.align === 'center' ? 'text-[#e2a336]' : 'text-[#808080]'}`}><AlignCenter size={14} /></button>
                    <button type="button" onClick={() => updateBlock(index, { style: { ...block.style, align: 'right' } })} className={`p-1 rounded hover:bg-[#333] ${block.style?.align === 'right' ? 'text-[#e2a336]' : 'text-[#808080]'}`}><AlignRight size={14} /></button>
                </div>
            )}
        </div>

        {block.type === 'text' && (
          <textarea
            value={block.content.text || ''}
            onChange={(e) => updateBlock(index, { content: { ...block.content, text: e.target.value } })}
            placeholder="Write your text content here (Markdown supported)..."
            className="w-full bg-[#0f0f0f] border border-[#333] text-[#f5f4f0] p-3 rounded-lg focus:border-[#e2a336] outline-none min-h-[100px] resize-y"
          />
        )}

        {block.type === 'image' && (
          <div className="space-y-3">
             <MediaUpload
               label="Image"
               value={block.content.src || ''}
               onChange={(url) => updateBlock(index, { content: { ...block.content, src: url } })}
               accept="image/*"
             />
             <input
              type="text"
              value={block.content.caption || ''}
              onChange={(e) => updateBlock(index, { content: { ...block.content, caption: e.target.value } })}
              placeholder="Caption (optional)"
              className="w-full bg-[#0f0f0f] border border-[#333] text-[#f5f4f0] px-3 py-2 rounded-lg focus:border-[#e2a336] outline-none text-sm"
            />
          </div>
        )}

        {block.type === 'video' && (
          <div className="space-y-3">
             <MediaUpload
               label="Video"
               value={block.content.src || ''}
               onChange={(url) => updateBlock(index, { content: { ...block.content, src: url } })}
               accept="video/*"
             />
             <input
              type="text"
              value={block.content.caption || ''}
              onChange={(e) => updateBlock(index, { content: { ...block.content, caption: e.target.value } })}
              placeholder="Caption (optional)"
              className="w-full bg-[#0f0f0f] border border-[#333] text-[#f5f4f0] px-3 py-2 rounded-lg focus:border-[#e2a336] outline-none text-sm"
            />
          </div>
        )}

        {block.type === 'button' && (
           <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              value={block.content.label || ''}
              onChange={(e) => updateBlock(index, { content: { ...block.content, label: e.target.value } })}
              placeholder="Button Label"
              className="w-full bg-[#0f0f0f] border border-[#333] text-[#f5f4f0] px-3 py-2 rounded-lg focus:border-[#e2a336] outline-none text-sm"
            />
            <input
              type="text"
              value={block.content.url || ''}
              onChange={(e) => updateBlock(index, { content: { ...block.content, url: e.target.value } })}
              placeholder="Button URL"
              className="w-full bg-[#0f0f0f] border border-[#333] text-[#f5f4f0] px-3 py-2 rounded-lg focus:border-[#e2a336] outline-none text-sm"
            />
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={() => removeBlock(index)}
        className="absolute top-2 right-2 text-[#444] hover:text-red-500 p-2 transition-colors"
      >
        <X size={16} />
      </button>
    </div>
  );
};

export const PageBuilder = ({ blocks, onChange }: PageBuilderProps) => {
  const addBlock = (type: ContentBlock['type']) => {
    const newBlock: ContentBlock = {
      id: crypto.randomUUID(),
      type,
      content: { text: '', src: '', caption: '', label: '', url: '' },
      style: { align: 'left' }
    };
    onChange([...blocks, newBlock]);
  };

  const moveBlock = (dragIndex: number, hoverIndex: number) => {
    const newBlocks = [...blocks];
    const [removed] = newBlocks.splice(dragIndex, 1);
    newBlocks.splice(hoverIndex, 0, removed);
    onChange(newBlocks);
  };

  const updateBlock = (index: number, updates: Partial<ContentBlock>) => {
    const newBlocks = [...blocks];
    newBlocks[index] = { ...newBlocks[index], ...updates };
    onChange(newBlocks);
  };

  const removeBlock = (index: number) => {
    const newBlocks = blocks.filter((_, i) => i !== index);
    onChange(newBlocks);
  };

  return (
    <div className="space-y-6">
       <div className="grid grid-cols-4 gap-4">
        <BlockTypeButton icon={Type} label="Text" onClick={() => addBlock('text')} />
        <BlockTypeButton icon={ImageIcon} label="Image" onClick={() => addBlock('image')} />
        <BlockTypeButton icon={Video} label="Video" onClick={() => addBlock('video')} />
        <BlockTypeButton icon={MousePointerClick} label="Button" onClick={() => addBlock('button')} />
      </div>

      <div className="space-y-4 min-h-[200px] p-4 bg-[#0f0f0f] rounded-xl border border-[#333] border-dashed">
        {blocks.length === 0 ? (
           <div className="text-center text-[#808080] py-12 flex flex-col items-center gap-3">
               <Plus size={32} className="opacity-50" />
               <p>Click a block type above to start building your page.</p>
           </div>
        ) : (
             blocks.map((block, index) => (
                <DraggableBlock
                    key={block.id}
                    block={block}
                    index={index}
                    moveBlock={moveBlock}
                    updateBlock={updateBlock}
                    removeBlock={removeBlock}
                />
            ))
        )}
      </div>
    </div>
  );
};