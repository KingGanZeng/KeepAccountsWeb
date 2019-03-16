
/**
 * MaskTabBar.state 参数类型
 *
 * @export
 * @interface MaskTabBarState
 */
export interface MaskTabBarState {
  openState: boolean,
  bookId: string,
  bookType: string
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
  nowBookType: string, // 账本类型
  onOpenState?: any
}
