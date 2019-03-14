import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtTabs, AtTabsPane } from 'taro-ui'
import { ContentProps, ContentState } from './Content.interface'
import './Content.scss'
// @ts-ignore
import { DailyContent } from '../DailyContent/DailyContent'

class Content extends Component<ContentProps,ContentState > {
  constructor(props: ContentProps) {
    super(props);
    this.state = {
      current: 0,
      dailyObj: { // 假数据
        incomeObj: this.props.income,
        expenseObj: this.props.expense,
      }
    }
  }
  static options = {
    addGlobalClass: true
  };
  static defaultProps:ContentProps = {
    income: {},
    expense: {},
  };

  handleClick (value) {
    this.setState({
      current: value,
    })
  }

  render() {
    const tabList = [{ title: '支出' }, { title: '收入' }];
    const { dailyObj } = this.state;

    const incomeArr = Object.values(dailyObj.incomeObj);
    const incomeContent = incomeArr.map((item, index) => {
      return (
        // native component
        <DailyContent
          taroKey={String(index)}
          dailyDetail={item}
        />
      )
    });

    const expenseArr = Object.values(dailyObj.expenseObj);
    const expenseContent = expenseArr.map((item, index) => {
      return (
        // native component
        <DailyContent
          taroKey={String(index)}
          dailyDetail={item}
        />
      )
    });

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
            {expenseContent}
          </AtTabsPane>
          <AtTabsPane
            current={this.state.current}
            index={1}
          >
            {incomeContent}
          </AtTabsPane>
        </AtTabs>
      </View>
    )
  }
}

export default Content
