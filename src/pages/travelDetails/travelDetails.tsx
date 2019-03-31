import Taro, { Component, Config } from '@tarojs/taro'
import {View, Text, Button, ScrollView} from '@tarojs/components'
import { TravelDetailsProps, TravelDetailsState } from './travelDetails.interface'
import './travelDetails.scss'
import {MAINHOST} from "../../config";
import '../../assets/iconfont/iconfont.scss'
import { dateFormatter, globalData } from '../../utils/common'

class TravelDetails extends Component<TravelDetailsProps,TravelDetailsState > {
  config:Config = {
    navigationBarTitleText: '标题'
  };
  constructor(props: TravelDetailsProps) {
    super(props);
    let budget = decodeURIComponent(this.$router.params.budget);
    if (budget == 'null' || budget == 'undefined') {
      budget = '0.00';
    }
    this.state = {
      sBookId: decodeURIComponent(this.$router.params.sBookId),
      bookId: decodeURIComponent(this.$router.params.bookId),
      budget: budget,
      bookType: decodeURIComponent((this.$router.params.bookType)),
      bookData: [],
      expenseNum: 0,
      incomeNum: 0,
      countNum: 0,
    }
  }

  /**
   * 请求当前账本数据
   */
  async getBookData() {
    let result = await Taro.request({
      method: 'GET',
      url: `${MAINHOST}/api/recordDataApi?book_id=` + this.state.bookId,
    })
    result = result.data.results;
    let expense = 0;
    let income = 0;
    let count = 0;
    // @ts-ignore
    result.forEach((item) => {
      if (item.record_type == 'expense') {
        expense += parseFloat(item.money)
      } else {
        income += parseFloat(item.money)
      }
      count += 1
    })
    this.setState({
      expenseNum: expense,
      incomeNum: income,
      countNum: count,
      bookData: result
    })
  }

  /**
   * 跳转到新建账本页
   */
  jumpToNewRecord() {
    Taro.navigateTo({
      url: '/pages/newRecord/newRecord?bookId=' + this.state.bookId
        + '&bookType=' + this.state.bookType
        + '&sBookId=' + this.state.sBookId
    })
  }

  /**
   * 跳转修改账本页
   */
  jumpToChangeRecord() {
    Taro.navigateTo({
      url: '/pages/newTravel/newTravel?bookId=' + this.state.bookId
    })
  }

  /**
   * 跳转到修改记录
   * @param item
   */
  jumpToItem(item) {
    Taro.navigateTo({
      url: '/pages/newRecord/newRecord?bookId=' + this.state.bookId +
        '&bookType=' + this.state.bookType +
        '&recordId=' + item.record_id +
        '&recordDate=' + item.create_timestamp +
        '&recordMoney=' + item.money +
        '&recordNote=' + item.note +
        '&recordType=' + item.record_type +
        '&recordCategory=' + item.category
    })
  }

  componentDidShow() {
    Taro.setNavigationBarTitle({ // 设置标题栏账本名
      title: decodeURIComponent(this.$router.params.bookName)
    });
    this.getBookData();
  }

  render() {
    const nowItem = this.state.bookData.map((item, key) => {
      const formatTime = dateFormatter(item.create_timestamp) // 格式化时间
      const moneyType = item.record_type == 'expense' ? '-' : '+'
      let name = globalData.categoryList[this.state.bookType][item.record_type].map((categoryItem) => {
        if (categoryItem.icon == item.category) {
          return categoryItem
        }
      });
      name = name.filter((nameItem) => {return nameItem})[0];
      return (
        <View
          key={key}
          onClick={this.jumpToItem.bind(this, item)}
          className='detail-item at-row at-row__justify--between at-row__align--center'
        >
          <View className='detail-name-date at-col at-col-1 at-col--auto'>
            <View className='icon-wrapper'>
              <View
                style={name.bgColor}
                className={`icon-item iconfont ${item.category}`}
              />
            </View>
            <View className='text-wrapper'>
              <View className='detail-name'>{name.title}</View>
              <View className='detail-date'>{formatTime}</View>
              <View className='detail-note'>{item.note}</View>
            </View>
          </View>
          <View className='detail-money at-col at-col-1 at-col--auto'>
            {moneyType}￥{parseFloat(item.money)}
          </View>
        </View>
      )
    })

    return (
      <View className='travelDetails-wrap'>
        <View className='header-wrapper'>
          <View className='header-card'>
            <View
              className='edit-book'
              onClick={this.jumpToChangeRecord}
            >
              <View className='at-icon at-icon-edit' />修改账本
            </View>
            <View className='card-header'>
              <View className='total-expense'>
                ￥<Text className='expense-money'>{this.state.expenseNum.toFixed(2)}</Text>
              </View>
              <View className='expense-title'>总支出</View>
            </View>
            <View className='card-content at-row'>
              <View className='budget-block at-col'>
                <View className='budget-title'>预算</View>
                <View className='budget-money-wrapper'>
                  ￥<Text className='budget-money'>{parseFloat(this.state.budget).toFixed(2)}</Text>
                </View>
              </View>
              <View className='count-block at-col'>
                <View className='count-title'>笔数</View>
                <View className='count-money'>{this.state.countNum}</View>
              </View>
            </View>
          </View>
        </View>
        <View className='travelDetails-container'>
          <View className='container-title'>开销记录</View>
          <ScrollView
            className='scroll-view'
            scrollY
            scrollWithAnimation
          >
            <View className='details-content'>
              {nowItem}
            </View>
          </ScrollView>
        </View>
        <View className='single-button-footer' onClick={this.jumpToNewRecord}>
          <Button className='single-button'>新建记录</Button>
        </View>
      </View>
    )
  }
}

export default TravelDetails
