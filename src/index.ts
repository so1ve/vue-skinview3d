import type { PlayerAnimation } from "skinview3d";
import { SkinViewer } from "skinview3d";
import type { PropType } from "vue";
import { defineComponent, h, ref, shallowRef, watchPostEffect } from "vue";

import type { Background, CapeOptions, Layers, SkinOptions } from "./types";

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
const VIEWER_PROPS = [
	"fov",
	"zoom",
	"autoRotate",
	"autoRotateSpeed",
	"animation",
	"nameTag",
] as const;
const CONTROLS_PROPS = ["enableRotate", "enableZoom", "enablePan"] as const;

export const SkinView3d = defineComponent({
	name: "SkinView3d",
	props: {
		width: {
			type: Number,
		},
		height: {
			type: Number,
		},
		fov: {
			type: Number,
			default: 70,
			validator(value: number) {
				return value > 0 && value < 180;
			},
		},
		zoom: {
			type: Number,
			default: 0.9,
		},
		globalLight: {
			type: Number,
			default: 0.4,
		},
		cameraLight: {
			type: Number,
			default: 0.6,
		},
		skinUrl: {
			type: String,
			default: null,
		},
		skinOptions: {
			type: Object as PropType<SkinOptions>,
		},
		capeUrl: {
			type: String,
			default: null,
		},
		capeOptions: {
			type: Object as PropType<CapeOptions>,
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
				}) as Layers,
		},
		autoRotate: {
			type: Boolean,
			default: false,
		},
		autoRotateSpeed: {
			type: Number,
			default: 2,
		},
		animation: {
			type: Object as PropType<PlayerAnimation | null>,
			default: null,
		},
		background: {
			type: Object as PropType<Background>,
		},
		nameTag: {
			type: String as PropType<string | null>,
			default: null,
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

			onCleanup(() => {
				viewer.value?.dispose();
			});
		});

		watchPostEffect(() => {
			viewer.value?.setSize(Number(props.width), Number(props.height));
		});

		for (const prop of VIEWER_PROPS) {
			watchPostEffect(() => {
				viewer.value && ((viewer.value[prop] as any) = props[prop]);
			});
		}

		watchPostEffect(() => {
			viewer.value && (viewer.value.globalLight.intensity = props.globalLight);
		});

		watchPostEffect(() => {
			viewer.value && (viewer.value.cameraLight.intensity = props.cameraLight);
		});

		watchPostEffect(() => {
			// Force trigger watcher
			// eslint-disable-next-line no-unused-expressions
			props.skinOptions?.ears;
			// eslint-disable-next-line no-unused-expressions
			props.skinOptions?.model;
			if (!props.skinOptions?.ears) {
				viewer.value?.loadEars(null);
			}
			viewer.value?.loadSkin(props.skinUrl, props.skinOptions);
		});

		watchPostEffect(() => {
			// Force trigger watcher
			// eslint-disable-next-line no-unused-expressions
			props.capeOptions?.backEquipment;
			viewer.value?.loadCape(props.capeUrl, props.capeOptions);
		});

		for (const prop of CONTROLS_PROPS) {
			watchPostEffect(() => {
				viewer.value && (viewer.value.controls[prop] = props[prop]);
			});
		}

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

		watchPostEffect(() => {
			if (!viewer.value) {
				return;
			}
			if (!props.background) {
				viewer.value.background = null;
			} else if (props.background.type === "color") {
				viewer.value.background = props.background.value;
			} else if (props.background.type === "image") {
				viewer.value.loadBackground(props.background.value);
			} else if (props.background.type === "panorama") {
				viewer.value.loadPanorama(props.background.value);
			}
		});

		return () => h("canvas", { ref: canvasRef });
	},
});
