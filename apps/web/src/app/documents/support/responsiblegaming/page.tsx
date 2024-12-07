export default function page() {
  return (
    <div>
      <ul className="mt-5 list-disc flex flex-col gap-3">
        <li>
          Gambling can be addictive. If You need some help to overcome such
          addiction, kindly follow this link which will redirect You to Our
          Responsible Gaming page on the Site. Please always gamble responsibly.
        </li>
        <li>
          Limits You may impose limits on Your Account. These limits are:
          <ul className="mt-2 list-inside list-decimal flex flex-col gap-2">
            <li>
              Deposit Limit You may choose to limit Your maximum losses. This
              limit will automatically block any further deposits made if the
              deposit limit set has been exceeded for that selected time frame.
            </li>
            <li>
              Session Time Limit You may choose to limit the time You spend
              enjoying Our Games. This pop up will appear, reminding You of the
              time limit You imposed on yourself and will allow you to log You
              out of Your Account or continue enjoying Our games. Kindly contact
              support to be able to set this limit. Where a session time limit
              falls on the hour, this pop up will be replaced by the Reality
              Check if you are resident outside of the United Kingdom. If You
              change Your mind, these limits can be changed by letting Us know
              via e-mail. Increasing or revoking a limit shall have effect only
              after seven (7) days; whereas decreasing a limit shall have effect
              immediately.
            </li>
          </ul>
        </li>
        <li>
          Reality Check If You are resident outside of the United Kingdom and
          only when playing on casino Games on the Site, a pop up will appear
          which will pause Your Game to remind You that you have been playing
          for one hour. This will be done every hour. This pop up will remind
          You of how much You lost and how much You won. You will then select to
          continue to enjoy Our Games or log out. This pop up might appear later
          than the automatic one hour schedule if Your Game does not allow for
          temporary suspension. This pop up will appear immediately after Your
          Game ends once You have come back to Our lobby. We will not always be
          able to apply the Session Time Limit or Reality Check on the time
          promised. For example, if You play auto spin games, live games or
          games which are not hosted on Our Site We will be unable to apply the
          Session Time Limit or Reality Check reminders until the game has
          finished or You return to Our lobby. You can deactivate the Reality
          Check at any time by opting-out on the pop up. If You would like to
          reactivate this, kindly contact support or refer to the ‘My Account’
          tab.
        </li>
      </ul>
    </div>
  );
}
