import { ChangeEvent } from "react";

type SetStateFunc<T> = React.Dispatch<React.SetStateAction<T>>;

export function changeHandler<T>(setFunc: SetStateFunc<T>) {
  return (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFunc((prev) => ({ ...prev, [name]: value }));
  };
}
