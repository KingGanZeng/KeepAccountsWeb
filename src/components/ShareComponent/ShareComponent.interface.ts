
/**
 * ShareComponent.state 参数类型
 *
 * @export
 * @interface ShareComponentState
 */
export interface ShareComponentState {
  groupState: boolean, // 小组状态
  groupMembers: any, // 小组用户列表, 用于第一次新建
  modalOpenState: boolean, // 删除信息确认弹出框状态
  modalContent: string, // 弹出框信息
  deleteGroupMemberId?: number, // 存储当前选中的删除用户uid
}

/**
 * ShareComponent.props 参数类型
 *
 * @export
 * @interface ShareComponentProps
 */
export interface ShareComponentProps {
  sharedState: boolean, // 小组状态
  projectName: string, // 项目名称
  groupIdInfo: string, // 小组id信息
  groupMemberList: any, // 小组用户列表,用于渲染
  onGroupId?: any, // 小组id修改监听事件
  onGroupMemberList?: any, // 小组成员监听事件（用于创建时）
  onShareState?: any, // 小组状态修改监听事件
  onGroupMember?: any, // 小组成员删除监听事件
  isAdmin: boolean, // 是否为管理员，用于判断修改权限
  firstCreate: boolean, // 用于判断是否为第一次创建，避免邀请但项目未创建的情况
}

