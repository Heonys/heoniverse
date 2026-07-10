import { useEffect, useRef, useState } from "react";
import * as monaco from "monaco-editor";
import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import tsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker";
import jsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker";
import cssWorker from "monaco-editor/esm/vs/language/css/css.worker?worker";
import htmlWorker from "monaco-editor/esm/vs/language/html/html.worker?worker";
import * as Y from "yjs";
import { MonacoBinding } from "y-monaco";
import {
  Awareness,
  applyAwarenessUpdate,
  encodeAwarenessUpdate,
  removeAwarenessStates,
} from "y-protocols/awareness";
import { VscClose } from "react-icons/vsc";
import { CODE_FILES_MAX, CODE_FILE_NAME_PATTERN } from "@heoniverse/shared";
import { useAppSelector, useGame } from "@/hooks";
import { eventEmitter } from "@/game/events";
import { cn, pickHexColor } from "@/utils";
import { CodeExplorer, EXT_BADGES } from "./CodeExplorer";

self.MonacoEnvironment = {
  getWorker(_workerId, label) {
    if (label === "typescript" || label === "javascript") return new tsWorker();
    if (label === "json") return new jsonWorker();
    if (label === "css") return new cssWorker();
    if (label === "html") return new htmlWorker();
    return new editorWorker();
  },
};

const LANG_BY_EXT: Record<string, string> = {
  ts: "typescript",
  tsx: "typescript",
  js: "javascript",
  jsx: "javascript",
  json: "json",
  css: "css",
  html: "html",
  md: "markdown",
};

export type CodePresence = { clientId: number; color: string; file?: string };

