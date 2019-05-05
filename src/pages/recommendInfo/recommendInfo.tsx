import Taro, { Component, Config } from '@tarojs/taro'
import {ScrollView, Text, View} from '@tarojs/components'
import {AtButton, AtTabs, AtTabsPane, AtToast} from 'taro-ui'
import Tips from '../../utils/tips'
import { RecommendInfoProps, RecommendInfoState } from './recommendInfo.interface'
import '../travelDetails/travelDetails.scss'
import './recommendInfo.scss'
import '../../assets/iconfont/iconfont.scss'
import {addZero, globalData} from "../../utils/common";
import {MAINHOST} from "../../config";

class RecommendInfo extends Component<RecommendInfoProps,RecommendInfoState > {
  config:Config = {
    navigationBarTitleText: '大家都在记'
  }
  constructor(props: RecommendInfoProps) {
    super(props)
    this.state = {
      current: 0,
      hasError: false,
      hasErrorMsg: '获取推荐信息错误',
      hasErrorIcon: 'close-circle',
      myUsageList: [],
      recommendList: [],
      bookType: '',
      itemId: decodeURIComponent(this.$router.params.itemId),
    }
  }

  /**
   * 获取用户最爱列表
   */
  async getMyUsage() {
    const bookId = decodeURIComponent(this.$router.params.bookId)
    const bookType = decodeURIComponent(this.$router.params.bookType)
    try{
      Tips.loading()
      const data = await Taro.request({
        method: "GET",
        url: `${MAINHOST}/api/getAllBookItemRecords`,
        data: {
          bookId: bookId,
        }
      });
      this.setState({
        myUsageList: data.data.record_set,
        bookType: bookType,
      })
      Tips.loaded()
    } catch (e) {
      this.setState({
        hasError: true,
        hasErrorMsg: '获取推荐信息错误',
        hasErrorIcon: 'close-circle',
      })
      Tips.loaded()
    }
  }

  handleClick (value) {
    this.setState({
      current: value
    })
  }

  async addToProject(recordInfo, recordType) {
    const username = Taro.getStorageSync('username')
    const uid = Taro.getStorageSync('uid')
    const nowDate = new Date();
    const year = nowDate.getFullYear();
    const month = addZero((nowDate.getMonth()+1).toString());
    const day = addZero((nowDate.getDate()).toString());
    const result = await Taro.request({
      method: "POST",
      url: `${MAINHOST}/api/recordDataApi`,
      data: {
        uid: uid,
        username: username,
        book_id: this.state.itemId, // 项目id
        category: recordInfo.icon,
        record_type: recordType,
        create_timestamp: `${year}-${month}-${day} 00:00`,
        money: 0,
        note: '',
        book_type: this.state.bookType,
      }
    });
    if(result.data) {
      this.setState({
        hasError: true,
        hasErrorMsg: '添加成功',
        hasErrorIcon: 'check-circle',
      }, () => {
        Taro.navigateBack();
      })
    } else {
      this.setState({
        hasError: true,
        hasErrorMsg: '添加失败',
        hasErrorIcon: 'close-circle',
      })
    }
  }

  async getHotRecord() {
    const bookType = decodeURIComponent(this.$router.params.bookType) // 场景类型
    try {
      Tips.loading()
      const result = await Taro.request({
        method: "GET",
        url: `${MAINHOST}/api/getRecordRecommendList`,
      })
      const recommendList:any = []
      let tmpList = [] // 临时list
      result.data.results.forEach((item, key) => {
        if (item.book_type === bookType) {
          tmpList = JSON.parse(item.record_recommend)
        }
      })
      tmpList.forEach(item => {
        recommendList.push({
          icon_name: item[0],
          record_type: 'expense',
          popular: item[1],
        })
      })
      console.log(recommendList)
      this.setState({
        recommendList: recommendList
      })
      Tips.loaded()
    } catch (e) {
      this.setState({
        hasError: true,
        hasErrorMsg: '获取推荐信息错误',
        hasErrorIcon: 'close-circle',
      })
      console.log(e)
      Tips.loaded()
    }
  }

  componentDidMount() {
    this.getMyUsage()
    this.getHotRecord()
  }

