import Taro, { Component, Config } from '@tarojs/taro'
import { AtInput, AtButton, AtToast, AtImagePicker } from 'taro-ui'
import { View } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import Tips from '../../utils/tips'
import { NewTravelProps, NewTravelState } from './newTravel.interface'
import './newTravel.scss'
import { MAINHOST } from "../../config";
import ShareComponent from "../../components/ShareComponent/ShareComponent";
import {randomWord} from "../../utils/common";

@connect(({ newTravel }) => ({
    ...newTravel,
}))

class NewTravel extends Component<NewTravelProps,NewTravelState > {
  config:Config = {
    navigationBarTitleText: '创建新项目'
  }
  constructor(props: NewTravelProps) {
    super(props)
    this.state = {
      sBookId: decodeURIComponent(this.$router.params.bookId) || '',
      hasBookId: false,
      titleInput: '',
      budget: 0,
      bookType: decodeURIComponent(this.$router.params.bookType) || 'travelParty',
      username: '',
      uid: '',
      is_shared: false,
      hasError: false,
      hasErrorMsg: '新建记录错误',
      hasErrorIcon: 'close-circle',
      groupIdInfo: '',
      groupMembers: [],
      firstShare: false,
      files: [],
      hasImage: true, // 是否有一张图片
      imageHasChange: false,
    }
  }

  /**
   * 处理输入框
   * @param inputLabel
   * @param input
   */
  handleInputChange (inputLabel, input) {
    if (inputLabel == 'titleInput') {
      this.setState({
        titleInput: input
      })
    } else if (inputLabel == 'budget') {
      this.setState({
        budget: input
      })
    }
  }

  /**
   * 获取账本信息
   */
  async getBookInfo() {
    let result:any = await Taro.request({
      method: 'GET',
      url: `${MAINHOST}/api/getBookList`,
      data: {
        book_id: parseInt(this.$router.params.projectId)
      }
    });
    if (result.data.results.length > 0) {
      result = result.data.results[0];
      if (result.is_shared) {
        // 用户已开启共享，获取小组成员信息
        const groupMemberInfoList:any = await this.getGroupMembers(result.uid);
        await this.getTempImageUrl(result.image_url || '')
          .then(value => {
            this.setState({
              hasBookId: true,
              bookType: result.book_type,
              titleInput: result.book_name,
              budget: parseFloat(result.budget), // 账本预算
              is_shared: result.is_shared, // 是否为共享账本
              groupIdInfo: result.uid,
              groupMembers: groupMemberInfoList,
              image_url: result.image_url || '',
              files: value.fileList[0].tempFileURL === '' ? [] : [{url: value.fileList[0].tempFileURL}],
              hasImage: value.fileList[0].tempFileURL === '',
            }, async () => {
              console.log("共享，数据获取完毕", this.state)
            })
          })
      } else {
        // 用户未开启共享，标注firstShare属性
        await this.getTempImageUrl(result.image_url || '')
          .then(value => {
            this.setState({
              hasBookId: true,
              bookType: result.book_type,
              titleInput: result.book_name,
              budget: parseFloat(result.budget),
              is_shared: result.is_shared,
              firstShare: !result.is_shared,
              image_url: result.image_url || '',
              files: value.fileList[0].tempFileURL === '' ? [] : [{url: value.fileList[0].tempFileURL}],
              hasImage: value.fileList[0].tempFileURL === '',
            }, async() => {
              console.log("数据获取完毕", this.state)
            })
          })
      }
    }
  }

