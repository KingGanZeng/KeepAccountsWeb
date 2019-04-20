import Taro, { Component } from '@tarojs/taro'
import {View, Text} from '@tarojs/components'
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
    nowBookRecord: {}, // 账本信息
    nowBookType: 'moneyManagement',
    nowBookId: 0,
  };

  /**
   * 跳转到记录内页
   * @param item
   */
  jumpToManagement = (item) => {
    Taro.navigateTo({
      url: "/pages/travelDetails/travelDetails?bookId=" + item.bookId +
        '&bookName=' + item.innerBookInfo.book_name +
        '&bookType=' + 'moneyManagement' +
        '&budget=' + item.innerBookInfo.budget +
        '&sBookId=' + this.props.nowBookRecord.specialBookId +
        '&is_admin=' + true
    })
  };

  render() {
    const recordArr = this.props.nowBookRecord;
    const content = recordArr.bookArr.map(item => {
      let income = 0;
      let expense = 0;
      item.recordArr.forEach( recordItem => {
        if (recordItem.record_type == 'income') {
          income += parseFloat(recordItem.money)
        } else {
          expense += parseFloat(recordItem.money)
        }
      })

      return (
        <View
          className='at-row at-row__justify--between at-row__align--end item-wrapper'
          key={String(item.bookId)}
          onClick={this.jumpToManagement.bind(this, item)}
        >
          <View className='at-col at-col-1 at-col--auto item-intro'>
            <View className='item-name'>{item.innerBookInfo.book_name}</View>
            <View className='item-money'>
              进账: <Text className='income'>￥{income}</Text>
            </View>
            <View className='item-money'>
              出账: <Text className='expense'>￥{expense}</Text>
            </View>
          </View>
          <View className='at-col at-col-3 item-count'>
            <View className='count-title'>差额</View>
            <View className='count-money'>￥{income-expense}</View>
          </View>
        </View>
      )
    });

    return (
      <View className='fx-MoneyManagementContent-wrap'>
        {content}
      </View>
    )
  }
}

export default MoneyManagementContent
