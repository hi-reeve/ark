import {
  children,
  createEffect,
  splitProps,
  type Component,
  type ComponentProps,
  type JSX,
} from 'solid-js'
import { Dynamic } from 'solid-js/web'
import { spread } from '../spread'
import { ssrSpread } from '../ssr-spread'

type DOMElements = keyof JSX.IntrinsicElements

type ElementType = DOMElements | Component<any>

type AsChildProps<Props extends { children?: unknown }> =
  | { asChild: true; children: JSX.Element | Node }
  | { asChild?: false; children?: Props['children'] }

export type WithAsChildProps<Props extends { children?: unknown }> = Omit<Props, 'children'> &
  AsChildProps<Props>

type ComponentWithAsChildProps<T extends ElementType> = Component<
  WithAsChildProps<ComponentProps<T>>
>

type JsxFactoryFn<T extends ElementType = ElementType> = (
  component: T,
) => ComponentWithAsChildProps<T>

type JsxElements = {
  [K in keyof JSX.IntrinsicElements]: ComponentWithAsChildProps<K>
}

function withAsChild(Component: ElementType) {
  return function jsx(props: ComponentProps<ElementType>) {
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
  }) as unknown as JsxFactoryFn & JsxElements
}

export const ark = jsxFactory()
