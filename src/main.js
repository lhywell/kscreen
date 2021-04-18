// import {a} from './toolbar.js'
import html2canvas from './lib/html2canvas.min.js'
import { css, remove, addClass, typeChecking, base64ToBlob } from './common/util'
import createDragDom from './common/createDragDom.js'
import backRightClient from './common/backRightClient'
import createToolbar from './toolbar/toolbar.js'
import drawMiddleImage from './toolbar/middleImage/drawMiddleImage'
import clearMiddleImage from './toolbar/middleImage/clearMiddleImage'
import endAndClear from './toolbar/endAndClear'
import toolbarPosition from './toolbar/toolbarPosition'
// import cursorImg from './assets/imgs/cursor.ico'
import './styles/fonts/iconfont.css'
import './styles/css/kscreen.scss'

function initLineWidth(initLine) {
    if (isNaN(initLine)) {
        return 10
    } else {
        if (initLine > 10) {
            return 10
        } else if (initLine < 1) {
            return 1
        } else {
            return initLine
        }
    }
}

export default class kscreen {
    constructor(options) {
        this.kss = null
        this.style = null
        this.kssScreenShotWrapper = null
        this.kssTextLayer = null
        this.rectangleCanvas = null
        this.toolbar = null
        this.scale = window.devicePixelRatio || 1
        //存储当前快照的元素
        this.currentImgDom = null
        //截图状态
        this.isScreenshot = false
        //快照组
        this.snapshootList = []
        /*
         * 1: 点下左键，开始状态
         * 2: 鼠标移动，进行状态
         * 3: 放开左键，结束状态
         * */
        this.drawingStatus = null
        this.currentToolType = null
        this.imgBase64 = null
        this.isEdit = false
        this.startX = null
        this.startY = null
        this.width = null
        this.height = null
        this.dotSize = 5
        this.lineSize = 2
        //工具显示状态
        this.toolShow = options.toolShow
        //工具栏样式
        this.toolbarWidth = null
        this.toolbarHeight = 40
        this.toolbarMarginTop = 10
        this.toolbarColor = '#fb3838'
        this.toolbarLineWidth = typeChecking(options.toolShow) === '[object Object]' ? initLineWidth(options.toolShow.drawLine) : 10


        //工具栏事件
        this.toolmousedown = null
        this.toolmousemove = null
        this.toolmouseup = null

        //根据base64获取绝对地址
        this.copyPath = options.copyPath

        //保存回调
        this.download = options.download
        //成功回调
        this.endCB = options.endCB
        //撤销回调
        this.cancelCB = options.cancelCB

        this.drawing = (e) => {
            const that = this
            that.drawingStatus = 2

            let client = backRightClient(e)
            let clientX = client[0]
            let clientY = client[1]

            css(that.kssScreenShotWrapper, {
                height: Math.abs(clientY - that.startY) + 'px',
                width: Math.abs(clientX - that.startX) + 'px',
                top: Math.min(that.startY, clientY) + 'px',
                left: Math.min(that.startX, clientX) + 'px'
            })
        }

        this.endDraw = (e) => {
            if (e.button !== 0) {
                return
            }
            const that = this
            that.drawingStatus = 3

            if (that.startX === e.clientX && that.startY === e.clientY) {
                let clientHeight = document.documentElement.clientHeight
                let clientWidth = document.documentElement.clientWidth
                that.startX = 2
                that.startY = 2
                that.height = clientHeight - 4
                that.width = clientWidth - 4
                css(that.kssScreenShotWrapper, {
                    height: that.height + 'px',
                    width: that.width + 'px',
                    top: that.startY + 'px',
                    left: that.startX + 'px'
                })
            } else {
                let client = backRightClient(e)
                let clientX = client[0]
                let clientY = client[1]

                that.width = Math.abs(clientX - that.startX)
                that.height = Math.abs(clientY - that.startY)
                that.startX = Math.min(that.startX, clientX)
                that.startY = Math.min(that.startY, clientY)
            }
            document.removeEventListener('mousemove', that.drawing)

            // 画版
            let canvas = document.createElement('canvas')
            canvas.id = 'kssRectangleCanvas'

            that.kssScreenShotWrapper.appendChild(canvas)
            that.rectangleCanvas = canvas
            canvas.addEventListener('mousedown', function(event) {
                if (that.isEdit || event.button === 2) {
                    return
                }
                clearMiddleImage(that)
                let startX = event.clientX
                let startY = event.clientY
                document.addEventListener('mousemove', canvasMoveEvent)
                document.addEventListener('mouseup', canvasUpEvent)
                //最后左上角的top和left
                let top
                let left

                function canvasMoveEvent(e) {
                    let clientHeight = document.documentElement.clientHeight
                    let clientWidth = document.documentElement.clientWidth

                    top = that.startY + e.clientY - startY

                    if (that.startY + e.clientY - startY + that.height > clientHeight) {
                        top = clientHeight - that.height
                    }

                    if (that.startY + e.clientY - startY < 0) {
                        top = 0
                    }

                    left = that.startX + e.clientX - startX

                    if (that.startX + e.clientX - startX + that.width > clientWidth) {
                        left = clientWidth - that.width
                    }

                    if (that.startX + e.clientX - startX < 0) {
                        left = 0
                    }

                    css(that.kssScreenShotWrapper, {
                        top: top + 'px',
                        left: left + 'px'
                    })
                    toolbarPosition(that, that.width, that.height, top, left, that.toolbar)
                }

                function canvasUpEvent(e) {
                    if (top === undefined) {
                        top = that.startY
                    }

                    if (left === undefined) {
                        left = that.startX
                    }
                    that.startY = top
                    that.startX = left
                    document.removeEventListener('mousemove', canvasMoveEvent)
                    document.removeEventListener('mouseup', canvasUpEvent)
                    drawMiddleImage(that)
                }
            })
            that.kss.removeEventListener('mousedown', that.startDrawDown)
            that.kss.removeEventListener('mouseup', that.drawDownComplete)
            document.removeEventListener('mouseup', that.endDraw)

            createDragDom(
                that.kssScreenShotWrapper,
                that.dotSize,
                that.lineSize,
                that
            )
            let img = document.createElement('img')
            img.id = 'kssCurrentImgDom'

            that.kssScreenShotWrapper.appendChild(img)
            that.currentImgDom = img
            drawMiddleImage(that)
            that.toolbar = createToolbar(that)
        }



        this.init(options.key, options.immediately)

    }

