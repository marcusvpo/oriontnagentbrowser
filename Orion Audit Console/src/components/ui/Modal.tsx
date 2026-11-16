import { useEffect, useRef, type ComponentProps } from "react";
import { Modal as DsModal } from "@/design-system/orion-audit-console---design-system-bdbb01";

/**
 * Wrapper fino sobre o Modal do Design System. O Modal original espalha `...props` depois do
 * próprio `ref`, e um `ref` indefinido injetado no ambiente de desenvolvimento sobrescreve o ref
 * interno — o <dialog> nunca abre. Aqui passamos nosso ref e controlamos showModal/close.
 */
export function Modal(props: Omit<ComponentProps<typeof DsModal>, "ref">) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (props.open && !d.open) d.showModal();
    if (!props.open && d.open) d.close();
  }, [props.open]);
  return <DsModal {...props} ref={ref} />;
}
