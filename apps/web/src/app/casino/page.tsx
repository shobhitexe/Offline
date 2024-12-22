import { AllGames, ProviderSelect } from "@/components";
import NavSearch from "@/components/Navbar/NavSerach";

export default function page() {
  return (
    <div className="">
      <NavSearch position="home" />
      <div className="w-[95%] mx-auto mt-2 overflow-x-auto">
        <ProviderSelect position="page" />
      </div>
      <AllGames />
    </div>
  );
}
