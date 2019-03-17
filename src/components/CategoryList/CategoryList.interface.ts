
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
  actionTitle: string, // 弹窗小标题
  actionIcon: string,
  actionIconBackgroundColor: string,
  type: string,
  date: string,
  money: string,
  note: string, // 备注
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
}
