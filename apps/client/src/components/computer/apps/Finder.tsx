import { useState } from "react";
import {
  IoTimeOutline,
  IoDesktopOutline,
  IoDocumentTextOutline,
  IoArrowDownCircleOutline,
  IoServerOutline,
  IoCloudOutline,
  IoGlobeOutline,
  IoAppsOutline,
  IoPricetagOutline,
  IoEllipsisHorizontalCircleOutline,
  IoChevronBack,
  IoChevronForward,
  IoListOutline,
  IoGridOutline,
  IoSearchOutline,
  IoLockClosed,
  IoShareOutline,
} from "react-icons/io5";
import { TrafficLights } from "@/components/computer";
import { AppIcon } from "@/icons";
import { useAppDispatch } from "@/hooks";
import { openApp } from "@/stores/desktopSlice";
import { resolvePath, listDir, joinPath, type FsNode } from "@/constants/fakeFs";
// 순환 import(dockItems→Finder→dockItems)지만 appsData 접근이 렌더 시점(런타임)이라 안전
import { appsData } from "@/constants/dockItems";
import { cn } from "@/utils";

// 사이드바 '응용 프로그램' 전용 뷰의 경로 센티널
const APPS_VIEW = "@applications";

type SideEntry = {
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  path?: string; // 없으면 장식(비활성)
};

const FAVORITES: SideEntry[] = [
  { label: "최근 항목", icon: IoTimeOutline },
  { label: "응용 프로그램", icon: IoAppsOutline, path: APPS_VIEW },
  { label: "데스크탑", icon: IoDesktopOutline, path: "~/Desktop" },
  { label: "문서", icon: IoDocumentTextOutline, path: "~/Documents" },
  { label: "다운로드", icon: IoArrowDownCircleOutline, path: "~/Downloads" },
];

const LOCATIONS: SideEntry[] = [
  { label: "Heoniverse HD", icon: IoServerOutline, path: "~" },
  { label: "iCloud Drive", icon: IoCloudOutline },
  { label: "네트워크", icon: IoGlobeOutline },
];

const TAGS = [
  { label: "빨간색", color: "#ff453a" },
  { label: "주황색", color: "#ff9f0a" },
  { label: "노란색", color: "#ffd60a" },
];

// macOS 폴더 아이콘 — path 순서: 뒤판(탭 포함) → 그라데이션 앞판 → 상단 하이라이트
const FolderIcon = ({ size = 36 }: { size?: number }) => (
  <svg width={size} height={size * (52 / 64)} viewBox="0 0 64 52">
    <defs>
      <linearGradient id="finder-folder-grad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#75cafc" />
        <stop offset="1" stopColor="#41a5f6" />
      </linearGradient>
    </defs>
    <path
      d="M4 10 a4 4 0 0 1 4-4 h16 a3 3 0 0 1 2.2 1 l3.6 4 H56 a4 4 0 0 1 4 4 v28 a4 4 0 0 1-4 4 H8 a4 4 0 0 1-4-4 Z"
      fill="#3390e8"
    />
    <path
      d="M4 17 a4 4 0 0 1 4-4 h48 a4 4 0 0 1 4 4 v26 a4 4 0 0 1-4 4 H8 a4 4 0 0 1-4-4 Z"
      fill="url(#finder-folder-grad)"
    />
    <path d="M4 17 a4 4 0 0 1 4-4 h48 a4 4 0 0 1 4 4 v1.5 H4 Z" fill="#ffffff" opacity="0.3" />
  </svg>
);

// 문서 아이콘 본문 잔글씨 라인 폭
const DOC_LINES = [20, 34, 29, 32, 25, 34, 28, 22];

