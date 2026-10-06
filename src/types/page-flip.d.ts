// page-flip ships no type declarations — just the parts the reader uses.
declare module "page-flip" {
  export type FlipCorner = "top" | "bottom";
  export type Orientation = "portrait" | "landscape";
  export type FlippingState = "user_fold" | "fold_corner" | "flipping" | "read";

  export interface FlipSetting {
    startPage: number;
    size: "fixed" | "stretch";
    width: number;
    height: number;
    minWidth: number;
    maxWidth: number;
    minHeight: number;
    maxHeight: number;
    drawShadow: boolean;
    flippingTime: number;
    usePortrait: boolean;
    startZIndex: number;
    autoSize: boolean;
    maxShadowOpacity: number;
    showCover: boolean;
    mobileScrollSupport: boolean;
    clickEventForward: boolean;
    useMouseEvents: boolean;
    swipeDistance: number;
    showPageCorners: boolean;
    disableFlipByClick: boolean;
  }

  export interface WidgetEvent<T> {
    data: T;
    object: PageFlip;
  }

  export class PageFlip {
    constructor(element: HTMLElement, settings: Partial<FlipSetting>);
    loadFromHTML(items: NodeListOf<HTMLElement> | HTMLElement[]): void;
    destroy(): void;
    update(): void;
    flipNext(corner?: FlipCorner): void;
    flipPrev(corner?: FlipCorner): void;
    flip(page: number, corner?: FlipCorner): void;
    turnToPage(page: number): void;
    getPageCount(): number;
    getCurrentPageIndex(): number;
    getOrientation(): Orientation;
    getState(): FlippingState;
    /** Internal renderer; its rAF loop keeps running after destroy(). */
    getRender(): { render: (timer: number) => void };
    on(event: "flip", cb: (e: WidgetEvent<number>) => void): void;
    on(event: "changeOrientation", cb: (e: WidgetEvent<Orientation>) => void): void;
    on(event: "changeState", cb: (e: WidgetEvent<FlippingState>) => void): void;
    on(event: "init", cb: (e: WidgetEvent<{ page: number; mode: Orientation }>) => void): void;
  }
}
