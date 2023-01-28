import BaseMVVM from './BaseMVVM';
import Compiler from '../Compiler/compiler'
import ObserverData from '../Oberserve/observer';
import ObserverComputed from '../Computed/observerComputed';
interface vm {
  // 需要进行计算劫持的对象
  $el?: string;
  // 数据
  data?: object;
  // 方法
  methods?: object;
  // 计算属性
  computed?: object;
}
export default class MVVM extends BaseMVVM {
  $el: HTMLElement;
  constructor(options: vm) {
    super()
    this.$el = document.querySelector(options.$el!)!;
    this.$data = options.data;
    this.$methods = options.methods;
    this.$computed = options.computed;
    // 对数据方法和计算属性进行重新代理
    this._proxyData(this.$data!);
    this._proxyMethods(this.$methods!);
    this._proxyComputed(this.$computed!);

    // 劫持计算属性和数据
    new ObserverComputed(this.$computed!, this);
    new ObserverData(this.$data!);
    // 对整个节点进行编译
    new Compiler(this);
  }
  isValidKey(key: string | number | symbol,object: object): key is keyof typeof object {
    return key in object;
  }
  _proxyData(data: object) {
    let that = this;
    Object.keys(data).forEach(function(key: string) {
      Object.defineProperty(that, key, {
        // 数据的代理需要改变set和get
        set(newValue: never) {
          if (that.isValidKey(key, data)) {
            data[key] = newValue;            
          }
        },
        get() {
          if (that.isValidKey(key, data)) {
            return data[key];         
          }
        },
      });
    });
  }

  _proxyMethods(methods: object) {
    if (methods && typeof methods === "object") {
      Object.keys(methods).forEach((key) => {
        // 方法直接进行代理
        if (this.isValidKey(key, methods))
        this[key] = methods[key];
      });
    }
  }

  _proxyComputed(computed: object) {
    let that = this;
    Object.keys(computed).forEach(function(key: string) {
      Object.defineProperty(that, key, {
        // 计算属性不可以直接更改本身需要更改计算的值
        set(newValue) {
          console.log("No writable");
        },
        get() {
          if (that.isValidKey(key, computed)) {
            return computed[key];
          }
        },
      });
    });
  }
}