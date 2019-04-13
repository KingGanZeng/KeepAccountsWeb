import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtForm, AtSwitch } from 'taro-ui'
import { ShareComponentProps, ShareComponentState } from './ShareComponent.interface'
import './ShareComponent.scss'

class ShareComponent extends Component<ShareComponentProps,ShareComponentState > {
  constructor(props: ShareComponentProps) {
    super(props)
    this.state = {
      groupState: false,
    }
  }
  static options = {
    addGlobalClass: true
  }
  static defaultProps:ShareComponentProps = {}

  /**
   * 开启小组
   */
  handleChange() {
    this.setState({
      groupState: !this.state.groupState
    });
  }

  render() {
    return (
      <View className='fx-ShareComponent-wrap'>
        <AtForm>
          <AtSwitch
            checked={this.state.groupState}
            onChange={this.handleChange}
            border={false}
            title='是否开启小组'
          />
        </AtForm>
      </View>
    )
  }
}

export default ShareComponent
