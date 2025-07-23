import { AppWindow } from "@/common";
import { Bootstrap, Dock, Header } from "@/components/computer";
import { appsData } from "@/constants/dockItems";
import { useAppSelector } from "@/hooks";

export const Desktop = () => {
  const showApps = useAppSelector((state) => state.desktop.showApps);

  return (
    <div
      className="relative w-full h-full rounded-2xl overflow-hidden"
      style={{
        backgroundImage: "url('/images/background/wallpaper.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Bootstrap />
      <Header />
      {appsData.map((app) => {
        if (showApps[app.id]) {
          return <AppWindow key={app.id} id={app.id} />;
        } else {
          return null;
        }
      })}
      <Dock />
    </div>
  );
};
