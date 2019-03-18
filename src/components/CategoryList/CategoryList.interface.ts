
/**
 * CategoryList.state 参数类型
 *
 * @export
 * @interface CategoryListState
 */
export interface CategoryListState {
  openState: boolean,
  bookType: string,
  bookId: number,
  type: string,
}

/**
 * CategoryList.props 参数类型
 *
 * @export
 * @interface CategoryListProps
 */
export interface CategoryListProps {
  nowBookType: string,
  nowBookId: number,
  nowType: string,
  onModalActionState?: any, // 上层弹出窗口
}
