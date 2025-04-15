declare module 'redux' {
  export interface Action<T = any> {
    type: T;
  }
  
  export interface AnyAction extends Action {
    [extraProps: string]: any;
  }
  
  export type Reducer<S = any, A extends Action = AnyAction> = (
    state: S | undefined,
    action: A
  ) => S;
  
  export interface Store<S = any, A extends Action = AnyAction> {
    dispatch: Dispatch<A>;
    getState(): S;
    subscribe(listener: () => void): () => void;
    replaceReducer(nextReducer: Reducer<S, A>): void;
  }
  
  export type Dispatch<A extends Action = AnyAction> = (action: A) => A;
  
  export function createStore<S, A extends Action, Ext, StateExt>(
    reducer: Reducer<S, A>,
    preloadedState?: S,
    enhancer?: any
  ): Store<S, A> & Ext;
  
  export function combineReducers<S>(reducers: { [K in keyof S]: Reducer<S[K], AnyAction> }): Reducer<S>;
  
  export function applyMiddleware(...middlewares: any[]): any;
  
  export function bindActionCreators<M extends ActionCreatorsMapObject<any>>(
    actionCreators: M,
    dispatch: Dispatch
  ): { [N in keyof M]: (...args: Parameters<M[N]>) => ReturnType<M[N]> };
  
  export interface ActionCreatorsMapObject<A = any> {
    [key: string]: (...args: any[]) => A;
  }
} 