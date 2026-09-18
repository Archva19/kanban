export interface Subtask {
  _id: string;
  title: string;
  isCompleted: boolean;
}

export interface Task {
  _id: string;
  title: string;
  description: string;
  dueDate?:string,
  status: string;
  subTasks: Subtask[];
}

export interface Column {
  _id: string;
  title: string;
  tasks: Task[];
}

export interface Board {
  _id: string;
  title: string;
  columns: Column[];
  isGuest: boolean;
  user: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface User {
  _id: string;
  fullName: string;
  email: string;
  isGuest: boolean;
  profilePicture: string;
  boards: Board[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface RecentUser {
  email: string;
  fullName: string;
  avatar: string;
}

export interface UserMeResponse {
  message: string;
  data: User;
}

export interface CreateBoardPayload {
  title: string;
  columns?: { title: string; tasks?: Task[] }[];
}

export interface EditBoardPayload {
  title?: string;
  columns?: { _id?: string; title: string }[];
}

export interface CreateTaskPayload {
  title: string;
  description?: string;
  dueDate?:string,
  subTasks?: { title: string; isCompleted?: boolean }[];
  columnId: string;
}

export interface EditTaskPayload {
  title?: string;
  description?: string;
  dueDate?:string,
  subTasks?: { _id?: string; title: string; isCompleted?: boolean }[];
  targetedColumnId?: string;
  columnId?: string;
}
