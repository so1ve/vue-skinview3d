<script setup lang="ts">
import { useEventListener, useLocalStorage } from "@vueuse/core";
import type {
	CapeLoadOptions,
	PlayerAnimation,
	SkinLoadOptions,
} from "skinview3d";
import { computed, nextTick, onMounted, reactive, ref, watch } from "vue";
import type { Background, Layers } from "vue-skinview3d";
import { SkinView3d } from "vue-skinview3d";
import {
	FlyingAnimation,
	IdleAnimation,
	RunningAnimation,
	WalkingAnimation,
} from "vue-skinview3d/animations";

const availableAnimations = {
	idle: new IdleAnimation(),
	walk: new WalkingAnimation(),
	run: new RunningAnimation(),
	fly: new FlyingAnimation(),
};
const BUILTIN_SKINS = [
	"img/hatsune_miku.png",
	"img/1_8_texturemap_redux.png",
	"img/hacksore.png",
	"img/haka.png",
	"img/ironman_hd.png",
	"img/sethbling.png",
	"img/deadmau5.png",
];
const BUILTIN_CAPES = [
	"img/mojang_cape.png",
	"img/legacy_cape.png",
	"img/hd_cape.png",
];

const DEFAULT_WIDTH = 300;
const DEFAULT_HEIGHT = 300;
const width = ref(DEFAULT_WIDTH);
const height = ref(DEFAULT_HEIGHT);
const fov = ref(70);
const zoom = ref(0.6);
const globalLight = ref(0.4);
const cameraLight = ref(0.6);
const autoRotate = ref(false);
const autoRotateSpeed = ref(2);
const animationType = ref("" as "" | keyof typeof availableAnimations);
const animationSpeed = ref(1);
const animationPlaying = ref(true);
const animation = computed<PlayerAnimation | null>(() => {
	const animationClass =
		animationType.value === ""
			? null
			: availableAnimations[animationType.value];
	animationClass && (animationClass.speed = animationSpeed.value);
	animationClass && (animationClass.paused = !animationPlaying.value);

	return animationClass;
});
const controls = reactive({
	rotate: true,
	zoom: true,
	pan: false,
});
const layers = reactive<Layers>({
	inner: {
		head: true,
		body: true,
		leftArm: true,
		rightArm: true,
		leftLeg: true,
		rightLeg: true,
	},
	outer: {
		head: true,
		body: true,
		leftArm: true,
		rightArm: true,
		leftLeg: true,
		rightLeg: true,
	},
});
const skinUrl = ref("img/hatsune_miku.png");
const skinOptions = reactive<SkinLoadOptions>({
	model: "auto-detect",
	ears: false,
});
const capeUrl = ref("img/mojang_cape.png");
const capeOptions = reactive<CapeLoadOptions>({
	backEquipment: "cape",
});
const panorama = ref(true);
const panoramaUrl = computed(() =>
	panorama.value ? "img/panorama.png" : null,
);
const background = computed<Background | undefined>(() =>
	panoramaUrl.value
		? {
				type: "panorama",
				value: panoramaUrl.value,
			}
		: undefined,
);
const nameTag = ref("Hatsune Miku");
const skinRef = ref<HTMLElement | null>(null);

const enableWideUI = useLocalStorage("enableWideUI", false);
const wideUIClass = computed(() => ({ "wide-ui": enableWideUI.value }));

onMounted(adjustUI);
watch(enableWideUI, adjustUI);
useEventListener("resize", onResize);

function onResize() {
	if (enableWideUI.value) {
		height.value = skinRef.value!.offsetHeight;
		width.value = skinRef.value!.offsetWidth;
	}
}
async function adjustUI() {
	await nextTick();
	if (enableWideUI.value) {
		onResize();
	} else {
		height.value = DEFAULT_HEIGHT;
		width.value = DEFAULT_WIDTH;
	}
}
</script>

