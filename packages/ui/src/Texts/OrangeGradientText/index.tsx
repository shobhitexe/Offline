import { cn } from "../../lib/utils";

type OrangeGradientTextProps = {
  children: React.ReactNode;
  className?: string;
};

export default function OrangeGradientText({
  children,
  className,
  ...other
}: OrangeGradientTextProps) {
  return (
    <div
      {...other}
      className={cn(
        "ui-bg-orangeTextGradient ui-bg-clip-text ui-text-transparent ui-font-bold",
        className
      )}
    >
      {children}
    </div>
  );
}
