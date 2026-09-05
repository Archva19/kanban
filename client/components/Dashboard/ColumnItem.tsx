import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import TaskCard from "./TaskCard";
import { CSS } from "@dnd-kit/utilities";
import { useDndContext, useDroppable } from "@dnd-kit/core";

interface ColumnItemProps {
  column: any;
  index: number;
}

export default function ColumnItem({ column, index }: ColumnItemProps) {
  const COLUMN_COLORS = [
    "#49C4E5",
    "#8471F2",
    "#67E2AE",
    "#FF9800",
    "#E91E63",
    "#00BCD4",
    "#9C27B0",
    "#FFC107",
    "#00E676",
    "#FF5722",
    "#3F51B5",
    "#F44336",
    "#00E5FF",
    "#AB47BC",
    "#8BC34A",
    "#FF4081",
  ];

  const { active, over } = useDndContext();

  const {
    attributes,
    listeners,
    setNodeRef: setSortableRef,
    transform,
    transition,
    isDragging,
    isOver,
  } = useSortable({
    id: column._id,
    data: { type: "Column", column },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.2 : 1,
  };

  return (
    <>
      <div
        ref={setSortableRef}
        style={style}
        key={column._id}
        className="w-70 shrink-0 flex flex-col gap-6 h-full"
      >
        <div
          className="flex gap-3 items-center cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <div
            style={{
              backgroundColor: COLUMN_COLORS[index % COLUMN_COLORS.length],
            }}
            className="rounded-full min-w-3.75 min-h-3.75"
          ></div>
          <p className="leading-3.75 w-full text-[12px] tracking-[2.4px] text-[#828FA3] wrap-break-word">
            {column.title} ({column.tasks.length})
          </p>
        </div>
        <SortableContext
          id={column._id}
          items={column.tasks.map((task: any) => task._id)}
          strategy={verticalListSortingStrategy}
        >
          <div
            className={`flex flex-col gap-5 w-full overflow-scroll h-full min-h-37.5 rounded-lg ${
              active?.data.current?.type === "Task" &&
              (isOver ||
                column.tasks.some((task: any) => task._id === over?.id))
                ? "bg-[#635FC7]/10 border-2 border-dashed border-[#635FC7]"
                : "bg-transparent border-2 border-transparent"
            }`}
          >
            {column.tasks.map((task: any) => (
              <TaskCard key={task._id} task={task} />
            ))}
          </div>
        </SortableContext>
      </div>
    </>
  );
}
