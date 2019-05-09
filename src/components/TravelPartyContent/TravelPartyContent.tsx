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
    this.state = {
      tempImageUrl: [],
    }
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
  jumpToDetailBook = (bookId, bookName, budget) => {
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


  /**
   * 根据imageid转换为url
   * @param imageIds
   */
  getUrlPromise(imageIds) {
    return new Promise((resolve, reject) => {
      const result = Taro.cloud.getTempFileURL({
        fileList: [imageIds]
      })
      if (!result) {
        reject()
        return;
      }
      resolve(result)
    })
  }

  /**
   * 根据imageId换取临时url
   * @param imageIdObj
   */
  async getTempImageUrl(imageIdObj) {
    const imgObj:any = {}
    for (const item in imageIdObj) {
      const data:any = await this.getUrlPromise(imageIdObj[item])
      imgObj[item] = data.fileList[0]
    }
    this.setState({
      tempImageUrl: imgObj
    })
  }

  componentWillReceiveProps(nextProps) {
    console.log(11111)
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
      this.BarChart.refresh(chartData);
    }
    // 先进行图片url读取
    const imageIdObj:any = {} // 存储图片id
    if (nextProps.nowBookRecord.bookArr && nextProps.nowBookRecord.bookArr.length > 0) {
      nextProps.nowBookRecord.bookArr.map((item) => {
        imageIdObj[item.bookId] = item.innerBookInfo.image_url
      })
      this.getTempImageUrl(imageIdObj) // id更换链接
    }
  }

  componentWillMount(): void {
    // 云开发
    Taro.cloud.init({
      env: 'dev-envir-a058cd',
      traceUser: true,
    })
  }

  render() {
    let swiperArr:any; // 轮播图效果
    if (this.props.nowBookRecord.bookArr && this.props.nowBookRecord.bookArr.length > 0) {
      swiperArr = this.props.nowBookRecord.bookArr.map((item, key) => {
        console.log(item)
        const time = this.formatterTime(item.innerBookInfo.create_timestamp);
        const bookId = item.bookId
        const bookName = item.innerBookInfo.book_name
        const budget = item.innerBookInfo.budget
        console.log(233, this.state.tempImageUrl[item.bookId])
        const hasImage = this.state.tempImageUrl[item.bookId] && this.state.tempImageUrl[item.bookId].tempFileURL
        const imageUrl = hasImage ? this.state.tempImageUrl[item.bookId].tempFileURL : 'http://d1quwfaqaf63s5.cloudfront.net/IMG_1305.JPG'
        return (
          <SwiperItem key={key}>
            <View
              className='inner-item'
              onClick={this.jumpToDetailBook.bind(this, bookId, bookName, budget)}
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
                    <Image
                      src={imageUrl}
                      style='width:160px;height:110px;'
                      mode='aspectFill'
                    />
                  </View>
                  <View className='at-col detail-content' />
                </View>
              </View>
            </View>
          </SwiperItem>
        )
      })
    }


    const legend = ['项目', '金额(元)']

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
          legend={legend}
        />
      </View>
    )
  }
}

export default TravelPartyContent
