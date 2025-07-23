import { VSCode } from "@/components/computer/apps";

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
    id: "facetime",
    title: "FaceTime",
    img: "/icons/facetime.webp",
  },
  {
    id: "message",
    title: "Message",
    img: "/icons/messages.webp",
  },
  {
    id: "safari",
    title: "Safari",
    img: "/icons/safari.png",
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
