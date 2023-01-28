import MVVM from "./Core/MVVM";
import "./style/index.less"

const vm = new MVVM({
  $el: '#root',
  data: {
    activeIndex: 0,
    tabList: ['双向绑定', '计算属性', '条件渲染', '循环/事件'],
    // 双绑
    person: {
      name: '小林绿子',
      age: 12,
      sex: '女'
    },

    // m-if
    showText: false,

    // m-for
    forTable: ["1x1=1", "2x2=4", "3x3=9", "4x4=16", "5x5=25", "6x6=36", "7x7=49", "8x8=64", "9x9=81"],

  },
  computed: {
    // 计算属性
    computedDescription() {
      return `${(this as any).person.name}的年龄是${(this as any).person.age}，然后是个${(this as any).person.sex}的`;
    },
  },
  methods: {
    // 改变showText以改变m-if的变化
    showTextChange: function () {
      if ((this as any).showText) { (this as any).showText = false }
      else { (this as any).showText = true }
    },

    // 改变不同栏块的显示
    active: function (index) {
      // (this as any).activeIndex = index,
      //   e.target.parentElement.parentElement.childNodes.forEach(child => {
      //     child.classList.remove("active")
      //   })
      // e.target.parentElement.classList.add("active");
      (this as any).activeIndex = index 
    },
    // 未每一个循环出来的表达式添加函数
    initForTable: function (s) {
      alert(s)
    },
    init: function() {
      console.log("1111111");
      
    }
  },
});
window['vm'] = vm;