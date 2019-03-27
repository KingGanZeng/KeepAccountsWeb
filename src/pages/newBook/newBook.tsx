import Taro, { Component, Config } from '@tarojs/taro'
import { View, Picker, Text, } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { AtForm, AtButton, AtToast } from 'taro-ui'
import { bookNameTranslate } from '../../utils/common'
import { NewBookProps, NewBookState } from './newBook.interface'
import './newBook.scss'
import '../../assets/iconfont/iconfont.scss'
import ContentInput from "../../components/ContentInput/ContentInput";
import {MAINHOST} from "../../config";


@connect(({ newBook }) => ({
  ...newBook,
}))

class NewBook extends Component<NewBookProps,NewBookState > {
  config:Config = {
    navigationBarTitleText: '编辑账本'
  };
  constructor(props: NewBookProps) {
    super(props);
    const defBookType = decodeURIComponent(this.$router.params.bookType);
    const defBookName = decodeURIComponent(this.$router.params.bookName);
    this.state = {
      bookType: defBookType,
      bookCategory: ['日常开销', '出游聚会', '居家装修', '人情往来', '投资理财', '租房居住', '借还记录'],
      bookCategoryChecked: bookNameTranslate('Chinese', defBookType) || '日常开销',
      bookName: defBookName==='undefined' ? '新建账本' : defBookName,
      budget: 0, // 账本预算
      hasGroup: false,
      loading: false,
      hasError: false,
      hasErrorMsg: '新建账本错误',
      hasErrorIcon: 'close-circle',
      uid: '',
      username: '',
      hasBookId: false,
    }
  }

  /**
   * 创建新账本
   * @return Promise<*>
   *
   */
  async createBook() {
    if(!this.state.bookName || !this.state.bookCategoryChecked){
      this.setState({
        hasError: true,
        hasErrorMsg: '新建账本错误',
        hasErrorIcon: 'close-circle',
      });
      return
    }
    return await this.props.dispatch({
      type: 'newBook/createBook',
      payload: {
        username: this.state.username,
        uid: this.state.uid,
        book_name: this.state.bookName,
        book_type: this.state.bookType,
        budget: this.state.budget == 0 ? null : this.state.budget,
      }
    })
  }

  /**
   * 创建小组
   */
  async createGroup() {
    return await this.props.dispatch({
      type: 'newBook/createGroup',
      payload: {
        user_name: this.state.username,
        uid: this.state.uid,
      }
    })
  }

  /**
   * 获取账本信息
   */
  async getBookInfo() {
    let result:any;
    if (this.$router.params.isSpecial == 'true') {
      result = await Taro.request({
        method: 'GET',
        url: `${MAINHOST}/api/getSpecialBookList`,
        data: {
          uid: this.state.uid,
          s_book_id: parseInt(this.$router.params.bookId)
        }
      });
      result = result.data;
    } else {
      result = await this.props.dispatch({
        type: 'newBook/getBookInfo',
        payload: {
          uid: this.state.uid,
          book_id: parseInt(this.$router.params.bookId)
        }
      });
    }
    if (result.results.length > 0) {
      result = result.results[0];
      this.setState({
        hasBookId: true,
        bookName: result.book_name,
        budget: parseFloat(result.budget), // 账本预算
        bookType: result.book_type,
        bookCategoryChecked: bookNameTranslate('Chinese', result.book_type) || '日常开销',
      }, () => {
        console.log("数据获取完毕")
      })
    }
  }

  /**
   * 修改账本信息
   */
  async changeBook() {
    const bookId = decodeURIComponent(this.$router.params.bookId);
    const result = await Taro.request({
      method: 'PUT',
      url: `${MAINHOST}/api/bookChangeApi/${bookId}`,
      data: {
        username: this.state.username,
        uid: this.state.uid,
        book_name: this.state.bookName,
        book_type: this.state.bookType,
        budget: this.state.budget,
      }
    });
    // @ts-ignore
    if(result.data.book_id) {
      this.setState({
        hasError: true,
        hasErrorMsg: '修改成功',
        hasErrorIcon: 'check-circle',
      }, () => {
        // 跳转回账本页面
        setTimeout(() => {
          Taro.redirectTo({
            url: '/pages/accountBook/accountBook'
          })
        }, 800)
      })
    } else {
      this.setState({
        hasError: true,
        hasErrorMsg: '修改失败',
      })
    }
  }

