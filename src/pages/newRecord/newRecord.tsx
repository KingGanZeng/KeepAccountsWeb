
import Taro, { Component, Config } from '@tarojs/taro'
import {Picker, View} from '@tarojs/components'
import {AtInput, AtModal, AtModalContent, AtTabs, AtTabsPane} from 'taro-ui'
import { connect } from '@tarojs/redux'
import { NewRecordProps, NewRecordState } from './newRecord.interface'
import './newRecord.scss'
// @ts-ignore
import { CategoryList } from '../../components/CategoryList/CategoryList'
// @ts-ignore
import {addZero, bookNameTranslate} from "../../utils/common";
import '../../assets/iconfont/iconfont.scss'

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
      current: 0,
      bookType: decodeURIComponent(this.$router.params.bookType) || 'dayLife',
      bookId: parseInt(decodeURIComponent(this.$router.params.bookId), 10),
      inputDate: `${year}-${month}-${day}`,
      inputMoney: 0, // 记录金额
      inputNote: '', // 记录备注
      actionTitle: '',
      actionIcon: '',
      actionIconBackgroundColor: '',
      openState: false,
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
      inputDate: `${year}-${month}-${day}`,
      inputMoney: 0,
      inputNote: '',
      openState: false,
    })
  }

  /**
   * 弹出框确认
   */
  confirmAction() {
    this.setState({
      openState: false,
    }, () => {
      Taro.navigateBack();
    })
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

  closeAction = e => {
    console.log(e)
    this.cancelAction()
  };

  componentDidMount() {
    Taro.setNavigationBarTitle({
      // @ts-ignore
      title: bookNameTranslate('English', this.state.bookType)
    })
  }

  render() {
    const tabList = [{ title: '支出' }, { title: '收入' }];
    // 生成当前时间，用于展示
    const time = new Date();
    const h = time.getHours();
    const m = time.getMinutes();

    return (
      <View className='newRecord-wrap'>
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
              nowBookType={this.state.bookType}
              nowBookId={this.state.bookId}
              nowType='expense'
              onModalActionState={this.handleSetModalAction.bind(this)}
            />
          </AtTabsPane>
          <AtTabsPane
            current={this.state.current}
            index={1}
          >
            <CategoryList
              nowBookType={this.state.bookType}
              nowBookId={this.state.bookId}
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
              <View className={ this.state.actionIcon + ' icon-item at-icon'} />
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
                value={this.state.inputMoney}
                border={false}
                onChange={this.handleChange.bind(this, 'money')}
              />
            </View>
            <View className='note-wrapper'>
              <AtInput
                name='note'
                placeholder='输入备注'
                value={this.state.inputNote}
                maxLength={15}
                border={false}
                onChange={this.handleChange.bind(this, 'note')}
              />
            </View>
            <View
              className={this.state.current ? 'action-button income' : 'action-button expense'}
              onClick={this.confirmAction}
            >确定</View>
          </AtModalContent>
        </AtModal>
      </View>
    )
  }
}

export default NewRecord
