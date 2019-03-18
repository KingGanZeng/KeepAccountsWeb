import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { DailyContentProps, DailyContentState } from './DailyContent.interface'
import './DailyContent.scss'
import { addZero } from '../../utils/common'

class DailyContent extends Component<DailyContentProps,DailyContentState > {
  constructor(props: DailyContentProps) {
    super(props);
    this.state = {
      dailyDetail: this.props.dailyDetail,
      detailType: this.props.type,
    }
  }
  static options = {
    addGlobalClass: true
  };
  static defaultProps:DailyContentProps = {
    dailyDetail: {},
    type: 'income',
  };

  /**
   * 格式化日期
   * @param date
   */
  dateFormatter() {
    const now = new Date();
    const date = this.state.dailyDetail.date;
    const input = date.split('-');
    const y = now.getFullYear().toString();
    let m = now.getMonth().toString();
    let d = now.getDate().toString();
    m = addZero(m+1);
    d = addZero(d);
    if(input[0] == y && input[1] == m && input[2] == d) {
      return `今天(${m}.${d})`
    } else {
      return `${addZero(input[1])}.${addZero(input[2])}`
    }
  }

  /**
   * 跳转到修改记录
   */
  jumpToItem(item) {
    console.log(item);
    Taro.navigateTo({
      url: '/pages/newRecord/newRecord?bookId=' + '321' + '&bookType=' + 'dayLife'
    })
  }

  render() {
    const { dailyDetail } = this.state;
    const contentList = dailyDetail.rowArr.map((item, index) => {
      return (
        <View className='at-row at-row__justify--between daily-item'
              key={String(index)}
              onClick={this.jumpToItem.bind(this, item)}
        >
          <View className='at-col at-col-1 at-col--auto item-intro'>
            <View className='at-icon at-icon-shopping-bag-2'>
              <Text className='item-name'>{item.category}</Text>
            </View>
            <View className='item-note'>{item.note}</View>
          </View>
          <View className='at-col at-col-1 at-col--auto item-money'>
            ￥{item.money.toFixed(2)}
          </View>
        </View>
      )
    });

    return (
      <View className='fx-DailyContent-wrap'>
        <View className='at-row at-row__justify--between daily-header'>
          <View className='at-col at-col-1 at-col--auto content-date'>
            {this.dateFormatter()}
          </View>
          <View className='at-col at-col-1 at-col--auto content-total'>
            ￥<Text className={this.state.detailType == 'income' ? 'income-count' : 'expense-count'}>
            {this.state.dailyDetail.total.toFixed(2)}
          </Text>
          </View>
        </View>
        <View className='daily-content'>
          {contentList}
        </View>
      </View>
    )
  }
}

export default DailyContent
