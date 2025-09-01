import { VSCode, Messages, ScreenSharing, Safari, Music, Photo } from "@/components/computer/apps";

type AppsData = {
  id: string;
  title: string;
  img: string;
  link?: string;
  component?: React.ReactNode;
  initPosition?: {
    x: number;
    y: number;
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
    initPosition: { x: 115, y: 20, width: 1244, height: 536 },
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
    component: <Music />,
  },
  {
    id: "photo",
    title: "Photo",
    img: "/icons/photos.png",
    component: <Photo />,
  },
  {
    id: "vscode",
    title: "VSCode",
    img: "/icons/vscode.png",
    component: <VSCode />,
  },
];
