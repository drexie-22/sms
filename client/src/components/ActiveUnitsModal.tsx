import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ActiveUnits from "@/pages/ActiveUnits";
import { ReactNode } from "react";

interface ActiveUnitsModalProps {
  children: ReactNode;
}

export default function ActiveUnitsModal({ children }: ActiveUnitsModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-5xl">
        <DialogHeader>
          <DialogTitle>Active Institutions</DialogTitle>
          <DialogDescription>
            List of currently active STARBOOKS institutions.
          </DialogDescription>
        </DialogHeader>
        <ActiveUnits />
      </DialogContent>
    </Dialog>
  );
}
