// 메뉴 화면 배경 — 뒤에서 도는 Phaser background 씬(움직이는 구름들)을 그대로 노출한다.
// 여기에 불투명 배경을 깔면 씬이 가려지니 카드 가독성용 딤만 얹을 것
export const MenuBackdrop = () => {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(120%_92%_at_50%_40%,transparent_42%,rgba(12,16,32,0.5)_100%),linear-gradient(180deg,rgba(25,30,55,0.28),rgba(12,15,30,0.5))]" />
    </div>
  );
};
