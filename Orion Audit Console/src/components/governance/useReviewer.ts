import { useEffect, useState } from "react";

const KEY = "orion.revisor";
/** Nome de exibição do revisor — única informação pessoal guardada no navegador. */
export function useReviewer() {
  const [name, setName] = useState("");
  useEffect(() => setName(localStorage.getItem(KEY) ?? ""), []);
  const save = (n: string) => { setName(n); localStorage.setItem(KEY, n); };
  return [name, save] as const;
}
