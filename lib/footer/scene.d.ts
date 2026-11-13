export type FooterScene = {
  cleanup(): void;
  /** Y (px, in the scene element) of ridge i (0 = front) at x px. */
  ridgeY(i: number, x: number): number;
  ridgeCount: number;
};
/** Start the footer ASCII landscape on `canvas`, sized to `scene`. */
export declare function createFooterScene(canvas: HTMLCanvasElement, scene: HTMLElement, opts?: { reduced?: boolean }): FooterScene;
