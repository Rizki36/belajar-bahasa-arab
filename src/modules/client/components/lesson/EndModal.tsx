import { useRouter } from "next/router";
import { FC } from "react";

import { Button } from "@/common/components/ui/button";
import { Dialog, DialogContent } from "@/common/components/ui/dialog";

import StarIcon from "../../icons/Star";

const EndModal: FC<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  score: number;
  star: number;
}> = ({ open, score, star, onOpenChange }) => {
  const router = useRouter();
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        withCloseButton={false}
        className="border-4 border-primary !rounded-xl bg-primary w-[450px]"
      >
        <div className="flex items-center justify-center gap-x-3 mt-6 mb-2">
          <StarIcon filled={star >= 1} className="size-[60px]" />
          <StarIcon filled={star >= 2} className="size-[60px] -mt-5" />
          <StarIcon filled={star >= 3} className="size-[60px]" />
        </div>

        <div className="text-white text-center">
          <div className="text-5xl font-semibold">{score}</div>
          <div>Nilai</div>
        </div>
        <div className="flex gap-x-3">
          <Button
            variant="ghost"
            size="lg"
            className="!text-white hover:bg-transparent w-full mt-6"
            onClick={() => {
              window.location.reload();
            }}
          >
            Ulangi
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="w-full mt-6"
            onClick={() => {
              router.push("/belajar");
            }}
          >
            Kembali
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EndModal;