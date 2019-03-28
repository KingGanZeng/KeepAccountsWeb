import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtDrawer } from 'taro-ui'
import { TabBarProps, TabBarState } from './TabBar.interface'
import './TabBar.scss'
import MaskTabBar from '../MaskTabBar/MaskTabBar'

class TabBar extends Component<TabBarProps,TabBarState > {
  constructor(props: TabBarProps) {
    super(props);
    this.state = {
      isOpen: false,
      showLeftBar: false,
      bookId: this.props.nowBookId,
      bookType: this.props.nowBookType,
    }
  }
  static options = {
    addGlobalClass: true
  };
  static defaultProps:TabBarProps = {
    nowBookId: '',
    nowBookType: '',
    isSpecial: false,
  };

  /**
   * 显示侧边栏
   */
  showLeftBar() {
    this.setState({
      showLeftBar: true,
    })
  }

  /**
   * 侧边栏点击事件
   * @param index
   */
  choosePage(index) {
    console.log(index)
  }

  /**
   * 关闭组件时将状态重置
   */
  onClose() {
    this.setState({
      showLeftBar: false,
    })
  }

  /**
   * 显示记账选项
   */
  showRecordWay() {
    // 如果类型是travel跳转到相应页面
    if (this.state.bookType == 'travelParty') {
      Taro.navigateTo({
        url: '/pages/newTravel/newTravel?bookId=' + this.state.bookId + '&bookType=' + this.state.bookType
      })
    } else {
      this.setState({
        isOpen: true,
      })
    }
  }

  /**
   * 跳转到图表页面
   */
  jumpToChartPage() {
    Taro.navigateTo({
      url: '/pages/chartPage/chartPage'
    })
  }

  /**
   * 接收子组件传值，关闭选项遮罩
   * @param openState
   */
  onChangeOpenState(openState) {
    this.setState({
      isOpen: openState,
    })
  }

  /**
   * 切换账本
   */
  changeBook() {
    this.setState({
      showLeftBar: false,
    });
    Taro.redirectTo({
      url: '/pages/accountBook/accountBook'
    })
  }

  /**
   * 修改账本信息
   */
  editBook() {
    this.setState({
      showLeftBar: false,
    });
    Taro.navigateTo({
      url: '/pages/newBook/newBook?bookId=' + this.state.bookId
      + '&isSpecial=' + this.props.isSpecial
    })
  }

  render() {
    return (
      <View className='fx-TabBar-wrap at-row at-row__justify--between'>
        <View className='at-col menu-button'>
          <View
            className='at-icon at-icon-list'
            onClick={this.showLeftBar}
          />
          <AtDrawer
            show={this.state.showLeftBar}
            mask
            onClose={this.onClose.bind(this)}
            onItemClick={this.choosePage}
          >
            <View className='drawer-top-item' />
            <View
              className='drawer-item half-border-bottom border-bottom'
              onClick={this.changeBook}
            >
              切换账本<View className='at-icon at-icon-bookmark' />
            </View>
            <View
              className='drawer-item half-border-bottom border-bottom'
              onClick={this.editBook}
            >
              修改账本信息<View className='at-icon at-icon-tags' />
            </View>
            <View className='drawer-item half-border-bottom border-bottom'>
              发现<View className='at-icon at-icon-eye' />
            </View>
            <View className='drawer-item half-border-bottom border-bottom'>
              愿望记账<View className='at-icon at-icon-heart-2' />
            </View>
          </AtDrawer>
        </View>
        <View className='at-col at-row at-row__align-content--center'>
          <View
            className='at-col add-button'
            onClick={this.showRecordWay}
          >
            <View className='at-icon at-icon-close rotate-button' />
          </View>
        </View>
        <View
          className='at-col diagram-button'
          onClick={this.jumpToChartPage}
        >
          <View className='at-icon at-icon-equalizer' />
        </View>
        <MaskTabBar
          isOpened={this.state.isOpen}
          onOpenState={this.onChangeOpenState.bind(this)}
          nowBookId={this.state.bookId}
          nowBookType={this.state.bookType}
        />
      </View>
    )
  }
}

export default TabBar
