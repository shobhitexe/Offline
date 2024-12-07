export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-10 bg-sectionBg sm:w-[90%] w-[95%] mx-auto text-sm">
      {children}
    </div>
  );
}
