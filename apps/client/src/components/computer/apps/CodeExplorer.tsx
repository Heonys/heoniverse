import { useState } from "react";
import { VscClose, VscNewFile } from "react-icons/vsc";
import { CODE_FILE_NAME_PATTERN } from "@heoniverse/shared";
import { cn } from "@/utils";
import type { CodePresence } from "./CodeEditor";

export const EXT_BADGES: Record<string, { label: string; color: string }> = {
  ts: { label: "TS", color: "#3178c6" },
  tsx: { label: "TS", color: "#3178c6" },
  js: { label: "JS", color: "#e8d44d" },
  jsx: { label: "JS", color: "#e8d44d" },
  json: { label: "{}", color: "#e8d44d" },
  css: { label: "#", color: "#42a5f5" },
  html: { label: "<>", color: "#e44d26" },
  md: { label: "M↓", color: "#9e9e9e" },
};

type Props = {
  files: string[];
  active: string | null;
  others: CodePresence[];
  onSelect: (name: string) => void;
  onCreate: (name: string) => boolean;
  onDelete: (name: string) => void;
};

export const CodeExplorer = ({ files, active, others, onSelect, onCreate, onDelete }: Props) => {
  const [drafting, setDrafting] = useState(false);
  const [draft, setDraft] = useState("");
  const [invalid, setInvalid] = useState(false);

  const closeDraft = () => {
    setDrafting(false);
    setDraft("");
    setInvalid(false);
  };

  const commitDraft = () => {
    const name = draft.trim();
    if (!name) return closeDraft();
    if (onCreate(name)) return closeDraft();
    setInvalid(true);
  };

  return (
    <div className="flex h-full w-44 flex-none flex-col border-r border-black/40 bg-[#252526]">
      <div className="flex h-8 flex-none items-center justify-between pl-3 pr-2">
        <span className="text-[11px] font-semibold tracking-wide text-white/40">탐색기</span>
        <button
          onClick={() => setDrafting(true)}
          className="rounded p-0.5 text-white/40 hover:bg-white/10 hover:text-white/80"
        >
          <VscNewFile size={14} />
        </button>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto pb-2">
        {files.map((name) => {
          const badge = EXT_BADGES[name.split(".").pop() ?? ""];
          return (
            <div
              key={name}
              onClick={() => onSelect(name)}
              className={cn(
                "group flex h-6.5 cursor-pointer items-center gap-1.5 pl-3 pr-2 text-[12px] text-white/70 hover:bg-white/5",
                active === name && "bg-[#37373d] text-white",
              )}
            >
              <span
                className="w-4 flex-none text-center text-[9px] font-bold"
                style={{ color: badge?.color }}
              >
                {badge?.label}
              </span>
              <span className="truncate">{name}</span>
              <span className="ml-auto flex flex-none items-center gap-1">
                {others
                  .filter((user) => user.file === name)
                  .map((user) => (
                    <span
                      key={user.clientId}
                      className="size-1.5 rounded-full"
                      style={{ backgroundColor: user.color }}
                    />
                  ))}
                {files.length > 1 && (
                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      onDelete(name);
                    }}
                    className="hidden rounded text-white/40 hover:text-white group-hover:block"
                  >
                    <VscClose size={13} />
                  </button>
                )}
              </span>
            </div>
          );
        })}
        {drafting && (
          <div className="flex h-6.5 items-center gap-1.5 pl-3 pr-2">
            <span className="w-4 flex-none" />
            <input
              ref={(el) => el?.focus({ preventScroll: true })}
              value={draft}
              onChange={(event) => {
                setDraft(event.target.value);
                setInvalid(false);
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter") commitDraft();
                if (event.key === "Escape") closeDraft();
              }}
              onBlur={closeDraft}
              placeholder="example.ts"
              spellCheck={false}
              className={cn(
                "w-full min-w-0 rounded-sm border border-[#007fd4] bg-[#3c3c3c] px-1 text-[12px] text-white outline-none placeholder:text-white/25",
                invalid && "border-red-400",
              )}
            />
          </div>
        )}
      </div>
      {drafting && !CODE_FILE_NAME_PATTERN.test(draft.trim()) && draft.trim() !== "" && (
        <div className="flex-none px-3 pb-2 text-[10px] leading-snug text-white/30">
          이름.확장자 형식 (ts·js·json·css·html·md)
        </div>
      )}
    </div>
  );
};