    init(key, immediately) {

        if (immediately === true) {
            this.start()
            this.end()
        }

        if (key === undefined) {
            key = 65
        } else if (key === null) {
            return
        }

        document.addEventListener('keydown', this.isRightKey.bind(this, key))

    }
    startScreenShot() {
        if (!this.isScreenshot) {
            this.start()
            this.end()
        }
    }
    endScreenShot() {
        endAndClear(this)
    }
    isRightKey(key, e) {
        if (e.keyCode === key && e.shiftKey && !this.isScreenshot) {
            this.start()
            this.end()
        }
    }
    start() {
        if (this.isScreenshot) {
            return
        }
        this.isScreenshot = true
        html2canvas(document.body, { useCORS: true, scrollY: 200 })
            .then((canvas) => {
                // 遮罩
                this.kss = canvas
                canvas.id = 'kss'
                this.scrollTop = document.documentElement.scrollTop

                document.body.appendChild(canvas)

                addClass(document.body, 'kssBody')
                css(canvas, {
                    top: `-${this.scrollTop}px`
                })

                canvas.addEventListener('mousedown', this.startDrawDown.bind(this))
                canvas.addEventListener('mouseup', this.drawDownComplete)
            })
    }
    end() {
        this.endScreenShot = (e) => {
            // 按key: "Escape"
            if (e.keyCode === 27) {
                endAndClear(this)
                this.cancelCB && this.cancelCB.call(this)
            }
        }

        this.cancelDrawingStatus = (e) => {
            // 按鼠标右键
            if (e.button === 2) {
                endAndClear(this)
                this.cancelCB && this.cancelCB.call(this)
            }
        }

        this.preventContextMenu = (e) => {
            e.preventDefault()
        }

        document.addEventListener('keydown', this.endScreenShot)
        document.addEventListener('mouseup', this.cancelDrawingStatus)
        document.addEventListener('contextmenu', this.preventContextMenu)
    }
    startDrawDown(e) {
        //当不是鼠标左键时立即返回
        if (e.button !== 0) {
            return
        }

        if (this.drawingStatus !== null) {
            return
        }
        this.drawingStatus = 1

        this.startX = e.clientX
        this.startY = e.clientY

        //移除并添加dom
        remove(document.getElementById('kssScreenShotWrapper'))
        let kssScreenShotWrapper = document.createElement('div')
        kssScreenShotWrapper.id = 'kssScreenShotWrapper'
        this.kssScreenShotWrapper = kssScreenShotWrapper
        let kssTextLayer = document.createElement('div')
        kssTextLayer.id = 'kssTextLayer'
        this.kssTextLayer = kssTextLayer

        kssScreenShotWrapper.appendChild(kssTextLayer)
        document.body.appendChild(kssScreenShotWrapper)

        document.addEventListener('mousemove', this.drawing)
        document.addEventListener('mouseup', this.endDraw)
    }
    drawDownComplete() {
        let kssBody = document.querySelector('.kssBody')
        kssBody.style.cursor = 'auto';
    }
    copyClipboard(base64Image, fileTitle) {
        let base64 = base64Image.split(',')[1];

        let result = base64ToBlob({ b64data: base64, contentType: 'image/png', sliceSize: 512, fileTitle: '' })
        // 转后后的blob对象
        try {
            // https://w3c.github.io/clipboard-apis/
            let clipboard = navigator.clipboard;
            if (clipboard == undefined) {
                console.log('clipboard is undefined');
            } else {
                let data = [new ClipboardItem({
                    [result.type]: result
                })];

                navigator.clipboard.write(data).then(function() {
                    console.log("添加到剪贴板成功");
                }, function() {
                    console.error("添加到剪贴板失败");
                });
            }

            return result;

        } catch (error) {
            console.error(error);
        }
    }
}