import { css, remove, typeChecking } from '../../common/util'
import drawMiddleImage from '../middleImage/drawMiddleImage'
import copy from '../copy'
import download from '../download'
import endAndClear from '../endAndClear'
import language from '../../common/language'

export default function saveImage(me) {
    let completeBT = document.createElement('span')
    completeBT.id = 'kssSaveImageBT'
    completeBT.className = 'iconfont icondownload kssToolbarItemBT'

    let lan = language()
    if (lan === 'zh') {
        completeBT.title = '保存'
    } else {
        completeBT.title = 'Save'
    }

    completeBT.addEventListener('click', async function() {
        const lastShot = me.snapshootList[me.snapshootList.length - 1]
        copy(me, lastShot)
        await download(me)
        typeChecking(me.download) === '[object Function]' && me.download.call(me, lastShot)
        endAndClear(me)
    })

    return completeBT
}