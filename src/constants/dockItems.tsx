import { VSCode, Messages, ScreenSharing, Safari } from "@/components/computer/apps";

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
    img: "/icons/messages.webp",
    component: <Messages />,
  },
  {
    id: "safari",
    title: "Safari",
    img: "/icons/safari.png",
    component: <Safari />,
  },
  {
    id: "terminal",
    title: "Terminal",
    img: "/icons/terminal.png",
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
