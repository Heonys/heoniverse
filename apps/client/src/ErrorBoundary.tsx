import { Component, type PropsWithChildren, type ErrorInfo, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AppIcon } from "@/icons";

type Props = PropsWithChildren<{
  // 지정하면 전체 화면 대신 해당 위치에 폴백을 렌더 (예: 데스크탑 앱 창 내부 격리)
  fallback?: ReactNode;
}>;

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return createPortal(
        <div className="fixed inset-0 z-[999999] flex h-dvh items-center justify-center bg-[#0b0d13] p-6">
          <div className="from-panel-top to-panel-bot w-full max-w-[400px] select-none rounded-[20px] border border-white/10 bg-gradient-to-b p-7 text-center shadow-[0_30px_70px_-20px_rgba(10,20,40,0.75),inset_0_1px_0_rgba(255,255,255,0.06)]">
            <AppIcon iconName="warning-tri" size={36} className="mx-auto text-[#ffb056]" />
            <h2 className="mt-3 text-[17px] font-semibold tracking-[-0.01em] text-white">
              문제가 발생했습니다
            </h2>
            <p className="text-text-dim mt-2 text-[13px] leading-relaxed">
              예상치 못한 오류로 화면을 표시할 수 없습니다.
              <br />
              새로고침하면 대부분 해결됩니다.
            </p>
            <button
              className="bg-accent mt-5 inline-flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl text-[14px] font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] transition hover:brightness-[1.06]"
              onClick={() => window.location.reload()}
            >
              <AppIcon iconName="refresh" size={16} />
              새로고침
            </button>
            {this.state.error?.message && (
              <details className="mt-4 text-left">
                <summary className="text-text-faint cursor-pointer text-[11.5px]">
                  오류 상세 정보
                </summary>
                <pre className="text-coral mt-2 max-h-28 overflow-auto whitespace-pre-wrap break-all rounded-lg bg-black/30 p-2.5 text-[11px] leading-relaxed">
                  {this.state.error.message}
                </pre>
              </details>
            )}
          </div>
        </div>,
        document.body,
      );
    }
    return this.props.children;
  }
}
