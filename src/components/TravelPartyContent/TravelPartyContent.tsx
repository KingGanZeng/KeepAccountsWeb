import Taro, {Component} from '@tarojs/taro'
import {Swiper, SwiperItem, View} from '@tarojs/components'
import {TravelPartyContentProps, TravelPartyContentState} from './TravelPartyContent.interface'
import './TravelPartyContent.scss'
// @ts-ignore
// import { LineChart } from '../LineChart/LineChart'

class TravelPartyContent extends Component<TravelPartyContentProps,TravelPartyContentState > {
  constructor(props: TravelPartyContentProps) {
    super(props)
    this.state = {}
  }
  static options = {
    addGlobalClass: true
  }
  static defaultProps:TravelPartyContentProps = {
    nowBookRecord: {},
    nowBookType: 'travelParty',
    nowBookId: 0
  }

  /**
   * 跳转内页
   */
  jumpToDetailBook(bookId, bookName, budget) {
    Taro.navigateTo({
      url: "/pages/travelDetails/travelDetails?bookId=" + bookId +
        '&bookName=' + bookName +
        '&bookType=' + 'travelParty' +
        '&budget=' + budget +
        '&sBookId=' + this.props.nowBookRecord.specialBookId
    })
  }

  /**
   * 时间戳格式化
   * @param djangoTime
   */
  formatterTime(djangoTime) {
    const now = new Date(djangoTime)
    var year = now.getFullYear(),
      month = ("0" + (now.getMonth() + 1)).slice(-2),
      date = ("0" + now.getDate()).slice(-2),
      hour = ("0" + now.getHours()).slice(-2),
      minute = ("0" + now.getMinutes()).slice(-2),
      second = ("0" + now.getSeconds()).slice(-2);
    return year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second
  }

  render() {
    const swiperArr = this.props.nowBookRecord.bookArr.map((item, key) => {
      const time = this.formatterTime(item.innerBookInfo.create_timestamp)
      return (
        <SwiperItem key={key}>
          <View
            className='inner-item'
            onClick={this.jumpToDetailBook.bind(this, item.bookId, item.innerBookInfo.book_name, item.innerBookInfo.budget)}
          >
            <View className='item-container'>
              <View className='item-header at-row at-row__justify--between'>
                <View className='at-col at-col-1 at-col--auto header-left'>
                  <View className='travel-title'>{item.innerBookInfo.book_name}</View>
                  <View className='travel-create-time'>{time}</View>
            </View>
                <View className='at-col at-col-1 at-col--auto header-right'>
                  ￥{item.innerExpense.toFixed(2)}
                </View>
              </View>
              <View className='item-content at-row'>
                <View className='at-col image-content' />
                <View className='at-col detail-content' />
              </View>
            </View>
          </View>
        </SwiperItem>
      )
    });

    return (
      <View className='fx-TravelPartyContent-wrap'>
        <Swiper
          className='inner-container'
          indicatorColor='#999'
          indicatorActiveColor='#ffffff'
          circular
          indicatorDots
        >
          {swiperArr}
        </Swiper>
      </View>
    )
  }
}

export default TravelPartyContent
