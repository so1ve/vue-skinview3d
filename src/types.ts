import type { CapeLoadOptions, SkinLoadOptions } from "skinview3d";

interface SubLayer {
  head: boolean;
  body: boolean;
  rightArm: boolean;
  leftArm: boolean;
  rightLeg: boolean;
  leftLeg: boolean;
}
export interface Layers {
  inner: SubLayer;
  outer: SubLayer;
}
export type SkinOptions = Omit<SkinLoadOptions, "makeVisible">;
export type CapeOptions = Omit<CapeLoadOptions, "makeVisible">;
