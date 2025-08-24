import { VSCode, Messages, ScreenSharing, Safari, Music, Photo } from "@/components/computer/apps";

type AppsData = {
  id: string;
  title: string;
  img: string;
  link?: string;
  component?: React.ReactNode;
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
    img: "/icons/music.webp",
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
