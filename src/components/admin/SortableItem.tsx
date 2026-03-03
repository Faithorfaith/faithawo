import { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { GripVertical, Edit2, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';

interface SortableItemProps {
  id: string;
  index: number;
  item: any;
  moveItem: (dragIndex: number, hoverIndex: number) => void;
  onEdit: (item: any) => void;
  onDelete: (id: string) => void;
  renderContent: (item: any) => React.ReactNode;
}

export const SortableItem = ({ id, index, item, moveItem, onEdit, onDelete, renderContent }: SortableItemProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const [{ handlerId }, drop] = useDrop({
    accept: 'SORTABLE_ITEM',
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(draggedItem: any, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = draggedItem.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = (clientOffset as any).y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      moveItem(dragIndex, hoverIndex);
      draggedItem.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: 'SORTABLE_ITEM',
    item: () => {
      return { id, index };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0 : 1;
  drag(drop(ref));

  return (
    <motion.div
      ref={ref}
      style={{ opacity }}
      layout
      data-handler-id={handlerId}
      className="bg-[#1a1a1a] p-5 rounded-xl border border-[#333] flex justify-between items-center group hover:border-[#e2a336]/50 transition-colors mb-3 cursor-default"
    >
      <div className="flex items-center gap-4 flex-1">
        <div className="cursor-grab active:cursor-grabbing text-[#808080] hover:text-[#f5f4f0] p-2 -ml-2 rounded transition-colors">
          <GripVertical size={20} />
        </div>
        {renderContent(item)}
      </div>
      <div className="flex gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={() => onEdit(item)} className="p-2 hover:bg-[#333] rounded-lg text-[#e2a336] transition-colors">
          <Edit2 size={16} />
        </button>
        <button onClick={() => onDelete(id)} className="p-2 hover:bg-[#333] rounded-lg text-red-500 transition-colors">
          <Trash2 size={16} />
        </button>
      </div>
    </motion.div>
  );
};
