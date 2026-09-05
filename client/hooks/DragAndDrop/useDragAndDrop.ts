import { useActiveBoard } from "@/context/ActiveBoardContext";
import { useUser } from "@/context/UserContext";
import {
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import axios from "axios";
import { getCookie } from "cookies-next";
import { useState } from "react";

function useDragAndDrop() {
  const { handleEditBoard } = useUser();
  const { activeBoard } = useActiveBoard();
  const [activeItem, setActiveItem] = useState<any>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  async function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    const activeData = active.data.current;

    if (activeData?.type === "Column") {
      setActiveItem({ type: "Column", data: activeData.column });
      return;
    }

    for (const column of activeBoard.columns) {
      const task = column.tasks.find((task: any) => task._id === active.id);
      if (task) {
        setActiveItem({ type: "Task", data: task });
        break;
      }
    }
  }

  async function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    let updatedColumns = activeBoard.columns.map((col: any) => ({
      ...col,
      tasks: [...col.tasks],
    }));

    const isColumn = active.data.current?.type === "Column";

    if (isColumn) {
      const oldIndex = updatedColumns.findIndex(
        (column: any) => column._id === activeId,
      );

      let newIndex;

      if (over.data.current?.type === "Column") {
        newIndex = updatedColumns.findIndex(
          (column: any) => column._id === overId,
        );
      } else {
        newIndex = updatedColumns.findIndex((column: any) =>
          column.tasks.some((task: any) => task._id === overId),
        );
      }

      if (oldIndex !== -1 && newIndex !== -1) {
        const [movedCol] = updatedColumns.splice(oldIndex, 1);
        updatedColumns.splice(newIndex, 0, movedCol);
      }
    } else {
      const sourceColumn = updatedColumns.find((column: any) =>
        column.tasks.some((task: any) => task._id === activeId),
      );

      const targetColumn = updatedColumns.find(
        (column: any) =>
          column._id === overId ||
          column.tasks.some((task: any) => task._id === overId),
      );

      if (!sourceColumn || !targetColumn) return;

      if (sourceColumn._id === targetColumn._id) {
        const oldIndex = sourceColumn.tasks.findIndex(
          (task: any) => task._id === activeId,
        );
        const newIndex = sourceColumn.tasks.findIndex(
          (task: any) => task._id === overId,
        );
        if (oldIndex !== -1 && newIndex !== -1) {
          const reorderedTasks = [...sourceColumn.tasks];
          const [movedTask] = reorderedTasks.splice(oldIndex, 1);
          reorderedTasks.splice(newIndex, 0, movedTask);
          sourceColumn.tasks = reorderedTasks;
        }
      } else {
        const movedTask = sourceColumn.tasks.find(
          (task: any) => task._id === activeId,
        );

        if (movedTask) {
          sourceColumn.tasks = sourceColumn.tasks.filter(
            (task: any) => task._id !== activeId,
          );

          const updatedTask = {
            ...movedTask,
            status: targetColumn.title,
          };

          const overIndex = targetColumn.tasks.findIndex(
            (task: any) => task._id === overId,
          );

          if (overIndex !== -1) {
            let insertIndex = overIndex;

            const overTask = targetColumn.tasks.find(
              (task: any) => task._id === overId,
            );

            const activeRect = active.rect.current.translated;
            const overRect = over.rect;

            if (activeRect && overRect) {
              if (activeRect.top - overRect.top > 40) {
                insertIndex = overIndex + 1;
              }
            }

            targetColumn.tasks.splice(insertIndex, 0, updatedTask);
          } else {
            const activeRect = active.rect.current.translated;
            let insertIndex = targetColumn.tasks.length;

            if (activeRect && targetColumn.tasks.length > 0) {
              const taskElements = Array.from(
                document.querySelectorAll(`[data-task-id]`),
              );
              for (let i = 0; i < targetColumn.tasks.length; i++) {
                const task = targetColumn.tasks[i];
                const element = document.getElementById(`task-${task._id}`);

                if (element) {
                  const rect = element.getBoundingClientRect();
                  const middleY = rect.top + rect.height / 2;
                  if (activeRect.top + activeRect.height / 2 < middleY) {
                    insertIndex = i;
                    break;
                  }
                }
              }
            }

            targetColumn.tasks.splice(insertIndex, 0, updatedTask);
          }
        }
      }
    }

    const updatedBoard = { ...activeBoard, columns: updatedColumns };
    handleEditBoard(updatedBoard);
  }


  async function handleDragEnd(event: DragEndEvent) {
    setActiveItem(null);
    if (!event.over) return;

    try {
      const token = getCookie("accesstoken");

      const res = await axios.patch(
        `http://localhost:3030/boards/${activeBoard._id}/drag`,
        { columns: activeBoard.columns },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
    } catch (error) {
      console.error("Failed to save drag layout", error);
      handleEditBoard(activeBoard);
    }
  }

  return {
    activeItem,
    sensors,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  };
}

export default useDragAndDrop;
