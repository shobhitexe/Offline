export default function page() {
  return (
    <div>
      <h3 className="text-2xl font-satoshiBold">RNG Testing Methods</h3>
      <ul className="mt-5 list-disc flex flex-col gap-3">
        <li>
          {process.env.NEXT_PUBLIC_CASINO_NAME} is committed to high standards
          of customer service as our main concern is to uphold fair and open
          conduct in its gambling operations. The outcome of the Casino and Live
          Casino products, which
          {process.env.NEXT_PUBLIC_CASINO_NAME} makes available to its
          customers, is determined by a certified and audited random number
          generator, which operates at a high level of encryption and randomness
          to ensure fairness without exception and no human interference
          (“RNG”).
        </li>
        <li>
          Our RNG is administered by an external third-party supplier Curaçao
          and has gone through all the external compliance testing. This ensures
          that the games which have been integrated into our website will
          perform as expected in terms of user experience.
        </li>
        <li>
          The Return to Player (RTP) value is a theoretical calculation of the
          expected percentage of wagers that a specific game will return to
          player after a significant amount of plays (e.g. hundreds of million
          game plays). While every single game play is unpredictable and it is
          possible to win a big amount or lose your bet, the average return of a
          specific game in the long run will approach the Theoretical RTP value.
        </li>
        <li>
          By playing Casino games on our website, you acknowledge and agree that
          our RNG will determine the outcome of the games you play and that you
          will accept the outcomes of all such games. In the event of a
          discrepancy between the result that appears on your device's display
          and the game server, the result that appears on the game server will
          prevail. You further acknowledge and agree that our records will be
          conclusive in relation to any dispute arising out of your gaming
          activity on our website.
        </li>
        <li>
          We are monitoring the players' payout ratio on a regular basis and we
          cooperate with gambling regulatory authorities to ensure our
          compliance with the legislation of relevant jurisdictions.{" "}
        </li>
      </ul>
    </div>
  );
}
