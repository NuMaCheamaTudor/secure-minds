import { Button } from "@/components/ui/button";

type Props = React.ComponentProps<typeof Button>;
export default function ShinyButton({ className = "", ...props }: Props) {
  return <Button {...props} className={`shiny-button h-12 text-base px-6 ${className}`} />;
}
