import Taro, { Component } from '@tarojs/taro'
import {View, Text, Button} from '@tarojs/components'
import { MoneyManagementContentProps, MoneyManagementContentState } from './MoneyManagementContent.interface'
import './MoneyManagementContent.scss'

class MoneyManagementContent extends Component<MoneyManagementContentProps,MoneyManagementContentState > {
  constructor(props: MoneyManagementContentProps) {
    super(props);
    this.state = {}
  }
  static options = {
    addGlobalClass: true
  };
  static defaultProps:MoneyManagementContentProps = {
    nowBookRecord: [], // 账本信息
    nowBookType: 'moneyManagement',
    nowBookId: 'm01',
  };

  /**
   * 跳转到记录内页
   * @param item
   */
  jumpToManagement = (item) => {
    Taro.navigateTo({
      url: "/pages/index/index?bookId=" + item.manage_id +
        '&bookName=' + item.management_name +
        '&bookType=' + 'moneyManagementInner'
    })
  };

  /**
   * 跳转到新建投资项目
   * @param item
   */
  jumpToNewManagement = (item) => {

  }

  render() {
    const recordArr = this.props.nowBookRecord;
    const content = recordArr.map(item => {
      return (
        <View
          className='at-row at-row__justify--between at-row__align--end item-wrapper'
          key={String(item.manage_id)}
          onClick={this.jumpToManagement.bind(this, item)}
        >
          <View className='at-col at-col-1 at-col--auto item-intro'>
            <View className='item-name'>{item.management_name}</View>
            <View className='item-money'>
              进账: <Text className='income'>￥{item.income}</Text>
            </View>
            <View className='item-money'>
              出账: <Text className='expense'>￥{item.expense}</Text>
            </View>
          </View>
          <View className='at-col at-col-3 item-count'>
            <View className='count-title'>差额</View>
            <View className='count-money'>￥{item.income-item.expense}</View>
          </View>
        </View>
      )
    });

    return (
      <View className='fx-MoneyManagementContent-wrap'>
        {content}
        <View className='single-button-footer' onClick={this.jumpToNewManagement.bind(this)}>
          <Button className='single-button'>新建项目</Button>
        </View>
      </View>
    )
  }
}

export default MoneyManagementContent