  /**
   * 修改账本信息
   */
  async changeBook() {
    Tips.loading()
    const bookId = decodeURIComponent(this.$router.params.projectId); // 获取项目id
    let createId = this.state.uid; // 先设定修改人uid
    if (this.state.is_shared) {
      createId = this.state.groupIdInfo // 修改人更新为group
      console.log(this.state.firstShare)
      if (this.state.firstShare) {
        // 判断如果是首次开启共享，则创建小组
        const result = await this.createNewGroup();
        console.log("创建小组", result);
        if (!result.group_id) {
          Tips.loaded()
          this.setState({
            hasError: true,
            hasErrorMsg: '开启共享失败，请稍后再试',
            hasErrorIcon: 'close-circle',
          })
          return;
        }
      }
    }
    // 修改项目图片
    let imageFile = this.state.image_url;
    let addImage = true;
    // @ts-ignore
    if (this.state.imageHasChange) {
      await this.uploadImage()
        .then((value:any) => {
          if (value.fileID) {
            imageFile = value.fileID
          }
        }, () => {
          if (this.state.files.length !== 0) {
            console.log(222222222222)
            this.setState({
              hasError: true,
              hasErrorMsg: '添加项目封面失败',
              hasErrorIcon: 'close-circle',
            })
            addImage = false;
          }
        })
    }
    if (!addImage) {
      Tips.loaded()
      return;
    }
    // 修改项目信息
    const result = await Taro.request({
      method: 'PUT',
      url: `${MAINHOST}/api/bookChangeApi/${bookId}`,
      data: {
        username: this.state.username,
        uid: createId,
        book_name: this.state.titleInput,
        book_type: this.state.bookType,
        budget: this.state.budget,
        is_shared: this.state.is_shared,
        image_url: imageFile,
      }
    });
    // @ts-ignore
    Tips.loaded()
    if(result.data.book_id) {
      this.setState({
        hasError: true,
        hasErrorMsg: '修改成功',
        hasErrorIcon: 'check-circle',
      }, () => {
        // 跳转回账本页面
        setTimeout(() => {
          Taro.navigateBack({
            delta: 1
          })
          // Taro.redirectTo({
          //   url: "/pages/travelDetails/travelDetails?bookId=" + result.data.book_id +
          //     '&bookName=' + this.state.titleInput +
          //     '&bookType=' + this.state.bookType +
          //     '&budget=' + this.state.budget +
          //     '&sBookId=' + this.state.sBookId +
          //     '&is_admin=' + true
          // })
        }, 800)
      })
    } else {
      this.setState({
        hasError: true,
        hasErrorMsg: '修改失败',
        hasErrorIcon: 'close-circle',
      })
    }
  }

  /**
   * 删除项目
   */
  async deleteBook() {
    const bookId = decodeURIComponent(this.$router.params.projectId);
    const result = await await Taro.request({
      method: 'DELETE',
      url: `${MAINHOST}/api/bookChangeApi/${bookId}`,
    });
    if(result.data.detail) {
      this.setState({
        hasError: true,
        hasErrorMsg: '暂无法删除该记录',
        hasErrorIcon: 'close-circle',
      })
    } else {
      this.setState({
        hasError: true,
        hasErrorMsg: '删除成功',
        hasErrorIcon: 'check-circle',
      }, () => {
        // 跳转回账本页面
        setTimeout(() => {
          Taro.navigateBack({
            delta: 2
          })
        }, 800)
      })
    }
  }

  /**
   * 创建新的共享小组，先将为当前用户创建组员信息，并设置为组长
   */
  async createNewGroup() {
    const uid = Taro.getStorageSync('uid');
    const username = Taro.getStorageSync('username');
    const portrait = Taro.getStorageSync('portrait');
    let result:any = await Taro.request({
      method: "POST",
      url: `${MAINHOST}/api/createGroupMember`,
      data: {
        group_id: this.state.groupIdInfo,
        uid: uid,
        username: username,
        is_admin: true,
        portrait: portrait,
      }
    });
    return result.data;
  }

  /**
   * 获取小组成员信息
   */
  async getGroupMembers(group_id) {
    let result:any = await Taro.request({
      method: "GET",
      url: `${MAINHOST}/api/getGroupMembers`,
      data: {
        group_id: group_id,
      }
    });
    return result.data.results;
  }

