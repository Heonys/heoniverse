export const setupCanvasSize = (canvas: HTMLCanvasElement, container: HTMLElement) => {
  const { width, height } = container.getBoundingClientRect();
  canvas.width = width;
  canvas.height = height;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
};