// macOS 문서 아이콘 — path 순서: 시트 → 접힌 모서리 → 타입별 본문(잔글씨/지퍼/사진)
const FileIcon = ({
  name,
  locked,
  size = 34,
}: {
  name: string;
  locked?: boolean;
  size?: number;
}) => {
  const ext = (name.includes(".") ? name.split(".").pop()! : "").toUpperCase().slice(0, 4);
  return (
    <span className="relative inline-block" style={{ width: size * (48 / 60), height: size }}>
      <svg width="100%" height="100%" viewBox="0 0 48 60">
        <defs>
          <linearGradient id="finder-sheet-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="1" stopColor="#eceef1" />
          </linearGradient>
        </defs>
        <path
          d="M3 5 a4 4 0 0 1 4-4 h23 l15 15 v39 a4 4 0 0 1-4 4 H7 a4 4 0 0 1-4-4 Z"
          fill="url(#finder-sheet-grad)"
          stroke="#b9bec7"
          strokeWidth="1"
        />
        <path
          d="M30 1 l15 15 H34 a4 4 0 0 1-4-4 Z"
          fill="#c9cdd4"
          stroke="#b9bec7"
          strokeWidth="1"
        />
        {ext === "ZIP" ? (
          /* 지퍼 */
          <>
            {Array.from({ length: 7 }, (_, i) => (
              <rect
                key={i}
                x={i % 2 ? 22.3 : 25.7}
                y={7 + i * 5.4}
                width="4.2"
                height="2.4"
                rx="0.7"
                fill="#9ba1ab"
              />
            ))}
            <rect x="22.6" y="44" width="7" height="8" rx="2" fill="#9ba1ab" />
            <circle cx="26.1" cy="55" r="1.7" fill="#9ba1ab" />
          </>
        ) : (
          /* 잔글씨 라인 */
          DOC_LINES.map((width, i) => (
            <rect
              key={i}
              x="7"
              y={12 + i * 4.6}
              width={width}
              height="1.8"
              rx="0.9"
              fill="#c6cbd3"
            />
          ))
        )}
      </svg>
      {locked && (
        <span
          className="absolute -bottom-0.5 -left-1 grid place-items-center rounded-full bg-[#e9ebef] shadow-sm"
          style={{ width: size * 0.38, height: size * 0.38 }}
        >
          <IoLockClosed size={size * 0.22} color="#3a3a3c" />
        </span>
      )}
    </span>
  );
};

const fakeBytes = (item: FsNode) => {
  if (item.content) return item.content.length * 2;
  // 내용 없는 파일(잠금 등)은 이름 기반 고정 의사 난수 용량 — 리렌더마다 바뀌지 않게
  let hash = 0;
  for (const ch of item.name) hash = (hash * 31 + ch.charCodeAt(0)) % 997;
  return 120_000 + hash * 4_000;
};

const formatBytes = (bytes: number) =>
  bytes >= 1_000_000
    ? `${(bytes / 1_000_000).toFixed(1)}MB`
    : bytes >= 1_000
      ? `${Math.round(bytes / 1_000)}KB`
      : `${bytes}B`;

const subText = (item: FsNode) =>
  item.type === "dir" ? `${listDir(item).length}개 항목` : formatBytes(fakeBytes(item));

const ItemIcon = ({ item, size }: { item: FsNode; size: number }) =>
  item.type === "dir" ? (
    <FolderIcon size={size} />
  ) : (
    <FileIcon name={item.name} locked={!!item.locked} size={size} />
  );

