import Taro, { Component } from '@tarojs/taro'
import { View, ScrollView, Text } from '@tarojs/components'
import { AtCard } from "taro-ui"
import { BookListProps, BookListState } from './BookList.interface'
import './BookList.scss'

class BookList extends Component<BookListProps,BookListState > {
  constructor(props: BookListProps) {
    super(props);
    this.state = {
      title: this.props.title,
      bookList: this.props.list,
    }
  }
  static options = {
    addGlobalClass: true
  };
  static defaultProps:BookListProps = {
    title: '我的账本',
    list: []
  };

  /**
   * 跳转到账本详情页
   * @param bookInfo
   */
  onClickBook = (bookInfo) => {
    Taro.navigateTo({
      url: "/pages/index/index?bookId=" + bookInfo.book_id +
        '&bookName=' + bookInfo.book_name +
        '&bookType=' + bookInfo.book_type
    })
  };

  render() {
    let hasBook = false;
    if (this.state.bookList && this.state.bookList.length > 0) {
      hasBook = true
    }
    const books = this.state.bookList.map((book) => {
      const bookClass = book.book_type + '-book';
      return (
        <View
          className={'book-item' + " " + bookClass}
          onClick={this.onClickBook.bind(this, book)}
        >
          {book.book_name}
          <Text className='note-wrapper'>{book.note}</Text>
        </View>
      )
    });

    return (
      <View className='fx-BookList-wrap'>
        <AtCard
          title={this.state.title}
          className='card-wrapper'
        >
          <ScrollView className='scroll-view'
                      scrollX
                      scrollWithAnimation
                      style='width: 100%;'
          >
            {hasBook && books}
            {!hasBook && <View className='empty-wrapper'>暂无账本</View>}
          </ScrollView>
        </AtCard>
      </View>
    )
  }
}

export default BookList