  /**
   * 删除账本
   */
  async deleteBook() {
    const bookId = decodeURIComponent(this.$router.params.bookId);
    const result = await await Taro.request({
      method: 'DELETE',
      url: `${MAINHOST}/api/bookChangeApi/${bookId}`,
    });
    if(result.data.detail) {
      this.setState({
        hasError: true,
        hasErrorMsg: '暂无法删除该账本',
      })
    } else {
      this.setState({
        hasError: true,
        hasErrorMsg: '删除成功',
        hasErrorIcon: 'check-circle',
      }, () => {
        // 跳转回账本页面
        setTimeout(() => {
          Taro.redirectTo({
            url: '/pages/accountBook/accountBook'
          })
        }, 800)
      })
    }
  }

  /**
   * 创建特殊账本
   */
  async createSpecialBook() {
    const result = await Taro.request({
      method: 'POST',
      url: `${MAINHOST}/api/createSpecialBook`,
      data: {
        username: this.state.username,
        uid: this.state.uid,
        book_name: this.state.bookName,
        book_type: this.state.bookType,
        budget: this.state.budget,
      }
    })
    // @ts-ignore
    if(result.data.s_book_id) {
      this.setState({
        hasError: true,
        hasErrorMsg: '创建成功',
        hasErrorIcon: 'check-circle',
      }, () => {
        // 跳转回账本页面
        setTimeout(() => {
          Taro.redirectTo({
            url: '/pages/accountBook/accountBook'
          })
        }, 800)
      })
    } else {
      this.setState({
        hasError: true,
        hasErrorMsg: '创建失败',
      })
    }
  }

  /**
   * 删除特殊账本
   */
  async deleteSpecialBook() {
    const bookId = decodeURIComponent(this.$router.params.bookId);
    const result = await await Taro.request({
      method: 'DELETE',
      url: `${MAINHOST}/api/changeSpecialBook/${bookId}`,
    });
    if(result.data.detail) {
      this.setState({
        hasError: true,
        hasErrorMsg: '暂无法删除该账本',
      })
    } else {
      this.setState({
        hasError: true,
        hasErrorMsg: '删除成功',
        hasErrorIcon: 'check-circle',
      }, () => {
        // 跳转回账本页面
        setTimeout(() => {
          Taro.redirectTo({
            url: '/pages/accountBook/accountBook'
          })
        }, 800)
      })
    }
  }

  /**
   * 修改特殊账本信息
   */
  async changeSpecialBook() {
    const bookId = decodeURIComponent(this.$router.params.bookId);
    const result = await Taro.request({
      method: 'PUT',
      url: `${MAINHOST}/api/changeSpecialBook/${bookId}`,
      data: {
        username: this.state.username,
        uid: this.state.uid,
        book_name: this.state.bookName,
        book_type: this.state.bookType,
        budget: this.state.budget,
      }
    });
    if(result.data.book_name) {
      this.setState({
        hasError: true,
        hasErrorMsg: '修改成功',
        hasErrorIcon: 'check-circle',
      }, () => {
        // 跳转回账本页面
        setTimeout(() => {
          Taro.redirectTo({
            url: '/pages/accountBook/accountBook'
          })
        }, 800)
      })
    } else {
      this.setState({
        hasError: true,
        hasErrorMsg: '修改失败',
      })
    }
  }

  /**
   * 确定提交
   */
  onSubmit () {
    // 是否是特殊账本
    if (this.state.bookCategoryChecked == '出游聚会') {
      if (this.$router.params.bookId) {
        this.changeSpecialBook()
      } else {
        this.createSpecialBook();
      }
      return
    }
    // 是否需要创建小组
    if (this.state.hasGroup) {
      this.createGroup();
    }
    // 是否为修改账本
    if(this.$router.params.bookId) {
      this.changeBook()
      return;
    }
    const data = new Promise(async (resolve, reject) => {
      const result = await this.createBook();
      if (!result) {
        reject();
        this.setState({
          hasError: true
        });
        return
      }
      Taro.redirectTo({
        url: '/pages/accountBook/accountBook'
      });
      resolve()
    });
    setTimeout(() => {
      this.setState({
        hasError: false
      })
    },500);
    return data
  }

  /**
   * 重置按钮
   */
  onReset () {
    // 是否是特殊账本
    if (this.$router.params.bookId && this.state.bookCategoryChecked == '出游聚会') {
      this.deleteSpecialBook();
    }
    if(this.$router.params.bookId) {
      this.deleteBook()
    } else {
      this.setState({
        bookType: 'dayLife',
        bookName: '新建账本',
        bookCategoryChecked: '日常开销',
        hasGroup: false,
      });
    }
  }

  /**
   * 切换账本类型
   * @param e
   */
  onCategoryChange = e => {
    this.setState({
      bookCategoryChecked: this.state.bookCategory[e.detail.value]
    }, () => {
      this.setState({
        bookType: bookNameTranslate('English', this.state.bookCategoryChecked) || '',
      })
    })
  };

