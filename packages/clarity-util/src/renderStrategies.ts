/* eslint-disable no-console */

/// <reference lib="dom" />
import type { Data } from 'clarity-decode'
import { Visualizer } from 'clarity-visualize'
import { decode } from 'clarity-decode'

// 渲染策略接口
export interface RenderStrategy {
  render: (encodedEvents: string[]) => void
  reset: (envelope: Data.Envelope, userAgent?: string) => void
  dataChange: (message: any, isReset?: boolean) => void
  resize: (width: number, height: number) => void
}

// 录制渲染策略
export class RecordingRenderStrategy implements RenderStrategy {
  private iframe: HTMLIFrameElement
  private container: HTMLElement
  private id: string
  private scale: number = 1
  private visualizer: Visualizer
  private events: Data.DecodedEvent[] = []
  private dJson: Data.DecodedPayload[] = []
  private totalTime: number = 0
  private currentTime: number = 0
  private isPaused: boolean = false

  constructor(el: HTMLElement, id?: string) {
    this.container = document.createElement('div')
    this.id = id || Math.random().toString(36).substr(2, 9)
    this.container.id = `tj-recording-container-${this.id}`
    this.container.style.cssText = `
      width: 100%;
      height: 100%;
      overflow: hidden;
      position: relative;
    `
    this.iframe = document.createElement('iframe')
    this.iframe.id = `tj-recording-iframe-${this.id}`
    this.iframe.style.cssText = `
      width: 100%;
      height: 100%;
      border: none;
      position: absolute;
      top: 0;
      left: 0;
    `
    this.container.appendChild(this.iframe)
    el.appendChild(this.container)

    this.visualizer = new Visualizer()
  }

  reset(envelope: Data.Envelope, userAgent?: string): void {
    console.clear()
    this.iframe.srcdoc = '<!DOCTYPE html><html><head></head><body></body></html>'
    this.events = []
    this.dJson = []
    this.currentTime = 0
    this.totalTime = 0

    const mobile = this.isMobileDevice(userAgent)
    this.visualizer.setup(this.iframe.contentWindow as Window, { version: envelope.version, onresize: this.resize.bind(this), mobile })
  }

  dataChange(message: any, isReset = false): void {
    if (message) {
      const decoded = decode(message)
      if (isReset || decoded.envelope.sequence === 1 || this.visualizer.state === null) {
        this.reset(decoded.envelope, decoded.dimension?.[0].data[0][0])
      }
      this.dJson.push(decoded)
      const merged = this.visualizer.merge([decoded]) as any
      this.events = this.events.concat(merged.events).sort(this.sort)
      this.totalTime = merged.events[merged.events.length - 1].time
      if (merged.dom) {
        this.visualizer.dom(merged.dom)
      }
    }
  }

  render(encodedEvents: string[]): void {
    if (encodedEvents.length > 0) {
      encodedEvents.forEach(event => this.dataChange(event))
    }
    this.playEvents()
  }

  private playEvents(): void {
    if (!this.isPaused && this.events.length > 0) {
      const end = this.currentTime + 16 // 60FPS => 16ms / frame
      this.currentTime = Math.min(end, this.totalTime)

      let index = 0
      while (index < this.events.length && this.events[index].time < end) {
        index++
      }
      this.visualizer.render(this.events.splice(0, index))
    }
    requestAnimationFrame(this.playEvents.bind(this))
  }

  resize(width: number, height: number): void {
    const offsetTop = this.iframe.offsetTop
    const offsetLeft = this.iframe.offsetLeft
    const availableWidth = this.container.offsetWidth
    const availableHeight = this.container.offsetHeight - offsetTop
    this.scale = Math.min(Math.min(availableWidth / width, 1), Math.min(availableHeight / height, 1))
    Object.assign(this.iframe.style, {
      position: 'absolute',
      width: `${width}px`,
      height: `${height}px`,
      transformOrigin: '0 0 0',
      transform: `scale(${this.scale})`,
      border: '1px solid #cccccc',
      overflow: 'hidden',
      left: `${offsetLeft}px`,
    })
  }

  private sort(a: Data.DecodedEvent, b: Data.DecodedEvent): number {
    return a.time - b.time
  }

  private isMobileDevice(userAgent?: string): boolean {
    if (!userAgent) {
      return false
    }
    return /android|webos|iphone|ipad|ipod|blackberry|windows phone|opera mini|iemobile|mobile|silk|fennec|bada|tizen|symbian|nokia|palmsource|meego|sailfish|kindle|playbook|bb10|rim/i.test(userAgent)
  }
}

// 热力图渲染策略保持不变
export class HeatmapRenderStrategy implements RenderStrategy {
  render(encodedEvents: string[]): void {
    console.log('执行热力图渲染')
  }

  reset(): void {
    // 实现热力图的重置逻辑
  }

  dataChange(): void {
    // 实现热力图的数据变化逻辑
  }

  resize(): void {
    // 实现热力图的调整大小逻辑
  }
}