  render() {
    // const recommendList = [
    //   {icon_name: 'icon-Hotel', record_type: 'expense', popular: 94},
    //   {icon_name: 'icon-icon-test1', record_type: 'expense', popular: 87},
    //   {icon_name: 'icon-icon-test2', record_type: 'expense', popular: 80},
    //   {icon_name: 'icon-kouhong', record_type: 'expense', popular: 80},
    //   {icon_name: 'icon-icon-test3', record_type: 'expense', popular: 76},
    //   {icon_name: 'icon-huodong', record_type: 'expense', popular: 73},
    //   {icon_name: 'icon-wukong1', record_type: 'income', popular: 69},
    //   {icon_name: 'icon-yiyuan', record_type: 'expense', popular: 67},
    //   {icon_name: 'icon-icon-test', record_type: 'expense', popular: 62},
    // ]
    const bookType = this.state.bookType
    const recommendList = this.state.recommendList
    const recommendContent = recommendList.map((item, index) => {
      let name = globalData.categoryList[bookType][item.record_type].map((categoryItem) => {
        if (categoryItem.icon == item.icon_name) {
          return categoryItem
        }
      });
      name = name.filter((nameItem) => {return nameItem})[0];
      // 如果支出中没有该类别，则分到收入中搜索
      if (!name) {
        name = globalData.categoryList[bookType]['income'].map((categoryItem) => {
          if (categoryItem.icon == item.icon_name) {
            return categoryItem
          }
        });
        name = name.filter((nameItem) => {return nameItem})[0];
        item.record_type = 'income'
      }
      const note = item.record_type == 'expense' ? '支出' : '收入'
      return (
        <View
          key={'recommend-' + index}
          className='detail-item at-row at-row__justify--between at-row__align--center'
        >
          <View className='detail-name-date at-col at-col-1 at-col--auto'>
            <View className='icon-wrapper'>
              <View
                style={name.bgColor}
                className={`icon-item iconfont ${item.icon_name}`}
              />
            </View>
            <View className='text-wrapper'>
              <View className='detail-name'>{name.title}</View>
              <View className='detail-note'>类型:{note}</View>
            </View>
          </View>
          <View className='detail-popular at-col at-col-1 at-col--auto'>
            <View className='add-to-myItem'>
              <AtButton
                type='primary'
                size='small'
                onClick={this.addToProject.bind(this, name, item.record_type)}
              >加到我的项目</AtButton>
            </View>
            人气值：<Text className='popular-num'>{item.popular}</Text>
          </View>
        </View>
      )
    })

    const myRecommendList = this.state.myUsageList
    const myRecommendContent = myRecommendList.map((item, index) => {
      const itemCategory = item[0]
      const recordType = item[1].record_type
      const usage = item[1].usage
      let name = globalData.categoryList[bookType][recordType].map((categoryItem) => {
        if (categoryItem.icon == itemCategory) {
          return categoryItem
        }
      });
      name = name.filter((nameItem) => {return nameItem})[0];
      const note = recordType == 'expense' ? '支出' : '收入'
      return (
        <View
          key={'myRecommend-' + index}
          className='detail-item at-row at-row__justify--between at-row__align--center'
        >
          <View className='detail-name-date at-col at-col-1 at-col--auto'>
            <View className='icon-wrapper'>
              <View
                style={name.bgColor}
                className={`icon-item iconfont ${itemCategory}`}
              />
            </View>
            <View className='text-wrapper'>
              <View className='detail-name'>{name.title}</View>
              <View className='detail-note'>类型:{note}</View>
            </View>
          </View>
          <View className='detail-popular at-col at-col-1 at-col--auto'>
            <View className='add-to-myItem'>
              <AtButton
                type='primary'
                size='small'
                onClick={this.addToProject.bind(this, name, recordType)}
              >加到我的项目</AtButton>
            </View>
            使用频率：<Text className='popular-num'>{usage}</Text>次
          </View>
        </View>
      )
    })

    const tabList = [{ title: '人气记账' }, { title: '我的最爱' }]
    return (
      <View className='recommendInfo-wrap travelDetails-wrap'>
        <AtToast
          isOpened={this.state.hasError}
          text={this.state.hasErrorMsg}
          icon={this.state.hasErrorIcon}
          hasMask
        />
        <AtTabs current={this.state.current} tabList={tabList} onClick={this.handleClick.bind(this)}>
          <AtTabsPane current={this.state.current} index={0} >
            <View className='travelDetails-container'>
              <View className='recommend-wrapper'>
                <View className='recommend-content'>
                  <ScrollView
                    scrollY
                    scrollWithAnimation
                    style='height: 90vh'
                  >
                    {recommendContent}
                  </ScrollView>
                </View>
              </View>
            </View>
          </AtTabsPane>
          <AtTabsPane current={this.state.current} index={1} >
            <View className='travelDetails-container'>
              <View className='recommend-wrapper'>
                <View className='recommend-content'>
                  <ScrollView
                    scrollY
                    scrollWithAnimation
                    style='height: 90vh'
                  >
                    {myRecommendContent}
                  </ScrollView>
                </View>
              </View>
            </View>
          </AtTabsPane>
        </AtTabs>
      </View>
    )
  }
}

export default RecommendInfo
