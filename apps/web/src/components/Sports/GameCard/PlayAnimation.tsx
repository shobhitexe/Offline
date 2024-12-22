import { parse, format } from "date-fns";

export default function PlayAnimation({
  time,
  isInPlay = false,
}: {
  time: string;
  isInPlay?: boolean;
}) {
  const parsedDate = parse(time, "dd/MM/yyyy, HH:mm:ss", new Date());

  const formattedDate = format(parsedDate, "dd MMM");

  const formattedTime = format(parsedDate, "h:mm a");

  return (
    <div className="date-height">
      <div className="date-time in-play">
        <div className="animate">
          {isInPlay ? (
            <div className="relative top-1.5 text-xxs">In Play</div>
          ) : (
            <ul className="flip-animation text-xxs">
              <li>
                <span className="in-play-light">
                  <div className="icon-holder-small">
                    <div className="sports-icon inplay-light-icon"></div>
                  </div>
                  {formattedDate}
                </span>
              </li>
              <li>
                <span className="in-play-light">
                  <div className="icon-holder-small">
                    <div className="sports-icon inplay-light-icon"></div>
                  </div>
                  {formattedTime}
                </span>
              </li>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
