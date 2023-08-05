import { FC, useEffect, useCallback, useState, useRef } from "react";
import { BallsCanvas } from "./animation.js";
import { COLOR_OFFSET_DEG, ANIMATION_DELAY } from "./constants.ts";
import * as S from "./style";
import PepeImg from "../../assets/pepe.png";

export const AnimationComponent: FC = () => {
  const [colorOffset, setColorOffset] = useState(0);
  const [isLogoShown, setLogoShown] = useState(false);
  const viewportRange = useRef<[number, number] | null>(null);

  const startColorChange = () => {
    const timer = setTimeout(() => {
      setColorOffset(COLOR_OFFSET_DEG);
      setLogoShown(true);
    }, ANIMATION_DELAY);
    return () => clearTimeout(timer);
  };

  const getBallsConfig = useCallback((screenWidth: number) => {
    const config = {
      amount: 0,
      radiusMultiplier: 0,
    };

    if (screenWidth <= 767) {
      config.amount = 22;
      config.radiusMultiplier = 3;
    } else if (screenWidth <= 1439) {
      config.amount = 33;
      config.radiusMultiplier = 4;
    } else {
      config.amount = 50;
      config.radiusMultiplier = 6;
    }
    return config;
  }, []);

  const setViewportRange = useCallback((screenWidth: number) => {
    if (screenWidth >= 1440) {
      viewportRange.current = [Infinity, 1440];
    } else if (screenWidth <= 1439 && screenWidth >= 768) {
      viewportRange.current = [1439, 768];
    } else {
      viewportRange.current = [767, 0];
    }
  }, []);

  useEffect(() => {
    const ballsCanvas = new BallsCanvas();

    const handleResize = (evt: any) => {
      if (!viewportRange.current) {
        return;
      }
      const [to, from] = viewportRange.current;
      if (
        evt.currentTarget.innerWidth <= to &&
        evt.currentTarget.innerWidth >= from
      ) {
        return;
      } else {
        setViewportRange(evt.currentTarget.innerWidth);
        ballsCanvas.reRender(getBallsConfig(evt.currentTarget.innerWidth));
      }
    };

    const windowWidth = window.innerWidth;

    setViewportRange(windowWidth);
    ballsCanvas.init(getBallsConfig(windowWidth));
    startColorChange();
    window.addEventListener("resize", handleResize);

    return () => {
      ballsCanvas.destroy();
      window.removeEventListener("resize", handleResize);
    };
  }, [getBallsConfig, setViewportRange]);

  return (
    <S.Container>
      <S.CanvasContainer $colorOffset={colorOffset} className="canvas-section">
        <S.Canvas />
      </S.CanvasContainer>
      <S.LogoContainer $isLogoShown={isLogoShown}>
        <S.ImageContent src={PepeImg} />
      </S.LogoContainer>
    </S.Container>
  );
};
