import { ElMessage } from 'element-plus'
class Message {
  private static instance: Message

  private constructor() {}

  public static getInstance(): Message {
    if (!this.instance) {
      this.instance = new Message()
    }
    return this.instance
  }

  public resetMessage() {
    Array.from(document.getElementsByClassName('el-message')).forEach((item) => {
      item.remove()
    })
    ElMessage.closeAll()
  }

  public success(message: string): void {
    this.resetMessage()
    ElMessage({
      type: 'success',
      message
    })
  }

  public error(message: string): void {
    this.resetMessage()
    ElMessage({
      type: 'error',
      message
    })
  }

  public warning(message: string): void {
    this.resetMessage()
    ElMessage({
      type: 'warning',
      message
    })
  }

  public info(message: string): void {
    this.resetMessage()
    ElMessage({
      type: 'info',
      message
    })
  }
}

const message = Message.getInstance()

export default message
