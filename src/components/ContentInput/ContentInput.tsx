import Taro, { Component } from '@tarojs/taro'
import {Input, Label, View} from '@tarojs/components'
import { ContentInputProps, ContentInputState } from './ContentInput.interface'
import './ContentInput.scss'

class ContentInput extends Component<ContentInputProps,ContentInputState > {
  constructor(props: ContentInputProps) {
    super(props)
    this.state = {
      inputContent: '',
      focusState: false,
    }
  }
  static options = {
    addGlobalClass: true
  }
  static defaultProps:ContentInputProps = {
    placeholder: '',
    inputName: '',
    value: '',
  }

  /**
   * 聚焦时添加样式
   */
  focusStyle() {
    this.setState({
      focusState: true,
    })
  }

  /**
   * 失焦时撤销样式
   */
  blurStyle() {
    if (!this.state.inputContent) {
      this.setState({
        focusState: false,
      })
    }
  }

  /**
   * 输入值改变时触发
   * @param e
   */
  onInputChange = e => {
    this.setState({
      inputContent: e.detail.value,
    }, () => {
      this.props.onInput(this.props.inputName, this.state.inputContent)
    })
  };

  componentWillReceiveProps(nextProps): void {
    // @ts-ignore
    if (nextProps.value == 0 || nextProps.value == '0') {
      this.setState({
          inputContent: '',
          focusState: false,
        }
      )
    } else if (nextProps.value == 'NaN') {
      this.setState({
          inputContent: '',
          focusState: false,
        }
      )
    } else {
      this.setState({
          inputContent: nextProps.value,
          focusState: true,
        }
      )
    }
  }

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
            value={this.state.inputContent}
            placeholderStyle='color: rgba(0,0,0,0)'
            maxLength={20}
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