  /**
   * 生成新账本并跳转
   */
  async jumpToNewBook() {
    let imageFile = '';
    let addImage = true;
    Tips.loading()
    // @ts-ignore
    await this.uploadImage()
      .then((value:any) => {
        if (value.fileID) {
          imageFile = value.fileID
        }
        Tips.loaded()
      }, () => {
        Tips.loaded()
        if (this.state.files.length !== 0) {
          console.log(1111111)
          this.setState({
            hasError: true,
            hasErrorMsg: '添加项目封面失败',
            hasErrorIcon: 'close-circle',
          })
          addImage = false;
        }
      })
    if (!addImage) {
      Tips.loaded()
      return;
    }

    let result:any = await Taro.request({
      method: 'POST',
      url: `${MAINHOST}/api/createBook`,
      data: {
        username: this.state.username,
        uid: this.state.uid,
        book_name: this.state.titleInput,
        book_type: this.state.bookType,
        budget: this.state.budget,
        is_shared: this.state.is_shared,
        image_url: imageFile,
      }
    });
    result = result.data;
    if (result.book_id) {
      const addToMain = await Taro.request({
        method: 'POST',
        url: `${MAINHOST}/api/addSpecialBookItem`,
        data: {
          s_book_id: this.state.sBookId,
          book_id: result.book_id
        }
      });
      if (addToMain.data.hasAdd) {
        Tips.loaded()
        Taro.redirectTo({
          url: "/pages/travelDetails/travelDetails?bookId=" + result.book_id +
            '&bookName=' + this.state.titleInput +
            '&bookType=' + this.state.bookType +
            '&budget=' + this.state.budget +
            '&sBookId=' + this.state.sBookId +
            '&is_admin=' + true
        })
      }
    }
    Tips.loaded()
  }

  /**
   * 分享信息
   */
  onShareAppMessage() {
    const username = Taro.getStorageSync('username');
    return {
      title: `【${username}】邀请你加入组群【${this.state.titleInput}】`,
      path: `/pages/sharePage/sharePage?inviteUser=${username}&groupId=${this.state.groupIdInfo}&projectName=${this.state.titleInput}`,
      success: function (res) {
        console.log("转发成功:" + JSON.stringify(res));
      },
      fail: function (res) {
        // 转发失败
        console.log("转发失败:" + JSON.stringify(res));
      }
    }
  }

  /**
   * 监听子组件小组id修改
   * @param groupId
   */
  onChangeGroupInfo(groupId) {
    this.setState({
      groupIdInfo: groupId,
    })
  }

  /**
   * 监听子组件小组成员列表的变化
   * @param groupMemberList
   */
  onChangeGroupMemberList(groupMemberList) {
    this.setState({
      groupMembers: groupMemberList,
    })
  }

  /**
   * 监听子组件小组共享状态修改
   * @param shareState
   */
  onChangeShareState(shareState) {
    console.log("父组件监听", shareState);
    this.setState({
      is_shared: shareState,
    })
  }

  /**
   * 监听子组件信息，删除某个组成员
   * @param group_member_id
   */
  async onDeleteGroupMember(group_member_id) {
    let result:any = await Taro.request({
      method: 'DELETE',
      url: `${MAINHOST}/api/changeGroupMember/${group_member_id}`,
    })
    if (!result.data) {
      await this.getBookInfo();
    } else {
      this.setState({
        hasError: true,
        hasErrorMsg: '删除失败',
        hasErrorIcon: 'close-circle',
      })
    }
  }

  // 图片处理相关
  /**
   * 图片本地上传
   * @param files
   * @param operation
   */
  onChange (files, operation) {
    if (operation === 'add') {
      this.setState({
        files: files,
        hasImage: false,
        imageHasChange: true,
      })
    } else {
      this.setState({
        files: [],
        hasImage: true,
        imageHasChange: true,
      })
    }
  }

  /**
   * 上传图片
   */
  uploadImage() {
    const image = this.state.files;
    return new Promise(((resolve, reject) => {
      if (image.length === 0) {
        this.deleteImage()
        reject()
        return
      }
      // @ts-ignore
      let cloudPathEnd = randomWord(false, 32);
      console.log(333333, image[0].url)
      const data =  Taro.cloud.uploadFile({
        cloudPath: `project/${cloudPathEnd}`,
        filePath: image[0].url,
      })
      console.log(444444, data)
      if (!data) {
        reject()
        return
      }
      resolve(data)
    }))
  }

