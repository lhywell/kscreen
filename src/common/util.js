export function css(dom, obj) {
    for (let i in obj) {
        dom.style[i] = obj[i]
    }
}

export function remove(dom) {
    if (dom instanceof HTMLElement) {
        dom.parentNode.removeChild(dom)
    } else if (dom instanceof HTMLCollection) {
        Array.prototype.forEach.call(dom, function(obj) {
            obj.parentNode.removeChild(obj)
        })
    }
}


export function hasClass(obj, cls) {
    return obj.classList.contains(cls);
}

export function addClass(obj, cls) {
    obj.classList.add(cls);
}

export function removeClass(obj, cls) {
    obj.classList.remove(cls);
}

export function computed(obj, baseProperty, changeProperty, cb) {
    Object.defineProperty(obj, baseProperty, {
        set: function(val) {
            changeProperty.forEach((it, index) => {
                cb[index](obj, val, changeProperty[index])
            })
        }
    })
}

export function typeChecking(val) {
    return Object.prototype.toString.call(val)
}

export function base64ToBlob({ b64data = '', contentType = '', sliceSize = 512, fileTitle = '' } = {}) {
    // 使用 atob() 方法将数据解码
    let byteCharacters = atob(b64data);
    let byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        let slice = byteCharacters.slice(offset, offset + sliceSize);
        let byteNumbers = [];
        for (let i = 0; i < slice.length; i++) {
            byteNumbers.push(slice.charCodeAt(i));
        }
        // 8 位无符号整数值的类型化数组。内容将初始化为 0。
        // 如果无法分配请求数目的字节，则将引发异常。
        byteArrays.push(new Uint8Array(byteNumbers));
    }
    let result = new Blob(byteArrays, {
        type: contentType
    })
    result = Object.assign(result, {
        // 这里一定要处理一下 URL.createObjectURL
        preview: URL.createObjectURL(result),
        name: fileTitle + `.png`
    });
    return result;
}