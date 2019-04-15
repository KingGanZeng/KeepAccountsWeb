import Taro, { Component, Config } from '@tarojs/taro'
import {Button, View} from '@tarojs/components'
import {AtForm, AtButton, AtModalContent, AtModal, AtModalHeader, AtModalAction} from 'taro-ui'
import { SharePageProps, SharePageState } from './sharePage.interface'
import './sharePage.scss'
import {MAINHOST} from "../../config";
import {Request} from "../../utils/request";
import Tips from "../../utils/tips";

class SharePage extends Component<SharePageProps,SharePageState > {
  config:Config = {
    navigationBarTitleText: '加入共享账本'
  }
  constructor(props: SharePageProps) {
    super(props);
    const groupId = decodeURIComponent(this.$router.params.groupId);
    const projectName = decodeURIComponent(this.$router.params.projectName);
    const inviteUser = decodeURIComponent(this.$router.params.inviteUser);
    this.state = {
      projectName: projectName,
      groupId: groupId,
      inviteUser: inviteUser,
      hasAuthorized: false,
      modalOpenState: false,
      confirmMsg: '',
      hasAdd: false,
    }
  }

  async checkAddState() {
    const uid = Taro.getStorageSync('uid');
    try {
      let result:any = await Taro.request({
        method: "GET",
        url: `${MAINHOST}/api/getGroupMembers`,
        data: {
          group_id: this.state.groupId,
        }
      });
      result = result.data.results
      for (const member of result) {
        if (member.uid == uid) {
          this.setState({
            hasAdd: true,
            confirmMsg: '已加入'
          })
        }
      }
    } catch (e) {
      console.log(e)
    }
  }

  /**
   * 确认加入小组
   */
  async confirmJoin() {
    const uid = Taro.getStorageSync('uid');
    const username = Taro.getStorageSync('username')
    const portrait = Taro.getStorageSync('portrait')
    Tips.loading();
    try {
      let result:any = await Taro.request({
        method: 'POST',
        url: `${MAINHOST}/api/createGroupMember`,
        data: {
          group_id: this.state.groupId,
          uid: uid,
          username: username,
          portrait: portrait,
          is_admin: false,
        }
      })
      result = result.data;
      console.log(result, result.group_id);
      if(result.group_id) {
        let projectInfo:any = await Taro.request({
          method: 'GET',
          url: `${MAINHOST}/api/getBookList`,
          data: {
            uid: result.group_id,
          }
        })
        Tips.loaded();
        if (projectInfo.data.results.length > 0) {
          projectInfo = projectInfo.data.results[0]
          // 跳转到项目列表
          Taro.redirectTo({
            url: "/pages/travelDetails/travelDetails?bookId=" + projectInfo.book_id +
              '&bookName=' + projectInfo.book_name +
              '&bookType=' + 'travelParty' +
              '&budget=' + projectInfo.budget +
              '&sBookId=' + false +
              '&is_admin=' + false
          })
        }
      }
    } catch (e) {
      Tips.loaded();
      console.log(e);
    }
  }

  /**
   * 拒绝加入小组
   */
  refuseJoin() {
    this.setState({
      confirmMsg: '已拒绝',
    });
  }

  /**
   * 获取认证状态
   * 未认证弹窗认证
   * 已认证从数据库获取信息
   */
  async getAuthorized() {
    let authorizeState = false;
    let openState= false;
    await Taro.getSetting({
      success(res) {
        if(!res.authSetting['scope.userInfo']) {
          authorizeState = false;
          openState = true
        } else {
          authorizeState = true
        }
      }
    });
    this.setState({
      hasAuthorized: authorizeState,
      modalOpenState: openState
    }, () => {
      // 当用户已授权后
      console.log('状态', this.state.hasAuthorized)
      if(this.state.hasAuthorized) {
        // 获取用户的相关信息
        Taro.getUserInfo()
          .then(result => {
            const userInfo = JSON.parse(result.rawData);
            console.log('userinfo', userInfo)
            // 将用户名及头像信息存入localStorage
            Taro.setStorageSync('username', userInfo.nickName);
            Taro.setStorageSync('portrait', userInfo.avatarUrl);
          })
          .then(() => {
            Request.login()
          })
      }
    })
  }

  /**
   * 关闭弹出窗，状态更新
   */
  handleModal() {
    this.setState({
      hasAuthorized: false,
    }, () => {
      console.log(this.state.hasAuthorized)
    });
  }

  /**
   * 获取用户信息
   * @param e
   */
  onGotUserInfo = e => {
    this.setState({
      hasAuthorized: true,
      modalOpenState: false,
    })
    console.log(e)
  }

  componentDidShow() {
    const projectName = this.$router.params.projectName
    const groupId = this.$router.params.groupId
    this.setState({
      projectName: projectName,
      groupId: groupId,
    }, () => {
      this.checkAddState()
    })
  }

  /**
   * 组件渲染完成后执行
   */
  async componentDidMount() {
    await this.getAuthorized()
    const uid = Taro.getStorageSync('uid')
    const username = Taro.getStorageSync('username')
    const portrait = Taro.getStorageSync('portrait')
    console.log('用户信息', uid, username, portrait)
  }

  render() {
    return (
      <View className='sharePage-wrap'>
        <AtModal
          isOpened={this.state.modalOpenState}
          onClose={this.handleModal}
        >
          <AtModalHeader>注册</AtModalHeader>
          <AtModalContent>
            新用户需要先注册才能开启共享账本哦！
          </AtModalContent>
          <AtModalAction>
            <View className='login-button-wrapper'>
              <Button
                className='login-button'
                openType='getUserInfo'
                onGetUserInfo={this.onGotUserInfo.bind(this)}
              >注册使用</Button>
              <View className='at-tabs__item-underline at-tabs__item-underline' />
            </View>
          </AtModalAction>
        </AtModal>
        <View className='shareInfo'>
          【{this.state.inviteUser}】邀请您加入【{this.state.projectName}】
        </View>
        { !this.state.hasAdd && <AtForm>
          <AtButton type='primary' className='button-check-item' onClick={this.confirmJoin}>确认加入</AtButton>
          <AtButton type='primary' className='button-trash-item' onClick={this.refuseJoin}>拒绝</AtButton>
        </AtForm>}
        <View className='shareInfo'>
          {this.state.confirmMsg}
        </View>
      </View>
    )
  }
}

export default SharePage
