interface ITreeItemProp {
  menuId: string;
  menuName: string;
  parentId?: string;
  url?: string;
}

interface ITreeItemPropExtend extends ITreeItemProp {
  children?: ITreeItemPropExtend[]
}

interface IChildrenOf {
  [key: string]: ITreeItemProp[];
}

interface IMenuProp {
  id: string;
  label: string;
  url?: string;
  children?: IMenuProp[];
}

const listToTree = (arr: ITreeItemProp[]) => {
  const rootValue = '-1'

  const tree = [] // 最终返回的树
  const childrenOf: IChildrenOf = {} // 存放的子树
  let menuId
  let parentId

  for (const item of arr) {
    if (item.parentId && !childrenOf[item.parentId]) {
      childrenOf[item.parentId] = []
    }
  }

  for (const item of arr) {
    menuId = item.menuId
    parentId = item.parentId || rootValue
    const _item: ITreeItemPropExtend = { ...item }
    if (childrenOf[menuId]) {
      _item.children = childrenOf[menuId]
    }

    if (parentId === rootValue) {
      // 顶层节点
      tree.push(_item)
    } else {
      // 插入到父节点的childrenOf
      childrenOf[parentId].push(_item)
    }
  }

  return tree
}

// 递归树结构，返回全身组装的树，对象结构不同，不改变原树属性
const treeToMenu = (tree: ITreeItemPropExtend[]) => {
  const ret = []

  const fn = (obj: ITreeItemPropExtend) => {
    const node: IMenuProp = {
      id: obj.menuId,
      label: obj.menuName,
      url: obj.url
    }
    if (obj.children) {
      node.children = []
      for (const item of obj.children) {
        node.children.push(fn(item))
      }
    }
    return node
  }

  for (const item of tree) {
    ret.push(fn(item))
  }

  return ret
}

const getRelateNodes = (targetId: string, key: string, data: IMenuProp[]) => {
  let relateNodes: IMenuProp[] = []
  const _getRelateNodes = (his: IMenuProp[], targetId: string, tree: IMenuProp[]) => {
    for (const item of tree) {
      // key as keyof typeof item，断言item里面一定有key这个key
      if (item[key as keyof typeof item] === targetId) {
        // 如果只要返回父元素们，就写成relateNodes = his
        relateNodes = [...his, item]
        return true
      } else if (item.children) {
        const history = [...his]
        history.push(item)
        // 终止递归条件
        if (_getRelateNodes(history, targetId, item.children)) {
          break
        }
      }
    }
  }
  _getRelateNodes([], targetId, data)

  return relateNodes
}

export {
  listToTree,
  treeToMenu,
  getRelateNodes,
}