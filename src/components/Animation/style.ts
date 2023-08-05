import styled from "styled-components";

export const Container = styled.div`
  position: relative;
  background-color: #ededf3;
  height: 560px;
  width: 100%;
  border-radius: 20px;

  display: flex;
  justify-content: center;
  align-items: center;
`;

export const CanvasContainer = styled.div<{ $colorOffset: number }>`
  width: 100%;
  height: 100%;

  transition: filter 1s ease-in-out;

  filter: hue-rotate(${(props) => props.$colorOffset}deg);
`;

export const Canvas = styled.canvas`
  width: 100%;
  height: 100%;
`;

export const LogoContainer = styled.div<{ $isLogoShown: boolean }>`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 229px;
  height: 229px;
  border-radius: 50%;
  background-color: transparent;

  opacity: ${(props) => (props.$isLogoShown ? 1 : 0)};
  transition: opacity 1s ease-in-out;

  @media (max-width: 767px) {
    width: 150px;
    height: 150px;
  }
`;

export const ImageContent = styled.img`
  object-fit: cover;
  width: 100%;
  height: 100%;
  padding: 5px;
`;
