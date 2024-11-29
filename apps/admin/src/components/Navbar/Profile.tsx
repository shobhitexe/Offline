import { options } from "@/app/api/auth/[...nextauth]/options";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DropdownMenuItem,
} from "@repo/ui";
import { getServerSession } from "next-auth";

export default async function Profile() {
  const session = await getServerSession(options);

  return (
    <Dialog>
      <DialogTrigger className="ui-relative ui-flex ui-cursor-pointer ui-select-none ui-items-center ui-gap-2 ui-rounded-sm ui-px-2 ui-py-1.5 ui-text-sm ui-outline-none ui-transition-colors ui-focus:ui-bg-accent ui-focus:ui-text-accent-foreground ui-data-[disabled]:ui-pointer-events-none ui-data-[disabled]:ui-opacity-50 ui-[&_svg]:ui-pointer-events-none ui-[&_svg]:ui-size-4 ui-[&_svg]:ui-shrink-0">
        Profile
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>User: {session?.user.id}</DialogTitle>
          <DialogDescription>
            <table className="w-full border-collapse mt-5 text-black text-base">
              <tbody className="space-y-2">
                <tr className="border-b">
                  <td className="pr-4">Name:</td>
                  <td>{session?.user.name}</td>
                </tr>
                <tr className="border-b">
                  <td className="pr-4">Username:</td>
                  <td>{session?.user.username}</td>
                </tr>
              </tbody>
            </table>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
