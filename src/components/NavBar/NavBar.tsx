import Taro, { Component } from '@tarojs/taro'
import { View, Picker, Text } from '@tarojs/components'
import { NavBarProps, NavBarState } from './NavBar.interface'
import './NavBar.scss'
import { addZero, moneyFormatter } from '../../utils/common'

class NavBar extends Component<NavBarProps,NavBarState > {
  constructor(props: NavBarProps) {
    super(props);
    this.state = {
      date: this.props.yearMonthStr,
      bookType: this.props.navBookType,
    }
  }
  static options = {
    addGlobalClass: true
  };
  static defaultProps:NavBarProps = {
    yearMonthStr: '2019-02',
    navBarData: {
      incomeCount: 0,
      expenseCount: 0,
      count: 0,
      budget: 0,
    },
    navBookType: '',
    itemNum: 0,
  };

  /**
   * 日期选择器
   * @param e
   */
  onDateChange = e => {
    this.setState({
      date: e.detail.value
    }, () => {
      this.props.onDateState(this.state.date)
    })
  };

  render() {
    // 设置时间，生成时间选择器
    const bookYear = this.state.date.split('-')[0];
    let bookMonth= this.state.date.split('-')[1];
    bookMonth = addZero(bookMonth);
    const pickerType = this.state.bookType === 'dayLife' || this.state.bookType === 'rent' ? 'month' : 'year';

    let content:any;
    if (this.state.bookType == 'dayLife') {
      const mapCount = [
        {title: '支出', value: this.props.navBarData.expenseCount},
        {title: '预算', value: this.props.navBarData.budget},
        {title: '收入', value: this.props.navBarData.incomeCount},
      ];
      content = mapCount.map((item, index) => {
        if (item.title !== '笔数') {
          // @ts-ignore
          item.value = moneyFormatter(item.value);
        }
        return (
          <View className='at-col navBar-footer left-first' key={index}>
            <View className='footer-title'>{item.title}</View>
            <View className='footer-content'>
              { item.title == '支出' && <Text className='money book-expense'>{item.value}</Text> }
              { item.title == '收入' && <Text className='money book-income'>{item.value}</Text> }
              { item.title == '预算' && <Text className='money book-budget'>{item.value}</Text> }
              <Text>￥</Text>
            </View>
          </View>
        )
      })
    } else if(this.state.bookType == 'travelParty') {
      const mapCount = [
        {title: '支出', value: this.props.navBarData.expenseCount},
        {title: '项目数', value: this.props.itemNum},
      ];
      content = mapCount.map((item, index) => {
        if (item.title !== '笔数') {
          // @ts-ignore
          item.value = moneyFormatter(item.value);
        }
        return (
          <View className='at-col navBar-footer left-first' key={index}>
            <View className='footer-title'>{item.title}</View>
            <View className='footer-content'>
              { item.title == '支出' && <Text className='money book-expense'>{item.value}</Text> }
              { item.title == '收入' && <Text className='money book-income'>{item.value}</Text> }
              { item.title == '预算' && <Text className='money book-budget'>{item.value}</Text> }
              { item.title == '项目数' && <Text className='money book-count'>{item.value}</Text> }
              { item.title != '项目数' && <Text>￥</Text>}
            </View>
          </View>
        )
      })
    } else if(this.state.bookType == 'homeDecoration') {
      const mapCount = [
        {title: '支出', value: this.props.navBarData.expenseCount},
        {title: '预算', value: this.props.navBarData.budget},
        {title: '笔数', value: this.props.navBarData.count},
      ];
      content = mapCount.map((item, index) => {
        if (item.title !== '笔数') {
          // @ts-ignore
          item.value = moneyFormatter(item.value);
        }
        return (
          <View className='at-col navBar-footer left-first' key={index}>
            <View className='footer-title'>{item.title}</View>
            <View className='footer-content'>
              { item.title == '支出' && <Text className='money book-expense'>{item.value}</Text> }
              { item.title == '预算' && <Text className='money book-budget'>{item.value}</Text> }
              { item.title == '笔数' && <Text className='money book-count'>{item.value}</Text> }
              { item.title != '笔数' && <Text>￥</Text>}
            </View>
          </View>
        )
      })
    } else if(this.state.bookType == 'socialRelation') {
      const mapCount = [
        {title: '支出', value: this.props.navBarData.expenseCount},
        {title: '收入', value: this.props.navBarData.incomeCount},
      ];
      content = mapCount.map((item, index) => {
        if (item.title !== '笔数') {
          // @ts-ignore
          item.value = moneyFormatter(item.value);
        }
        return (
          <View className='at-col navBar-footer left-first' key={index}>
            <View className='footer-title'>{item.title}</View>
            <View className='footer-content'>
              { item.title == '支出' && <Text className='money book-expense'>{item.value}</Text> }
              { item.title == '收入' && <Text className='money book-income'>{item.value}</Text> }
              <Text>￥</Text>
            </View>
          </View>
        )
      })
    } else if(this.state.bookType == 'moneyManagement') {
      const mapCount = [
        {title: '总盈利', value: this.props.navBarData.incomeCount},
        {title: '总亏损', value: this.props.navBarData.expenseCount},
        {title: '收支差额', value: this.props.navBarData.incomeCount-this.props.navBarData.expenseCount},
      ];
      content = mapCount.map((item, index) => {
        if (item.title !== '笔数') {
          // @ts-ignore
          item.value = moneyFormatter(item.value);
        }
        return (
          <View className='at-col navBar-footer left-first' key={index}>
            <View className='footer-title'>{item.title}</View>
            <View className='footer-content'>
              { item.title == '总亏损' && <Text className='money book-expense'>{item.value}</Text> }
              { item.title == '总盈利' && <Text className='money book-income'>{item.value}</Text> }
              { item.title == '收支差额' && <Text className='money book-count'>{item.value}</Text> }
              <Text>￥</Text>
            </View>
          </View>
        )
      })
    } else if(this.state.bookType == 'moneyManagementInner') {
      const mapCount = [
        {title: '盈利', value: this.props.navBarData.incomeCount},
        {title: '亏损', value: this.props.navBarData.expenseCount},
      ];
      content = mapCount.map((item, index) => {
        if (item.title !== '笔数') {
          // @ts-ignore
          item.value = moneyFormatter(item.value);
        }
        return (
          <View className='at-col navBar-footer left-first' key={index}>
            <View className='footer-title'>{item.title}</View>
            <View className='footer-content'>
              { item.title == '亏损' && <Text className='money book-expense'>{item.value}</Text> }
              { item.title == '盈利' && <Text className='money book-income'>{item.value}</Text> }
              <Text>￥</Text>
            </View>
          </View>
        )
      })
    } else if(this.state.bookType == 'rent') {
      const mapCount = [
        {title: '总支出', value: this.props.navBarData.expenseCount},
        {title: '人数', value: this.props.navBarData.count},
        {title: '人均', value: (this.props.navBarData.expenseCount / this.props.navBarData.count) || 0},
      ];
      content = mapCount.map((item, index) => {
        if (item.title !== '笔数') {
          // @ts-ignore
          item.value = moneyFormatter(item.value);
        }
        return (
          <View className='at-col navBar-footer left-first' key={index}>
            <View className='footer-title'>{item.title}</View>
            <View className='footer-content'>
              { item.title == '总支出' && <Text className='money book-expense'>{item.value}</Text> }
              { item.title == '人均' && <Text className='money book-budget'>{item.value}</Text> }
              { item.title == '人数' && <Text className='money book-count'>{item.value}</Text> }
              { item.title != '人数' && <Text>￥</Text>}
            </View>
          </View>
        )
      })
    } else if(this.state.bookType == 'others') {
      const mapCount = [
        {title: '应还', value: this.props.navBarData.expenseCount},
        {title: '应收', value: this.props.navBarData.incomeCount},
      ];
      content = mapCount.map((item, index) => {
        if (item.title !== '笔数') {
          // @ts-ignore
          item.value = moneyFormatter(item.value);
        }
        return (
          <View className='at-col navBar-footer left-first' key={index}>
            <View className='footer-title'>{item.title}</View>
            <View className='footer-content'>
              { item.title == '应还' && <Text className='money book-expense'>{item.value}</Text> }
              { item.title == '应收' && <Text className='money book-income'>{item.value}</Text> }
              <Text>￥</Text>
            </View>
          </View>
        )
      })
    }

    return (
      <View className='fx-NavBar-wrap'>
        <View className='at-row'>
          <View className='at-col at-col-1 at-col--auto navBar-footer half-border-right'>
            <Picker
              mode='date'
              fields={pickerType}
              onChange={this.onDateChange}
              value={this.state.date}
            >
              { pickerType === 'month'  &&
              <View>
                <View className='navBar-year'>{bookYear}年</View>
                <View className='navBar-month'>
                  <Text className='month-wrapper'>{bookMonth}</Text>月
                  <View className='at-icon at-icon-chevron-down' />
                </View>
              </View>
              }
              { pickerType !== 'month'  &&
              <View>
                <View className='navBar-year'>当前年份</View>
                <View className='navBar-only-year'>
                  <Text className='month-wrapper'>{bookYear}</Text>年
                  <View className='at-icon at-icon-chevron-down' />
                </View>
              </View>
              }
            </Picker>
          </View>
          { content }
        </View>
      </View>
    );
  }
}

export default NavBar
