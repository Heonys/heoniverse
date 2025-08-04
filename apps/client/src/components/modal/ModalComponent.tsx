import { useModal } from "@/hooks";

export const ModalComponent = () => {
  const { modalState } = useModal();

  if (modalState.state !== "open") return null;

  const Component = modalState.component;
  return <Component {...(modalState.props ?? {})} />;
};
