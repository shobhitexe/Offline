import fetcher from "@/lib/setup";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Skeleton,
} from "@repo/ui";
import { useState } from "react";
import useSWR from "swr";

export default function ProfileInfo({ id }: { id: string }) {
  const [isOpen, setIsOpen] = useState(false);

  const { data, isLoading } = useSWR<{
    data: {
      name: string;
      username: string;
      balance: string;
      marketCommission: string;
      sessionCommission: string;
      createdAt: string;
    };
  }>(isOpen ? `/user?id=${id}` : null, fetcher);

  return (
    <Dialog onOpenChange={(open) => setIsOpen(open)}>
      <DialogTrigger className="ui-py-1.5 ui-text-sm ui-px-2">
        Profile
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isLoading ? (
              <Skeleton className="w-full h-7" />
            ) : (
              `${data?.data.name} [${data?.data.username}]`
            )}
          </DialogTitle>
        </DialogHeader>
        <table className="text-left">
          <tbody>
            {isLoading ? (
              <Skeleton className="w-full h-5" />
            ) : (
              <tr>
                <th>Name</th>
                <td>{data?.data.name}</td>
              </tr>
            )}
            {isLoading ? (
              <Skeleton className="w-full h-5" />
            ) : (
              <tr>
                <th>Username</th>
                <td>{data?.data.username}</td>
              </tr>
            )}
            {isLoading ? (
              <Skeleton className="w-full h-5" />
            ) : (
              <tr>
                <th>Balance</th>
                <td>{data?.data.balance}</td>
              </tr>
            )}
            {isLoading ? (
              <Skeleton className="w-full h-5" />
            ) : (
              <tr>
                <th>Market Commission</th>
                <td> {data?.data.marketCommission}</td>
              </tr>
            )}
            {isLoading ? (
              <Skeleton className="w-full h-5" />
            ) : (
              <tr>
                <th>Session Commission</th>
                <td>{data?.data.sessionCommission}</td>
              </tr>
            )}
            {isLoading ? (
              <Skeleton className="w-full h-5" />
            ) : (
              <tr>
                <th>Created At</th>
                <td>{data?.data.createdAt}</td>
              </tr>
            )}
          </tbody>
        </table>
      </DialogContent>
    </Dialog>
  );
}
