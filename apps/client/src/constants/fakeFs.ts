// Finder와 터미널이 공유하는 가짜 파일시스템.
// 터미널에서 ls/cat으로 본 파일을 Finder에서도 그대로 볼 수 있는 게 포인트.

export type FsNode = {
  name: string;
  type: "dir" | "file";
  children?: FsNode[];
  content?: string;
  // 열 수 없는 파일의 안내 문구 (미리보기·cat 시 표시)
  locked?: string;
};

export const FAKE_FS: FsNode = {
  name: "~",
  type: "dir",
  children: [
    {
      name: "Desktop",
      type: "dir",
      children: [
        {
          name: "읽어주세요.txt",
          type: "file",
          content: `Heoniverse 가상 컴퓨터입니다.

문서 폴더에 프로젝트 소개가 있습니다.
터미널에서 help를 입력하면 사용할 수 있는 명령을 볼 수 있습니다.`,
        },
      ],
    },
    {
      name: "Documents",
      type: "dir",
      children: [
        {
          name: "프로젝트_소개.md",
          type: "file",
          content: `# Heoniverse

Phaser 기반 몰입형 메타버스 협업 플랫폼.

- 실시간 멀티플레이어 (Colyseus)
- 근접 화상통화 (WebRTC)
- 공유 화이트보드 (Excalidraw)
- AI NPC / AI 어시스턴트 (Gemini)

Gather에서 영감을 받아, 게임적 몰입감과
자연스러운 소통 경험을 목표로 만들었습니다.`,
        },
        {
          name: "기술_스택.md",
          type: "file",
          content: `# 기술 스택

클라이언트
- React 19 · TypeScript · Vite
- Phaser 3
- Redux Toolkit · TailwindCSS

서버
- Colyseus (실시간 상태 동기화)
- Express · PeerJS (WebRTC 시그널링)
- Gemini API (AI NPC · 어시스턴트)`,
        },
      ],
    },
    {
      name: "Downloads",
      type: "dir",
      children: [
        {
          name: "asset-pack.zip",
          type: "file",
          locked: "압축 파일은 미리보기를 지원하지 않습니다.",
        },
      ],
    },
    {
      name: "credits.md",
      type: "file",
      content: `# Credits

- 픽셀 아트: LimeZu (limezu.itch.io)
- 시작점: SkyOffice (오픈소스)
- macOS UI 참고: macos-web`,
    },
    {
      name: ".비밀폴더",
      type: "dir",
      children: [
        {
          name: "메모.txt",
          type: "file",
          content: `비밀 입니다`,
        },
      ],
    },
  ],
};

// "~/Documents" 같은 경로 문자열을 노드로 해석. 실패 시 null.
export function resolvePath(path: string): FsNode | null {
  const clean = path.replace(/^~\/?/, "").replace(/\/+$/, "");
  if (!clean) return FAKE_FS;

  let node: FsNode = FAKE_FS;
  for (const part of clean.split("/")) {
    if (part === "." || part === "") continue;
    const next = node.children?.find((c) => c.name === part);
    if (!next) return null;
    node = next;
  }
  return node;
}

// 디렉토리 목록 (숨김 파일은 showHidden일 때만 — 터미널 ls -a로 발견하는 이스터에그)
export function listDir(node: FsNode, showHidden = false): FsNode[] {
  if (node.type !== "dir") return [];
  return (node.children ?? []).filter((c) => showHidden || !c.name.startsWith("."));
}

// 상위 경로 계산용: "~/a/b" → "~/a"
export function parentPath(path: string): string {
  const parts = path.replace(/^~\/?/, "").split("/").filter(Boolean);
  parts.pop();
  return parts.length ? `~/${parts.join("/")}` : "~";
}

export function joinPath(base: string, name: string): string {
  return base === "~" ? `~/${name}` : `${base}/${name}`;
}
