import { toast } from "sonner";
import { TypeOf } from "zod";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/common/components/ui/dialog";
import { trpc } from "@/utils/trpc";

import SubBabForm, { FormSchema } from "./Form";

const SubBabFormDialog: React.FC<{
  mode: "create" | "update";
  open: boolean;
  bab?: { id: string };
  subBab?: { id: string; name: string; number: number };
  setOpen: (open: boolean) => void;
}> = ({ mode, bab, subBab, open, setOpen }) => {
  const { mutateAsync: createSubBab } = trpc.admin.subBab.add.useMutation();
  const { mutateAsync: updateSubBab } = trpc.admin.subBab.update.useMutation();
  const trpcUtils = trpc.useUtils();

  const handleCreate = async (data: TypeOf<typeof FormSchema>) => {
    try {
      if (!bab?.id) throw new Error("Bab ID is missing");

      await createSubBab({
        babId: bab?.id,
        ...data,
      });
      setOpen(false);
    } catch (error) {
      toast.error("Gagal menambah bab", {
        description: "Terjadi kesalahan saat menambah bab. Silahkan coba lagi.",
      });
      console.error(error);
    }
  };

  const handleUpdate = async (data: TypeOf<typeof FormSchema>) => {
    try {
      if (!subBab?.id) throw new Error("Sub Bab ID is missing");

      await updateSubBab({
        id: subBab?.id,
        ...data,
      });
      setOpen(false);
    } catch (error) {
      toast.error("Gagal mengubah bab", {
        description: "Terjadi kesalahan saat mengubah bab. Silahkan coba lagi.",
      });
      console.error(error);
    }
  };

  const handleSubmit = async (data: TypeOf<typeof FormSchema>) => {
    if (mode === "create") {
      await handleCreate(data);
    }
    if (mode === "update") {
      await handleUpdate(data);
    }

    trpcUtils.admin.subBab.invalidate();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => setOpen(isOpen)}>
      <DialogContent className="max-w-[1000px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Tambah" : "Edit"} Sub Bab
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div>
          <SubBabForm
            defaultValues={
              subBab
                ? {
                    name: subBab?.name!,
                    number: subBab?.number!,
                  }
                : undefined
            }
            onSubmit={handleSubmit}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SubBabFormDialog;
