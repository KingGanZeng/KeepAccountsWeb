
/**
 * sharePage.state 参数类型
 *
 * @export
 * @interface SharePageState
 */
export interface SharePageState {
  groupId: string, // 小组id
  projectName: string, // 项目名称
  inviteUser: string, // 邀请人
  hasAuthorized: boolean, // 注册状态
  modalOpenState: boolean, // 模态框状态
  confirmMsg: string, // 确认信息
  hasAdd: boolean, // 是否已加入该小组
}

/**
 * sharePage.props 参数类型
 *
 * @export
 * @interface SharePageProps
 */
export interface SharePageProps {}
