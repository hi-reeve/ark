import {
  Children,
  cloneElement,
  forwardRef,
  type ComponentProps,
  type ElementType,
  type ReactElement,
} from 'react'

type ComponentWithAsChild<Component extends ElementType> = ReactElement<
  ComponentProps<Component> & {
    asChild?: boolean
  },
  Component
>

type JsxFactory<Component extends ElementType = ElementType> = (
  el: Component,
) => ComponentWithAsChild<Component>

type HTMLJsxElements = {
  [K in keyof JSX.IntrinsicElements]: ComponentWithAsChild<K>
}

type AsChildProps =
  | { asChild: true; children: ReactElement }
  | { asChild: false; children?: ReactElement }

function styled(Component: ElementType) {
  const Comp = forwardRef<unknown, AsChildProps>((props, ref) => {
    const { asChild, ...restProps } = props
    if (asChild) {
      const onlyChild = Children.only(props.children)
      return cloneElement(onlyChild, { ...restProps, ref })
    }
    return <Component {...restProps} ref={ref} />
  })

  // @ts-expect-error - it exists
  Comp.displayName = Component.displayName || Component.name

  return Comp
}

export function jsxFactory<Component extends ElementType = ElementType>() {
  const cache = new Map<Component, ComponentWithAsChild<Component>>()

  return new Proxy(styled, {
    apply(target, thisArg, argArray: [Component]) {
      return styled(argArray[0])
    },
    get(_, element) {
      const asElement = element as Component
      if (!cache.has(asElement)) {
        //@ts-expect-error - fix later
        cache.set(asElement, styled(asElement))
      }
      return cache.get(asElement)
    },
  }) as unknown as JsxFactory & HTMLJsxElements
}

const ark = jsxFactory()

const tt = <ark.div>Welcome</ark.div>
