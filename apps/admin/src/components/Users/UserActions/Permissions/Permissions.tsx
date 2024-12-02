import fetcher from "@/lib/setup";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  FormInput,
  LoadingSpinner,
  Skeleton,
  Switch,
  useToast,
} from "@repo/ui";
import { useState } from "react";
import useSWR from "swr";
import { changePermissions } from "./changePermissionAction";

export default function Permission({ id }: { id: string }) {
  const [isOpen, setIsOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast();

  const { data, mutate } = useSWR<{
    data: boolean;
  }>(isOpen ? `/admin/user/block?id=${id}` : null, fetcher);

  async function changePermissionsClient() {
    try {
      setIsLoading(true);
      const res = await changePermissions(id, !data?.data);

      if (res) {
        toast({
          title: "Permissions updated",
          description: `Changed status to ${!data?.data === true ? "Blocked" : "Unblocked"}`,
        });
        mutate();
        return;
      }

      toast({ description: "Failed", variant: "destructive" });
    } catch (error) {
      toast({ description: "Failed", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog onOpenChange={(open) => setIsOpen(open)}>
      <DialogTrigger className="ui-py-1.5 ui-text-sm ui-px-2">
        Permission
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Permissions</DialogTitle>
        </DialogHeader>

        <div className="flex items-center gap-5">
          <div>Blocked</div>{" "}
          <Switch
            checked={data?.data}
            onCheckedChange={changePermissionsClient}
          />
          {isLoading && <LoadingSpinner />}
        </div>
      </DialogContent>
    </Dialog>
  );
}
