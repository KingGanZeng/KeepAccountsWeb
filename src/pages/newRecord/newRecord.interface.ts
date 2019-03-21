
/**
 * newRecord.state 参数类型
 *
 * @export
 * @interface NewRecordState
 */
export interface NewRecordState {
  uid: string,
  username: string,
  current: number, // 当前标签页编号
  recordBookType: string, // 当前账本类型
  recordBookId: number, // 账本id
  actionTitle: string, // 账本名称
  actionIcon: string, // 记录图标
  actionIconBackgroundColor: string, // 图标背景
  inputDate: string, // 记录时间（默认当前）
  inputMoney: number, // 记录金额
  inputNote: string, // 记录备注
  openState: boolean, // 弹出框状态
  hasError: boolean, // toast状态
}

/**
 * newRecord.props 参数类型
 *
 * @export
 * @interface NewRecordProps
 */
export interface NewRecordProps {
  submitSuccess: boolean, // 提交状态
  dispatch?: any,
}
