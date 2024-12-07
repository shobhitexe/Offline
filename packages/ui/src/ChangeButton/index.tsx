import PencilIcon from "../Icons/PencilIcon";
import { LinkComponent } from "../Link";

export default function ChangeButton() {
  return (
    <LinkComponent
      href={""}
      className="ui-flex ui-items-center ui-gap-2 ui-border ui-border-white/20 ui-py-1 ui-px-2 ui-rounded-sm ui-cursor-pointer"
    >
      <PencilIcon />
      <div className="ui-text-sm">Set/Update</div>
    </LinkComponent>
  );
}
