import { addClass, hasClass } from '../common/util'

export default function makeSnapShoot(me) {
  let ctx = me.rectangleCanvas.getContext('2d')

  ctx.drawImage(
    me.rectangleCanvas,
    0,
    0,
    me.width * me.scale,
    me.height * me.scale,
    0,
    0,
    me.width * me.scale,
    me.height * me.scale
  )

  let dataURL = me.rectangleCanvas.toDataURL('image/png')

  let kssToolbarItemBT = document.getElementsByClassName('kssToolbarItemBT')
  Array.prototype.forEach.call(kssToolbarItemBT, (it) => {
      let bol = hasClass(it,'iconundo');
      if(bol){
        addClass(it,'greaterone');
      }
  })


  me.snapshootList.push(dataURL)
  me.currentImgDom.src = dataURL
}
