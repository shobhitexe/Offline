export default function page() {
  const casinoName = (
    process.env.NEXT_PUBLIC_CASINO_NAME as string
  ).toLowerCase();

  return (
    <div className="mx-5 sm:mt-28 mt-24 mb-10 bg-cardBG rounded-lg">
      {casinoName === "jackpot1x" && (
        <div className="text-main p-5 flex flex-col gap-5">
          <h1 className="text-center text-4xl font-medium">About Us</h1>
          <p className="">
            Welcome to Jackpot1x, India's premier destination for online gaming
            and color prediction lotteries! We offer an exciting lineup of
            1,000+ casino games and a unique color prediction feature that has
            become a favorite among players looking for fast-paced,
            easy-to-play, and thrilling betting options.
            <br />
            <br /> Our color prediction lottery is a simple yet high-stakes game
            where players can bet on color outcomes and win instant rewards.
            With intuitive gameplay, real-time results, and quick rounds, this
            feature is perfect for players who enjoy fast-paced excitement and
            the chance to win big in seconds. <br />
            <br /> In addition to color prediction, Jackpot1x also offers
            traditional casino games, sports exchange, and more. Instant
            deposits and withdrawals allow you to focus on what matters -
            playing and winning! With a secure platform and 24/7 support,
            Jackpot1x ensures a smooth and trustworthy gaming experience. <br />
            <br /> Join Jackpot1x today and dive into the future of online
            gaming with color prediction, a game that combines simplicity with
            the thrill of instant rewards. Your next big win is just a
            prediction away!
          </p>
        </div>
      )}
    </div>
  );
}
