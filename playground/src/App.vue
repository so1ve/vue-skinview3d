<script setup lang="ts">
import { computed, reactive, ref, watch } from "vue";
import {
  FlyingAnimation,
  IdleAnimation,
  RunningAnimation,
  WalkingAnimation,
} from "skinview3d";
import type { CapeLoadOptions, SkinLoadOptions, SkinViewer } from "skinview3d";
import type { Layers } from "vue-skinview3d";
import { SkinView3d } from "vue-skinview3d";

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

const skinViewRef = ref();
const viewer = computed<SkinViewer>(() => skinViewRef.value.viewer);
const width = ref(300);
const height = ref(300);
const fov = ref(70);
const zoom = ref(0.9);
const globalLight = ref(0.4);
const cameraLight = ref(0.6);
const autoRotate = ref(false);
const autoRotateSpeed = ref(2);
const animation = ref("" as "" | keyof typeof availableAnimations);
const animationClass = computed(() =>
  animation.value === "" ? null : availableAnimations[animation.value],
);
const animationSpeed = ref(1);
const animationPlaying = ref(true);
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
const capeOptions = reactive<CapeLoadOptions>({
  backEquipment: "cape",
});
const skinOptions = reactive<SkinLoadOptions>({
  model: "auto-detect",
});

function setAnimation() {
  viewer.value.animation &&
    (viewer.value.animation.speed = animationSpeed.value);
  viewer.value.animation &&
    (viewer.value.animation.paused = !animationPlaying.value);
}

watch(fov, () => {
  viewer.value.fov = fov.value;
});
watch(zoom, () => {
  viewer.value.zoom = zoom.value;
});
watch(globalLight, () => {
  viewer.value.globalLight.intensity = globalLight.value;
});
watch(cameraLight, () => {
  viewer.value.cameraLight.intensity = cameraLight.value;
});
watch(autoRotate, () => {
  viewer.value.autoRotate = autoRotate.value;
});
watch(autoRotateSpeed, () => {
  viewer.value.autoRotateSpeed = autoRotateSpeed.value;
});
watch(animationClass, () => {
  viewer.value.animation = animationClass.value;
  setAnimation();
});
watch(animationSpeed, () => {
  setAnimation();
});
watch(animationPlaying, () => {
  setAnimation();
});
</script>

<template>
  <SkinView3d
    ref="skinViewRef"
    :cape-options="capeOptions"
    :enable-pan="controls.pan"
    :enable-rotate="controls.rotate"
    :enable-zoom="controls.zoom"
    :height="height"
    :layers="layers"
    :skin-options="skinOptions"
    :skin-url="skinUrl"
    :width="width"
  />
  <div class="controls">
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
          <input v-model="animation" checked type="radio" value="" />
          None
        </label>
        <label>
          <input v-model="animation" type="radio" value="idle" />
          Idle
        </label>
        <label>
          <input
            v-model="animation"
            name="animation"
            type="radio"
            value="walk"
          />
          Walk
        </label>
        <label>
          <input
            v-model="animation"
            name="animation"
            type="radio"
            value="run"
          />
          Run
        </label>
        <label>
          <input
            v-model="animation"
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
      <table id="layers_table">
        <thead>
          <tr>
            <th></th>
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
          <input
            id="skin_url_upload"
            accept="image/*"
            class="hidden"
            type="file"
          />
          <button id="skin_url_unset" class="control hidden" type="button">
            Unset
          </button>
          <button
            class="control"
            onclick="document.getElementById('skin_url_upload').click();"
            type="button"
          >
            Browse...
          </button>
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
          <input
            id="cape_url"
            list="default_capes"
            placeholder="none"
            size="20"
            type="text"
            value="img/mojang_cape.png"
          />
        </label>
        <datalist id="default_capes">
          <option value=""></option>
          <option value="img/mojang_cape.png"></option>
          <option value="img/legacy_cape.png"></option>
          <option value="img/hd_cape.png"></option>
        </datalist>
        <input
          id="cape_url_upload"
          accept="image/*"
          class="hidden"
          type="file"
        />
        <button id="cape_url_unset" class="control hidden" type="button">
          Unset
        </button>
        <button
          class="control"
          onclick="document.getElementById('cape_url_upload').click();"
          type="button"
        >
          Browse...
        </button>
      </div>
    </div>
  </div>
</template>
