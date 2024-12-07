import { Login } from "@/components";

export default function page(): JSX.Element {
  return (
    <div className="sm:mt-24 mt-16 flex flex-col sm:gap-5 gap-3">
      <h1 className="capitalize text-cardBG text-center sm:text-4xl xs:text-3xl text-2xl font-semibold">
        Sign In To Your Account
      </h1>
      <div className="w-[90%] bg-strokeBG h-[2px] mx-auto" />
      <div className="bg-cardBG md:w-[40%] sm:w-[50%] xs:w-[80%] w-[95%] mx-auto sm:px-10 px-5 rounded-xl items-center md:gap-20 gap-5 md:divide-x divide-[#483B32]">
        <Login />
      </div>

      <div className="sm:mt-20 mt-5" />
    </div>
  );
}
