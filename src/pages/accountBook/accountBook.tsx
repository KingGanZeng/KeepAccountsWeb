
import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { connect } from '@tarojs/redux'
// import Api from '../../utils/request'
// import Tips from '../../utils/tips'
import {AtCard, AtGrid } from "taro-ui";
import { AccountBookProps, AccountBookState } from './accountBook.interface'
import './accountBook.scss'

// import { } from '../../components'

@connect(({ accountBook }) => ({
    ...accountBook,
}))

class AccountBook extends Component<AccountBookProps,AccountBookState> {
  config:Config = {
    navigationBarTitleText: '选择账本'
  }
  constructor(props: AccountBookProps) {
    super(props)
    this.state = {
      bookArray: []
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
        user_name: 'zenggan'
      }
    })
  }

  componentDidMount() {
    this.getBook()
  }

  toMyAccountBook(item, index) {
    const book_id = this.props.data[index].book_id
    const book_type = this.props.data[index].book_type
    Taro.navigateTo({
      url: "/pages/index/index?myBookId=" + book_id + '&myBookName=' + item.value + '&booktype=' + book_type
    })
  }

  toNewAccountBook(item) {
    let type = ''
    if(item.value === '日常开销') {
      type = 'dayLife'
    } else if(item.value === '出游聚会') {
      type = 'travelPart'
    } else if(item.value === '居家装修') {
      type = 'homeDecoration'
    } else if(item.value === '人情往来') {
      type = 'socialRelation'
    } else if(item.value === '投资理财') {
      type = 'moneyManagement'
    } else if(item.value === '租房居住') {
      type = 'rent'
    } else if(item.value === '不知道啥') {
      type = 'others'
    }
    Taro.navigateTo({
      url: "/pages/newBook/newBook?booktype=" + type
    })
  }

  render() {
    const { data } = this.props
    let newData: Array<Object> = []
    if(data && data.length > 0) {
      newData = data.map(item => {
        let icon = ''
        if(item.book_type === 'dayLife') {
          icon = 'https://img12.360buyimg.com/jdphoto/s72x72_jfs/t6160/14/2008729947/2754/7d512a86/595c3aeeNa89ddf71.png'
        } else if(item.book_type === 'travelPart') {
          icon = 'https://img20.360buyimg.com/jdphoto/s72x72_jfs/t15151/308/1012305375/2300/536ee6ef/5a411466N040a074b.png'
        } else if(item.book_type = 'homeDecoration') {
          icon = 'https://img10.360buyimg.com/jdphoto/s72x72_jfs/t5872/209/5240187906/2872/8fa98cd/595c3b2aN4155b931.png'
        } else if(item.book_type = 'socialRelation') {
          icon = 'https://img14.360buyimg.com/jdphoto/s72x72_jfs/t17251/336/1311038817/3177/72595a07/5ac44618Na1db7b09.png'
        } else if(item.book_type = 'moneyManagement') {
          icon = 'https://img30.360buyimg.com/jdphoto/s72x72_jfs/t5770/97/5184449507/2423/294d5f95/595c3b4dNbc6bc95d.png'
        } else if(item.book_type = 'rent') {
          icon = 'https://img30.360buyimg.com/jdphoto/s72x72_jfs/t5770/97/5184449507/2423/294d5f95/595c3b4dNbc6bc95d.png'
        } else if(item.book_type = 'others') {
          icon = 'https://img10.360buyimg.com/jdphoto/s72x72_jfs/t5872/209/5240187906/2872/8fa98cd/595c3b2aN4155b931.png'
        }
        const tmpObj = {
          image: icon,
          value: item.book_name
        }
        return tmpObj
      })
    }

    return (
      <View className='accountBook-wrap'>
        <AtCard className='card-wrapper'
          title='我的账本'
        >
          <AtGrid data={newData}
            onClick={this.toMyAccountBook}
          />
        </AtCard>
        <AtCard className='card-wrapper'
          title='选择账本场景'
          iconType='tags'
          note='新建账本需先选择账本场景'
        >
          <AtGrid
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
                image: 'https://img12.360buyimg.com/jdphoto/s72x72_jfs/t10660/330/203667368/1672/801735d7/59c85643N31e68303.png',
                value: '不知道啥'
              },
              {
                image: 'https://img14.360buyimg.com/jdphoto/s72x72_jfs/t17251/336/1311038817/3177/72595a07/5ac44618Na1db7b09.png',
                value: '人情往来'
              },
              {
                image: 'https://img30.360buyimg.com/jdphoto/s72x72_jfs/t5770/97/5184449507/2423/294d5f95/595c3b4dNbc6bc95d.png',
                value: '投资理财'
              },
              {
                image: 'https://img30.360buyimg.com/jdphoto/s72x72_jfs/t5770/97/5184449507/2423/294d5f95/595c3b4dNbc6bc95d.png',
                value: '租房居住'
              }
            ]}
            onClick={this.toNewAccountBook}
          />
        </AtCard>
      </View>
    )
  }
}

export default AccountBook
