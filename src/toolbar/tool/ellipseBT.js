import { css } from '../../common/util'
import backToPreImg from '../backToPreImg'
import makeSnapShoot from '../makeSnapShoot'
import activeToolbarItem from '../activeToolbarItem'
import layerSort from '../layerSort'
import language from '../../common/language'
import options from '../../config/EllipseConfig'

export default function ellipseBT(me) {
  let ellipseBT = document.createElement('span')
  ellipseBT.id = 'kssArrowBT'
  ellipseBT.className = 'iconfont iconcircle kssToolbarItemBT'
  
  let lan = language()
  if(lan === 'zh'){
      ellipseBT.title = '插入椭圆'
  }else{
      ellipseBT.title = 'Insert Ellipse'
  }
    
  ellipseBT.addEventListener('click', function() {
    me.isEdit = true

    if (me.currentToolType === 'ellipse') {
      return
    }

    me.currentToolType = 'ellipse'
    activeToolbarItem(ellipseBT)
    layerSort(me, 'canvasLayer')

    if (me.toolmousedown) {
      me.rectangleCanvas.removeEventListener('mousedown', me.toolmousedown)
      document.removeEventListener('mousemove', me.toolmousemove)
      document.removeEventListener('mouseup', me.toolmouseup)
    }

    me.rectangleCanvas.addEventListener('mousedown', ellipseMousedownEvent)
    me.toolmousedown = ellipseMousedownEvent

    function ellipseMousedownEvent(e) {
      if (e.button === 2) {
        return
      }

      let startX = e.clientX - me.startX
      let startY = e.clientY - me.startY

      document.addEventListener('mousemove', ellipseMousemoveEvent)
      document.addEventListener('mouseup', ellipseMouseupEvent)
      me.toolmousemove = ellipseMousemoveEvent
      me.toolmouseup = ellipseMouseupEvent

      function ellipseMousemoveEvent(e) {
        backToPreImg(me)
        let context = me.rectangleCanvas.getContext('2d')
        let endX = e.clientX
        let endY = e.clientY

        if (endX < me.startX) {
          endX = me.startX
        } else if (endX > me.startX + me.width) {
          endX = me.startX + me.width
        }

        endX -= me.startX

        if (endY < me.startY) {
          endY = me.startY
        } else if (endY > me.startY + me.height) {
          endY = me.startY + me.height
        }

        endY -= me.startY

        let centerX = (startX + endX) / 2
        let centerY = (startY + endY) / 2
        let radiusX = Math.abs(endX - startX) / 2
        let radiusY = Math.abs(endY - startY) / 2
        let k = 0.5522848
        let ox = radiusX * k
        let oy = radiusY * k

        context.beginPath()
        context.lineWidth = options.lineWidth
        context.strokeStyle = options.strokeStyle
        context.moveTo((centerX - radiusX) * me.scale, centerY * me.scale)
        context.bezierCurveTo(
          (centerX - radiusX) * me.scale,
          (centerY - oy) * me.scale,
          (centerX - ox) * me.scale,
          (centerY - radiusY) * me.scale,
          centerX * me.scale,
          (centerY - radiusY) * me.scale
        )
        context.bezierCurveTo(
          (centerX + ox) * me.scale,
          (centerY - radiusY) * me.scale,
          (centerX + radiusX) * me.scale,
          (centerY - oy) * me.scale,
          (centerX + radiusX) * me.scale,
          centerY * me.scale
        )
        context.bezierCurveTo(
          (centerX + radiusX) * me.scale,
          (centerY + oy) * me.scale,
          (centerX + ox) * me.scale,
          (centerY + radiusY) * me.scale,
          centerX * me.scale,
          (centerY + radiusY) * me.scale
        )
        context.bezierCurveTo(
          (centerX - ox) * me.scale,
          (centerY + radiusY) * me.scale,
          (centerX - radiusX) * me.scale,
          (centerY + oy) * me.scale,
          (centerX - radiusX) * me.scale,
          centerY * me.scale
        )
        context.stroke()
        context.closePath()
      }

      function ellipseMouseupEvent(e) {
        document.removeEventListener('mousemove', ellipseMousemoveEvent)
        document.removeEventListener('mouseup', ellipseMouseupEvent)
        makeSnapShoot(me)
      }
    }
  })

  return ellipseBT
}
