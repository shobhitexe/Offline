interface DashboardHeadingProps {
  heading: string;
}

export default function DashboardHeading({
  heading,
}: DashboardHeadingProps): JSX.Element {
  return (
    <div className="sm:text-4xl xs:text-3xl text-2xl text-center font-medium">
      {heading}
    </div>
  );
}
