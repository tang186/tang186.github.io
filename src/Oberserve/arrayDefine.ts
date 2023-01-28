import Dep from "../Dep/Dep";
const arrMethods = [
    'push',
    'pop',
    'shift',
    'unshift',
    'splice',
    'sort',
    'reverse'
]
class ArrayProto {
    arrayProto: object
    constructor(target) {
        this.arrayProto = []
        // 创建一个新的原型，这就是改造之后的数组原型
        const arrayMethods = Object.create(Array.prototype)
        // 创建一个订阅用于监听数组的变化
        let dep = new Dep();
        this.arrayProto["dep"] = dep
        if (target) { dep.addSub(target) }
        // 重新构建Array原型里面的所有方法
        Object.getOwnPropertyNames(Array.prototype).forEach(method => {
            // 如果数组发生arrMethods中的七种变化说明数组m-for需要重新渲染在执行这个函数的同时进行notify进行渲染
            if(typeof arrayMethods[method] === "function" && arrMethods.indexOf(method) !== -1){
                this.arrayProto[method] = function () {
                    return (arrayMethods[method].apply(this, arguments), dep.notify())
                }
            }else{
                this.arrayProto[method] = arrayMethods[method]
            }
        })
    }
}

export default ArrayProto