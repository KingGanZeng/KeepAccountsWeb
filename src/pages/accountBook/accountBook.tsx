
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Button } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtCard, AtGrid, AtModal, AtModalContent } from "taro-ui";
import { Request } from '../../utils/request'
import { AccountBookProps, AccountBookState } from './accountBook.interface'
import './accountBook.scss'
import Tips from '../../utils/tips'
import '../../assets/iconfont/iconfont.scss'
// @ts-ignore
import { BookList } from '../../components/BookList/BookList';
import {MAINHOST} from "../../config";

@connect(({ accountBook }) => ({
    ...accountBook,
}))

class AccountBook extends Component<AccountBookProps,AccountBookState> {
  config:Config = {
    navigationBarTitleText: '选择账本类别',
    enablePullDownRefresh: true,
    backgroundTextStyle: "dark"
  };
  constructor(props: AccountBookProps) {
    super(props);
    this.state = {
      hasAuthorized: false,
      modalOpenState: false,
      uid: '',
      specialBookList: [],
      groupProjectList: [],
      groupAdminProjectList: [],
    }
  }

  /**
   * 获取账本列表
   * @params user_name
   * @return Promise<*>
   */
  async getBook() {
    await this.props.dispatch({
      type: 'accountBook/getBook',
      payload: {
        uid: this.state.uid
      }
    })
  }

  /**
   * 获取特殊账本
   */
  async getSpecialBook() {
    const result = await Taro.request({
      method: 'GET',
      url: `${MAINHOST}/api/getSpecialBookList`,
      data: {
        uid: this.state.uid,
      }
    });
    this.setState({
      specialBookList: result.data.results
    })
  }

  /**
   * 获取共享账本/项目
   */
  async getGroupBook() {
    // 首先获取我的小组列表
    const groupList = await Taro.request({
      method: 'GET',
      url: `${MAINHOST}/api/getGroupMembers`,
      data: {
        uid: this.state.uid,
      }
    })
    if (groupList.data.results.length > 0) {
      // 如果小组列表不为空，则遍历获取gid再拿到账本信息
      const tmpAdminGroupBookList:any = [];
      const tmpGroupBookList:any = [];
      for(const item of groupList.data.results) {
        const bookList = await Taro.request({
          method: 'GET',
          url: `${MAINHOST}/api/getBookList`,
          data: {
            uid: item.group_id,
          }
        })
        // 向groupBookList中添加项目
        if (item.is_admin) {
          // 如果是创建者，则groupAdminProjectList内容添加，否则groupProject添加
          tmpAdminGroupBookList.push({
            ...bookList.data.results[0],
            is_admin: item.is_admin,
          })
        } else {
          tmpGroupBookList.push({
            ...bookList.data.results[0],
            is_admin: item.is_admin,
          })
        }
      }
      console.log(tmpAdminGroupBookList, tmpGroupBookList)
      this.setState({
        groupAdminProjectList: tmpAdminGroupBookList,
        groupProjectList: tmpGroupBookList,
      })
      Tips.loaded()
    } else {
      Tips.loaded()
      return;
    }
  }

  /**
   * 账本名称转义
   * @param item
   */
  async toNewAccountBook(item) {
    if(!this.state.hasAuthorized) {
      this.setState({
        modalOpenState: true,
      })
      return ;
    }
    let type = '';
    if(item.value === '日常开销') {
      type = 'dayLife'
    } else if(item.value === '出游聚会') {
      type = 'travelParty'
    } else if(item.value === '居家装修') {
      type = 'homeDecoration'
    } else if(item.value === '人情往来') {
      type = 'socialRelation'
    } else if(item.value === '投资理财') {
      type = 'moneyManagement'
    } else if(item.value === '租房居住') {
      type = 'rent'
    } else if(item.value === '借还记录') {
      type = 'others'
    }
    Taro.navigateTo({
      url: "/pages/newBook/newBook?bookType=" + type
    })
  }

  /**
   * 关闭弹出窗，状态更新
   */
  handleModal() {
    this.setState({
      hasAuthorized: false,
    }, () => {
      console.log(this.state.hasAuthorized)
    });
  }

  /**
   * 获取认证状态
   * 未认证弹窗认证
   * 已认证从数据库获取信息
   */
  async getAuthorized() {
    let authorizeState = false
    let openState= false
    await Taro.getSetting({
      success(res) {
        if(!res.authSetting['scope.userInfo']) {
          authorizeState = false
          openState = true
        } else {
          authorizeState = true
        }
      }
    })
    this.setState({
      hasAuthorized: authorizeState,
      modalOpenState: openState
    }, () => {
      // 当用户已授权后
      if(this.state.hasAuthorized) {
        // 获取用户的相关信息
        Taro.getUserInfo()
          .then(result => {
            const userInfo = JSON.parse(result.rawData)
            // 将用户名及头像信息存入localStorage
            Taro.setStorageSync('username', userInfo.nickName);
            Taro.setStorageSync('portrait', userInfo.avatarUrl);
          })
      }
    })
  }

