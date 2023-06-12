import { defineComponent, h, ref, watchPostEffect } from "vue";
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
  },
  setup: (props, { expose }) => {
    const viewer = ref<SkinViewer>();
    const canvasRef = ref<HTMLCanvasElement>();

    expose({ viewer });

    watchPostEffect((onCleanup) => {
      if (!canvasRef.value) {
        return;
      }
      viewer.value = new SkinViewer({
        canvas: canvasRef.value,
        width: props.width,
        height: props.height,
      });

      props.skinUrl && viewer.value.loadSkin(props.skinUrl);
      props.capeUrl && viewer.value.loadCape(props.capeUrl);

      onCleanup(() => {
        viewer.value?.dispose();
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

    return () => h("canvas", { ref: canvasRef });
  },
});
