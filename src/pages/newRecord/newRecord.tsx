
import Taro, { Component, Config } from '@tarojs/taro'
import {Picker, View} from '@tarojs/components'
import {AtInput, AtModal, AtModalContent, AtTabs, AtTabsPane, AtToast} from 'taro-ui'
import { connect } from '@tarojs/redux'
import { NewRecordProps, NewRecordState } from './newRecord.interface'
import './newRecord.scss'
// @ts-ignore
import { CategoryList } from '../../components/CategoryList/CategoryList'
// @ts-ignore
import {addZero, bookNameTranslate, globalData } from "../../utils/common";
import '../../assets/iconfont/iconfont.scss'
import { MAINHOST } from "../../config";

@connect(({ newRecord }) => ({
    ...newRecord,
}))

class NewRecord extends Component<NewRecordProps,NewRecordState > {
  config:Config = {
    navigationBarTitleText: '新建记账'
  };
  constructor(props: NewRecordProps) {
    super(props);
    const nowDate = new Date();
    const year = nowDate.getFullYear();
    const month = addZero((nowDate.getMonth()+1).toString());
    const day = addZero((nowDate.getDate()).toString());
    this.state = {
      uid: '',
      username: '',
      current: 0,
      recordBookType: decodeURIComponent(this.$router.params.bookType),
      recordBookId: parseInt(decodeURIComponent(this.$router.params.bookId), 10),
      inputDate: `${year}-${month}-${day}`,
      inputMoney: 0, // 记录金额
      inputNote: '', // 记录备注
      actionTitle: '',
      actionIcon: '',
      actionIconBackgroundColor: '',
      openState: false,
      hasError: false,
      hasErrorMsg: '新建账本错误',
      hasErrorIcon: 'close-circle',
      recordData: {
        recordId: parseInt(decodeURIComponent(this.$router.params.recordId), 10),
        recordDate: decodeURIComponent(this.$router.params.recordDate),
        recordMoney: parseInt(decodeURIComponent(this.$router.params.recordMoney), 10),
        recordNote: decodeURIComponent(this.$router.params.recordNote),
        recordType: decodeURIComponent(this.$router.params.recordType),
        recordCategory: decodeURIComponent(this.$router.params.recordCategory)
      }
    }
  }

  /**
   * 切换标签页
   * @param value
   */
  handleClick (value) {
    this.setState({
      current: value,
    })
  }

  /**
   * 接受子组件信息，激活弹窗
   * @param data
   */
  handleSetModalAction(data) {
    this.setState({
      actionTitle: data.actionTitle,
      actionIcon: data.actionIcon,
      actionIconBackgroundColor: data.actionIconBackgroundColor,
      openState: data.openState,
    })
  }

  /**
   * 弹出框取消, 重置数据
   */
  cancelAction() {
    const nowDate = new Date();
    const year = nowDate.getFullYear();
    const month = addZero((nowDate.getMonth()+1).toString());
    const day = addZero((nowDate.getDate()).toString());
    this.setState({
      openState: false,
    })
    if(!this.state.recordData.recordId) {
      // 如何是修改账单，则不清除记录信息，否则清空
      this.setState({
        inputDate: `${year}-${month}-${day}`,
        inputMoney: 0,
        inputNote: '',
      })
    }
  }

  /**
   * 创建新流水
   */
  async createRecord() {
    const recordType = this.state.current == 0 ? 'expense' : 'income'
    const result = await this.props.dispatch({
      type: 'newRecord/createRecord',
      payload: {
        uid: this.state.uid,
        username: this.state.username,
        book_id: this.state.recordBookId,
        category: this.state.actionIcon,
        record_type: recordType,
        create_timestamp: this.state.inputDate + ' 00:00',
        money: this.state.inputMoney,
        note: this.state.inputNote,
      }
    });
    if(this.props.submitSuccess || result.record_id) {
      this.setState({
        openState: false,
      }, () => {
        Taro.navigateBack();
      })
    } else {
      this.setState({
        hasError: true,
      })
    }
  }

  /**
   * 修改账本
   */
  async updateRecord() {
    const recordType = this.state.current == 0 ? 'expense' : 'income'
    const record_id = this.state.recordData.recordId
    const result = await Taro.request({
      method: 'PUT',
      url: `${MAINHOST}/api/recordChangeApi/${record_id}`,
      data: {
        uid: this.state.uid,
        username: this.state.username,
        book_id: this.state.recordBookId,
        category: this.state.actionIcon,
        record_type: recordType,
        create_timestamp: this.state.inputDate + ' 00:00',
        money: this.state.inputMoney,
        note: this.state.inputNote,
      }
    })
    // @ts-ignore
    if(result.data.record_id) {
      this.setState({
        openState: false,
        hasError: true,
        hasErrorMsg: '修改成功',
        hasErrorIcon: 'check-circle',
      }, () => {
        // 跳转回账本页面
        setTimeout(() => {
          Taro.navigateBack({
            delta: 1
          })
        }, 800)
      })
    } else {
      this.setState({
        hasError: true,
        hasErrorMsg: '更新账单信息错误',
      })
    }
  }

