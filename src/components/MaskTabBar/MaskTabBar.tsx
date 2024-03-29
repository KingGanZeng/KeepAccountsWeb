import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { MaskTabBarProps, MaskTabBarState } from './MaskTabBar.interface'
import './MaskTabBar.scss'
import '../TabBar/TabBar.scss'

class MaskTabBar extends Component<MaskTabBarProps,MaskTabBarState > {
  constructor(props: MaskTabBarProps) {
    super(props);
    this.state = {
      openState: this.props.isOpened,
      bookId: this.props.nowBookId,
      bookType: this.props.nowBookType == 'moneyManagementInner' ? 'moneyManagement' : this.props.nowBookType,
    }
  }
  static options = {
    addGlobalClass: true
  };
  static defaultProps:MaskTabBarProps = {
    isOpened: false,
    nowBookId: '',
    nowBookType: '',
  };

  /**
   * 向父组件传值，关闭遮罩
   */
  closeRecordWay() {
    this.setState({
      openState: false,
    }, () => {
      this.props.onOpenState(this.state.openState)
    })
  }

  /**
   * 跳转到新记账页面
   */
  newRecord() {
    this.closeRecordWay()
    Taro.navigateTo({
      url: '/pages/newRecord/newRecord?bookId=' + this.state.bookId + '&bookType=' + this.state.bookType
    })
  }

  render() {
    const isOpened = this.props.isOpened;

    return (
      <View className='fx-MaskTabBar-wrap'>
        {isOpened && <View className='diagram-mask' onClick={this.closeRecordWay.bind(this)} /> }
        {isOpened && <View className='fx-TabBar-wrap at-row at-row__justify--between'>
          <View className='at-col menu-button'>
            <View className='at-icon at-icon-list' />
          </View>
          <View className='at-col at-row at-row__align-content--center'>
            <View className='at-col add-button'>
              <View
                className='at-icon at-icon-add rotate-button'
                onClick={this.closeRecordWay.bind(this)}
              />
              <View className='at-icon at-icon-image left-button' />
              <View
                className='at-icon at-icon-edit center-button'
                onClick={this.newRecord}
              />
              <View className='at-icon at-icon-volume-plus right-button' />
            </View>
          </View>
          <View className='at-col diagram-button'>
            <View className='at-icon at-icon-equalizer' />
          </View>
        </View> }
      </View>
    )
  }
}

export default MaskTabBar
