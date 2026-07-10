import { useEffect, useRef, useState } from "react";
import { TrafficLights } from "@/components/computer";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { openApp, closeApp } from "@/stores/desktopSlice";
import { resolvePath, listDir, parentPath, joinPath } from "@/constants/fakeFs";
// 순환 import(dockItems→Terminal→dockItems)지만 appsData 접근이 이벤트 핸들러 안(런타임)이라 안전
import { appsData } from "@/constants/dockItems";

// Tab 완성 대상 명령 — sudo·rm은 이스터에그라 제외
const COMMANDS = [
  "help",
  "about",
  "ls",
  "cd",
  "pwd",
  "cat",
  "open",
  "whoami",
  "date",
  "echo",
  "history",
  "clear",
  "exit",
];

type Line = { text: string; kind?: "cmd" | "error" | "accent" };

// 가짜 셸 — 파일시스템(fakeFs)은 Finder와 공유, open은 실제 앱 창을 연다
export const Terminal = () => {
  const dispatch = useAppDispatch();
  const userName = useAppSelector((state) => state.user.userName);

  const [lines, setLines] = useState<Line[]>([
    { text: "Heoniverse 터미널에 오신 것을 환영합니다 — help 를 입력해보세요", kind: "accent" },
  ]);
  const [input, setInput] = useState("");
  const [cwd, setCwd] = useState("~");
  const historyRef = useRef<string[]>([]);
  const historyPos = useRef(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // scrollIntoView는 창(overflow-hidden) 등 조상까지 스크롤시켜 창 내용이 밀린다 — 출력 영역만 스크롤
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [lines]);

  // autoFocus도 조상 스크롤을 유발할 수 있어 preventScroll 포커스로 대체
  useEffect(() => {
    inputRef.current?.focus({ preventScroll: true });
  }, []);

  const print = (text: string, kind?: Line["kind"]) =>
    setLines((prev) => [...prev, ...text.split("\n").map((t) => ({ text: t, kind }))]);

  const run = (raw: string) => {
    const [cmd, ...args] = raw.split(/\s+/);
    const arg = args.join(" ");

    switch (cmd) {
      case "help":
        print(
          [
            "사용 가능한 명령:",
            "  about      이 공간에 대하여",
            "  ls [-a]    파일 목록  ·  cd <폴더>  ·  pwd",
            "  cat <파일>  파일 내용 보기",
            "  open <앱>   앱 실행 (예: open music)",
            "  whoami · date · echo · history · clear · exit",
          ].join("\n"),
        );
        break;

      case "about":
        print(
          "Heoniverse — Phaser 기반 몰입형 메타버스 협업 플랫폼.\n가상 오피스에서 화상회의·화이트보드·AI와 함께 일하고 노는 공간입니다.",
        );
        break;

      case "ls": {
        const showHidden = args.includes("-a");
        const target = args.find((a) => !a.startsWith("-"));
        const node = resolvePath(target ? join(cwd, target) : cwd);
        if (!node || node.type !== "dir") {
          print(`ls: ${target}: 그런 폴더가 없습니다`, "error");
          break;
        }
        const items = listDir(node, showHidden);
        if (items.length === 0) print("(비어 있음)");
        else print(items.map((c) => (c.type === "dir" ? `${c.name}/` : c.name)).join("   "));
        break;
      }

      case "cd": {
        if (!arg || arg === "~") {
          setCwd("~");
          break;
        }
        if (arg === "..") {
          setCwd(parentPath(cwd));
          break;
        }
        const path = join(cwd, arg);
        const node = resolvePath(path);
        if (!node || node.type !== "dir") print(`cd: ${arg}: 그런 폴더가 없습니다`, "error");
        else setCwd(path);
        break;
      }

      case "pwd":
        print(cwd);
        break;

      case "cat": {
        if (!arg) {
          print("cat: 파일 이름을 입력하세요", "error");
          break;
        }
        const node = resolvePath(join(cwd, arg));
        if (!node || node.type !== "file") print(`cat: ${arg}: 그런 파일이 없습니다`, "error");
        else if (node.locked) print(`cat: ${arg}: ${node.locked}`, "error");
        else print(node.content ?? "");
        break;
      }

      case "open": {
        const app = appsData.find(
          (a) => a.id === arg || a.title.toLowerCase() === arg.toLowerCase(),
        );
        if (!arg) print("open: 앱 이름을 입력하세요 (예: open music)", "error");
        else if (!app || !app.component) {
          print(
            `open: ${arg}: 그런 앱이 없습니다 — ${appsData
              .filter((a) => a.component)
              .map((a) => a.id)
              .join(", ")}`,
            "error",
          );
        } else {
          dispatch(openApp({ id: app.id, title: app.title }));
          print(`${app.title} 실행됨`);
        }
        break;
      }

      case "whoami":
        print(`${userName || "guest"} — 여기선 모두가 손님입니다`);
        break;

      case "date":
        print(new Date().toLocaleString("ko-KR"));
        break;

      case "echo":
        print(arg);
        break;

      case "history":
        print(historyRef.current.map((h, i) => `  ${i + 1}  ${h}`).join("\n") || "(비어 있음)");
        break;

      case "clear":
        setLines([]);
        break;

      case "sudo":
        print("sudo: 권한이 없습니다.", "error");
        break;

      case "exit":
        dispatch(closeApp("terminal"));
        break;

      case "rm":
        print("rm: 권한이 없습니다.", "error");
        break;

      default:
        print(`hsh: ${cmd}: command not found — help 를 입력해보세요`, "error");
    }
  };

  const join = (base: string, rel: string) =>
    rel.startsWith("~")
      ? rel
      : rel.split("/").reduce((acc, part) => {
          if (part === "..") return parentPath(acc);
          if (part === "." || part === "") return acc;
          return joinPath(acc, part);
        }, base);

  // bash식 Tab 완성 — 후보 1개면 완성, 여러 개면 공통 프리픽스까지 채우고 목록 출력
  const autocomplete = () => {
    const tokens = input.split(/\s+/);
    const isFirstToken = tokens.length <= 1 && !input.endsWith(" ");
    const last = input.endsWith(" ") ? "" : (tokens[tokens.length - 1] ?? "");
    const head = input.slice(0, input.length - last.length);

    // macOS처럼 대소문자 무시 매칭 (desk → Desktop)
    const matches = (name: string, prefix: string) =>
      name.toLowerCase().startsWith(prefix.toLowerCase());

    // 후보는 마지막 토큰을 통째로 대체할 문자열로 만든다 (경로면 base 포함)
    let candidates: string[] = [];
    if (isFirstToken) {
      candidates = COMMANDS.filter((c) => matches(c, last)).map((c) => `${c} `);
    } else if (tokens[0] === "open") {
      candidates = appsData
        .filter((app) => app.component && matches(app.id, last))
        .map((app) => `${app.id} `);
    } else {
      const slash = last.lastIndexOf("/");
      const base = slash >= 0 ? last.slice(0, slash + 1) : "";
      const prefix = slash >= 0 ? last.slice(slash + 1) : last;
      const dirNode = resolvePath(base ? join(cwd, base) : cwd);
      if (!dirNode || dirNode.type !== "dir") return;
      candidates = listDir(dirNode, prefix.startsWith("."))
        .filter((c) => matches(c.name, prefix))
        .map((c) => base + c.name + (c.type === "dir" ? "/" : " "));
    }

    if (candidates.length === 0) return;
    if (candidates.length === 1) {
      setInput(head + candidates[0]);
      return;
    }
    const lcp = candidates.reduce((a, b) => {
      let i = 0;
      while (i < a.length && i < b.length && a[i] === b[i]) i++;
      return a.slice(0, i);
    });
    // 대소문자만 다른 경우(do → Do)도 실제 표기로 교정
    if (lcp.length > last.length || (lcp.length === last.length && lcp !== last)) {
      setInput(head + lcp);
    } else {
      print(candidates.map((c) => c.trim()).join("   "));
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      autocomplete();
    } else if (e.key === "Enter") {
      const raw = input.trim();
      setInput("");
      historyPos.current = -1;
      print(`${prompt()} ${raw}`, "cmd");
      if (raw) {
        historyRef.current.push(raw);
        run(raw);
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const h = historyRef.current;
      if (h.length === 0) return;
      historyPos.current =
        historyPos.current < 0 ? h.length - 1 : Math.max(0, historyPos.current - 1);
      setInput(h[historyPos.current]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const h = historyRef.current;
      if (historyPos.current < 0) return;
      historyPos.current++;
      if (historyPos.current >= h.length) {
        historyPos.current = -1;
        setInput("");
      } else {
        setInput(h[historyPos.current]);
      }
    }
  };

  const prompt = () => `${userName || "guest"}@heoniverse ${cwd} $`;

  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-2xl bg-[#0a0c10]">
      <div className="draggable-area relative flex h-7 w-full flex-none cursor-move items-center justify-center bg-[#16181d]">
        <TrafficLights id="terminal" />
        <span className="font-mono text-[11.5px] text-white/45">
          {userName || "guest"}@heoniverse — hsh
        </span>
      </div>
      <div
        ref={scrollRef}
        className="flex-1 cursor-text overflow-y-auto px-3 py-2 font-mono text-[12.5px] leading-[1.6] text-[#d2d6dd]"
        onClick={() => inputRef.current?.focus()}
      >
        {lines.map((line, i) => (
          <div
            key={i}
            className={
              line.kind === "error"
                ? "text-[#f2cc60]"
                : line.kind === "accent"
                  ? "whitespace-pre text-[#8a8cf5]"
                  : line.kind === "cmd"
                    ? "text-white/85"
                    : "whitespace-pre-wrap"
            }
          >
            {line.text || " "}
          </div>
        ))}
        <div className="flex items-center gap-1.5">
          <span className="flex-none text-[#7ee787]">{prompt()}</span>
          <input
            ref={inputRef}
            value={input}
            autoComplete="off"
            spellCheck={false}
            className="min-w-0 flex-1 border-none bg-transparent font-mono text-[12.5px] text-[#d2d6dd] outline-none"
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
          />
        </div>
      </div>
    </div>
  );
};