  /**
   * 获取用户信息
   * @param e
   */
  onGotUserInfo = e => {
    this.setState({
      hasAuthorized: true,
      modalOpenState: false,
    })
    console.log(e)
  }

  /**
   * 下拉刷新
   */
  onPullDownRefresh() {
    this.getBook()
    this.getSpecialBook()
  }

  /**
   * 组件渲染完成后执行
   */
  async componentWillMount() {
    await this.getAuthorized()
    await Request.login()
    const uid = Taro.getStorageSync('uid')
    this.setState({
      uid: uid
    }, () => {
      Tips.loading()
      this.getBook()
      this.getSpecialBook()
      this.getGroupBook()
    })
  }

  render() {
    const { data } = this.props
    // @ts-ignore
    let myBookList = data.map((item) => {
      // 禁止渲染特殊账本及相关
      if (item.book_type != 'travelParty' && item.book_type != 'moneyManagement' && item.book_type != 'moneyManagementInner') {
        return item
      }
    });
    myBookList = myBookList.filter((value) => {
      return value
    });
    if (this.state.specialBookList.length > 0) {
      this.state.specialBookList.map((item) => {
        let tmpItem = item
        tmpItem.book_id = item.s_book_id
        myBookList.push(tmpItem)
      });
    }
    const hasBook = myBookList.length > 0;
    // const hasGroupAdminProjects = this.state.groupAdminProjectList.length > 0;
    const hasGroupProjects = this.state.groupProjectList.length > 0;
    const date = +new Date();
    console.log(111, this.state.groupProjectList, this.state.groupAdminProjectList)

    return (
      <View className='fx-accountBook-wrap'>
        <AtModal
          isOpened={this.state.modalOpenState}
          onClose={this.handleModal}
        >
          <AtModalContent>
            <View className='login-title'>欢迎</View>
            <View className='iconfont icon-signature' />
            <View className='login-intro'>智能记账小程序可以帮你快速记录生活的点滴，点击开始，开启你的记账旅程吧</View>
            <View className='login-button-wrapper'>
              <Button
                className='login-button'
                openType='getUserInfo'
                onGetUserInfo={this.onGotUserInfo.bind(this)}
              >开始使用</Button>
              <View className='at-tabs__item-underline at-tabs__item-underline' />
            </View>
          </AtModalContent>
        </AtModal>
        <AtCard
          className='choice-wrapper'
          title='选择账本场景'
          note='*新建账本需先选择账本场景'
        >
          <AtGrid
            className='choice-block'
            hasBorder={false}
            mode='rect'
            data={
              [
                {
                  image: 'https://img12.360buyimg.com/jdphoto/s72x72_jfs/t6160/14/2008729947/2754/7d512a86/595c3aeeNa89ddf71.png',
                  value: '日常开销',
                },
                {
                  image: 'https://img20.360buyimg.com/jdphoto/s72x72_jfs/t15151/308/1012305375/2300/536ee6ef/5a411466N040a074b.png',
                  value: '出游聚会'
                },
                {
                  image: 'https://img10.360buyimg.com/jdphoto/s72x72_jfs/t5872/209/5240187906/2872/8fa98cd/595c3b2aN4155b931.png',
                  value: '居家装修'
                },
                {
                  image: 'https://img14.360buyimg.com/jdphoto/s72x72_jfs/t17251/336/1311038817/3177/72595a07/5ac44618Na1db7b09.png',
                  value: '人情往来'
                },
                {
                  image: 'https://img12.360buyimg.com/jdphoto/s72x72_jfs/t10660/330/203667368/1672/801735d7/59c85643N31e68303.png',
                  value: '投资理财'
                },
                {
                  image: 'https://img30.360buyimg.com/jdphoto/s72x72_jfs/t5770/97/5184449507/2423/294d5f95/595c3b4dNbc6bc95d.png',
                  value: '租房居住'
                },
                {
                  image: 'https://img12.360buyimg.com/jdphoto/s72x72_jfs/t10660/330/203667368/1672/801735d7/59c85643N31e68303.png',
                  value: '借还记录'
                },
              ]}
            onClick={this.toNewAccountBook}
          />
        </AtCard>
        { hasBook && <BookList title='我的账本' date={date} list={myBookList} />}
        { hasGroupProjects && <BookList title='我的共享项目' date={date} list={this.state.groupProjectList} />
        }
      </View>
    )
  }
}

export default AccountBook
