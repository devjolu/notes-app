import { FC, useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import { object, string, TypeOf } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoadingButton } from "../LoadingButton";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { INote } from "../../api/types";
import { updateNoteFn } from "../../api/note-api";

type IUpdateNoteProps = {
  note: INote;
  setOpenNoteModal: (open: boolean) => void;
};

const updateNoteSchema = object({
  title: string().min(1, "Se requiere título"),
  content: string().min(1, "Se requiere contenido"),
});

export type UpdateNoteInput = TypeOf<typeof updateNoteSchema>;

const UpdateNote: FC<IUpdateNoteProps> = ({ note, setOpenNoteModal }) => {
  const methods = useForm<UpdateNoteInput>({
    resolver: zodResolver(updateNoteSchema),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  useEffect(() => {
    if (note) {
      methods.reset(note);
    }
  }, []);

  const queryClient = useQueryClient();
  const { mutate: updateNote } = useMutation({
    mutationFn: ({ noteId, note }: { noteId: number; note: UpdateNoteInput }) =>
      updateNoteFn(noteId, note),
    onSuccess(data) {
      queryClient.invalidateQueries({ queryKey: ["getNotes"] });
      setOpenNoteModal(false);
      toast("Note updated successfully", {
        type: "success",
        position: "top-right",
      });
    },
    onError(error: any) {
      setOpenNoteModal(false);
      const resMessage =
        error.response.data.message ||
        error.response.data.detail ||
        error.message ||
        error.toString();
      toast(resMessage, {
        type: "error",
        position: "top-right",
      });
    },
  });

  const onSubmitHandler: SubmitHandler<UpdateNoteInput> = async (data) => {
    updateNote({ noteId: note.id, note: data });
  };

  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl text-ct-dark-600 font-semibold">
          Actualizar Note
        </h2>
        <div
          onClick={() => setOpenNoteModal(false)}
          className="text-2xl text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg p-1.5 ml-auto inline-flex items-center cursor-pointer"
        >
          <i className="bx bx-x"></i>
        </div>
      </div>{" "}
      <form className="w-full" onSubmit={handleSubmit(onSubmitHandler)}>
        <div className="mb-2">
          <label className="block text-gray-700 text-lg mb-2" htmlFor="title">
            Titulo
          </label>
          <input
            className={twMerge(
              `appearance-none border border-gray-400 rounded w-full py-3 px-3 text-gray-700 mb-2 leading-tight focus:outline-none`,
              `${errors["title"] && "border-red-500"}`
            )}
            {...methods.register("title")}
            placeholder="Titulo..."
          />
          <p
            className={twMerge(
              `text-red-500 text-xs italic mb-2 invisible`,
              `${errors["title"] && "visible"}`
            )}
          >
            {errors["title"]?.message as string}
          </p>
        </div>
        <div className="mb-2">
          <label className="block text-gray-700 text-lg mb-2" htmlFor="title">
            Contenido
          </label>
          <textarea
            className={twMerge(
              `appearance-none border rounded w-full py-3 px-3 text-gray-700 mb-2 leading-tight focus:outline-none`,
              `${errors.content ? "border-red-500" : "border-gray-400"}`
            )}
            rows={6}
            {...register("content")}
            placeholder="Contenido..."
          />
          <p
            className={twMerge(
              `text-red-500 text-xs italic mb-2`,
              `${errors.content ? "visible" : "invisible"}`
            )}
          >
            {errors.content && errors.content.message}
          </p>
        </div>
        <LoadingButton loading={false} btnColor="bg-blue-500">
          Actualizar Nota
        </LoadingButton>
      </form>
    </section>
  );
};

export default UpdateNote;
