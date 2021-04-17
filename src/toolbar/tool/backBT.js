import { css } from '../../common/util'
import backToPreImg from '../backToPreImg'
import activeToolbarItem from '../activeToolbarItem'
import layerSort from '../layerSort'
import language from '../../common/language'

export default function backBT (me) {
    let backBT = document.createElement('span')
    backBT.id = 'kssbackeBT'
    backBT.className = 'iconfont iconundo kssToolbarItemBT'
    let lan = language()
    if(lan === 'zh'){
        backBT.title = '撤销'
    }else{
        backBT.title = 'Undo'
    }

    backBT.addEventListener('click', function () {
        if (me.snapshootList.length > 1) {
            if (me.snapshootList.length === 2) {
                layerSort(me, 'canvasLayer')
                backBT.classList.remove('greaterone');
                backToInit()
            }
            me.snapshootList.pop()
        } else if (me.snapshootList.length === 1) {
            layerSort(me, 'canvasLayer')
            backBT.classList.remove('greaterone');
            backToInit()
        }
      
        me.currentImgDom.src = me.snapshootList[me.snapshootList.length - 1]
        setTimeout(function () {
            backToPreImg(me)
        }, 0)
    })

    function backToInit () {
        me.isEdit = false
        me.currentToolType = null
        me.rectangleCanvas.removeEventListener('mousedown', me.toolmousedown)
        document.removeEventListener('mousemove', me.toolmousemove)
        document.removeEventListener('mouseup', me.toolmouseup)
        activeToolbarItem(null)
    }

    return backBT
} 