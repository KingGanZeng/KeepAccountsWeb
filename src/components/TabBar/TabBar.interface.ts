
/**
 * TabBar.state 参数类型
 *
 * @export
 * @interface TabBarState
 */
export interface TabBarState {
  isOpen: boolean,
  showLeftBar: boolean,
  bookId: string,
  bookType: string,
}

/**
 * TabBar.props 参数类型
 *
 * @export
 * @interface TabBarProps
 */
export interface TabBarProps {
  nowBookId: string, // 当前选择的账本编号
  nowBookType: string, // 账本类型
  isSpecial: boolean, // 区分特殊账本
}
