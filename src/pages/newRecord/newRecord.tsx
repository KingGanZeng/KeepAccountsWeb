
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

@connect(({ newRecord }) => ({
    ...newRecord,
}))

class NewRecord extends Component<NewRecordProps,NewRecordState > {
  config:Config = {
    navigationBarTitleText: '标题'
  }
  constructor(props: NewRecordProps) {
    super(props)
    this.state = {
      current: 0,
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
            <CategoryList />
          </AtTabsPane>
          <AtTabsPane
            current={this.state.current}
            index={1}
          >
            <CategoryList />
          </AtTabsPane>
        </AtTabs>
        <Picker></Picker>
      </View>
    )
  }
}

export default NewRecord
