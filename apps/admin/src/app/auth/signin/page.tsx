import SignInPage from "@/components/Auth/Signin";
import Image from "next/image";

export default function Page() {
  return (
    <div
      className="flex h-screen items-center relative"
      style={{
        backgroundImage: `url("/images/auth/signin2.avif")`,
        backgroundSize: "cover",
        backgroundPosition: "left",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="h-full">
        <Image
          src={"/images/auth/signin.jpg"}
          width={640}
          height={480}
          alt="signin"
          className="h-full w-full object-cover max-sm:hidden relative z-10"
        />
      </div>

      <div className="w-full max-w-2xl mx-auto p-3">
        <div className="w-full h-full absolute bg-black/60 left-0 top-0" />
        <SignInPage />
      </div>
    </div>
  );
}
