import { editableAnatomy } from '@ark-ui/react'
import { defineRecipe } from 'css-panda'
import { defineParts } from './define-parts'

const parts = defineParts(editableAnatomy.build())

export const editable = defineRecipe({
  name: 'editable',
  description: 'A editable style',
  base: parts({
    root: {
      width: 'full',
    },
  }),
})
