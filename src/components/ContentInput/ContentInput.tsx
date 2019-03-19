import Taro, { Component } from '@tarojs/taro'
import {Input, Label, View} from '@tarojs/components'
import { ContentInputProps, ContentInputState } from './ContentInput.interface'
import './ContentInput.scss'

class ContentInput extends Component<ContentInputProps,ContentInputState > {
  constructor(props: ContentInputProps) {
    super(props)
    this.state = {
      bookName:'',
      focusState: false,
    }
  }
  static options = {
    addGlobalClass: true
  }
  static defaultProps:ContentInputProps = {
    placeholder: '',
  }

  focusStyle() {
    this.setState({
      focusState: true,
    })
  }

  blurStyle() {
    if (!this.state.projectName) {
      this.setState({
        focusState: false,
      })
    }
  }

  onInputChange = e => {
    this.setState({
      projectName: e.detail.value,
      helpInfo: '',
    })
  };

  render() {
    return (
      <View className='fx-ContentInput-wrap'>
        <View className='input-outline-x'>
          <Input
            className='input-control input-outline'
            placeholder={this.props.placeholder}
            onFocus={this.focusStyle}
            onBlur={this.blurStyle}
            onInput={this.onInputChange}
            value={this.state.bookName}
            placeholderStyle='color: rgba(0,0,0,0)'
            maxLength={8}
          />
          <Label
            className={this.state.focusState ? 'input-label input-label-active' : 'input-label'}
          >{this.props.placeholder}</Label>
        </View>
      </View>
    )
  }
}

export default ContentInput
