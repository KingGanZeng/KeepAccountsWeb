import Taro, { Component } from '@tarojs/taro'
import { View, ScrollView, Text } from '@tarojs/components'
import { AtCard } from "taro-ui"
import { BookListProps, BookListState } from './BookList.interface'
import './BookList.scss'

class BookList extends Component<BookListProps,BookListState > {
  constructor(props: BookListProps) {
    super(props);
    this.state = {
      bookTitle: this.props.title
    }
  }
  static options = {
    addGlobalClass: true
  };
  static defaultProps:BookListProps = {
    title: '我的账本',
    list: [],
  };

  /**
   * 跳转到账本详情页
   * @param bookInfo
   */
  onClickBook = (bookInfo) => {
    if (this.state.bookTitle === '我参与的') {
      Taro.navigateTo({
        url: "/pages/travelDetails/travelDetails?bookId=" + bookInfo.book_id +
          '&bookName=' + bookInfo.book_name +
          '&bookType=' + bookInfo.book_type +
          '&budget=' + bookInfo.budget +
          '&sBookId=' + false  +
          '&is_admin=' + false
      })
    } else {
      Taro.redirectTo({
        url: "/pages/index/index?bookId=" + bookInfo.book_id +
          '&bookName=' + bookInfo.book_name +
          '&bookType=' + bookInfo.book_type +
          '&budget=' + bookInfo.budget +
          '&isSpecial=' + true +
          '&is_admin=' + true
      })
    }
  };

  render() {
    let hasBook = false;
    if (this.props.list && this.props.list.length > 0) {
      hasBook = true
    }
    const books = this.props.list.map((book, index) => {
      const bookClass = book.book_type + '-book';
      return (
        <View
          key={String(index)}
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
          title={this.state.bookTitle}
        >
          <ScrollView
            className='scroll-view'
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
