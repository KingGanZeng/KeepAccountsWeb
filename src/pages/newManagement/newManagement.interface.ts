
/**
 * newManagement.state 参数类型
 *
 * @export
 * @interface NewManagementState
 */
export interface NewManagementState {
  focusState: boolean, // 输入框聚焦状态，用于做label悬浮效果
  projectName: string, // 项目的名称
  moneyManageBookId: string, // 总账本的id
  commitStatus: boolean, // toast弹出状态
  helpInfo: string, // 输入框提示
}

/**
 * newManagement.props 参数类型
 *
 * @export
 * @interface NewManagementProps
 */
export interface NewManagementProps {
  dispatch?: any,
  projectId: string, // 生成的projectId
  commitSuccess: boolean, // 提交状态
}
