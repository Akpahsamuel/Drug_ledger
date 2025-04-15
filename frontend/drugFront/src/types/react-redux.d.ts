declare module 'react-redux' {
  import { Dispatch, Action, AnyAction } from 'redux';
  import { ComponentType, FC, ReactNode } from 'react';
  
  export interface ProviderProps {
    store: any;
    children: ReactNode;
  }
  
  export const Provider: FC<ProviderProps>;
  
  export function useSelector<TState = any, Selected = unknown>(
    selector: (state: TState) => Selected,
    equalityFn?: (left: Selected, right: Selected) => boolean
  ): Selected;
  
  export function useDispatch<DispatchType = Dispatch<Action>>(): DispatchType;
  
  export function connect<StateProps = {}, DispatchProps = {}, OwnProps = {}, State = any>(
    mapStateToProps?: (state: State, ownProps?: OwnProps) => StateProps,
    mapDispatchToProps?: DispatchProps | ((dispatch: Dispatch<Action>) => DispatchProps),
    mergeProps?: (stateProps: StateProps, dispatchProps: DispatchProps, ownProps: OwnProps) => StateProps & DispatchProps & OwnProps,
    options?: any
  ): (component: ComponentType<StateProps & DispatchProps & OwnProps>) => ComponentType<OwnProps>;
} 