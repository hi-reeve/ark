/* eslint-disable @typescript-eslint/no-explicit-any */

import { mergeProps } from '@zag-js/react'
import { Children, cloneElement, forwardRef, isValidElement } from 'react'
import { composeRefs } from './compose-refs'

type AsChildProps<Props extends { children?: unknown }> =
  | { asChild: true; children: React.ReactElement }
  | { asChild?: false; children?: Props['children'] }

type WithAsChildProps<Props extends { children?: unknown }> = Omit<Props, 'children'> &
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

function styled(Component: React.ElementType) {
  const Comp = forwardRef<unknown, AsChildProps<React.ComponentPropsWithRef<React.ElementType>>>(
    function Styled(props, ref) {
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

  return new Proxy(styled, {
    apply(target, thisArg, argArray) {
      return styled(argArray[0])
    },
    get(_, element) {
      const asElement = element as React.ElementType
      if (!cache.has(asElement)) {
        cache.set(asElement, styled(asElement))
      }
      return cache.get(asElement)
    },
  }) as unknown as JsxFactoryFn & JsxElements
}
