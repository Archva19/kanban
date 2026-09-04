"use client";

import ColumnItem from "@/components/Dashboard/ColumnItem";
import NewColumnBtn from "@/components/Dashboard/NewColumnBtn";
import TaskCard from "@/components/Dashboard/TaskCard";
import EmptyBoard from "@/components/EmptyMessages/EmptyBoard";
import { useActiveBoard } from "@/context/ActiveBoardContext";
import useDragAndDrop from "@/hooks/DragAndDrop/useDragAndDrop";
import {
    closestCenter,
  closestCorners,
  DndContext,
  DragOverlay,
  pointerWithin,
} from "@dnd-kit/core";
import {
  horizontalListSortingStrategy,
  SortableContext,
} from "@dnd-kit/sortable";

export default function Board() {
  const { activeBoard } = useActiveBoard();
  const { activeItem, sensors, handleDragStart, handleDragEnd } =
    useDragAndDrop();

  if (!activeBoard) {
    return null;
  }

  if (activeBoard.columns.length === 0) {
    return <EmptyBoard />;
  }

  function customCollisionDetection(args: any) {
  if (activeItem?.type === "Column") {
    return closestCorners(args);
  }

  const pointerCollisions = pointerWithin(args);
  if (pointerCollisions.length > 0) {
    return pointerCollisions;
  }

  return pointerCollisions;
}

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={customCollisionDetection}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="w-full h-full overflow-x-scroll">
          <div className="h-full pt-6 flex gap-6 px-6 after:content-[''] after:w-px after:shrink-0">
            <SortableContext
              items={activeBoard.columns.map((col: any) => col._id)}
              strategy={horizontalListSortingStrategy}
            >
              {activeBoard?.columns.map((column: any, index: number) => (
                <ColumnItem key={column._id} column={column} index={index} />
              ))}
            </SortableContext>

            <NewColumnBtn />
          </div>
        </div>

        <DragOverlay>
          {activeItem?.type === "Task" ? (
            <div className="shadow-[0_10px_20px_0_rgba(54,78,126,0.25)] cursor-grabbing opacity-90 scale-105">
              <TaskCard task={activeItem.data} />
            </div>
          ) : activeItem?.type === "Column" ? (
            <div className="w-70 opacity-80 cursor-grabbing">
              <ColumnItem column={activeItem.data} index={0} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </>
  );
}
