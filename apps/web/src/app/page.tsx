import NavSearch from "@/components/Navbar/NavSerach";
import {
  AllGames,
  Category,
  Footer,
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
      {/* <NavSearch position="home" /> */}
      <div className="pt-px" />
      <Hero />
      {/* <Category /> */}
      <div className="md:hidden flex overflow-auto no-scrollbar mt-3 sm:px-5 px-3 w-[99%]">
        <ProviderSelect position="home" />
      </div>
      {/* <Providers /> */}
      <AllGames />
      {/* <Sports /> */}
      {/* <TopEvents /> */}
      {/* <Promotions /> */}

      <Footer />

      <div className="sm:mt-40 mt-32" />
    </main>
  );
}
