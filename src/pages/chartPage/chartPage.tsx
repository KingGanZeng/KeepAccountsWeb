
import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { ChartPageProps, ChartPageState } from './chartPage.interface'
import './chartPage.scss'
// @ts-ignore
// import BarChart from "../../components/BarChart/BarChart";
// import PieChart from "../../components/PieChart/PieChart";

@connect(({ chartPage }) => ({
    ...chartPage,
}))

class ChartPage extends Component<ChartPageProps,ChartPageState > {
  config:Config = {
    navigationBarTitleText: '标题'
  }
  constructor(props: ChartPageProps) {
    super(props)
    this.state = {
    }
  }

  render() {
    return (
      <View className='chartPage-wrap'>
        {/*<BarChart />*/}
        {/*<PieChart />*/}
      </View>
    )
  }
}

export default ChartPage
