import { redirect } from "next/navigation";

export default function page(): JSX.Element {
  redirect("/dashboard/profile/details");
}
