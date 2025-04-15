declare module '@reduxjs/toolkit' {
  import { Action, AnyAction, Reducer, Store } from 'redux';
  
  export interface PayloadAction<P = void, T extends string = string> {
    payload: P;
    type: T;
  }
  
  export interface SliceCaseReducers<State> {
    [key: string]: (state: State, action: PayloadAction<any>) => State;
  }
  
  export interface Slice<State = any, CaseReducers = SliceCaseReducers<State>> {
    name: string;
    reducer: Reducer<State>;
    actions: Record<string, (payload?: any) => PayloadAction<any>>;
    caseReducers: CaseReducers;
  }
  
  export function createSlice<State = any, CaseReducers = SliceCaseReducers<State>>(options: {
    name: string;
    initialState: State;
    reducers: CaseReducers;
  }): Slice<State, CaseReducers>;
  
  export function configureStore<State = any>(options: {
    reducer: Reducer<State> | Record<string, Reducer<any>>;
    middleware?: any[];
    devTools?: boolean;
    preloadedState?: State;
  }): Store<State>;
} 