  /**
   * 删除云端图片
   */
  deleteImage() {
    return new Promise(((resolve, reject) => {
      const imageID:any = this.state.image_url
      const data = Taro.cloud.deleteFile({
        fileList: [imageID],
      })
      if (!data) {
        reject()
        return
      }
      resolve()
    }))
  }

  /**
   * 根据imageId换取临时url
   * @param imageId
   */
  getTempImageUrl(imageId) {
    return new Promise(((resolve, reject) => {
      const data = Taro.cloud.getTempFileURL({
        fileList: [imageId],
      })
      if (!data) {
        reject()
        return
      }
      resolve(data)
    }))
  }

  // 页面挂载时执行
  async componentDidMount() {
    Tips.loading()
    // 云开发
    Taro.cloud.init({
      env: 'dev-envir-a058cd',
      traceUser: true,
    })
    const username = Taro.getStorageSync('username');
    const uid = Taro.getStorageSync('uid');
    this.setState({
      uid: uid,
      username: username,
    });
    if (this.$router.params.projectId) {
      await this.getBookInfo();
      Taro.setNavigationBarTitle({ // 设置标题栏
        title: '修改项目信息'
      });
    }
    Tips.loaded()
  }

  render() {
    const isAdmin = decodeURIComponent(this.$router.params.is_admin) === 'true'
    const first_create = decodeURIComponent(this.$router.params.first_create) === 'true'
    return (
      <View className='newTravel-wrap'>
        <AtToast
          isOpened={this.state.hasError}
          text={this.state.hasErrorMsg}
          icon={this.state.hasErrorIcon}
          hasMask
        />
        <View className='input-wrapper'>
          <AtImagePicker
            length={1}
            files={this.state.files}
            showAddBtn={this.state.hasImage}
            onChange={this.onChange.bind(this)}
          />
          <AtInput
            name='value'
            value={this.state.titleInput}
            type='text'
            disabled={!isAdmin}
            placeholder='请输入项目名称，如:台湾游'
            onChange={this.handleInputChange.bind(this, 'titleInput')}
            clear
          />
          <AtInput
            name='value'
            value={this.state.budget || ''}
            type='number'
            disabled={!isAdmin}
            placeholder='请设置预算'
            onChange={this.handleInputChange.bind(this, 'budget')}
          />
          <ShareComponent
            sharedState={this.state.is_shared}
            groupIdInfo={this.state.groupIdInfo}
            projectName={this.state.titleInput}
            groupMemberList={this.state.groupMembers}
            isAdmin={isAdmin}
            firstCreate={first_create}
            onGroupId={this.onChangeGroupInfo.bind(this)}
            onGroupMemberList={this.onChangeGroupMemberList.bind(this)}
            onShareState={this.onChangeShareState.bind(this)}
            onGroupMember={this.onDeleteGroupMember.bind(this)}
          />
        </View>
        { this.state.hasBookId && <View className='button-wrapper'>
          <AtButton
            circle
            disabled={!isAdmin}
            type='primary'
            onClick={this.changeBook}
            className='button-check-item'
          >
            <View className='at-icon at-icon-check' />
          </AtButton>
          <AtButton
            circle
            disabled={!isAdmin}
            type='primary'
            className='button-trash-item'
            onClick={this.deleteBook}
          >
            <View className='at-icon at-icon-trash' />
          </AtButton>
          </View>
        }
        {!this.state.hasBookId && <View className='button-wrapper'>
          <AtButton
            circle
            type='primary'
            disabled={!isAdmin}
            className='button-check-item'
            onClick={this.jumpToNewBook}
          >
              <View className='at-icon at-icon-check' />
          </AtButton>
        </View>
        }
      </View>
    )
  }
}

export default NewTravel
