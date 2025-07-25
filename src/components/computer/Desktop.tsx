import { AppWindow } from "@/common";
import { Bootstrap, Dock, Header } from "@/components/computer";
import { appsData } from "@/constants/dockItems";
import { useAppSelector } from "@/hooks";

export const Desktop = () => {
  const showApps = useAppSelector((state) => state.desktop.showApps);
  return (
    <div
      className="relative w-full h-full rounded-2xl overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/images/background/wallpaper.jpg')" }}
    >
      <Bootstrap />
      <Header />
      <div className="h-[calc(100%-2rem)]">
        {appsData.map((app) => {
          if (app.component && showApps[app.id]) {
            return (
              <AppWindow key={app.id} id={app.id} title={app.title} component={app.component} />
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
