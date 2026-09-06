import {
  createContext,
  use,
  useCallback,
  useMemo,
  useRef,
  type RefCallback,
  type RefObject,
} from 'react';

type Digit0to4 = 0 | 1 | 2 | 3 | 4;
type Digit0to8 = Digit0to4 | 5 | 6 | 7 | 8;

export type SceneNodeName =

  | 'pre'
  | 'preHalfTop'
  | 'preHalfBot'
  | 'preContent'
  | 'preCounter'
  | 'preBar'

  | 'trail'
  | 'cursor'
  | 'cursorInner'
  | 'puff'
  | 'flyer'
  | 'hint'
  | 'loopVeil'
  | 'dive'
  | 'diveStreaks'
  | 'diveSurface'

  | 'hero'
  | 'heroBg'
  | 'heroBgParallax'
  | 'beatA'
  | 'beatB'
  | 'sub'
  | 'burst'
  | 'cue'
  | 'burgerWrap'
  | 'burgerScale'
  | 'burgerParallax'
  | 'burgerEnter'
  | `line${0 | 1 | 2}`
  | `ing${Digit0to4}`
  | `ie${Digit0to4}`

  | 'menu'
  | 'track'
  | 'menuBar'
  | 'disc0'
  | 'classicImg'
  | `mw${Digit0to8}`

  | 'sidesHead'
  | `ow${Digit0to4}`
  | 'checkoutHead'
  | 'registerCard'
  | 'registerPaper'

  | 'find'
  | 'streetParallax'
  | 'streetRise'
  | 'findHead'
  | 'findCard'
  | 'findFlip'

  | 'trayWrap'
  | 'trayCount';

export type SceneRegistry = Partial<Record<SceneNodeName, HTMLElement>>;

interface SceneNodesValue {
  readonly registryRef: RefObject<SceneRegistry>;
  readonly set: (name: SceneNodeName, node: HTMLElement | null) => void;
}

const SceneNodesContext = createContext<SceneNodesValue | null>(null);

export function useSceneNodesValue(): SceneNodesValue {
  const registryRef = useRef<SceneRegistry>({});
  const set = useCallback((name: SceneNodeName, node: HTMLElement | null) => {
    if (node) registryRef.current[name] = node;
    else delete registryRef.current[name];
  }, []);
  return useMemo(() => ({ registryRef, set }), [set]);
}

export const SceneNodesProvider = SceneNodesContext;

export function useSceneNode<T extends HTMLElement>(name: SceneNodeName): RefCallback<T> {
  const value = use(SceneNodesContext);
  if (!value) throw new Error('useSceneNode must be used inside <SceneNodesProvider>');
  const { set } = value;
  return useCallback((node: T | null) => set(name, node), [set, name]);
}
