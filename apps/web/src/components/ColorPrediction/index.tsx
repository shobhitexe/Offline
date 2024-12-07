import { options } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";

export default async function ColorPrediction() {
  const session = await getServerSession(options);

  return (
    <iframe
      id="gameFrame"
      src={`${process.env.NEXT_PUBLIC_COLOR_SERVER_URL}/home?token=${session?.user.token}`}
      allowFullScreen
      className="max-w-sm mx-auto w-full max-h-[85vh] min-h-[85vh] h-full block bg-[#1c1817]"
    ></iframe>
  );
}