<template>
	<div class="container" :class="wideUIClass">
		<section ref="skinRef" class="section" :class="wideUIClass">
			<SkinView3d
				:animation="animation"
				:auto-rotate="autoRotate"
				:auto-rotate-speed="autoRotateSpeed"
				:background="background"
				:camera-light="cameraLight"
				:cape-options="capeOptions"
				:cape-url="capeUrl"
				:enable-pan="controls.pan"
				:enable-rotate="controls.rotate"
				:enable-zoom="controls.zoom"
				:fov="fov"
				:global-light="globalLight"
				:height="height"
				:layers="layers"
				:name-tag="nameTag || null"
				:skin-options="skinOptions"
				:skin-url="skinUrl"
				:width="width"
				:zoom="zoom"
			/>
		</section>
		<section class="controls" :class="wideUIClass">
			<div class="control-section">
				<h1>Viewport</h1>
				<div>
					<label class="control">
						Width:
						<input v-model="width" size="4" type="number" />
					</label>
					<label class="control">
						Height:
						<input v-model="height" size="4" type="number" />
					</label>
				</div>
				<div>
					<label class="control">
						FOV:
						<input
							v-model="fov"
							max="179"
							min="1"
							size="2"
							step="1"
							type="number"
						/>
					</label>
					<label class="control">
						Zoom:
						<input
							v-model="zoom"
							max="2.00"
							min="0.01"
							size="4"
							step="0.01"
							type="number"
						/>
					</label>
				</div>
			</div>
			<div class="control-section">
				<h1>Light</h1>
				<div>
					<label class="control">
						Global:
						<input
							v-model="globalLight"
							max="2.00"
							min="0.00"
							size="4"
							step="0.01"
							type="number"
						/>
					</label>
					<label class="control">
						Camera:
						<input
							v-model="cameraLight"
							max="2.00"
							min="0.00"
							size="4"
							step="0.01"
							type="number"
						/>
					</label>
				</div>
			</div>
			<div class="control-section">
				<h1>Rotation</h1>
				<label class="control">
					<input v-model="autoRotate" type="checkbox" />
					Enable
				</label>
				<label class="control">
					Speed:
					<input v-model="autoRotateSpeed" size="3" step="0.1" type="number" />
				</label>
			</div>
			<div class="control-section">
				<h1>Animation</h1>
				<div>
					<label>
						<input v-model="animationType" checked type="radio" value="" />
						None
					</label>
					<label>
						<input v-model="animationType" type="radio" value="idle" />
						Idle
					</label>
					<label>
						<input
							v-model="animationType"
							name="animation"
							type="radio"
							value="walk"
						/>
						Walk
					</label>
					<label>
						<input
							v-model="animationType"
							name="animation"
							type="radio"
							value="run"
						/>
						Run
					</label>
					<label>
						<input
							v-model="animationType"
							name="animation"
							type="radio"
							value="fly"
						/>
						Fly
					</label>
				</div>
				<label class="control">
					Speed:
					<input v-model="animationSpeed" size="3" step="0.1" type="number" />
				</label>
				<button
					class="control"
					type="button"
					@click="animationPlaying = !animationPlaying"
				>
					Pause / Resume
				</button>
			</div>
			<div class="control-section">
				<h1>Mouse Control</h1>
				<div class="control">
					<label>
						<input v-model="controls.rotate" type="checkbox" />
						Enable Rotate
					</label>
					<label>
						<input v-model="controls.zoom" type="checkbox" />
						Enable Zoom
					</label>
					<label>
						<input v-model="controls.pan" type="checkbox" />
						Enable Pan
					</label>
				</div>
			</div>
			<div class="control-section">
				<h1>Skin Layers</h1>
				<table>
					<thead>
						<tr>
							<th />
							<th>head</th>
							<th>body</th>
							<th>right arm</th>
							<th>left arm</th>
							<th>right leg</th>
							<th>left leg</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<th>inner</th>
							<td>
								<input v-model="layers.inner.head" type="checkbox" />
							</td>
							<td>
								<input v-model="layers.inner.body" type="checkbox" />
							</td>
							<td>
								<input v-model="layers.inner.rightArm" type="checkbox" />
							</td>
							<td>
								<input v-model="layers.inner.leftArm" type="checkbox" />
							</td>
							<td>
								<input v-model="layers.inner.rightLeg" type="checkbox" />
							</td>
							<td>
								<input v-model="layers.inner.leftLeg" type="checkbox" />
							</td>
						</tr>
						<tr>
							<th>outer</th>
							<td>
								<input v-model="layers.outer.head" type="checkbox" />
							</td>
							<td>
								<input v-model="layers.outer.body" type="checkbox" />
							</td>
							<td>
								<input v-model="layers.outer.rightArm" type="checkbox" />
							</td>
							<td>
								<input v-model="layers.outer.leftArm" type="checkbox" />
							</td>
							<td>
								<input v-model="layers.outer.rightLeg" type="checkbox" />
							</td>
							<td>
								<input v-model="layers.outer.leftLeg" type="checkbox" />
							</td>
						</tr>
					</tbody>
				</table>
				<div>
					<h2>Back Equipment</h2>
					<div class="control">
						<label>
							<input
								v-model="capeOptions.backEquipment"
								type="radio"
								value="cape"
							/>
							Cape
						</label>
						<label>
							<input
								v-model="capeOptions.backEquipment"
								type="radio"
								value="elytra"
							/>
							Elytra
						</label>
					</div>
				</div>
			</div>
			<div class="control-section">
				<h1>Skin</h1>
				<div>
					<div class="control">
						<label>
							URL:
							<select v-model="skinUrl">
								<option v-for="url in BUILTIN_SKINS" :key="url" :value="url">
									{{ url }}
								</option>
							</select>
						</label>
					</div>
				</div>
				<div>
					<label class="control">
						Model:
						<select v-model="skinOptions.model">
							<option selected value="auto-detect">Auto detect</option>
							<option value="default">Default</option>
							<option value="slim">Slim</option>
						</select>
					</label>
				</div>
			</div>
			<div class="control-section">
				<h1>Cape</h1>
				<div class="control">
					<label>
						URL:
						<select v-model="capeUrl">
							<option v-for="url in BUILTIN_CAPES" :key="url" :value="url">
								{{ url }}
							</option>
						</select>
					</label>
				</div>
			</div>
			<div class="control-section">
				<h1>Ears</h1>
				<div>
					<label class="control">
						<input v-model="skinOptions.ears" type="checkbox" />
						Enable
					</label>
				</div>
			</div>
			<div class="control-section">
				<h1>Panorama</h1>
				<div class="control">
					<label class="control">
						<input v-model="panorama" type="checkbox" />
						Enable
					</label>
				</div>
			</div>
			<div class="control-section">
				<h1>Name Tag</h1>
				<div class="control">
					<label>
						Text:
						<input v-model="nameTag" placeholder="none" size="20" type="text" />
					</label>
				</div>
			</div>
		</section>
		<footer :class="wideUIClass">
			<div>
				GitHub:
				<a href="https://github.com/so1ve/vue-skinview3d">
					so1ve/vue-skinview3d
				</a>
				<label class="control">
					<input v-model="enableWideUI" type="checkbox" />
					Enable wide UI
				</label>
			</div>
		</footer>
	</div>
</template>

<style scoped>
.container.wide-ui {
	display: grid;
	position: absolute;
	top: 5px;
	left: 5px;
	right: 5px;
	bottom: 5px;
	grid-template-columns: 40% 60%;
	grid-template-rows: calc(100% - 60px) 60px;
	grid-template-areas: "section controls" "footer footer";
}
.section.wide-ui {
	grid-area: section;
}
footer.wide-ui {
	grid-area: footer;
}
.controls.wide-ui {
	grid-area: controls;
	display: grid;
	justify-content: start;
	padding: 0 2rem;
	overflow: auto;
}
.controls.wide-ui .control-section {
	display: grid;
}
</style>