  /**
   * 切换小组状态
   *
   * @param value
   */
  handleGroupChange = value => {
    this.setState({
      hasGroup: value,
    })
  };

  /**
   * 父组件处理子组件传递的信息
   *
   * @param inputName
   * @param inputContent
   */
  onInputChange(inputName, inputContent) {
    if(inputName == 'bookName') {
      this.setState({
        bookName: inputContent
      })
    } else if(inputName == 'bookType') {
      this.setState({
        bookType: inputContent
      })
    } else {
      this.setState({
        budget: inputContent
      })
    }
  }

  /**
   * 组件渲染前获取数据
   */
  componentWillMount() {
    const username = Taro.getStorageSync('username');
    const uid = Taro.getStorageSync('uid');
    this.setState({
      uid: uid,
      username: username,
    }, () => {
      if (this.$router.params.bookId) {
        this.getBookInfo()
      }
    });
  }

  render() {
    // @ts-ignore
    const pickValue = this.state.bookCategory.reduce((previousValue, currentValue, currentIndex) => {
      if(this.state.bookCategoryChecked == currentValue) {
        return currentIndex
      }
    });

    return (
      <View className='newBook-container'>
        <AtToast
          isOpened={this.state.hasError}
          text={this.state.hasErrorMsg}
          icon={this.state.hasErrorIcon}
          hasMask
        />
        <AtForm
          className='newBook-wrap'
          onSubmit={this.onSubmit.bind(this)}
          onReset={this.onReset.bind(this)}
        >
          <View className='iconfont icon-signature' />
          <ContentInput
            value={this.state.bookName}
            onInput={this.onInputChange.bind(this)}
            inputName='bookName'
            placeholder='账本名称*'
          />
          <ContentInput
            value={this.state.budget.toString()}
            onInput={this.onInputChange.bind(this)}
            inputName='bookBudget'
            placeholder='账本预算(元)'
          />
          <Picker
            mode='selector'
            range={this.state.bookCategory}
            onChange={this.onCategoryChange}
            value={pickValue}
            disabled={this.state.hasBookId}
          >
            <View className='picker-wrapper'>
              账本类型
              <Text className='picker-content'>{this.state.bookCategoryChecked}</Text>
              <View className='at-icon at-icon-chevron-right' />
            </View>
          </Picker>
          {/*<AtInput*/}
            {/*name='bookName'*/}
            {/*type='text'*/}
            {/*className='name-wrapper'*/}
            {/*maxLength={6}*/}
            {/*value={this.state.bookName}*/}
            {/*placeholder={this.state.bookName}*/}
            {/*onChange={this.handleChange.bind(this, 'bookName')}*/}
            {/*autoFocus*/}
            {/*border={false}*/}
          {/*/>*/}
          {/*<View className='book-setting-label'>账本设置</View>*/}
          {/*<Picker*/}
            {/*mode='selector'*/}
            {/*range={this.state.bookCategory}*/}
            {/*onChange={this.onCategoryChange}*/}
            {/*value={0}*/}
          {/*>*/}
            {/*<View className='picker-wrapper half-border-bottom border-bottom'>*/}
              {/*账本类型*/}
              {/*<Text className='picker-content'>{this.state.bookCategoryChecked}</Text>*/}
              {/*<View className='at-icon at-icon-chevron-right' />*/}
            {/*</View>*/}
          {/*</Picker>*/}
          {/*<AtInput*/}
            {/*name='bookName'*/}
            {/*type='number'*/}
            {/*title='账本预算'*/}
            {/*className='name-wrapper'*/}
            {/*value={this.state.budget}*/}
            {/*placeholder={this.state.budget.toString()}*/}
            {/*onChange={this.handleChange.bind(this, 'budget')}*/}
            {/*autoFocus*/}
          {/*/>*/}
          {/*<AtSwitch*/}
            {/*title='是否开启小组'*/}
            {/*checked={this.state.hasGroup}*/}
            {/*onChange={this.handleGroupChange}*/}
            {/*className='input-margin-bottom'*/}
            {/*border={false}*/}
            {/*color='#ff5a5b'*/}
          {/*/>*/}
          <View className='button-wrapper at-row'>
            <View className='button-item at-col'>
              <AtButton
                type='primary'
                formType='submit'
                className='form-button submit-button'
                loading={this.state.loading}
              >
                {this.$router.params.bookId ? '修改' : '提交'}
              </AtButton>
            </View>
            <View className='button-item at-col'>
              <AtButton
                formType='reset'
                type='secondary'
                className='form-button'
              >
                {this.$router.params.bookId ? '删除' : '重置'}
              </AtButton>
            </View>
          </View>
        </AtForm>
      </View>
    )
  }
}

export default NewBook
