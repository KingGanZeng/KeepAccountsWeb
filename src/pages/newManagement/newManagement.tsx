
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Input, Label, Button } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtToast } from "taro-ui"
// import Api from '../../utils/request'
import Tips from '../../utils/tips'
import { NewManagementProps, NewManagementState } from './newManagement.interface'
import './newManagement.scss'
import {MAINHOST} from "../../config";

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
      moneyManageBookId: decodeURIComponent(this.$router.params.bookId) || '',
      hasBookId: false,
      helpInfo: '',
      username: '',
      uid: '',
      hasError: false,
      hasErrorMsg: '新建记录错误',
      hasErrorIcon: 'close-circle',
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
      Tips.loaded();
      return ;
    }
    this.createProject(this.state.moneyManageBookId, this.state.projectName)
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
   * 获取账本信息
   */
  async getBookInfo() {
    let result:any;
    result = await Taro.request({
      method: 'GET',
      url: `${MAINHOST}/api/getBookList`,
      data: {
        uid: this.state.uid,
        book_id: parseInt(this.$router.params.bookId)
      }
    });
    if (result.data.results.length > 0) {
      result = result.data.results[0];
      this.setState({
        hasBookId: true,
        focusState: true,
        projectName: result.book_name
      }, () => {
        console.log("数据获取完毕")
      })
    }
  }

  /**
   * 创建新项目
   * @param bookId
   * @param projectName
   */
  async createProject(bookId, projectName) {
    let result:any = await Taro.request({
      method: 'POST',
      url: `${MAINHOST}/api/createBook`,
      data: {
        username: this.state.username,
        uid: this.state.uid,
        book_name: projectName,
        book_type: 'moneyManagement',
      }
    });
    Tips.loaded();
    result = result.data;
    if (result.book_id) {
      const addToMain = await Taro.request({
        method: 'POST',
        url: `${MAINHOST}/api/addSpecialBookItem`,
        data: {
          s_book_id: bookId,
          book_id: result.book_id
        }
      });
      if (addToMain.data.hasAdd) {
        Taro.navigateBack({ // 返回账本首页
          delta: 1
        })
      }
    }
  }

  /**
   * 修改账本信息
   */
  async changeBook() {
    const bookId = decodeURIComponent(this.$router.params.bookId);
    const result = await Taro.request({
      method: 'PUT',
      url: `${MAINHOST}/api/bookChangeApi/${bookId}`,
      data: {
        username: this.state.username,
        uid: this.state.uid,
        book_name: this.state.projectName,
        book_type: 'moneyMangentInner',
      }
    });
    // @ts-ignore
    if(result.data.book_id) {
      this.setState({
        hasError: true,
        hasErrorMsg: '修改成功',
        hasErrorIcon: 'check-circle',
      }, () => {
        // 跳转回账本页面
        setTimeout(() => {
          Taro.redirectTo({
            url: '/pages/accountBook/accountBook'
          })
        }, 800)
      })
    } else {
      this.setState({
        hasError: true,
        hasErrorMsg: '修改失败',
      })
    }
  }

  async deleteBook() {
    const bookId = decodeURIComponent(this.$router.params.bookId);
    const result = await await Taro.request({
      method: 'DELETE',
      url: `${MAINHOST}/api/bookChangeApi/${bookId}`,
    });
    if(result.data.detail) {
      this.setState({
        hasError: true,
        hasErrorMsg: '暂无法删除该项目',
      })
    } else {
      this.setState({
        hasError: true,
        hasErrorMsg: '删除成功',
        hasErrorIcon: 'check-circle',
      }, () => {
        // 跳转回账本页面
        setTimeout(() => {
          Taro.navigateBack({
            delta: 2
          })
        }, 800)
      })
    }
  }

  // 页面挂载时执行
  componentWillMount() {
    const username = Taro.getStorageSync('username');
    const uid = Taro.getStorageSync('uid');
    this.setState({
      uid: uid,
      username: username,
    }, () => {
      if (this.$router.params.bookId) {
        this.getBookInfo()
      }
    });
  }

  render() {
    return (
      <View className='newManagement-wrap'>
        <AtToast
          isOpened={this.state.hasError}
          text={this.state.hasErrorMsg}
          icon={this.state.hasErrorIcon}
          hasMask
        />
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
        { this.state.hasBookId && <View className='button-footer at-row'>
          <View className='at-col button-wrapper'>
            <Button
              className='button-item confirm'
              onClick={this.changeBook}
            >确认修改</Button>
          </View>
          <View className='at-col button-wrapper'>
            <Button
              className='button-item cancel'
              onClick={this.deleteBook}
            >删除项目</Button>
          </View>
        </View>}
        { !this.state.hasBookId && <View className='button-footer at-row'>
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
        </View>}
      </View>
    )
  }
}

export default NewManagement
