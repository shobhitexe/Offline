import Image from "next/image";

export default function Footer() {
  return (
    <div className="flex flex-col items-center justify-center mt-10 gap-10">
      <span className="text-xl">Gaming Partner</span>

      <div className="flex items-center flex-wrap justify-center gap-5">
        {Array.from({ length: 3 }).map((_, idx) => (
          <Image
            key={idx}
            src={`/images/footer/f${idx + 1}.png`}
            alt={idx.toString()}
            width={107}
            height={20}
          />
        ))}
      </div>
    </div>
  );
}
