import Slider, { Settings } from "react-slick";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const settings: Settings = {
  dots: true,
  speed: 300,
  slidesToShow: 1,
  slidesToScroll: 1,
  draggable: false,
  infinite: false,
};

type Props = {
  afterChange?: (index: number) => void;
} & React.PropsWithChildren;

export const AppSlider = ({ afterChange, children }: Props) => {
  return (
    <div className="flex justify-center items-center bg-slate-400 rounded-2xl p-3">
      <Slider {...settings} afterChange={afterChange}>
        {children}
      </Slider>
    </div>
  );
};
