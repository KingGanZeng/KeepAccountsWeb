import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { AtForm, AtSwitch, AtButton, AtModal } from 'taro-ui'
import { ShareComponentProps, ShareComponentState } from './ShareComponent.interface'
import './ShareComponent.scss'
// @ts-ignore
import { randomWord } from '../../utils/common'

class ShareComponent extends Component<ShareComponentProps,ShareComponentState > {
  constructor(props: ShareComponentProps) {
    super(props);
    this.state = {
      groupState: false,
      groupMembers: [],
      modalOpenState: false,
      modalContent: '',
    }
  }
  static options = {
    addGlobalClass: true
  };
  static defaultProps:ShareComponentProps = {
    sharedState: false,
    projectName: '',
    groupIdInfo: '',
    groupMemberList: [],
    isAdmin: false,
    firstCreate: false,
  };

  /**
   * 开启小组
   */
  handleGroupSwitchChange() {
    if (!this.state.groupState) {
      console.log("创建小组");
      const nowUserPortrait = Taro.getStorageSync('portrait');
      const nowUsername = Taro.getStorageSync('username');
      const nowUserId = Taro.getStorageSync('uid');
      const newGroup = this.state.groupMembers.map(item => item);
      // 当用户开启小组时，将用户信息push进小组
      newGroup.push({
        uid: nowUserId,
        username: nowUsername,
        portrait: nowUserPortrait,
      });
      // 随机生成小组id
      // @ts-ignore
      const groupId = randomWord(false, 32);
      console.log(this.state.groupMembers, this.state.groupMembers.length)
      if (this.state.groupMembers.length < 1) {
        // 只有当组成员为0时，将用户信息添加进去，否则不做修改
        this.setState({
          groupMembers: newGroup,
        }, () => {
          // 同步父组件信息
          this.props.onGroupMemberList(newGroup)
        });
      }
      // 设置Taro开启小组信息获取
      Taro.showShareMenu({
        withShareTicket: true
      });
      // 如果未创建小组，则向父组件传小组id,否则不对组id做修改
      if (!this.props.groupIdInfo) {
        this.props.onGroupId(groupId)
      }
    } else {
      // 在关闭小组时，如果是已创建好的组(不是第一次创建的)，不做操作；对未在系统注册的组，清空组信息
      if (this.props.groupMemberList.length === 1) {
        this.setState({
          groupMembers: [],
        })
      }
      Taro.showShareMenu({
        withShareTicket: false
      })
    }

    this.setState({
      groupState: !this.state.groupState,
    }, () => {
      // 将共享状态传值给父组件
      this.props.onShareState(this.state.groupState)
    });
  }

  /**
   * 从小组中删除某个用户，弹窗二次确认
   * @param memberInfo
   */
  handleDeleteMember(memberInfo) {
    this.setState({
      modalOpenState: true,
      modalContent: `确认将【${memberInfo.username}】从小组中移除？`,
      deleteGroupMemberId: memberInfo.group_info_id
    })
  }

  /**
   * 弹出框取消事件
   */
  handleDeleteCancel() {
    this.setState({
      modalOpenState: false,
      modalContent: '',
      deleteGroupMemberId: 0,
    })
  }

  /**
   * 弹出框确认事件，删除该用户
   */
  handleDeleteConfirm() {
    this.props.onGroupMember(this.state.deleteGroupMemberId)
    this.setState({
      modalOpenState: false,
      modalContent: '',
      deleteGroupMemberId: 0,
    })
  }

  /**
   * 组件获取到props的变化，更新状态
   */
  componentWillReceiveProps(nextProps): void {
    if (nextProps.sharedState === true) {
      this.setState({
        groupState: nextProps.sharedState,
        groupMembers: nextProps.groupMemberList,
      })
    }
  }

  componentDidMount(): void {
    this.setState({
      groupState: this.props.sharedState,
      groupMembers: this.props.groupMemberList,
    })
  }

  render() {
    const uid = Taro.getStorageSync('uid')
    const memberList = this.state.groupMembers.map((member, index) => {
      const isNowUser = member.uid === uid
      const needDeleteButton = !isNowUser && this.props.isAdmin // 为管理员且不是本人显示删除按钮
      return (
        <View className='at-col at-col-3 member-wrapper' key={index}>
          <Image className='portrait-wrapper' src={member.portrait} />
          <View className='name-wrapper'>{member.username}</View>
          { needDeleteButton &&
            <View
              onClick={this.handleDeleteMember.bind(this, member)}
              className='at-icon at-icon-subtract-circle delete-icon'
            />}
        </View>
      )
    });
    return (
      <View className='fx-ShareComponent-wrap'>
        <AtModal
          isOpened={this.state.modalOpenState}
          title='确认删除'
          cancelText='取消'
          confirmText='确认'
          onClose={this.handleDeleteCancel}
          onCancel={this.handleDeleteCancel}
          onConfirm={this.handleDeleteConfirm}
          content={this.state.modalContent}
        />
        <AtForm>
          <AtSwitch
            checked={this.state.groupState}
            onChange={this.handleGroupSwitchChange}
            border={false}
            disabled={this.props.projectName === '' || !this.props.isAdmin || this.props.firstCreate}
            title='是否开启小组'
          />
          {this.props.firstCreate && <View className='open-group-toast'>开启小组需先完成项目创建</View>}
        </AtForm>
        {this.state.groupState && <View className='at-row at-row--wrap group-wrapper'>
          {this.state.groupMembers.length > 0 && memberList}
          {this.props.isAdmin && <View className='at-col at-col-3 member-wrapper member-add'>
            <AtButton openType='share' />
            <View className='at-icon at-icon-add' />
          </View>}
        </View>}
      </View>
    )
  }
}

export default ShareComponent
