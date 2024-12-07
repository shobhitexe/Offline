import { Input } from "@repo/ui";

export default function Search() {
  return (
    <div>
      <Input
        name="search"
        type="text"
        id="search"
        placeholder={"Search...."}
        required
      />
    </div>
  );
}
