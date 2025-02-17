import type { ColorSwatchProps } from '@zag-js/color-picker'
import { createContext } from '../create-context'

export const [ColorPickerSwatchProvider, useColorPickerSwatchContext] =
  createContext<ColorSwatchProps>({
    name: 'ColorPickerSwatchContext',
    hookName: 'useColorPickerSwatchContext',
    providerName: '<ColorPickerSwatchProvider />',
  })
