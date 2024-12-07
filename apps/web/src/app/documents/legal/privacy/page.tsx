export default function page() {
  return (
    <div>
      <ul className="mt-5 list-disc flex flex-col gap-3">
        <li>
          You should be aware that acceptance of the Rules includes full
          acceptance of the terms of Our Privacy Statement.
        </li>
      </ul>
      <h3 className="text-2xl font-satoshiBold my-5">Privacy</h3>
      <ul className="mt-5 list-disc flex flex-col gap-3">
        <li>
          Desijackpot is committed to protecting your personal information. This
          Privacy Policy lets you know what information we collect when you use
          our services, why we collect this information and how we use the
          collected information.
        </li>
        <li>
          Please note that this Privacy Policy will be agreed between you and
          {process.env.NEXT_PUBLIC_CASINO_NAME}. ('We', 'Us' or 'Our', as
          appropriate). This Privacy Policy is an integrated part of{" "}
          {process.env.NEXT_PUBLIC_CASINO_NAME}'s Terms and Conditions.
        </li>
        <li>
          {" "}
          We may periodically make changes to this Privacy Policy and will
          notify you of these changes by posting the modified terms on our
          platforms. We recommend that you revisit this Privacy Policy
          regularly.
        </li>
      </ul>
      <h3 className="text-2xl font-satoshiBold my-5">Information collected</h3>
      <ul className="mt-5 list-disc flex flex-col gap-3">
        <li>
          We consider information that may be used to identify an individual,
          including, but not limited to, first and last name, date of birth,
          home or other physical address, email address, phone number or other
          relevant information to be Personal Information ('Personal
          Information').{" "}
        </li>
        <li>
          You may be asked to provide Personal Information when you use our
          website, register for an account or use our services. The Personal
          Information that we collect may include information such as: contact
          information (including telephone number), shipping information,
          billing information, transaction history, website usage preferences,
          and feedback regarding the Services. This information is held by us on
          servers based in Germany and elsewhere from time to time.
        </li>
        <li>
          {" "}
          When you interact with the services, our servers keep an activity log
          unique to you that collects certain administrative and traffic
          information including: source IP address, time of access, date of
          access, web page(s) visited, language use, software crash reports and
          type of browser used. This information is essential for the provision
          and quality of our services.
        </li>
        <li>
          We do not collect Personal Information about you without your
          knowledge.
        </li>
      </ul>
      <h3 className="text-2xl font-satoshiBold my-5">
        Means of collecting and processing data
      </h3>
      <ul className="mt-5 list-disc flex flex-col gap-3">
        <li>
          We may automatically collect certain data as discussed above and
          receive Personal Information about you where you provide such
          information through the services or other communications and
          interactions on the {process.env.NEXT_PUBLIC_CASINO_NAME} site.
        </li>
        <li>
          We may also receive Personal Information from online vendors and
          service providers, and from customer lists lawfully acquired from
          third-party vendors.
        </li>
        <li>
          {" "}
          In addition, we may engage the services of third-party service
          providers to provide technical support process your online
          transactions and maintain your account. We will have access to any
          information you provide to such vendors, service providers and
          third-party e-commerce services, and we will use the Personal
          Information as set out in this Privacy Policy below. This information
          will only be disclosed to third parties outside the company in
          accordance with this Privacy Policy. We take steps to ensure that our
          arrangements with third-party service providers and online vendors
          protect your privacy.
        </li>
      </ul>
      <h3 className="text-2xl font-satoshiBold my-5">Information Usage</h3>
      <ul className="mt-5 list-disc flex flex-col gap-3">
        <li>
          We use the Personal Information we collect from you to deliver our
          Services, to provide customer support, to undertake necessary security
          and identify verification checks, to process any of your online
          transactions, to assist your participation in third-party promotions,
          meet certain business requirements and for any other purpose related
          to the operation of the Services. As such, we may share your Personal
          Information with our carefully selected partners (including any other
          parties that have data sharing arrangements with the latter).
        </li>
        <li>
          Your Personal Information may also be used by us to provide you with:
          <ul className="mt-5 list-decimal list-inside flex flex-col gap-3">
            <li>
              Promotional offers and information regarding our products and
              services.
            </li>
            <li>
              Promotional offers and information regarding the products and
              services of our partners, in order to enlarge the range of
              provided products and improve our customer service.
            </li>
          </ul>
        </li>
        <li>
          From time-to-time, we may request information from you via surveys or
          contests.
        </li>
        <li>
          Participation in these surveys or contests is completely voluntary and
          you have the choice of whether or not to disclose such information.
          Information requested may include contact information (such as name,
          correspondence address and telephone number), and demographic
          information (such as zip or postal code or age).
        </li>
        <li>
          By accepting any contest prize or winnings from us, you consent to use
          of your name for advertising and promotional purposes without
          additional compensation, except where prohibited by law. Unless you
          have elected not to receive promotional information, we may also use
          your Personal Information (including your email address and phone
          number) to provide you with information regarding our products,
          services and promotions, including other gaming products (including
          online poker, casino, betting, backgammon) and products and services
          from third parties carefully selected by us.
        </li>
      </ul>
      <h3 className="text-2xl font-satoshiBold my-5">
        Certain excluded disclosures
      </h3>
      <ul className="mt-5 list-disc flex flex-col gap-3">
        <li>
          We may disclose your Personal Information if required to do so by law,
          or if we believe in good faith that such action is necessary to:
          <ul className="mt-5 list-decimal list-inside flex flex-col gap-3">
            <li>
              Comply with any legal process served on us, any of our sites or
              the services or in circumstances where we are under a
              substantially similar legal obligation.
            </li>
            <li>Protect and defend our rights or property or </li>
            <li>
              Act to protect the personal safety of users of the services or the
              public. If, in our sole determination, you are found to have
              cheated or attempted to defraud us, the company , or any other
              user of the services in any way including but not limited to game
              manipulation or payment fraud, or if we suspect you of fraudulent
              payment, including use of stolen credit cards, or any other
              fraudulent activity (including any chargeback or other reversal of
              a payment) or prohibited transaction (including money laundering),
              we reserve the right to share this information (together with your
              identity) with other online gaming sites, banks, credit card
              companies, appropriate agencies and relevant authorities.
            </li>
            <li>
              For the purpose of research on the prevention of addiction, data
              can be made anonymous and passed on to the respective
              institutions.
            </li>
          </ul>
        </li>
      </ul>
    </div>
  );
}
