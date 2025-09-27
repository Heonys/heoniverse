import { AppIcon } from "@/icons";
import { Backdrop } from "./Backdrop";

export const NonDesktop = () => {
  return (
    <Backdrop>
      <div className="flex w-full select-none flex-col items-center gap-5">
        <div className="flex w-full flex-col space-y-1.5 text-left">
          <div className="flex items-center gap-2">
            <AppIcon iconName="warning-tri" className="text-[#ffb056]" size={20} />
            <h2 className="text-lg font-semibold leading-none tracking-tight text-white">
              Desktop Only
            </h2>
          </div>
          <p className="text-sm text-[#c2c2c2]">데스크탑에서만 이용 가능합니다.</p>
        </div>
        <div className="text-sm text-[#e0e0e0]">
          <p>
            이 서비스는 데스크탑 환경에서 최적화되어 있습니다. 모바일에서는 정상적인 이용이 어렵기에
            데스크탑 브라우저에서 접속해 주세요.
          </p>
        </div>
      </div>
    </Backdrop>
  );
};
