import { css } from '../../util'
import img from '../../assets/imgs/color.png'

export default function colorBT (me) {
    let colorBT = document.createElement('span')
    colorBT.id = 'kssColorBT'
    colorBT.className = 'iconfont iconpalette kssToolbarItemBT'
    colorBT.title = '颜色工具'

    colorBT.addEventListener('click', function () {
        let clientHeight = document.documentElement.clientHeight
        let colorBoard = document.getElementById('kssColorBoard')
        let bottomSurplus = clientHeight - me.startY - me.height - me.toolbarMarginTop - me.toolbarHeight

        if (bottomSurplus < 0) {
            css(colorBoard, {
                top: '30px',
            })
        } else {
            css(colorBoard, {
                top: '-40px',
            })
        }

        colorBoard.style.display = 'block'
        colorBoard.focus()
    })

    return colorBT
}