  /**
   * 删除账单
   */
  async deleteAction() {
    const record_id = this.state.recordData.recordId
    const result = await await Taro.request({
      method: 'DELETE',
      url: `${MAINHOST}/api/recordChangeApi/${record_id}`,
    })
    if(result.data.detail) {
      this.setState({
        hasError: true,
        hasErrorMsg: '暂无法删除该账单',
      })
    } else {
      this.setState({
        openState: false,
        hasError: true,
        hasErrorMsg: '删除成功',
        hasErrorIcon: 'check-circle',
      }, () => {
        // 跳转回账本页面
        setTimeout(() => {
          Taro.navigateBack({
            delta: 1
          })
        }, 800)
      })
    }
  }

  /**
   * 弹出框确认
   */
  async confirmAction() {
    if(!this.state.recordData.recordId) {
      await this.createRecord()
    } else {
      await this.updateRecord()
    }
  }

  /**
   * 输入框
   */
  handleChange = (type, input) => {
    if (type == 'money') {
      this.setState({
        inputMoney: input
      })
    } else {
      this.setState({
        inputNote: input
      })
    }
  };

  /**
   * 切换时间
   * @param e
   */
  onDateChange = e => {
    this.setState({
      inputDate: e.detail.value
    })
  };

  /**
   * 关闭弹出窗
   * @param e
   */
  closeAction = e => {
    console.log(e)
    this.cancelAction()
  };

  componentDidMount() {
    Taro.setNavigationBarTitle({
      // @ts-ignore
      title: bookNameTranslate('Chinese', this.state.recordBookType)
    })
    // 从缓存中获取用户信息
    const username = Taro.getStorageSync('username')
    const uid = Taro.getStorageSync('uid')
    this.setState({
      uid: uid,
      username: username,
    });
    // 如果是修改账单，自动唤起弹窗
    if(this.state.recordData.recordId) {
      console.log("弹窗信息", this.state.recordData);
      let name = globalData.categoryList[this.state.recordBookType][this.state.recordData.recordType].map((categoryItem) => {
        if (categoryItem.icon == this.state.recordData.recordCategory) {
          return categoryItem
        }
      });
      name = name.filter((nameItem) => {return nameItem})[0] // 数组去空
      this.setState({
        current: this.state.recordData.recordType == 'expense' ? 0 : 1,
        inputDate: this.state.recordData.recordDate.split('T')[0],
        inputMoney: this.state.recordData.recordMoney, // 记录金额
        inputNote: this.state.recordData.recordNote, // 记录备注
        actionTitle: name.title,
        actionIcon: name.icon,
        actionIconBackgroundColor: name.bgColor,
        openState: true,
      })
    }
  }

  render() {
    const tabList = [{ title: '支出' }, { title: '收入' }];
    // 生成当前时间，用于展示
    const time = new Date();
    const h = time.getHours();
    const m = time.getMinutes();

    return (
      <View className='newRecord-wrap'>
        <AtToast
          isOpened={this.state.hasError}
          text={this.state.hasErrorMsg}
          icon={this.state.hasErrorIcon}
          hasMask
        />
        <AtTabs
          current={this.state.current}
          tabList={tabList}
          onClick={this.handleClick.bind(this)}
        >
          <AtTabsPane
            current={this.state.current}
            index={0}
          >
            <CategoryList
              nowBookType={this.state.recordBookType}
              nowBookId={this.state.recordBookId}
              nowType='expense'
              onModalActionState={this.handleSetModalAction.bind(this)}
            />
          </AtTabsPane>
          <AtTabsPane
            current={this.state.current}
            index={1}
          >
            <CategoryList
              nowBookType={this.state.recordBookType}
              nowBookId={this.state.recordBookId}
              nowType='income'
              onModalActionState={this.handleSetModalAction.bind(this)}
            />
          </AtTabsPane>
        </AtTabs>
        <AtModal
          isOpened={this.state.openState}
          closeOnClickOverlay
          onClose={this.closeAction.bind(this)}
        >
          <AtModalContent>
            <View className='header-wrapper'>
              <View className={this.state.current ? 'now-time income' : 'now-time expense'}>{h}:{addZero(m)}</View>
              <View className='header-icon-wrapper' onClick={this.cancelAction}>
                <View className='at-icon at-icon-close' />
              </View>
            </View>
            <View className='action-icon-wrapper' style={this.state.actionIconBackgroundColor}>
              <View className={this.state.actionIcon + ' icon-item at-icon'} />
            </View>
            <View className={this.state.current ? 'action-title income' : 'action-title expense'}>{this.state.actionTitle}</View>
            <View className='date-wrapper'>
              <Picker
                mode='date'
                value={this.state.inputDate}
                onChange={this.onDateChange.bind(this)}
              >
                <View className='action-date'>{this.state.inputDate}</View>
              </Picker>
            </View>
            <View className='money-wrapper'>
              <AtInput
                name='money'
                type='number'
                placeholder='￥0.00'
                value={this.state.inputMoney || ''}
                border={false}
                onChange={this.handleChange.bind(this, 'money')}
              />
            </View>
            <View className='note-wrapper'>
              <AtInput
                name='note'
                placeholder='输入备注'
                value={this.state.inputNote}
                maxLength={30}
                border={false}
                onChange={this.handleChange.bind(this, 'note')}
              />
            </View>
            <View
              className={this.state.current ? 'action-button income' : 'action-button expense'}
              onClick={this.confirmAction}
            >确定</View>
            { this.state.recordData.recordId && <View
              className='action-button delete'
              onClick={this.deleteAction}
            >删除</View> }
          </AtModalContent>
        </AtModal>
      </View>
    )
  }
}

export default NewRecord
