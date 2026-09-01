"use client";

import { createContext, ReactNode, useContext, useState } from "react";

interface FormsContextType {
  newBoardVis: boolean;
  setNewBoardVis: (value: boolean) => void;
  deleteBoardVis: boolean;
  setDeleteBoardVis: (value: boolean) => void;
  deleteMessageVis: boolean;
  setDeleteMessageVis: (value: boolean) => void;
  editBoardVis: boolean;
  setEditBoardVis: (value: boolean) => void;
  autoAddColumn: boolean;
  setAutoAddColumn: (value: boolean) => void;
  newTaskVis: boolean;
  setNewTaskVis: (value: boolean) => void;
  editTaskVis: boolean;
  setEditTaskVis: (value: boolean) => void;
  activeTask: any;
  setActiveTask: (value: any) => void;
  deleteTaskVis: any;
  setDeleteTaskVis: (value: any) => void;
  deleteTaskMessageVis: any;
  setDeleteTaskMessageVis: (value: any) => void;
  taskWindowVis: any;
  setTaskWindowVis: (value: any) => void;
  taskDropDownVis: any;
  setTaskDropDownVis: (value: any) => void;
}

const FormsContext = createContext<FormsContextType | undefined>(undefined);

export default function FormsProvider({ children }: { children: ReactNode }) {
  const [newBoardVis, setNewBoardVis] = useState(false);
  const [deleteBoardVis, setDeleteBoardVis] = useState(false);
  const [deleteMessageVis, setDeleteMessageVis] = useState(false);
  const [editBoardVis, setEditBoardVis] = useState(false);
  const [autoAddColumn, setAutoAddColumn] = useState(false);
  const [newTaskVis, setNewTaskVis] = useState(false);
  const [editTaskVis, setEditTaskVis] = useState(false);
  const [activeTask, setActiveTask] = useState(null);
  const [deleteTaskVis, setDeleteTaskVis] = useState(false);
  const [deleteTaskMessageVis, setDeleteTaskMessageVis] = useState(false);
  const [taskWindowVis, setTaskWindowVis] = useState(false);
  const [taskDropDownVis, setTaskDropDownVis] = useState(false);

  return (
    <>
      <FormsContext.Provider
        value={{
          newBoardVis,
          setNewBoardVis,
          deleteBoardVis,
          setDeleteBoardVis,
          deleteMessageVis,
          setDeleteMessageVis,
          editBoardVis,
          setEditBoardVis,
          autoAddColumn,
          setAutoAddColumn,
          newTaskVis,
          setNewTaskVis,
          editTaskVis,
          setEditTaskVis,
          activeTask,
          setActiveTask,
          deleteTaskVis,
          setDeleteTaskVis,
          deleteTaskMessageVis,
          setDeleteTaskMessageVis,
          taskWindowVis, 
          setTaskWindowVis,
          taskDropDownVis,
          setTaskDropDownVis
        }}
      >
        {children}
      </FormsContext.Provider>
    </>
  );
}

export function useForms() {
  const context = useContext(FormsContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
