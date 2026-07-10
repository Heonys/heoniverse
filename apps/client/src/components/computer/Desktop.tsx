import { useEffect } from "react";
import { AppWindow } from "@/common";
import { Bootstrap, Dock, Header } from "@/components/computer";
import { appsData } from "@/constants/dockItems";
import { useAppSelector } from "@/hooks";

// 앱을 처음 열 때야 요청되는 이미지 — 컴퓨터 켤 때 미리 받아둔다
const PRELOAD_IMAGES = ["/icons/apple.png", "/icons/google.png", "/icons/github.png"];

export const Desktop = () => {
  const showApps = useAppSelector((state) => state.desktop.showApps);

  useEffect(() => {
    PRELOAD_IMAGES.forEach((src) => {
      new Image().src = src;
    });
  }, []);
  return (
    <div
      id="desktop-inner"
      className="relative h-full w-full overflow-hidden rounded-2xl bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/images/background/wallpaper.jpg')" }}
    >
      <Bootstrap />
      <Header />
      {/* relative 필수 — react-rnd bounds="parent"의 기준이 되어 창을 메뉴바 아래로 한정 */}
      <div id="desktop-windows" className="relative h-[calc(100%-2rem)]">
        {appsData.map((app) => {
          if (app.component && showApps[app.id]) {
            return (
              <AppWindow
                key={app.id}
                id={app.id}
                title={app.title}
                component={app.component}
                initPosition={app.position}
              />
            );
          } else {
            return null;
          }
        })}
      </div>
      <Dock />
    </div>
  );
};
