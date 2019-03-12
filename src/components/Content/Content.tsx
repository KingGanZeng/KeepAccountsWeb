import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtTabs, AtTabsPane } from 'taro-ui'
import { ContentProps, ContentState } from './Content.interface'
import './Content.scss'
import { DailyContent } from '../DailyContent/DailyContent'

class Content extends Component<ContentProps,ContentState > {
  constructor(props: ContentProps) {
    super(props)
    this.state = {
      current: 0,
      dailyObj: { // 假数据
        incomeArr: [
          {date: '2019-03-12', rowArr: [{type: 'food', money: 20}, {type: 'shopping', money: 300}], total: 320},
          {date: '2019-03-11', rowArr: [{type: 'food', money: 200.42}, {type: 'shopping', money: 100}], total: 300.42},
          {date: '2019-03-7', rowArr: [{type: 'food', money: 200.42}, {type: 'shopping', money: 100}], total: 300.42}
        ],
        expenseArr: [
          {date: '2019-03-5', rowArr: [{type: 'salary', money: 2000}], total: 2000},
          {date: '2019-03-25', rowArr: [{type: 'salary', money: 2000}], total: 2000},
        ],
      }
    }
  }
  static options = {
    addGlobalClass: true
  }
  static defaultProps:ContentProps = {}

  handleClick (value) {
    this.setState({
      current: value,
    })
  }

  render() {
    const tabList = [{ title: '支出' }, { title: '收入' }]
    const { dailyObj } = this.state
    const incomeContent = dailyObj.incomeArr.map((item, index) => {
      return (
        // native component
        <DailyContent
          taroKey={String(index)}
          dailyDetail={item}
        />
      )
    })

    const expenseContent = dailyObj.expenseArr.map((item, index) => {
      return (
        // native component
        <DailyContent
          taroKey={String(index)}
          dailyDetail={item}
        />
      )
    })

    return (
      <View className='fx-Content-wrap'>
        <AtTabs
          current={this.state.current}
          tabList={tabList}
          onClick={this.handleClick.bind(this)}
        >
          <AtTabsPane
            current={this.state.current}
            index={0}
          >
            {incomeContent}
          </AtTabsPane>
          <AtTabsPane
            current={this.state.current}
            index={1}
          >
            {expenseContent}
          </AtTabsPane>
        </AtTabs>
      </View>
    )
  }
}

export default Content
