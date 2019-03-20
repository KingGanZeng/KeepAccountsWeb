
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Button } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtCard, AtGrid, AtModal, AtModalContent } from "taro-ui";
import { Request } from '../../utils/request'
import { AccountBookProps, AccountBookState } from './accountBook.interface'
import './accountBook.scss'
import '../../assets/iconfont/iconfont.scss'
// @ts-ignore
import { BookList } from '../../components/BookList/BookList';

@connect(({ accountBook }) => ({
    ...accountBook,
}))

class AccountBook extends Component<AccountBookProps,AccountBookState> {
  config:Config = {
    navigationBarTitleText: '选择账本场景'
  };
  constructor(props: AccountBookProps) {
    super(props);
    this.state = {
      bookArray: [],
      hasAuthorized: false,
      modalOpenState: false,
      uid: '',
    }
  }

  /**
   * 获取账本列表
   * @params user_name
   * @return Promise<*>
   */
  async getBook() {
    const result = await this.props.dispatch({
      type: 'accountBook/getBook',
      payload: {
        uid: this.state.uid
      }
    })
    // this.setState({
    //   bookArray: result.results
    // }, () => {
    //   console.log(this.state.bookArray)
    // })
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
    })_
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
      if(this.state.hasAuthorized) {
        // 获取用户的相关信息
        Taro.getUserInfo()
          .then(result => {
            const userInfo = JSON.parse(result.rawData)
            // 将用户名存入localStorage
            Taro.setStorageSync('username', userInfo.nickName)
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
   * 组件渲染完成后执行
   */
  async componentDidMount() {
    await this.getAuthorized()
    await Request.login()
    const uid = Taro.getStorageSync('uid')
    this.setState({
      uid: uid
    }, () => {
      this.getBook()
    })
  }

  render() {
    const { data } = this.props
    // const myBookList = [
    //   {book_id:1, book_type: 'dayLife', book_name: '日常开销', note: ''},
    //   {book_id:2, book_type: 'travelParty', book_name: '出游聚会', note: ''},
    //   {book_id:3, book_type: 'homeDecoration', book_name: '居家装修', note: ''},
    //   {book_id:4, book_type: 'socialRelation', book_name: '人情往来', note: ''},
    //   {book_id:5, book_type: 'moneyManagement', book_name: '投资理财', note: ''},
    //   {book_id:5, book_type: 'rent', book_name: '租房居住', note: ''},
    //   {book_id:6, book_type: 'others', book_name: '借还记录', note: ''},
    //   {book_id:8, book_type: 'dayLife', book_name: '聚餐记账', note: '同事组'},
    // ];
    const myBookList = data || []
    const hasBook = myBookList.length > 0;
    console.log("***这里渲染***", myBookList);
    const date = +new Date();

    return (
      <View className='fx-accountBook-wrap'>
        <AtModal
          isOpened={this.state.modalOpenState}
          onClose={this.handleModal}
        >
          <AtModalContent>
            <View className='login-title'>欢迎</View>
            <View className='iconfont icon-signature' />
            <View className='login-intro'>xx记账小程序可以帮你快速记录生活的点滴，点击开始，开启你的记账旅程吧</View>
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
        { hasBook && <BookList title='我的账本' date={date} list={myBookList} />}
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
      </View>
    )
  }
}

export default AccountBook
