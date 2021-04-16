import { css, remove, typeChecking } from '../../util'
import drawMiddleImage from '../middleImage/drawMiddleImage'
import copy from '../copy'
import download from '../download'
import endAndClear from '../endAndClear'
import language from '../../common/language'

export default function completeBT (me) {
    let completeBT = document.createElement('span')
    completeBT.id = 'kssCompleteBT'
    completeBT.className = 'iconfont iconcheck kssToolbarItemBT'
    
    let lan = language()
    if(lan === 'zh'){
        completeBT.title = '完成截图'
    }else{
        completeBT.title = 'Finish'
    }
    
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