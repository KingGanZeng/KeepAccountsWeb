import Taro, {Component} from '@tarojs/taro'
import {Swiper, SwiperItem, View, Image} from '@tarojs/components'
import {TravelPartyContentProps, TravelPartyContentState} from './TravelPartyContent.interface'
import './TravelPartyContent.scss'
// @ts-ignore
// import { LineChart } from '../LineChart/LineChart'
import { BarChart } from '../../components/BarChart/BarChart'

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
    nowBookType: '',
    nowBookId: 0,
    isAdmin: false, // 是否为管理员
  }

  /**
   * 跳转内页
   */
  jumpToDetailBook(bookId, bookName, budget) {
    Taro.navigateTo({
      url: "/pages/travelDetails/travelDetails?bookId=" + bookId +
        '&bookName=' + bookName +
        '&bookType=' + this.props.nowBookType +
        '&budget=' + budget +
        '&sBookId=' + this.props.nowBookRecord.specialBookId +
        '&is_admin=' + true
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

  // @ts-ignore
  refBarChart = node => {this.BarChart = node}

  componentWillReceiveProps(nextProps) {
    if (nextProps.nowBookRecord.bookArr) {
      const data:any = {
        itemName: [],
        income: [],
        expense: [],
      }
      nextProps.nowBookRecord.bookArr.forEach((item) => {
        data.itemName.push(item.innerBookInfo.book_name)
        data.income.push(item.innerIncome || 0)
        data.expense.push(item.innerExpense || 0)
      });
      const chartData = {
        dimensions: {
          data: data.itemName.reverse()
        },
        measures: [{
          data: data.expense.reverse()
        },{
          data: data.income.reverse()
        }]
      };
      // @ts-ignore
      this.BarChart.refresh(chartData);
    }
  }


  render() {
    let swiperArr:any;

    if (this.props.nowBookRecord.bookArr && this.props.nowBookRecord.bookArr.length > 0) {
      swiperArr = this.props.nowBookRecord.bookArr.map((item, key) => {
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
                  <View className='at-col image-content'>
                    <Image src='http://d2f7o8gw4q8bay.cloudfront.net/jordan.jpg' mode='scaleToFill' />
                  </View>
                  <View className='at-col detail-content' />
                </View>
              </View>
            </View>
          </SwiperItem>
        )
      });
    }

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
        <BarChart
          ref={this.refBarChart}
          chartTitle='项目收支情况'
        />
      </View>
    )
  }
}

export default TravelPartyContent