// 파일시스템(fakeFs)은 터미널과 공유. 숨김 폴더는 터미널 `ls -a`로만 발견 가능(이스터에그).
export const Finder = () => {
  const dispatch = useAppDispatch();
  const [history, setHistory] = useState<string[]>(["~"]);
  const [pos, setPos] = useState(0);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [preview, setPreview] = useState<FsNode | null>(null);
  const cwd = history[pos];

  const navigate = (path: string) => {
    if (path === cwd) return;
    const next = [...history.slice(0, pos + 1), path];
    setHistory(next);
    setPos(next.length - 1);
    setPreview(null);
  };
  const goBack = () => {
    if (pos === 0) return;
    setPos(pos - 1);
    setPreview(null);
  };
  const goForward = () => {
    if (pos >= history.length - 1) return;
    setPos(pos + 1);
    setPreview(null);
  };

  const isAppsView = cwd === APPS_VIEW;
  const node = isAppsView ? null : (resolvePath(cwd) ?? resolvePath("~")!);
  const items = node ? listDir(node) : [];
  const apps = appsData.filter((app) => app.component);

  const title = isAppsView
    ? "응용 프로그램"
    : cwd === "~"
      ? "Heoniverse HD"
      : cwd.split("/").pop()!;

  const renderSideEntry = (entry: SideEntry) => {
    const active = entry.path === cwd;
    return (
      <button
        key={entry.label}
        className={cn(
          "flex w-full items-center gap-2 rounded-[7px] px-2 py-[4.5px] text-left text-[12px]",
          entry.path
            ? "cursor-pointer text-white/80 hover:bg-white/[0.06]"
            : "cursor-default text-white/35",
          active && "bg-white/[0.12] text-white",
        )}
        disabled={!entry.path}
        onClick={() => entry.path && navigate(entry.path)}
      >
        <entry.icon size={15} className={cn("flex-none", entry.path && "text-[#4ca5ff]")} />
        <span className="truncate">{entry.label}</span>
      </button>
    );
  };

  return (
    <div className="relative flex h-full w-full overflow-hidden rounded-2xl bg-[#1e1e1e]">
      {/* 사이드바 */}
      <div className="flex w-40 flex-none flex-col border-r border-white/[0.07] bg-[#26262a]/95">
        <div className="draggable-area relative h-11 flex-none cursor-move">
          <TrafficLights id="finder" />
        </div>
        <div className="flex-1 overflow-y-auto px-2 pb-3">
          <div className="px-2 pb-1 text-[10px] font-bold tracking-wide text-white/35">
            즐겨찾기
          </div>
          {FAVORITES.map(renderSideEntry)}

          <div className="px-2 pb-1 pt-3.5 text-[10px] font-bold tracking-wide text-white/35">
            위치
          </div>
          {LOCATIONS.map(renderSideEntry)}

          <div className="px-2 pb-1 pt-3.5 text-[10px] font-bold tracking-wide text-white/35">
            태그
          </div>
          {TAGS.map((tag) => (
            <div
              key={tag.label}
              className="flex w-full items-center gap-2 rounded-[7px] px-2 py-[4.5px] text-[12px] text-white/35"
            >
              <span
                className="size-2.5 flex-none rounded-full border border-black/30"
                style={{ background: tag.color }}
              />
              <span className="truncate">{tag.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 본문 */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* 툴바 */}
        <div className="draggable-area flex h-11 flex-none cursor-move items-center gap-1 border-b border-white/[0.06] bg-[#232327] px-2.5">
          <button
            className={cn(
              "grid size-6 place-items-center rounded-md text-white/75",
              pos === 0 ? "cursor-default opacity-30" : "cursor-pointer hover:bg-white/[0.08]",
            )}
            disabled={pos === 0}
            onClick={goBack}
            aria-label="뒤로"
          >
            <IoChevronBack size={17} />
          </button>
          <button
            className={cn(
              "grid size-6 place-items-center rounded-md text-white/75",
              pos >= history.length - 1
                ? "cursor-default opacity-30"
                : "cursor-pointer hover:bg-white/[0.08]",
            )}
            disabled={pos >= history.length - 1}
            onClick={goForward}
            aria-label="앞으로"
          >
            <IoChevronForward size={17} />
          </button>
          <span className="ml-1.5 truncate text-[13px] font-bold text-white/85">{title}</span>

          {/* 보기 전환만 동작, 나머지 버튼은 장식 */}
          <div className="ml-auto flex items-center gap-0.5 text-white/45">
            <button
              className={cn(
                "grid size-6 cursor-pointer place-items-center rounded-md",
                view === "grid" && "bg-white/[0.07] text-white/70",
              )}
              onClick={() => setView("grid")}
              aria-label="아이콘 보기"
            >
              <IoGridOutline size={14} />
            </button>
            <button
              className={cn(
                "grid size-6 cursor-pointer place-items-center rounded-md",
                view === "list" && "bg-white/[0.07] text-white/70",
              )}
              onClick={() => setView("list")}
              aria-label="목록 보기"
            >
              <IoListOutline size={15} />
            </button>
            <span className="ml-1.5 grid size-6 place-items-center">
              <IoShareOutline size={15} />
            </span>
            <span className="grid size-6 place-items-center">
              <IoPricetagOutline size={14} />
            </span>
            <span className="grid size-6 place-items-center">
              <IoEllipsisHorizontalCircleOutline size={16} />
            </span>
            <span className="ml-1 grid size-6 place-items-center">
              <IoSearchOutline size={15} />
            </span>
          </div>
        </div>

        {/* 본문 */}
        <div className={cn("flex-1 overflow-y-auto", view === "grid" ? "p-3" : "py-1")}>
          {isAppsView ? (
            view === "grid" ? (
              <div className="grid grid-cols-[repeat(auto-fill,minmax(88px,1fr))] content-start gap-1">
                {apps.map((app) => (
                  <button
                    key={app.id}
                    className="flex cursor-pointer flex-col items-center gap-1.5 rounded-lg p-2.5 hover:bg-white/[0.06]"
                    onDoubleClick={() => dispatch(openApp({ id: app.id, title: app.title }))}
                  >
                    <img src={app.img} className="no-pixel size-10" alt="" />
                    <div className="line-clamp-2 max-w-full break-all text-center text-[10.5px] leading-tight text-white/80">
                      {app.title}
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              apps.map((app) => (
                <button
                  key={app.id}
                  className="flex w-full cursor-pointer items-center gap-2.5 px-3 py-[5px] text-left odd:bg-white/[0.035] hover:bg-white/[0.07]"
                  onDoubleClick={() => dispatch(openApp({ id: app.id, title: app.title }))}
                >
                  <img src={app.img} className="no-pixel size-5 flex-none" alt="" />
                  <span className="truncate text-[12.5px] text-white/85">{app.title}</span>
                </button>
              ))
            )
          ) : items.length === 0 ? (
            <div className="flex h-full items-center justify-center text-[12.5px] text-white/35">
              폴더가 비어 있습니다
            </div>
          ) : view === "grid" ? (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(88px,1fr))] content-start gap-1">
              {items.map((item) => (
                <button
                  key={item.name}
                  className="flex cursor-pointer flex-col items-center gap-1.5 rounded-lg p-2.5 hover:bg-white/[0.06]"
                  onClick={() => item.type === "file" && setPreview(item)}
                  onDoubleClick={() =>
                    item.type === "dir" ? navigate(joinPath(cwd, item.name)) : setPreview(item)
                  }
                >
                  {/* 46/39 — 폴더(가로형)·문서(세로형)의 시각적 크기를 맞춘 보정값 */}
                  <span className="grid h-11 place-items-center">
                    <ItemIcon item={item} size={item.type === "dir" ? 46 : 39} />
                  </span>
                  <div className="line-clamp-2 max-w-full break-all text-center text-[10.5px] leading-tight text-white/80">
                    {item.name}
                  </div>
                  <div className="text-[9px] leading-none text-[#7ea6db]">{subText(item)}</div>
                </button>
              ))}
            </div>
          ) : (
            items.map((item) => (
              <button
                key={item.name}
                className="flex w-full cursor-pointer items-center gap-2.5 px-3 py-[5px] text-left odd:bg-white/[0.035] hover:bg-white/[0.07]"
                onClick={() => item.type === "file" && setPreview(item)}
                onDoubleClick={() =>
                  item.type === "dir" ? navigate(joinPath(cwd, item.name)) : setPreview(item)
                }
              >
                <span className="grid w-5 flex-none place-items-center">
                  <ItemIcon item={item} size={item.type === "dir" ? 18 : 17} />
                </span>
                <span className="truncate text-[12.5px] text-white/85">{item.name}</span>
                {item.locked && <IoLockClosed size={11} className="flex-none text-white/30" />}
              </button>
            ))
          )}
        </div>

        {/* 상태바 */}
        <div className="flex h-6 flex-none items-center justify-center border-t border-white/[0.06] bg-[#232327] text-[10.5px] text-white/40">
          {isAppsView ? `${apps.length}개 항목 · 더블클릭으로 실행` : `${items.length}개 항목`}
        </div>
      </div>

      {/* 파일 미리보기 오버레이 */}
      {preview && (
        <div
          className="absolute inset-0 z-10 flex items-center justify-center bg-black/70 p-6"
          onClick={() => setPreview(null)}
        >
          <div
            className="flex max-h-[85%] w-full max-w-[420px] flex-col overflow-hidden rounded-xl border border-white/15 bg-[#232327] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-none items-center justify-between border-b border-white/[0.07] px-4 py-2.5">
              <span className="truncate text-[12.5px] font-semibold text-white">
                {preview.name}
              </span>
              <button
                className="grid size-6 cursor-pointer place-items-center rounded-full bg-white/[0.07] text-white/70"
                onClick={() => setPreview(null)}
              >
                <AppIcon iconName="x-mark" size={14} />
              </button>
            </div>
            <div className="overflow-y-auto whitespace-pre-wrap px-4 py-3.5 text-[12.5px] leading-relaxed text-white/85">
              {preview.locked ? (
                <span className="flex items-center gap-2 text-[#f2cc60]">
                  <AppIcon iconName="lock" size={13} />
                  {preview.locked}
                </span>
              ) : (
                preview.content
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
