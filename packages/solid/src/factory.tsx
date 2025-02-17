/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  children,
  createEffect,
  splitProps,
  type Component,
  type ComponentProps,
  type JSX,
  type ParentProps,
} from 'solid-js'
import { Dynamic } from 'solid-js/web'
import { spread } from './spread'
import { ssrSpread } from './ssr-spread'

type ElementType = keyof JSX.IntrinsicElements | Component<any>

export type AsChildProps = {
  asChild?: boolean
}

type JsxElements = {
  [E in keyof JSX.IntrinsicElements]: AsChildForwardRefComponent<E>
}

export type AsChildForwardRefComponent<E extends ElementType> = Component<AsChildComponentProps<E>>

export type AsChildComponentProps<E extends ElementType> = ComponentProps<E> & AsChildProps

export type HTMLArkProps<T extends ElementType> = AsChildComponentProps<T>

function withAsChild(Component: ElementType) {
  return function jsx(props: ParentProps<AsChildProps>) {
    const [localProps, restProps] = splitProps(props, ['asChild', 'children'])

    if (!localProps.asChild) {
      return (
        <Dynamic component={Component} {...restProps}>
          {localProps.children}
        </Dynamic>
      )
    }

    const getChildren = children(() => ssrSpread(localProps.children, restProps))

    createEffect(() => {
      const children = getChildren()
      if (children instanceof HTMLElement) {
        spread(children, restProps)
      }
    })

    return getChildren
  }
}

export function jsxFactory() {
  const cache = new Map()

  return new Proxy(withAsChild, {
    apply(target, thisArg, argArray) {
      return withAsChild(argArray[0])
    },
    get(_, element) {
      const asElement = element as ElementType
      if (!cache.has(asElement)) {
        cache.set(asElement, withAsChild(asElement))
      }
      return cache.get(asElement)
    },
  }) as unknown as JsxElements
}

export const ark = jsxFactory()
