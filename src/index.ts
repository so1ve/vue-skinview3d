import type { PropType } from "vue";
import {
  defineComponent,
  h,
  ref,
  shallowRef,
  watch,
  watchPostEffect,
} from "vue";
import type { CapeLoadOptions, SkinLoadOptions } from "skinview3d";
import { SkinViewer } from "skinview3d";

import type { Layers } from "./types";

export * from "./types";

const LAYER_PARTS = [
  "head",
  "body",
  "rightArm",
  "leftArm",
  "rightLeg",
  "leftLeg",
] as const;
const LAYER_TYPES = ["inner", "outer"] as const;

export const SkinView3d = defineComponent({
  name: "SkinView3d",
  props: {
    width: {
      type: Number,
    },
    height: {
      type: Number,
    },
    skinUrl: {
      type: String,
      default: null,
    },
    skinOptions: {
      type: Object as PropType<SkinLoadOptions>,
    },
    capeUrl: {
      type: String,
      default: null,
    },
    capeOptions: {
      type: Object as PropType<CapeLoadOptions>,
    },
    enableRotate: {
      type: Boolean,
      default: true,
    },
    enableZoom: {
      type: Boolean,
      default: true,
    },
    enablePan: {
      type: Boolean,
      default: false,
    },
    layers: {
      type: Object as PropType<Layers>,
      default: () =>
        ({
          inner: {
            head: true,
            body: true,
            rightArm: true,
            leftArm: true,
            rightLeg: true,
            leftLeg: true,
          },
          outer: {
            head: true,
            body: true,
            rightArm: true,
            leftArm: true,
            rightLeg: true,
            leftLeg: true,
          },
        } as Layers),
    },
  },
  setup: (props, { expose }) => {
    const viewer = shallowRef<SkinViewer>();
    const canvasRef = ref<HTMLCanvasElement>();

    expose({ viewer });

    watchPostEffect((onCleanup) => {
      if (!canvasRef.value) {
        return;
      }

      viewer.value = new SkinViewer({
        canvas: canvasRef.value,
      });

      viewer.value?.loadSkin(props.skinUrl, props.skinOptions);
      viewer.value?.loadCape(props.capeUrl, props.capeOptions);

      onCleanup(() => {
        viewer.value?.dispose();
      });
    });

    watchPostEffect(() => {
      viewer.value?.setSize(Number(props.width), Number(props.height));
    });

    watch(
      [() => props.skinUrl, props.skinOptions],
      () => {
        viewer.value?.loadSkin(props.skinUrl, props.skinOptions);
      },
      { immediate: true },
    );

    watch(
      [() => props.capeUrl, props.capeOptions],
      () => {
        viewer.value?.loadCape(props.capeUrl, props.capeOptions);
      },
      { immediate: true, flush: "post" },
    );

    watchPostEffect(() => {
      viewer.value && (viewer.value.controls.enableRotate = props.enableRotate);
    });

    watchPostEffect(() => {
      viewer.value && (viewer.value.controls.enableZoom = props.enableZoom);
    });

    watchPostEffect(() => {
      viewer.value && (viewer.value.controls.enablePan = props.enablePan);
    });

    watchPostEffect(() => {
      if (!viewer.value) {
        return;
      }
      for (const part of LAYER_PARTS) {
        for (const layer of LAYER_TYPES) {
          viewer.value.playerObject.skin[part][`${layer}Layer`].visible =
            props.layers[layer][part];
        }
      }
    });

    return () => h("canvas", { ref: canvasRef });
  },
});
