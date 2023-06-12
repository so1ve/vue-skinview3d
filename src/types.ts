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
