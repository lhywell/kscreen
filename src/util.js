export function css (dom, obj) {
    for (let i in obj) {
        dom.style[i] = obj[i]
    }
}

export function remove(dom) {
    if (dom instanceof HTMLElement) {
        dom.parentNode.removeChild(dom)
    } else if (dom instanceof HTMLCollection) {
        Array.prototype.forEach.call(dom, function (obj) {
            obj.parentNode.removeChild(obj)
        })
    }
}

export function domType(dom) {
    return Object.prototype.toString.call(dom)
}

export function hasClass (obj, cls) {
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
            set: function (val) {
                changeProperty.forEach((it, index) => {
                    cb[index](obj, val, changeProperty[index])
                })
            }
        })
}

export function typeChecking (val) {
    return Object.prototype.toString.call(val)
}