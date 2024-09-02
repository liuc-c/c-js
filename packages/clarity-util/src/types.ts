import type { Ref } from 'vue'
import type { RenderStrategy } from './renderStrategies'

export interface RendererComposition {
  render: () => void
  start: () => void
  pause: () => void
  currentTime: Ref<number>
  isPlaying: Ref<boolean>
  setStrategy: (strategy: RenderStrategy) => void
}
