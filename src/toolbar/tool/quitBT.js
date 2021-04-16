import { css, remove } from '../../util'
import drawMiddleImage from '../middleImage/drawMiddleImage'
import endAndClear from '../endAndClear'
import language from '../../common/language'

export default function quitBT (me) {
    let quitBT = document.createElement('span')
    quitBT.id = 'kssQuitBT'
    quitBT.className = 'iconfont iconclose kssToolbarItemBT'
    
    let lan = language()
    if(lan === 'zh'){
      quitBT.title = '退出截图'
    }else{
      quitBT.title = 'Exist'
    }
  
    quitBT.addEventListener('click', function(){
        me.isEdit = true
        
        endAndClear(me)
        me.cancelCB && me.cancelCB()
    }, false)

    return quitBT
}