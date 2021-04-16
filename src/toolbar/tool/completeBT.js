import { css, remove, typeChecking } from '../../util'
import drawMiddleImage from '../middleImage/drawMiddleImage'
import copy from '../copy'
import download from '../download'
import endAndClear from '../endAndClear'

export default function completeBT (me) {
    let completeBT = document.createElement('span')
    completeBT.id = 'kssCompleteBT'
    completeBT.className = 'iconfont iconcheck kssToolbarItemBT'
    completeBT.title = '完成截图'

    completeBT.addEventListener('click', async function () {
        me.isEdit = true
        
        const lastShot = me.snapshootList[me.snapshootList.length - 1]
        copy(me, lastShot)
        me.needDownload === true && (await download(me))
        typeChecking(me.endCB) === '[object Function]' && me.endCB(lastShot)
        endAndClear(me)
    })

    return completeBT
}