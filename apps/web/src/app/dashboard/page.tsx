import { getServerSession } from "next-auth";
import { options } from "../api/auth/[...nextauth]/options";

export default async function page() {
  const session = await getServerSession(options);

  console.log(session);

  return <div>page</div>;
}
