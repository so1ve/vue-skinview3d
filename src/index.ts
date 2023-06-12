import {
  defineComponent,
  h,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from "vue";
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

    onMounted(() => {
      viewer.value = new SkinViewer({
        canvas: canvasRef.value,
        width: props.width,
        height: props.height,
      });

      props.skinUrl && viewer.value.loadSkin(props.skinUrl);
      props.capeUrl && viewer.value.loadCape(props.capeUrl);
    });

    onBeforeUnmount(() => {
      viewer.value?.dispose();
    });

    watch([() => props.width, () => props.height], ([newWidth, newHeight]) => {
      viewer.value?.setSize(Number(newWidth), Number(newHeight));
    });

    watch(
      () => props.skinUrl,
      (newSkin) => {
        newSkin && viewer.value?.loadSkin(newSkin);
      },
    );

    watch(
      () => props.capeUrl,
      (newCape) => {
        newCape && viewer.value?.loadCape(newCape);
      },
    );

    return () => h("canvas", { ref: canvasRef });
  },
});
