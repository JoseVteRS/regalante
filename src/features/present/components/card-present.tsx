import {
  CircleDotDashedIcon,
  EllipsisIcon,
  EllipsisVerticalIcon,
  EyeIcon,
  FlipHorizontalIcon,
  GiftIcon,
  LinkIcon,
  ListIcon,
  PencilIcon,
  Trash,
  Trash2,
  TrashIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StatusBadge } from "@/components/common/status-badge";
import { useDeletePresent } from "../api/use-delete-present";
import { useConfirm } from "../../../../hooks/use-confirm";
import { useOpenPresentSheetState } from "../hooks/use-open-present";
import { List, Present } from "@/types/types";
import Link from "next/link";

export type PresentWithList = Present & {
  list: List;
};

interface CardPresentProps {
  present: PresentWithList;
  onEdit: () => void;
  onDelete?: () => void;
}

export const CardPresent = ({ present, onEdit }: CardPresentProps) => {
  const deletePresent = useDeletePresent(present.id);
  const [ConfirmDialog, confirm] = useConfirm(
    "Estás seguro que quieres borrar este regalo?",
    "Se borrará permanentemente este regalo"
  );

  const { onOpen } = useOpenPresentSheetState();

  const onDelete = async () => {
    const ok = await confirm();

    if (ok) {
      console.log("borrar regalo");
      deletePresent.mutate(undefined);
    }
  };

  return (
    <>
      <ConfirmDialog />
      <Card className="w-full bg-card text-card-foreground shadow-md hover:shadow-lg transition-shadow duration-300 rounded-lg overflow-hidden">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-2">
              {/* <GiftIcon className="w-5 h-5 text-primary" /> */}
              <h3 className="text-lg font-semibold">{present.name}</h3>
              <StatusBadge status={present.status || false} />
            </div>
            <div className="flex items-center space-x-2">
              <DropdownMenu>
                <DropdownMenuTrigger className="focus:outline-none">
                  <EllipsisVerticalIcon className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-popover text-popover-foreground">
                  <DropdownMenuItem
                    onClick={() => onOpen(present.id)}
                    className="flex items-center space-x-2 hover:bg-accent hover:text-accent-foreground"
                  >
                    <PencilIcon className="w-4 h-4" />
                    <span>Editar</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="flex items-center space-x-2 text-destructive hover:bg-destructive/50 hover:text-destructive-foreground"
                    onClick={onDelete}
                  >
                    <TrashIcon className="w-4 h-4" />
                    <span className="font-bold">Borrar</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
            {present.description}
          </p>

          {present.list && (
            <Link
              href={`/dashboard/lists/${present.list.id}`}
              className="text-sm text-primary hover:underline mb-2 inline-block"
            >
              {present.list.name}
            </Link>
          )}

          {present.link && (
            <Link
              href={present.link}
              target="_blank"
              rel="noreferrer noopener"
              className="flex items-center text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              <LinkIcon className="w-3 h-3 mr-1" />
              {new URL(present.link).hostname}
            </Link>
          )}
        </CardContent>
      </Card>
    </>
  );
};
