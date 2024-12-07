import { redirect } from "next/navigation";

export default function Page({ params }: { params: { id: string } }) {
  return redirect(`/auth/register?addedById=${params.id}`);
}
