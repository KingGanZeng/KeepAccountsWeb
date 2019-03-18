
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Input, Label, Button } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtToast } from "taro-ui"
// import Api from '../../utils/request'
import Tips from '../../utils/tips'
import { NewManagementProps, NewManagementState } from './newManagement.interface'
import './newManagement.scss'

@connect(({ newManagement }) => ({
    ...newManagement,
}))

class NewManagement extends Component<NewManagementProps,NewManagementState > {
  config:Config = {
    navigationBarTitleText: '新建项目'
  };
  constructor(props: NewManagementProps) {
    super(props);
    this.state = {
      focusState: false,
      projectName: '',
      moneyManageBookId: decodeURIComponent(this.$router.params.moneyManageBookId),
      commitStatus: false,
      helpInfo: '',
    }
  }

  /**
   * 输入框聚焦时，触发样式修改
   */
  focusStyle() {
    this.setState({
      focusState: true,
    })
  }

  /**
   * 输入框失焦时，label归位
   */
  blurStyle() {
    if (!this.state.projectName) {
      this.setState({
        focusState: false,
      })
    }
  }

  /**
   * 确定按钮事件
   */
  handleButtonConfirm() {
    Tips.loading();
    if(!this.state.projectName) {
      this.setState({
        helpInfo: '请输入项目名称,例如: 支付宝理财'
      });
      return ;
    }
    this.createProject(this.state.moneyManageBookId, this.state.projectName)
      .then(() => {
        Tips.loaded();
        if (this.props.commitSuccess) {
          Taro.navigateTo({
            url: "/pages/index/index?bookId=" + this.props.projectId +
              '&bookName=' + this.state.projectName +
              '&bookType=' + 'moneyManageInner'
          })
        } else {
          this.setState({
            commitStatus: true,
          })
        }
      });
  }

  /**
   * 取消按钮事件
   */
  handleButtonCancel() {
    Taro.navigateBack({
      delta: 1
    });
  }

  /**
   * 处理输入框
   * @param e
   */
  onInputChange = e => {
    this.setState({
      projectName: e.detail.value,
      helpInfo: '',
    })
  };

  /**
   * 处理toast
   * @param e
   */
  handleToast = e => {
    console.log(e);
    this.setState({
      commitStatus: false,
    })
  }

  /**
   * 创建新项目
   * @param bookId
   * @param projectName
   */
  async createProject(bookId, projectName) {
    return await this.props.dispatch({
      type: 'newManagement/createProject',
      payload: {
        uid: 'DSAO28A98X', // 这里需要localstorage中获取
        book_id: bookId,
        project_name: projectName
      }
    })
  }

  render() {
    return (
      <View className='newManagement-wrap'>
        <View className='input-form'>
          <View className='input-outline-x'>
            <Input
              className='input-control input-outline'
              placeholder='项目名称'
              onFocus={this.focusStyle}
              onBlur={this.blurStyle}
              onInput={this.onInputChange}
              value={this.state.projectName}
              placeholderStyle='color: rgba(0,0,0,0)'
              maxLength={8}
            />
            <Label
              className={this.state.focusState ? 'input-label input-label-active' : 'input-label'}
            >项目名称</Label>
          </View>
          <View className='help-info'>
            {this.state.helpInfo}
          </View>
        </View>
        <View className='button-footer at-row'>
          <View className='at-col button-wrapper'>
            <Button
              className='button-item confirm'
              onClick={this.handleButtonConfirm}
            >确认</Button>
          </View>
          <View className='at-col button-wrapper'>
            <Button
              className='button-item cancel'
              onClick={this.handleButtonCancel}
            >取消</Button>
          </View>
        </View>
        <AtToast
          text='项目创建失败'
          status='error'
          isOpened={this.state.commitStatus}
          duration={1000}
          onClose={this.handleToast.bind(this)}
        />
      </View>
    )
  }
}

export default NewManagement
