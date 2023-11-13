import { FC } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import { object, string, TypeOf } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoadingButton } from "../LoadingButton";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNoteFn } from "../../api/note-api";
import NProgress from "nprogress";

type ICreateNoteProps = {
  setOpenNoteModal: (open: boolean) => void;
};

const createNoteSchema = object({
  title: string().min(1, "Se requiere título"),
  content: string().min(1, "Se requiere contenido"),
});

export type CreateNoteInput = TypeOf<typeof createNoteSchema>;

const CreateNote: FC<ICreateNoteProps> = ({ setOpenNoteModal }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateNoteInput>({
    resolver: zodResolver(createNoteSchema),
  });

  const queryClient = useQueryClient();

  const { mutate: createNote } = useMutation({
    mutationFn: (note: CreateNoteInput) => createNoteFn(note),
    onMutate() {
      NProgress.start();
    },
    onSuccess(data) {
      queryClient.invalidateQueries({ queryKey: ["getNotes"] });
      setOpenNoteModal(false);
      NProgress.done();
      toast("Note created successfully", {
        type: "success",
        position: "top-right",
      });
    },
    onError(error: any) {
      setOpenNoteModal(false);
      NProgress.done();
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

  const onSubmitHandler: SubmitHandler<CreateNoteInput> = async (data) => {
    createNote(data);
  };

  return (
    <section>
      <div className="flex justify-between items-center mb-3 pb-3 border-b border-gray-200">
        <h2 className="text-2xl text-ct-dark-600 font-semibold">Crear Nota</h2>
        <div
          onClick={() => setOpenNoteModal(false)}
          className="text-2xl text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg p-1.5 ml-auto inline-flex items-center cursor-pointer"
        >
          <i className="bx bx-x"></i>
        </div>
      </div>
      <form className="w-full" onSubmit={handleSubmit(onSubmitHandler)}>
        <div className="mb-2">
          <label className="block text-gray-700 text-lg mb-2" htmlFor="title">
            Titulo
          </label>
          <input
            className={twMerge(
              `appearance-none border border-gray-400 rounded w-full py-3 px-3 text-gray-700 mb-2  leading-tight focus:outline-none`,
              `${errors.title && "border-red-500"}`
            )}
            {...register("title")}
            placeholder="Titulo..."
          />
          <p
            className={twMerge(
              `text-red-500 text-xs italic mb-2 invisible`,
              `${errors.title && "visible"}`
            )}
          >
            {errors.title && errors.title.message}
          </p>
        </div>
        <div className="mb-2">
          <label className="block text-gray-700 text-lg mb-2" htmlFor="content">
            Contenido
          </label>
          <textarea
            className={twMerge(
              `appearance-none border border-gray-400 rounded w-full py-3 px-3 text-gray-700 mb-2 leading-tight focus:outline-none`,
              `${errors.content && "border-red-500"}`
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
        <LoadingButton loading={false} btnColor="bg-green-500">
          Crear Nota
        </LoadingButton>
      </form>
    </section>
  );
};

export default CreateNote;
