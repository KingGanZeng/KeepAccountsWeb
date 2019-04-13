import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import {AtForm, AtSwitch, AtButton } from 'taro-ui'
import { ShareComponentProps, ShareComponentState } from './ShareComponent.interface'
import './ShareComponent.scss'
// @ts-ignore
import { randomWord } from '../../utils/common'

class ShareComponent extends Component<ShareComponentProps,ShareComponentState > {
  constructor(props: ShareComponentProps) {
    super(props)
    this.state = {
      groupState: this.props.sharedState,
      groupMembers: this.props.groupMemberList,
    }
  }
  static options = {
    addGlobalClass: true
  }
  static defaultProps:ShareComponentProps = {
    sharedState: false,
    projectName: '',
    groupIdInfo: '',
    groupMemberList: [],
  }

  /**
   * 开启小组
   */
  handleGroupSwitchChange() {
    if (!this.state.groupState) {
      const nowUserPortrait = Taro.getStorageSync('portrait');
      const nowUsername = Taro.getStorageSync('username');
      const nowUserId = Taro.getStorageSync('uid');
      const newGroup = this.state.groupMembers;
      // 当用户开启小组时，将用户信息push进小组
      newGroup.push({
        uid: nowUserId,
        name: nowUsername,
        portrait: nowUserPortrait,
      });
      // 随机生成小组id
      // @ts-ignore
      const groupId = randomWord(false, 32);
      this.setState({
        groupMembers: newGroup,
      })
      // 设置Taro开启小组信息获取
      Taro.showShareMenu({
        withShareTicket: true
      })
      // 如果未创建小组，则向父组件传小组id,否则不对组id做修改
      if (!this.props.groupIdInfo) {
        this.props.onGroupId(groupId)
      }
    } else {
      // 在关闭小组时，如果是已创建好的组，不做操作；对未在系统注册的组，清空组信息
      if (this.props.groupMemberList.length === 0) {
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

  render() {
    const memberList = this.state.groupMembers.map((member, index) => {
      return (
        <View className='at-col at-col-3 member-wrapper' key={index}>
          <Image className='portrait-wrapper' src={member.portrait} />
          <View className='name-wrapper'>{member.name}</View>
        </View>
      )
    })
    return (
      <View className='fx-ShareComponent-wrap'>
        <AtForm>
          <AtSwitch
            checked={this.state.groupState}
            onChange={this.handleGroupSwitchChange}
            border={false}
            disabled={this.props.projectName === ''}
            title='是否开启小组'
          />
        </AtForm>
        {this.state.groupState && <View className='at-row at-row--wrap group-wrapper'>
          {memberList}
          <View className='at-col at-col-3 member-wrapper member-add'>
            <AtButton openType='share' />
            <View className='at-icon at-icon-add' />
          </View>
        </View>}
      </View>
    )
  }
}

export default ShareComponent
