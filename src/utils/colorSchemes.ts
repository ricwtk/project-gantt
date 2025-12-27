// src/utils/colorSchemes.ts

/**
 * Color schemes for Gantt charts
 * Based on ColorBrewer color palettes
 */

export interface ColorScheme {
  name: string
  colors: string[]
  type: 'qualitative' | 'sequential' | 'diverging'
}

export const colorSchemes: Record<string, ColorScheme> = {
  Set1: {
    name: 'Set 1',
    type: 'qualitative',
    colors: [
      '#e41a1c',
      '#377eb8',
      '#4daf4a',
      '#984ea3',
      '#ff7f00',
      '#ffff33',
      '#a65628',
      '#f781bf',
      '#999999',
    ],
  },
  Set2: {
    name: 'Set 2',
    type: 'qualitative',
    colors: [
      '#66c2a5',
      '#fc8d62',
      '#8da0cb',
      '#e78ac3',
      '#a6d854',
      '#ffd92f',
      '#e5c494',
      '#b3b3b3',
    ],
  },
  Set3: {
    name: 'Set 3',
    type: 'qualitative',
    colors: [
      '#8dd3c7',
      '#ffffb3',
      '#bebada',
      '#fb8072',
      '#80b1d3',
      '#fdb462',
      '#b3de69',
      '#fccde5',
      '#d9d9d9',
      '#bc80bd',
      '#ccebc5',
      '#ffed6f',
    ],
  },
  Pastel1: {
    name: 'Pastel 1',
    type: 'qualitative',
    colors: [
      '#fbb4ae',
      '#b3cde3',
      '#ccebc5',
      '#decbe4',
      '#fed9a6',
      '#ffffcc',
      '#e5d8bd',
      '#fddaec',
      '#f2f2f2',
    ],
  },
  Pastel2: {
    name: 'Pastel 2',
    type: 'qualitative',
    colors: [
      '#b3e2cd',
      '#fdcdac',
      '#cbd5e8',
      '#f4cae4',
      '#e6f5c9',
      '#fff2ae',
      '#f1e2cc',
      '#cccccc',
    ],
  },
}

/**
 * Get a color from a scheme by index
 */
export function getColorFromScheme(
  schemeName: string,
  index: number
): string {
  const scheme = colorSchemes[schemeName] || colorSchemes.Set3
  const colors = scheme!.colors
  return colors[index % colors.length] as string
}

/**
 * Get all available color scheme names
 */
export function getColorSchemeNames(): string[] {
  return Object.keys(colorSchemes)
}

/**
 * Get a color scheme object
 */
export function getColorScheme(name: string): ColorScheme {
  return colorSchemes[name] || colorSchemes.Set3 as ColorScheme
}

/**
 * Generate a color palette for tasks
 */
export function generateTaskColors(
  taskCount: number,
  schemeName: string = 'Set3'
): string[] {
  const scheme = getColorScheme(schemeName)
  const colors: string[] = []

  for (let i = 0; i < taskCount; i++) {
    colors.push(getColorFromScheme(schemeName, i))
  }

  return colors
}

/**
 * Lighten a hex color
 */
export function lightenColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16)
  const amt = Math.round(2.55 * percent)
  const R = (num >> 16) + amt
  const G = ((num >> 8) & 0x00ff) + amt
  const B = (num & 0x0000ff) + amt

  return (
    '#' +
    (
      0x1000000 +
      (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
      (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
      (B < 255 ? (B < 1 ? 0 : B) : 255)
    )
      .toString(16)
      .slice(1)
  )
}

/**
 * Darken a hex color
 */
export function darkenColor(hex: string, percent: number): string {
  return lightenColor(hex, -percent)
}

/**
 * Check if a color is light or dark
 */
export function isLightColor(hex: string): boolean {
  const num = parseInt(hex.replace('#', ''), 16)
  const r = (num >> 16) & 255
  const g = (num >> 8) & 255
  const b = num & 255

  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255

  return luminance > 0.5
}

/**
 * Get contrasting text color (black or white) for a background color
 */
export function getContrastColor(hex: string): string {
  return isLightColor(hex) ? '#000000' : '#ffffff'
}

/**
 * Validate hex color format
 */
export function isValidHexColor(hex: string): boolean {
  return /^#[0-9A-F]{6}$/i.test(hex)
}

/**
 * Convert hex to RGB
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1] as string, 16),
        g: parseInt(result[2] as string, 16),
        b: parseInt(result[3] as string, 16),
      }
    : null
}

/**
 * Convert RGB to hex
 */
export function rgbToHex(r: number, g: number, b: number): string {
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
}
