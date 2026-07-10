import {
  VSCode,
  Messages,
  ScreenSharing,
  Safari,
  Finder,
  Music,
  Photo,
  Terminal,
  Assistant,
} from "@/components/computer/apps";

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
    component: <Finder />,
    position: { width: 680, height: 460 },
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
    id: "assistant",
    title: "AI 어시스턴트",
    img: "/icons/assistant.svg",
    component: <Assistant />,
    position: { width: 560, height: 540 },
  },
  {
    id: "music",
    title: "Music",
    img: "/icons/music.png",
    component: <Music />,
    position: { width: 760, height: 500 },
  },
  {
    id: "photo",
    title: "Photo",
    img: "/icons/photos.png",
    component: <Photo />,
    position: { width: 720, height: 480 },
  },
  {
    id: "terminal",
    title: "Terminal",
    img: "/icons/terminal.svg",
    component: <Terminal />,
    position: { width: 620, height: 420 },
  },
  {
    id: "vscode",
    title: "VSCode",
    img: "/icons/vscode.png",
    component: <VSCode />,
  },
];
