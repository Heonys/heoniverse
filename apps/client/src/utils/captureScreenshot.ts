import { phaserGame } from "@/game";
import { eventEmitter } from "@/game/events";
import { addScreenshot } from "./screenshotStore";

// 인게임 스크린샷 촬영 — 진입점은 여럿(P키·아이폰 카메라 앱)이지만 구현은 이 함수 하나.
// 촬영 성공 시 SCREENSHOT_TAKEN을 emit해 플래시·토스트(ScreenshotFlash)가 반응한다.
export function captureScreenshot() {
  phaserGame.renderer.snapshot((image) => {
    addScreenshot((image as HTMLImageElement).src)
      .then(() => eventEmitter.emit("SCREENSHOT_TAKEN"))
      .catch((err) => console.error("스크린샷 저장 실패:", err));
  });
}
