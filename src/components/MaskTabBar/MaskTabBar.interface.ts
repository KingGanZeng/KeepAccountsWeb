
/**
 * MaskTabBar.state 参数类型
 *
 * @export
 * @interface MaskTabBarState
 */
export interface MaskTabBarState {
  openState: boolean,
  bookId: string,
}

/**
 * MaskTabBar.props 参数类型
 *
 * @export
 * @interface MaskTabBarProps
 */
export interface MaskTabBarProps {
  isOpened: boolean,
  nowBookId: string, // 账本编号
  onOpenState?: any
}
