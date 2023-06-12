import { defineComponent, h, ref, shallowRef, watchPostEffect } from "vue";
import { SkinViewer } from "skinview3d";

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
    capeUrl: {
      type: String,
      default: null,
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
  },
  setup: (props, { expose }) => {
    const viewer = shallowRef<SkinViewer>();
    const canvasRef = ref<HTMLCanvasElement>();

    expose({ viewer });

    const stop = watchPostEffect((onCleanup) => {
      if (!canvasRef.value) {
        return;
      }

      viewer.value = new SkinViewer({
        canvas: canvasRef.value,
      });

      onCleanup(() => {
        stop();
      });
    });

    watchPostEffect(() => {
      viewer.value?.setSize(Number(props.width), Number(props.height));
    });

    watchPostEffect(() => {
      props.skinUrl && viewer.value?.loadSkin(props.skinUrl);
    });

    watchPostEffect(() => {
      props.capeUrl && viewer.value?.loadCape(props.capeUrl);
    });

    watchPostEffect(() => {
      viewer.value && (viewer.value.controls.enableRotate = props.enableRotate);
    });

    watchPostEffect(() => {
      viewer.value && (viewer.value.controls.enableZoom = props.enableZoom);
    });

    watchPostEffect(() => {
      viewer.value && (viewer.value.controls.enablePan = props.enablePan);
    });

    return () => h("canvas", { ref: canvasRef });
  },
});
