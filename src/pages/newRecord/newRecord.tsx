
import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtTabs, AtTabsPane } from 'taro-ui'
import { connect } from '@tarojs/redux'
// import Api from '../../utils/request'
// import Tips from '../../utils/tips'
import { NewRecordProps, NewRecordState } from './newRecord.interface'
import './newRecord.scss'
// @ts-ignore
import { CategoryList } from '../../components/CategoryList/CategoryList'
// @ts-ignore
import {bookNameTranslate} from "../../utils/common";

@connect(({ newRecord }) => ({
    ...newRecord,
}))

class NewRecord extends Component<NewRecordProps,NewRecordState > {
  config:Config = {
    navigationBarTitleText: '新建记账'
  }
  constructor(props: NewRecordProps) {
    super(props)
    this.state = {
      current: 0,
      bookType: decodeURIComponent(this.$router.params.bookType) || 'dayLife',
      bookId: parseInt(decodeURIComponent(this.$router.params.bookId), 10),
    }
  }

  /**
   * 切换标签页
   * @param value
   */
  handleClick (value) {
    this.setState({
      current: value,
    })
  }

  componentDidMount() {
    Taro.setNavigationBarTitle({
      // @ts-ignore
      title: bookNameTranslate('English', this.state.bookType)
    })
  }

  render() {
    const tabList = [{ title: '支出' }, { title: '收入' }];

    return (
      <View className='newRecord-wrap'>
        <AtTabs
          current={this.state.current}
          tabList={tabList}
          onClick={this.handleClick.bind(this)}
        >
          <AtTabsPane
            current={this.state.current}
            index={0}
          >
            <CategoryList
              nowBookType={this.state.bookType}
              nowBookId={this.state.bookId}
              nowType='expense'
            />
          </AtTabsPane>
          <AtTabsPane
            current={this.state.current}
            index={1}
          >
            <CategoryList
              nowBookType={this.state.bookType}
              nowBookId={this.state.bookId}
              nowType='income'
            />
          </AtTabsPane>
        </AtTabs>
      </View>
    )
  }
}

export default NewRecord
