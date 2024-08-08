import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { insertPresentSchema } from "@/db/schema";
import { z } from "zod";
import { UpdatePresentForm } from "../forms/update-form-present";
import { useOpenPresentSheetState } from "@/features/present/hooks/use-open-present";
import { Loader2 } from "lucide-react";
import { useUpdatePresent } from "../api/use-update-present";
import { useGetUserPresent } from "../api/use-get-user-present";
import { UpdatePresentFormValues } from "../forms/form-schemas";


export const UpdatePresentSheet = () => {
  const { isOpen, onClose, id } = useOpenPresentSheetState();
  const mutation = useUpdatePresent(id);

  const presentQuery = useGetUserPresent(id);

  const onSubmit = (values: UpdatePresentFormValues) => {
    mutation.mutate(values, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  const isLoading = presentQuery.isLoading;
  const isDisabled = mutation.isPending || isLoading;

  const defaultValues = presentQuery?.data
    ? { ...presentQuery.data, listId: presentQuery?.data?.list?.id }
    : { name: "", link: "", desciption: "", status: true, listId: null };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side={"bottom"} className="rounded-t-xl">
        <SheetHeader>
          <SheetTitle>Actualizar regalo: {defaultValues.name}</SheetTitle>
          <SheetDescription>
            Modifica cualquier detalle del regalo
          </SheetDescription>
        </SheetHeader>
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="size-4 animate-spin" />
          </div>
        ) : (
          <UpdatePresentForm
            onSubmit={onSubmit}
            disabled={isDisabled}
            defaultValues={defaultValues}
          />
        )}
      </SheetContent>
    </Sheet>
  );
};
