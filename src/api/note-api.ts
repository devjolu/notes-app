import axios from "axios";
import { CreateNoteInput } from "../components/notes/create.note";
import { UpdateNoteInput } from "../components/notes/update.note";
import { INote } from "./types";

const delay = () => {
  return new Promise((resolve) => setTimeout(resolve, 1000));
};

const BASE_URL = "http://127.0.0.1:3002/api/v1";

export const noteApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: false,
});

noteApi.defaults.headers.common["Content-Type"] = "application/json";

export const createNoteFn = async (note: CreateNoteInput) => {
  const response = await noteApi.post<INote>("/notes", note);
  return response.data;
};

export const updateNoteFn = async (noteId: number, note: UpdateNoteInput) => {
  const response = await noteApi.put<INote>(`/notes/${noteId}`, note);
  return response.data;
};

export const deleteNoteFn = async (noteId: number) => {
  return noteApi.delete<null>(`/notes/${noteId}`);
};

export const getSingleNOteFn = async (noteId: string) => {
  const response = await noteApi.get<INote>(`notes/${noteId}`);
  return response.data;
};

export const getNotesFn = async (): Promise<INote[]> => {
  //const response = await noteApi.get("/notes");
  //return response.data;
  const response = await fetch("http://127.0.0.1:3002/api/v1/notes", {
    method: "GET",
  });
  console.log("response:", response);

  await delay();

  const notes = await response.json();
  console.log("notes:", notes);

  return notes;
};
