---
title: React
group: Library
toc: true
---

## Overview

1. **Unidirectional Data Flow**: Data flows through props
2. **Function Components**
3. **VDOM**: Enables batched DOM updates
4. **JSX**

## JSX

JSX is just syntactic sugar for `React.createElement()`. Usually compiled into JavaScript via Babel or [SWC](https://swc.rs/).

```jsx
let p = <p id="2">hello</p> // jsx
let p = React.createElement('p', { id: '2' }, 'hello') // js
```

## Component

A component is a function that returns [JSX](#jsx).

### Component Communication

- [props](#props)
- [slots](#slots)
- [context](#context)

#### Props

```jsx
function Parent() {
	return <Child text="hello" />
}

function Child({ text }) {
	return <p>{text}</p>
}
```

#### Slots

```jsx
function Parent() {
	return <Child>hello</Child>
}

function Child({ children }) {
	return <p>{children}</p>
}
```

#### Context

```jsx
const TextContext = createContext('')

function Parent() {
	return <TextContext value={'hello'}><Child /></TextContext>
}

function Child() {
	const text = useContext(TextContext)
	return <p>{text}</p>
}
```

### State Management

When the state changes, React will re-render the current component and its child components.

```jsx
function Parent() {
  const [state, setState] = useState(0)
  return <Child />
}
```

When the tree structure remains unchanged, state is preserved. Clicking the toggle will not reset the counter value.

```jsx
toggle ? <Counter name="alice" /> : <Counter name="bob" />
```

You can use a key to forcefully refresh the component’s state.

```jsx
toggle ? <Counter name="alice" key="1" /> : <Counter name="bob" key="2" />
```

### Component Lifecycle

```color
@[green]{Mount}
  |  constructor() # init state
  |  render() # return jsx
  |  @[blue]{Updates DOM}
  |  componentDidMount() # fetch or DOM Manipulation

@[green]{Update}
  |  @[blue]{Props or state changes}
  |  render()
  |  @[blue]{Updates DOM}
  |  componentDidUpdate(prevProps, prevState) # fetch or DOM Manipulation

@[green]{Unmount}
  |  componentWillUnmount() # perform cleanup
```

### Controlled Component

1. **Controlled Component**: The component’s state is controlled by React.

```jsx
<input type="text" value={value} onChange={handleChange} />
```

2. **Uncontrolled Component**: The component’s state is controlled by the DOM.

```jsx
<input type="text" ref={inputRef} />
```

## Hooks

Every React component has a corresponding Fiber object. The Fiber object has a `memoizedState` property, which uses to store Hooks.

```js
Fiber {
  memoizedState: Hook,
}
```

Hooks are stored in a linked list.

```js
Hook {
  baseQueue,
  baseState,
  memoizedState,
  queue,
  next: Hook,
}
```

### useState

1. Because of _Batch Updates_, calling `setState` (sync function) multiple times only causes one re-render.
2. Updating the state directly does not cause a re-render.
3. Hooks rely on the _order of their calls_ to associate the component with its state.
4. The state during each render exists within a _closure_.
5. If the new value is identical (`Object.is`) to the current state, React will skip re-render.

### useEffect

```color
useEffect(fn)           # run on every render
useEffect(fn, [])       # run when the component mounts (componentDidMount)
useEffect(fn, [dep])    # run when the dep changes (componentDidUpdate)
useEffect(() => fn, []) # run when the component unmounts (componentWillUnmount)
```

### useLayoutEffect

- [useEffect](#useeffect): runs asynchronously without blocking the render
- useLayoutEffect: runs synchronously

### useRef

- The object returned by `useRef` remains the same between renders.
- Changing `ref.current` will not cause the component to re-render.

### useMemo

- The `fn` function is executed only when `dep` changes.
- The reference of `cachedValue` changes only when `dep` changes.

```js
const cachedValue = useMemo(fn, [dep])
```

### useCallback

The following statements are equivalent.

```jsx
useCallback(fn, deps)
useMemo(() => fn, deps)
```

## Reactive Principle

1. State changes
2. Trigger render
3. Generate VDOM
4. Diff
5. Update the real DOM

## Performance Optimization

### Skip Recomputation

`fn` is only called during the initial render.

```jsx
const [state, setState] = useState(fn)
```

`fn` is only called when `dep` changes.

```jsx
const result = useMemo(fn, [dep])
```

### Skip Re-rendering

When the parent component re-renders, it only re-renders when the `props` change.

```jsx
const Text = memo(({ text, handleClick }) => {
	return <p onclick={handleClick}>{text}</p>
})
```

Using `useMemo` and `useCallback` can prevent reference changes.

```jsx
const text = useMemo(fn, [dep])
const handleClick = useCallback(fn, [dep])
```

## Virtual DOM

Since the DOM cannot be diffed efficiently, React uses a virtual DOM to achieve this, which is implemented as Fiber nodes.

```ts
type Fiber = {
  key: ReactKey,      // id, uuid
  type: any,          // 'p', 'div'
  memoizedProps: any, // class, color
}
```

### Diff

Because diffing the entire tree is costly, React optimizes performance by only comparing nodes at the _same level_.

- The `key` determines whether two nodes are the same.
- The `type` determines whether a node can be reused.
- The `props` determine whether it needs to be updated.

```color
<h1 key="1" val="a" />  |  <h1 key="1" val="a" /> # resue (same type, props)
<h1 key="2" val="a" />  |  <@[mod]{h2} key="2" val="a" /> # create (different type)
<h1 key="3" val="a" />  |  <h1 key="3" val=@[mod]{"b"} /> # update (different props)
```

### List Rendering

When using the `index` as the key, inserting an element at the beginning will create one new element and update two existing elements.

```color
<li key="0" val="b" />  |  @[add]{<li key="0" val="a" />} # update
<li key="1" val="c" />  |  <li key="1" val="b" /> # update
                        |  <li key="2" val="c" /> # create
```

When using an `id` as the key, inserting an element at the beginning will create one new element and reuse the other two elements.

```color
<li key="1" val="b" />  |  @[add]{<li key="0" val="a" />} # create
<li key="2" val="c" />  |  <li key="1" val="b" /> # resue
                        |  <li key="2" val="c" /> # resue
```
