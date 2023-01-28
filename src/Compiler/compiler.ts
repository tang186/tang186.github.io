import MVVM from '../Core/MVVM'; 
import compiler from './node/compilerFunction';
export default class Compiler{
  // 编译对象
  $el: HTMLElement;
  // 编译的作用域
  $context: MVVM;
  // 空白文档 使得不用直接在页面上修改节点和渲染节点
  $fragment: DocumentFragment;
  constructor(context: MVVM ) {
    this.$el = context.$el;
    this.$context = context;
    this.$fragment = document.createDocumentFragment();
    if (this.$el) {
      // 将目标节点放入空白文档
      this.nodeToFragment(this.$el);
      // 编译目标文档
      compiler(this.$fragment, this.$context);
      // 把文档片段添加到页面中
      this.$el.appendChild(this.$fragment);
    }
  }
  nodeToFragment(node: HTMLElement): void{
    // let fragment = document.createDocumentFragment();
    
    let nodeNew = Array.from(node.childNodes)
    if (nodeNew && nodeNew.length) {
      nodeNew.forEach((child) => {
        // childNodes的类型为只读
        // 判断是不是我们需要添加的节点，排除掉注释和换行, 只留下元素节点和文本节点
        if (!this.ignorable(child)) {
          // 为每一个节点添加一个父节点属性以方便后面的编译
          Object.defineProperty(child, 'par', {
            value: child.parentElement,
          });
          this.$fragment.appendChild(child);
        }
      });
    }
  }

  ignorable(node: ChildNode) {
    var reg = /^[\t\n\r]+/;
    // 排除掉注释和换行
    return (
      node.nodeType === 8 || (node.nodeType === 3 && reg.test(node.textContent!))
    );
  }

} 