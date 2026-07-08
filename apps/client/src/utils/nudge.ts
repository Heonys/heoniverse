// 콕 찌르기 수신 연출 — 사운드 에셋이 없는 프로젝트라 Web Audio로 짧은 2음 핑을 합성한다
export function playNudgeSound() {
  try {
    const ctx = new AudioContext();
    const gain = ctx.createGain();
    gain.connect(ctx.destination);
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.3);

    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.setValueAtTime(1320, ctx.currentTime + 0.12);
    osc.connect(gain);
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
    osc.onended = () => ctx.close();
  } catch {
    // 오디오 실패(autoplay 정책 등)는 치명적이지 않다
  }
}

// 탭이 안 보일 때 데스크탑 알림. 권한이 없으면 false — 호출측이 인앱 토스트로 폴백한다
export function showDesktopNudge(name: string) {
  if (!("Notification" in window) || Notification.permission !== "granted") return false;
  try {
    // tag를 쓰면 같은 tag 알림이 남아 있을 때 배너 없이 "조용히 교체"돼 안 뜬 것처럼 보인다.
    // 연타는 서버 쿨다운이 막으니 tag 없이 매번 새 알림으로 띄운다.
    const noti = new Notification(`${name}님이 콕 찔렀어요`, {
      icon: "/favicon.ico",
    });
    noti.onclick = () => {
      window.focus();
      noti.close();
    };
    return true;
  } catch {
    return false;
  }
}
