import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtDrawer, AtAvatar } from 'taro-ui'
import { TabBarProps, TabBarState } from './TabBar.interface'
import './TabBar.scss'
import {MAINHOST} from "../../config";

class TabBar extends Component<TabBarProps,TabBarState > {
  constructor(props: TabBarProps) {
    super(props);
    this.state = {
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
    // 如果类型是moneyManagement跳转到相应页面
   if (this.state.bookType == 'moneyManagement') {
      Taro.navigateTo({
        url: '/pages/newManagement/newManagement?bookId=' + this.state.bookId
      })
    } else {
      Taro.navigateTo({
        url: '/pages/newTravel/newTravel?bookId=' + this.state.bookId +
          '&bookType=' + this.state.bookType +
          '&is_admin=' + true +
          '&first_create=' + true
      })
    }
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
   * 跳转到愿望列表页
   */
  jumpToWish() {
    this.setState({
      showLeftBar: false,
    })
    Taro.navigateTo({
      url: '/pages/wish/wish'
    })
  }

  /**
   * 跳转到图表展示
   */
  jumpToChart() {
    this.setState({
      showLeftBar: false,
    })
    Taro.navigateTo({
      url: '/pages/bookChart/bookChart'
    })
  }

  /**
   * 删除账本
   */
  async deleteBook() {
    this.setState({
      showLeftBar: false,
    })
    const result = await Taro.request({
      method: 'DELETE',
      url: `${MAINHOST}/api/changeSpecialBook/${this.state.bookId}`,
    });
    if(result.data.detail) {
      console.log('删除账本失败');
    } else {
      setTimeout(() => {
        Taro.redirectTo({
          url: '/pages/accountBook/accountBook'
        })
      }, 800)
    }
  }

  /**
   * 跳转到发现页
   */
  jumpToDiscovery() {
    this.setState({
      showLeftBar: false,
    })
    Taro.navigateTo({
      url: '/pages/discovery/discovery'
    })
  }

  /**
   * 跳转到收藏页
   */
  jumpToCollection() {
    this.setState({
      showLeftBar: false,
    })
    Taro.navigateTo({
      url: '/pages/collection/collection'
    })
  }

  render() {
    const portrait = Taro.getStorageSync('portrait')
    const username = Taro.getStorageSync('username')
    return (
      <View className='fx-TabBar-wrap at-row at-row__justify--between'>
        <View className='at-col at-col-3 menu-button'>
          <View
            className='at-icon at-icon-list'
            onClick={this.showLeftBar}
          />
          <AtDrawer
            show={this.state.showLeftBar}
            mask
            onClose={this.onClose.bind(this)}
          >
            <View className='drawer-top-item'>
              <AtAvatar
                size='large'
                circle
                image={portrait}
              />
              <View className='username'>{username}</View>
            </View>
            <View
              className='drawer-item half-border-bottom border-bottom'
              onClick={this.changeBook}
            >
              切换账本<View className='at-icon at-icon-bookmark' />
            </View>
            {/*<View*/}
            {/*  className='drawer-item half-border-bottom border-bottom'*/}
            {/*  onClick={this.jumpToDiscovery}*/}
            {/*>*/}
            {/*  发现<View className='at-icon at-icon-eye' />*/}
            {/*</View>*/}
            {/*<View*/}
            {/*  className='drawer-item half-border-bottom border-bottom'*/}
            {/*  onClick={this.jumpToCollection}*/}
            {/*>*/}
            {/*  收藏<View className='at-icon at-icon-star-2' />*/}
            {/*</View>*/}
            <View
              className='drawer-item half-border-bottom border-bottom'
              onClick={this.deleteBook}
            >
              删除账本<View className='at-icon at-icon-trash' />
            </View>
            <View
              className='drawer-item half-border-bottom border-bottom'
              onClick={this.jumpToWish}
            >
              愿望清单<View className='at-icon at-icon-heart-2' />
            </View>
            <View
              className='drawer-item half-border-bottom border-bottom'
              onClick={this.jumpToChart}
            >
              查看图表<View className='at-icon at-icon-equalizer' />
            </View>
          </AtDrawer>
        </View>
        <View className='at-col at-col-3 at-row at-row__align-content--center'>
          <View
            className='at-col add-button'
            onClick={this.showRecordWay}
          >
            <View className='at-icon at-icon-close rotate-button' />
          </View>
        </View>
        <View className='at-col at-col-3 chart-button'>
          <View
            className='at-icon at-icon-list'
          />
        </View>
      </View>
    )
  }
}

export default TabBar
