import { useState } from "react";
import { Rnd } from "react-rnd";
import { openApp, closeApp } from "@/stores/desktopSlice";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { ErrorBoundary } from "@/ErrorBoundary";
import { AppIcon } from "@/icons";

type Props = {
  id: string;
  title: string;
  component?: React.ReactNode;
  initPosition?: { width: number; height: number };
};

export const AppWindow = ({ id, title, component, initPosition }: Props) => {
  const parent = document.getElementById("desktop-windows");
  const parentWidth = parent?.clientWidth ?? window.innerWidth;
  const parentHeight = parent?.clientHeight ?? window.innerHeight;

  const [position, setPosition] = useState(
    initPosition
      ? {
          x: (parentWidth - initPosition.width) / 2,
          y: (parentHeight - initPosition.height) / 6,
          width: initPosition.width,
          height: initPosition.height,
        }
      : {
          x: (parentWidth - 800) / 2,
          y: (parentHeight - 480) / 6,
          width: 800,
          height: 480,
        },
  );
  const dispatch = useAppDispatch();
  const zIndexMap = useAppSelector((state) => state.desktop.zIndexMap);

  return (
    <Rnd
      id={`desktop-app-${id}`}
      bounds="parent"
      className="overflow-hidden rounded-2xl border border-gray-600 shadow-xl"
      size={{ width: position.width, height: position.height }}
      style={{ zIndex: zIndexMap[id] }}
      position={position}
      minWidth={500}
      minHeight={300}
      dragHandleClassName="draggable-area"
      onMouseDown={() => dispatch(openApp({ id, title }))}
      onDragStop={(_e, d) => {
        setPosition({ ...position, x: d.x, y: d.y });
      }}
      onResizeStop={(_e, _dir, ref, _delta, pos) => {
        setPosition({
          ...position,
          width: parseInt(ref.style.width),
          height: parseInt(ref.style.height),
          ...pos,
        });
      }}
    >
      {/* 앱 하나의 크래시가 데스크탑·게임 전체를 죽이지 않게 창 단위로 격리 */}
      <ErrorBoundary
        fallback={
          <div className="flex size-full select-none flex-col items-center justify-center gap-2 bg-[#16171d] text-center">
            <AppIcon iconName="warning-tri" size={28} className="text-[#ffb056]" />
            <div className="text-[14px] font-semibold text-white">
              {title} 앱에 문제가 발생했습니다
            </div>
            <div className="text-text-dim text-[12px]">창을 닫고 다시 열어보세요</div>
            <button
              className="bg-accent mt-2 cursor-pointer rounded-lg px-4 py-1.5 text-[12.5px] font-semibold text-white transition hover:brightness-[1.06]"
              onClick={() => dispatch(closeApp(id))}
            >
              창 닫기
            </button>
          </div>
        }
      >
        {component}
      </ErrorBoundary>
    </Rnd>
  );
};
