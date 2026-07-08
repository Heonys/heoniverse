// 메뉴 화면 전용 배경 — 인게임과 같은 하늘/구름 에셋을 CSS 블러·딤으로만 뒤로 물려
// 카드가 주인공이 되게 한다 (인게임 Background 씬은 건드리지 않는다)
export const MenuBackdrop = () => {
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden bg-[#10131c]">
      <div className="absolute inset-0 scale-[1.06] bg-[url('/images/background/backdrop_day.png')] bg-cover bg-center brightness-90 [image-rendering:pixelated]" />
      <div className="animate-drift absolute left-0 right-0 top-[60px] h-[210px] bg-[url('/images/background/cloud_day.png')] bg-repeat-x opacity-65 blur-[1.5px] [background-size:auto_150px] [image-rendering:pixelated]" />
      <div className="absolute inset-0 bg-[radial-gradient(120%_92%_at_50%_40%,transparent_42%,rgba(12,16,32,0.5)_100%),linear-gradient(180deg,rgba(25,30,55,0.28),rgba(12,15,30,0.5))]" />
    </div>
  );
};
