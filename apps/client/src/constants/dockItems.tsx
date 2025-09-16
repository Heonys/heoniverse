import { VSCode, Messages, ScreenSharing, Safari } from "@/components/computer/apps";

type AppsData = {
  id: string;
  title: string;
  img: string;
  link?: string;
  component?: React.ReactNode;
  position?: {
    width: number;
    height: number;
  };
};

export const appsData: AppsData[] = [
  {
    id: "finder",
    title: "Finder",
    img: "/icons/finder.png",
  },
  {
    id: "screen-sharing",
    title: "Screen Sharing",
    img: "/icons/screen-sharing.webp",
    component: <ScreenSharing />,
    position: { width: 1009, height: 562 },
  },
  {
    id: "messages",
    title: "Messages",
    img: "/icons/messages.png",
    component: <Messages />,
  },
  {
    id: "safari",
    title: "Safari",
    img: "/icons/safari.png",
    component: <Safari />,
  },
  {
    id: "music",
    title: "Music",
    img: "/icons/music.png",
  },
  {
    id: "photo",
    title: "Photo",
    img: "/icons/photos.png",
  },
  {
    id: "vscode",
    title: "VSCode",
    img: "/icons/vscode.png",
    component: <VSCode />,
  },
];
