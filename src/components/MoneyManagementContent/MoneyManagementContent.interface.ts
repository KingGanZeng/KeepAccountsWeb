
/**
 * MoneyManagementContent.state 参数类型
 *
 * @export
 * @interface MoneyManagementContentState
 */
export interface MoneyManagementContentState {
}

/**
 * MoneyManagementProps.props 参数类型
 * 理财投资账本详情，每条投资记录
 *
 * @export
 * @interface MoneyManagementProps
 */
export interface MoneyManagementProps {
  management_name: string,
  income: number,
  expense: number,
  manage_id: string,
  creat_time: string,
}

/**
 * MoneyManagementContent.props 参数类型
 *
 * @export
 * @interface MoneyManagementContentProps
 */
export interface MoneyManagementContentProps {
  nowBookRecord: Array<MoneyManagementProps>, // 账本信息
  nowBookType: string,
  nowBookId: string,
}