export default function CodeEditor() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { network } = useGame();
  const computerId = useAppSelector((state) => state.computer.computerId);
  const userName = useAppSelector((state) => state.user.userName);

  const [fileNames, setFileNames] = useState<string[]>([]);
  const [openTabs, setOpenTabs] = useState<string[]>([]);
  const [activeFile, setActiveFile] = useState<string | null>(null);
  const [others, setOthers] = useState<CodePresence[]>([]);

  const docRef = useRef<Y.Doc | null>(null);
  const awarenessRef = useRef<Awareness | null>(null);
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const bindingRef = useRef<MonacoBinding | null>(null);
  const modelsRef = useRef(new Map<string, monaco.editor.ITextModel>());

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !computerId) return;

    const doc = new Y.Doc();
    const files = doc.getMap<Y.Text>("files");
    const awareness = new Awareness(doc);
    const name = userName || "익명";
    awareness.setLocalStateField("user", { name, color: pickHexColor(name) });
    docRef.current = doc;
    awarenessRef.current = awareness;

    const editor = monaco.editor.create(container, {
      model: null,
      theme: "vs-dark",
      automaticLayout: true,
      fontSize: 13,
      tabSize: 2,
      padding: { top: 8 },
    });
    editorRef.current = editor;

    const syncFiles = () => {
      const names = Array.from(files.keys()).sort();
      setFileNames(names);
      setOpenTabs((prev) => prev.filter((tab) => files.has(tab)));
      setActiveFile((prev) => (prev && files.has(prev) ? prev : (names[0] ?? null)));
    };
    files.observe(syncFiles);

    const onDocUpdate = (update: Uint8Array, origin: unknown) => {
      if (origin !== "remote") network.updateCode(computerId, update);
    };
    doc.on("update", onDocUpdate);

    const onAwarenessUpdate = (
      changes: { added: number[]; updated: number[]; removed: number[] },
      origin: unknown,
    ) => {
      if (origin === "remote") return;
      const changed = changes.added.concat(changes.updated, changes.removed);
      network.updateCodeAwareness(computerId, encodeAwarenessUpdate(awareness, changed));
    };
    awareness.on("update", onAwarenessUpdate);

    const onRemoteCode = (payload: { id: string; update: Uint8Array }) => {
      if (payload.id !== computerId) return;
      Y.applyUpdate(doc, payload.update, "remote");
    };
    const onRemoteAwareness = (payload: { id: string; update: Uint8Array }) => {
      if (payload.id !== computerId) return;
      applyAwarenessUpdate(awareness, payload.update, "remote");
    };
    eventEmitter.on("CODE_UPDATED", onRemoteCode);
    eventEmitter.on("CODE_AWARENESS_UPDATED", onRemoteAwareness);

    // y-monaco가 붙이는 .yRemoteSelection(Head)-{clientId} 클래스에 유저별 색·이름표를 입힌다
    const styleEl = document.createElement("style");
    document.head.appendChild(styleEl);
    const onAwarenessChange = () => {
      const rules: string[] = [];
      const list: CodePresence[] = [];
      awareness.getStates().forEach((state, clientId) => {
        if (clientId === awareness.clientID) return;
        const user = state.user as { name?: string; color?: string } | undefined;
        if (!user?.color) return;
        list.push({ clientId, color: user.color, file: state.file as string | undefined });
        const label = (user.name ?? "").replace(/["\\]/g, "");
        rules.push(
          `.yRemoteSelection-${clientId} { background-color: ${user.color}4d; }`,
          `.yRemoteSelectionHead-${clientId} { position: absolute; border-left: 2px solid ${user.color}; height: 100%; }`,
          `.yRemoteSelectionHead-${clientId}::after { content: "${label}"; position: absolute; left: -2px; top: -15px; padding: 0 4px; font-size: 10px; line-height: 15px; color: #fff; white-space: nowrap; background-color: ${user.color}; border-radius: 3px 3px 3px 0; }`,
        );
      });
      styleEl.textContent = rules.join("\n");
      setOthers(list);
    };
    awareness.on("change", onAwarenessChange);

    network.requestCodeSync(computerId);

    return () => {
      // off보다 먼저 — removed가 담긴 마지막 awareness 업데이트가 전파돼야 상대 화면의 내 커서가 즉시 사라진다
      removeAwarenessStates(awareness, [awareness.clientID], "unmount");
      awareness.off("update", onAwarenessUpdate);
      awareness.off("change", onAwarenessChange);
      files.unobserve(syncFiles);
      eventEmitter.off("CODE_UPDATED", onRemoteCode);
      eventEmitter.off("CODE_AWARENESS_UPDATED", onRemoteAwareness);
      doc.off("update", onDocUpdate);
      bindingRef.current?.destroy();
      bindingRef.current = null;
      editor.dispose();
      editorRef.current = null;
      awareness.destroy();
      doc.destroy();
      awarenessRef.current = null;
      docRef.current = null;
      modelsRef.current.forEach((model) => model.dispose());
      modelsRef.current.clear();
      styleEl.remove();
      setFileNames([]);
      setOpenTabs([]);
      setActiveFile(null);
      setOthers([]);
    };
  }, [network, computerId, userName]);

  useEffect(() => {
    if (!activeFile) return;
    setOpenTabs((prev) => (prev.includes(activeFile) ? prev : [...prev, activeFile]));
  }, [activeFile]);

  useEffect(() => {
    const doc = docRef.current;
    const awareness = awarenessRef.current;
    const editor = editorRef.current;
    if (!doc || !awareness || !editor) return;

    if (!activeFile) {
      bindingRef.current?.destroy();
      bindingRef.current = null;
      editor.setModel(null);
      awareness.setLocalStateField("file", null);
      return;
    }

    const ytext = doc.getMap<Y.Text>("files").get(activeFile);
    if (!ytext) return;

    const uri = monaco.Uri.parse(`file:///${activeFile}`);
    let model = monaco.editor.getModel(uri);
    if (!model) {
      const ext = activeFile.split(".").pop() ?? "";
      model = monaco.editor.createModel(ytext.toString(), LANG_BY_EXT[ext], uri);
      modelsRef.current.set(activeFile, model);
    } else if (model.getValue() !== ytext.toString()) {
      // 캐시된 모델은 binding이 없는 동안 원격 변경을 못 받아 stale — Y.Text가 항상 정본
      model.setValue(ytext.toString());
    }

    bindingRef.current?.destroy();
    editor.setModel(model);
    bindingRef.current = new MonacoBinding(ytext, model, new Set([editor]), awareness);
    awareness.setLocalStateField("file", activeFile);
  }, [activeFile, computerId]);

  const createFile = (name: string) => {
    const doc = docRef.current;
    if (!doc) return false;
    const files = doc.getMap<Y.Text>("files");
    if (!CODE_FILE_NAME_PATTERN.test(name) || files.has(name)) return false;
    if (files.size >= CODE_FILES_MAX) return false;
    files.set(name, new Y.Text());
    setActiveFile(name);
    return true;
  };

  const deleteFile = (name: string) => {
    const doc = docRef.current;
    if (!doc) return;
    const files = doc.getMap<Y.Text>("files");
    if (files.size <= 1) return;
    files.delete(name);
  };

  const closeTab = (name: string) => {
    const index = openTabs.indexOf(name);
    const next = openTabs.filter((tab) => tab !== name);
    setOpenTabs(next);
    if (activeFile === name) setActiveFile(next[Math.max(0, index - 1)] ?? null);
  };

  return (
    <div className="flex h-full w-full">
      <CodeExplorer
        files={fileNames}
        active={activeFile}
        others={others}
        onSelect={setActiveFile}
        onCreate={createFile}
        onDelete={deleteFile}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex h-9 flex-none items-stretch overflow-x-auto bg-[#252526]">
          {openTabs.map((name) => {
            const badge = EXT_BADGES[name.split(".").pop() ?? ""];
            const isActive = name === activeFile;
            return (
              <div
                key={name}
                onClick={() => setActiveFile(name)}
                className={cn(
                  "group flex min-w-0 max-w-44 cursor-pointer items-center gap-1.5 border-r border-black/40 pl-3 pr-2 text-[12px]",
                  isActive
                    ? "bg-[#1e1e1e] text-white"
                    : "bg-[#2d2d2d] text-white/50 hover:text-white/80",
                )}
              >
                <span className="flex-none text-[9px] font-bold" style={{ color: badge?.color }}>
                  {badge?.label}
                </span>
                <span className="truncate">{name}</span>
                <button
                  onClick={(event) => {
                    event.stopPropagation();
                    closeTab(name);
                  }}
                  className={cn(
                    "flex-none rounded p-0.5 hover:bg-white/10",
                    isActive ? "text-white/60" : "invisible text-white/40 group-hover:visible",
                  )}
                >
                  <VscClose size={13} />
                </button>
              </div>
            );
          })}
        </div>
        <div ref={containerRef} className="min-h-0 w-full flex-1" />
      </div>
    </div>
  );
}
