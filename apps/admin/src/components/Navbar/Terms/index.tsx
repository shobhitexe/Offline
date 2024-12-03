import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "@repo/ui";

export default function TermsCondition() {
  return (
    <Dialog>
      <DialogTrigger className="ui-py-1.5 ui-text-sm ui-px-2">
        Terms Condition
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>Terms & Condition</DialogHeader>
        <ol className="max-h-[60vh] overflow-y-scroll list-decimal space-y-4 pl-6">
          <li>If you do not accept this agreement, do not place any bet.</li>
          <li>
            Cheating bets are deleted automatically or manually. No claim
            allowed.
          </li>
          <li>
            The admin's decision is final, and no claims can be made against it.
          </li>
          <li>
            Batsman Runs (In-Play) Over/Under (back/lay) bets will stand after
            the batsman has faced one ball or is given out before the first ball
            is faced. The score counts if the batsman is not out, including if
            the innings is declared. In case of rain or match abandonment,
            settled bets will remain valid.
          </li>
          <li>
            Current/Next Innings Runs Odd/Even: Extras and penalty runs will be
            included for settlement purposes.
          </li>
          <li>
            Runs at Fall of 1st Wicket: At least one delivery must be bowled. If
            no wickets fall, bets will be void unless settlement is already
            determined.
          </li>
          <li>
            Runs at Fall of Next Wicket: The total innings runs scored by a team
            before the fall of the specified wicket determines the result of the
            market. If a team declares or reaches their target, the total will
            be the result. Bets will be void if play does not resume due to rain
            or delays, unless settled.
          </li>
          <li>Manual bets are not accepted.</li>
          <li>
            If anyone is found using two different IDs logged in from the same
            IP address, winnings on both accounts will be canceled. Members are
            not permitted to hold multiple accounts, including on associated
            sites operating on the same platform.
          </li>
          <li>
            Bets placed on unfair rates or cheating will be canceled, even after
            settling.
          </li>
          <li>Local fancy bets are based on Haar-Jeet (Win-Loss).</li>
          <li>
            Incomplete sessions will be canceled, but completed sessions will be
            settled.
          </li>
          <li>
            In case of match abandonment, cancellation, or no result, completed
            sessions will be settled.
          </li>
          <li>
            Lambi Paari:
            <ul className="list-disc pl-6">
              <li>
                In a T20 match, the full 20 overs must be bowled; if even one
                over is deducted due to rain or delay, bets will be canceled.
              </li>
              <li>
                In an ODI, the full 50 overs must be bowled; otherwise, bets
                will be canceled.
              </li>
            </ul>
          </li>
          <li>Advance Session and Lambi 1st Inning bets are valid only.</li>
          <li>
            Total Match Fours, Sixes, Runs, Wides, and Wickets: If the number of
            overs is reduced, all bets will be canceled. This rule applies to
            limited-overs matches like 20 and 50 overs games.
          </li>
          <li>
            1st Over Total Runs: Bets are offered for runs scored in the 1st
            over, including extras and penalty runs. The over must be completed
            for bets to stand unless already settled.
          </li>
          <li>
            Limited Overs Matches - Individual Batsmen Runs or Partnerships: If
            overs are reduced, markets are settled at the midpoint of the last
            quote before reduction. A new market may be formed if the match
            resumes.
          </li>
          <li>
            Test Matches - Individual Batsmen Runs/Partnerships: Bets are void
            if fewer than 50 overs are bowled unless one team wins, is
            dismissed, or declares. Partnership totals are calculated at the
            fall of the next wicket.
          </li>
          <li>
            We are not responsible for any loss due to technical issues with
            software malfunction.
          </li>
          <li>Kindly avoid using Jio internet on mobile while placing bets.</li>
        </ol>
      </DialogContent>
    </Dialog>
  );
}
