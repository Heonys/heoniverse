import { Keyframes } from "@/common";

type Props = {
  animKey: string;
  src: string;
  frameWidth: number;
  frameHeight: number;
  startFrame: number;
  endFrame: number;
  fps?: number;
};

export const SpriteAnimation = ({
  animKey,
  src,
  frameWidth,
  frameHeight,
  startFrame,
  endFrame,
  fps = 5,
}: Props) => {
  const frameCount = endFrame - startFrame + 1;
  const duration = frameCount / fps;

  return (
    <>
      <Keyframes
        name={`spriteAnim-${animKey}`}
        from={{ backgroundPosition: `-${startFrame * frameWidth}px` }}
        to={{ backgroundPosition: `-${(endFrame + 1) * frameWidth}px` }}
      />
      <div
        className="scale-200"
        style={{
          width: `${frameWidth}px`,
          height: `${frameHeight}px`,
          backgroundImage: `url(${src})`,
          animation: `spriteAnim-${animKey} ${duration}s steps(${frameCount}) infinite`,
          imageRendering: "pixelated",
        }}
      />
    </>
  );
};
