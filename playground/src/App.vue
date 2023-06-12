<script setup lang="ts">
import { computed, ref, watch } from "vue";
import type { SkinViewer } from "skinview3d";
import {
  FlyingAnimation,
  IdleAnimation,
  RunningAnimation,
  WalkingAnimation,
} from "skinview3d";

import { SkinView3d } from "../../src";

const availableAnimations = {
  idle: new IdleAnimation(),
  walk: new WalkingAnimation(),
  run: new RunningAnimation(),
  fly: new FlyingAnimation(),
};

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
    :height="height"
    skin-url="img/hatsune_miku.png"
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
  </div>
</template>
