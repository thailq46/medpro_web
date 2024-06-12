import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface IModalConfirmCustomProps {
  title: string;
  content?: string;
  isOpen: boolean;
  handleOke?: () => void;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function ModalConfirmCustom({
  isOpen,
  setIsOpen,
  title,
  content,
  handleOke,
}: IModalConfirmCustomProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent className="z-[99999999999]">
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{content}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Huỷ</AlertDialogCancel>
          <AlertDialogAction onClick={handleOke}>Xác nhận</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
