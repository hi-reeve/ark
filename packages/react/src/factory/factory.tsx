/* eslint-disable @typescript-eslint/no-explicit-any */

import { mergeProps } from '@zag-js/react'
import { Children, forwardRef as __forwardRef, cloneElement, isValidElement } from 'react'
import { composeRefs } from './compose-refs'

type AsChildProps<Props extends { children?: unknown }> =
  | { asChild: true; children: React.ReactElement }
  | { asChild?: false; children?: Props['children'] }

export type WithAsChildProps<Props extends { children?: unknown }> = Omit<Props, 'children'> &
  AsChildProps<Props>

type ComponentWithAsChildProps<T extends React.ElementType> = React.FC<
  WithAsChildProps<React.ComponentPropsWithRef<T>>
>

type JsxFactoryFn<T extends React.ElementType = React.ElementType> = (
  component: T,
) => ComponentWithAsChildProps<T>

type JsxElements = {
  [K in keyof JSX.IntrinsicElements]: ComponentWithAsChildProps<K>
}

function withAsChild(Component: React.ElementType) {
  const Comp = __forwardRef<unknown, AsChildProps<React.ComponentPropsWithRef<React.ElementType>>>(
    function ComponentWithAsChild(props, ref) {
      const { asChild, ...restProps } = props

      if (!asChild) {
        return <Component {...restProps} ref={ref} />
      }

      const onlyChild = Children.only(props.children)
      const forwardedRef = composeRefs(ref, (onlyChild as any).ref)

      return isValidElement(onlyChild)
        ? cloneElement(onlyChild, {
            ...mergeProps(restProps, onlyChild.props as any),
            ref: forwardedRef,
          })
        : null
    },
  )

  // @ts-expect-error - it exists
  Comp.displayName = Component.displayName || Component.name

  return Comp
}

export function jsxFactory() {
  const cache = new Map()

  return new Proxy(withAsChild, {
    apply(target, thisArg, argArray) {
      return withAsChild(argArray[0])
    },
    get(_, element) {
      const asElement = element as React.ElementType
      if (!cache.has(asElement)) {
        cache.set(asElement, withAsChild(asElement))
      }
      return cache.get(asElement)
    },
  }) as unknown as JsxFactoryFn & JsxElements
}

export const ark = jsxFactory()

export type HTMLArkProps<T extends React.ElementType> = ComponentWithAsChildProps<T>

type Pretty<T> = T extends infer U ? { [K in keyof U]: U[K] } : never

type Assign<T, U> = Pretty<T & Omit<U, keyof T>>

export function forwardRef<
  T extends React.ElementType,
  P extends Record<never, never> = Record<never, never>,
>(
  component: React.ForwardRefRenderFunction<
    never,
    Assign<React.ComponentPropsWithoutRef<T>, P & { asChild?: boolean }>
  >,
) {
  return __forwardRef(component) as unknown as ComponentWithAsChildProps<T>
}
