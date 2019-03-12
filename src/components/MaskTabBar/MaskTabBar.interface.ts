
/**
 * MaskTabBar.state 参数类型
 *
 * @export
 * @interface MaskTabBarState
 */
export interface MaskTabBarState {
  openState: boolean
}

/**
 * MaskTabBar.props 参数类型
 *
 * @export
 * @interface MaskTabBarProps
 */
export interface MaskTabBarProps {
  isOpened: boolean,
  onOpenState?: any
}
