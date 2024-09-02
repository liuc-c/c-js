<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRenderer, RecordingRenderStrategy } from 'clarity-util'
import demoData from '../demo.json'
const container = ref<HTMLDivElement | null>(null)
const { render, start, pause, isPlaying } = useRenderer(new RecordingRenderStrategy(document.body))

onMounted(() => {
  const e = demoData.map(item => JSON.stringify(item))
  console.log(e);
  
  if (container.value) {
    const strategy = new RecordingRenderStrategy(container.value)
    render(e)
  }
})
</script>

<template>
  <div w-90vw h-90vh border-1 mx-auto ref="container">
  </div>
</template>
