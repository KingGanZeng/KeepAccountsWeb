import Taro, { Component } from '@tarojs/taro'
import { View, Picker, Text } from '@tarojs/components'
import { NavBarProps, NavBarState } from './NavBar.interface'
import './NavBar.scss'
import { addZero } from '../../utils/common'

class NavBar extends Component<NavBarProps,NavBarState > {
  constructor(props: NavBarProps) {
    super(props);
    this.state = {
      date: this.props.yearMonthStr,
      income: this.props.navBarData.incomeCount || 0,
      expense: this.props.navBarData.expenseCount || 0,
      bookType: this.props.navBookType,
    }
  }
  static options = {
    addGlobalClass: true
  };
  static defaultProps:NavBarProps = {
    yearMonthStr: '2019-03',
    navBarData: {
      incomeCount: 0,
      expenseCount: 0,
    },
    navBookType: '',
  };

  /**
   * 日期选择器
   * @param e
   */
  onDateChange = e => {
    this.setState({
      date: e.detail.value
    }, () => {
      console.log(this.state.date);
      this.props.onDateState(this.state.date)
    })
  };

  /**
   * 账本编辑按钮事件
   */
  jumpToEdit() {
    const bookId = this.$router.params.bookId;
    const bookType = this.$router.params.bookType;
    Taro.navigateTo({
      url: '/pages/newBook/newBook?book_id=' + bookId + '&book_type=' + bookType
    })
  }

  render() {
    // 设置时间，生成时间选择器
    const bookYear = this.state.date.split('-')[0];
    let bookMonth= this.state.date.split('-')[1];
    bookMonth = addZero(bookMonth);
    let pickerType = this.state.bookType === 'dayLife' || this.state.bookType === 'rent' ? 'month' : 'year';
    pickerType = 'month';

    let content:any;
    if (this.state.bookType !== 'dayLife') {
      const mapCount = [
        {title: '收入', value: this.state.income},
        {title: '支出', value: this.state.expense},
        ];
      content = mapCount.map((item, index) => {
        if (item.title !== '笔数') {
          item.value = item.value.toFixed(2);
        }
        return (
          <View className='at-col navBar-footer left-first'>
            <View className='footer-title'>{item.title}</View>
            <View className='footer-content'>
              { item.title == '支出' && <Text className='money book-income'>{item.value}</Text> }元
              { item.title == '收入' && <Text className='money book-expense'>{item.value}</Text> }元
            </View>
          </View>
        )
      })
    }

    return (
      <View className='fx-NavBar-wrap'>
        <View className='at-row'>
          <View className='at-col at-col-1 at-col--auto navBar-footer half-border-right border-beside'>
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
          {content}
        </View>
      </View>
    );
  }
}

export default NavBar
