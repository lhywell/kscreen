import { css, remove } from '../../util'
import drawMiddleImage from '../middleImage/drawMiddleImage'
import img from '../../assets/imgs/cancel.png'
import endAndClear from '../endAndClear'

export default function quitBT (me) {
    let quitBT = document.createElement('span')
    quitBT.id = 'kssQuitBT'
    quitBT.className = 'iconfont iconclose kssToolbarItemBT'
    quitBT.title = '退出截图'

    quitBT.addEventListener('click', function(){
        me.isEdit = true
        
        endAndClear(me)
        me.cancelCB && me.cancelCB()
    }, false)

    return quitBT
}