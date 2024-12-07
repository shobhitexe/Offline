export default function page() {
  return (
    <div>
      <ul className="mt-2 list-inside list-decimal flex flex-col gap-5">
        <li>Click on "Register" tab</li>
        <li>
          Accurately complete the registration form including:
          <ul className="mt-5 list-disc flex flex-col gap-3 list-inside">
            <li>Your full name</li>
            <li>Your valid e-mail address</li>
            <li>Your current country of residence</li>
            <li>Your mobile number</li>
            <li>Your date of birth</li>
            <li>Select and confirm password</li>
            <li>Clicking on “Deposit” on the Site</li>
            <li>Selecting Your payment method</li>
            <li>Completing the information required for that payment method</li>
            <li>
              Confirming that the information is accurate by clicking on
              “Deposit”.
            </li>
          </ul>
        </li>
      </ul>
      <h3 className="text-2xl font-satoshiBold mt-5">Age Verification</h3>
      <ul className="mt-5 list-disc flex flex-col gap-3">
        <li>
          Your age must be verified within 72 hours of Your first deposit on the
          Site. If Your age is not verified within this time, Your Account may
          be frozen and no further gambling will be permitted until We have
          successfully verified Your age. We may withhold any funds in Your
          Account until Your age is successfully verified. If You are found to
          be under 18, We will return any deposits and void all winnings and/or
          bonuses.
        </li>
      </ul>
    </div>
  );
}
