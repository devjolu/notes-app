import "react-toastify/dist/ReactToastify.css";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { getNotesFn } from "./api/note-api";
import NoteModal from "./components/note.modal";
import CreateNote from "./components/notes/create.note";
import NoteItem from "./components/notes/note.component";
import NProgress from "nprogress";
import { INote } from "./api/types";

function AppContent() {
  const [openNoteModal, setOpenNoteModal] = useState(false);

  const {
    data: notes,
    isLoading,
    isFetching,
    isSuccess,
    isError,
  } = useQuery({
    queryKey: ["getNotes"],
    queryFn: () => getNotesFn(),
    staleTime: 5 * 1000,
    //select: (data) => data,
    /*onSuccess(data) {
      NProgress.done();
    },
    onError(error: any) {
      const resMessage =
        error.response.data.message ||
        error.response.data.detail ||
        error.message ||
        error.toString();

      toast(resMessage, {
        type: "error",
        position: "top-right",
      });

      NProgress.done();
    },*/
  });

  useEffect(() => {
    if (isLoading || isFetching) {
      NProgress.start();
    }

    if (isSuccess || isError) {
      NProgress.done();
    }
  }, [isLoading, isFetching, isSuccess, isError]);

  return (
    <div className="2xl:max-w-[90rem] max-w-[68rem] mx-auto">
      <div className="m-8 grid grid-cols-[repeat(auto-fill,_320px)] gap-7 grid-rows-[1fr]">
        <div className="p-4 min-h-[18rem] bg-white rounded-lg border border-gray-200 shadow-md flex flex-col items-center justify-center">
          <div
            onClick={() => setOpenNoteModal(true)}
            className="flex items-center justify-center h-20 w-20 border-2 border-dashed border-ct-blue-600 rounded-full text-ct-blue-600 text-5xl cursor-pointer"
          >
            <i className="bx bx-plus"></i>
          </div>
          <h4
            onClick={() => setOpenNoteModal(true)}
            className="text-lg font-medium text-ct-blue-600 mt-5 cursor-pointer"
          >
            Agregar Nota
          </h4>
        </div>

        {/* Note Items */}

        {notes?.map((note: INote) => (
          <NoteItem key={note.id} note={note} />
        ))}

        {/* Create Note Modal */}
        <NoteModal
          openNoteModal={openNoteModal}
          setOpenNoteModal={setOpenNoteModal}
        >
          <CreateNote setOpenNoteModal={setOpenNoteModal} />
        </NoteModal>
      </div>
    </div>
  );
}

function App() {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <AppContent />
        <ToastContainer />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </>
  );
}

export default App;
