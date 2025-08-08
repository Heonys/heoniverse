import { CustomRoomPassword, ControlGuide, LeaveRoom, JoinedUsers } from "@/components/modal";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { show, hide } from "@/stores/modalSlice";

const modalTemplates = {
  CustomRoomPassword,
  ControlGuide,
  LeaveRoom,
  JoinedUsers,
};

type ModalTemplates = typeof modalTemplates;

export const useModal = () => {
  const dispatch = useAppDispatch();
  const modalState = useAppSelector((state) => state.modal.modal);

  const showModal = <T extends keyof ModalTemplates>(
    component: T,
    props?: Parameters<ModalTemplates[T]>[0],
  ) => {
    dispatch(
      show({
        state: "open",
        component: modalTemplates[component],
        props,
      }),
    );
  };

  const hideModal = () => {
    dispatch(hide());
  };

  return { modalState, showModal, hideModal };
};
