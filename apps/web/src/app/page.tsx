import NavSearch from "@/components/Navbar/NavSerach";
import {
  AllGames,
  Category,
  Hero,
  // Promotions,
  ProviderSelect,
  // Providers,
  // Sports,
  // TopEvents,
} from "../components";

export default function Page(): JSX.Element {
  return (
    <main>
      <NavSearch position="home" />
      <Hero />
      {/* <Category /> */}
      <div className="md:hidden flex overflow-auto no-scrollbar mt-3 sm:px-5 px-3 w-[99%]">
        <ProviderSelect />
      </div>
      {/* <Providers /> */}
      <AllGames />
      {/* <Sports /> */}
      {/* <TopEvents /> */}
      {/* <Promotions /> */}
      <div className="sm:mt-20 mt-5" />
    </main>
  );
}
