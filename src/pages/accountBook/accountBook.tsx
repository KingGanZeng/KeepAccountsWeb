
import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import {AtCard, AtGrid } from "taro-ui";
import { AccountBookProps, AccountBookState } from './accountBook.interface'
import './accountBook.scss'
// @ts-ignore
import { BookList } from '../../components/BookList/BookList';

@connect(({ accountBook }) => ({
    ...accountBook,
}))

class AccountBook extends Component<AccountBookProps,AccountBookState> {
  config:Config = {
    navigationBarTitleText: '选择账本'
  };
  constructor(props: AccountBookProps) {
    super(props);
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

  toNewAccountBook(item) {
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
    } else if(item.value === '不知道啥') {
      type = 'others'
    }
    Taro.navigateTo({
      url: "/pages/newBook/newBook?bookType=" + type
    })
  }

  componentDidMount() {
    this.getBook()
  }

  render() {
    const myBookList = [
      {book_id:1, book_type: 'dayLife', book_name: '日常开销', note: ''},
      {book_id:2, book_type: 'travelParty', book_name: '出游聚会', note: ''},
      {book_id:3, book_type: 'homeDecoration', book_name: '居家装修', note: ''},
      {book_id:4, book_type: 'socialRelation', book_name: '人情往来', note: ''},
      {book_id:5, book_type: 'moneyManagement', book_name: '投资理财', note: ''},
      {book_id:5, book_type: 'rent', book_name: '租房居住', note: ''},
      {book_id:6, book_type: 'others', book_name: '借还记录', note: ''},
      {book_id:8, book_type: 'dayLife', book_name: '聚餐记账', note: '同事组'},
    ];

    return (
      <View className='fx-accountBook-wrap'>
        <BookList title='我的账本' list={myBookList} />
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
