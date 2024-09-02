import type { Ref } from 'vue'
import { ref } from 'vue'
import type { RenderStrategy } from './renderStrategies'

// 将 RendererComposition 类型定义移到这里
export interface RendererComposition {
  render: (encodedEvents: string[]) => void
  start: () => void
  pause: () => void
  currentTime: Ref<number>
  isPlaying: Ref<boolean>
  setStrategy: (strategy: RenderStrategy) => void
}

export class Renderer {
  private strategy: RenderStrategy
  private isPlaying: Ref<boolean> = ref(false)
  private currentTime: Ref<number> = ref(0)

  constructor(strategy: RenderStrategy) {
    this.strategy = strategy
  }

  setStrategy(strategy: RenderStrategy): void {
    this.strategy = strategy
  }

  render(encodedEvents: string[]): void {
    this.strategy.render(encodedEvents)
  }

  start(): void {
    this.isPlaying.value = true
    console.log('开始播放')
  }

  pause(): void {
    this.isPlaying.value = false
    console.log('暂停播放')
  }

  getCurrentTime(): Ref<number> {
    return this.currentTime
  }

  getIsPlaying(): Ref<boolean> {
    return this.isPlaying
  }
}

// 组合式函数
export function useRenderer(initialStrategy: RenderStrategy): RendererComposition {
  const renderer = new Renderer(initialStrategy)

  return {
    render: (encodedEvents: string[]): void => renderer.render(encodedEvents),
    start: (): void => renderer.start(),
    pause: (): void => renderer.pause(),
    currentTime: renderer.getCurrentTime(),
    isPlaying: renderer.getIsPlaying(),
    setStrategy: (strategy: RenderStrategy): void => renderer.setStrategy(strategy),
  }
}
