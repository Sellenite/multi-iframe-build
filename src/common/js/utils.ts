interface ITreeItemProp {
  menuId: string;
  menuName: string;
  parentId: string;
  url: string;
}

interface ITreeItemPropExtend extends ITreeItemProp {
  children: ITreeItemPropExtend[]
}

interface IChildrenOf {
  [key: string]: ITreeItemPropExtend[];
}

interface IMenuProp {
  id: string;
  label: string;
  url: string;
  children: IMenuProp[];
}

interface ITreeProbablyHaveChildren<T> {
  children?: T[]
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
    const _item: ITreeItemPropExtend = { ...item, children: [] }
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
      url: obj.url,
      children: []
    }
    if (obj.children) {
      for (const item of obj.children) {
        node.children && node.children.push(fn(item))
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

const traverseTree = <T extends ITreeProbablyHaveChildren<T>>(tree: Array<T>, callback: (v: T) => void) => {
  const fn = (data: Array<T>) => {
    for (const item of data) {
      callback(item)
      if (item.children && item.children.length) {
        fn(item.children)
      }
    }
  }

  fn(tree)
}

// 生成路径平面结构
const genFileModulesPath = () => {
  const arr: string[] = []
  const files = require.context('@/modules', true, /routes.json/)
  files.keys().forEach(key => {
    const prefixPath = key.replace('routes.json', '').substring(1)
    const routes = files(key).default || files(key)

    for (const routesKey in routes) {
      if (routesKey === '#always') {
        continue
      }
      arr.push(prefixPath + routesKey)
    }
  })

  // 去除/main/index
  const mainIndex = arr.findIndex(v => v === '/main/index')
  if (mainIndex > -1) {
    arr.splice(mainIndex, 1)
  }

  return arr
}

// 生成文件路径树的屏幕结构
const genFileTreeList = (fileModulesPath: string[]) => {
  const ret: ITreeItemProp[] = []

  for (const item of fileModulesPath) {
    const urlSplit = item.substring(1).split('/')
    for (const [index, urlItem] of urlSplit.entries()) {
      if (!ret.find(v => v.menuId === urlItem)) {
        ret.push({
          menuName: urlItem,
          menuId: urlItem,
          parentId: '',
          url: ''
        })
      }

      const current = ret.find(v => v.menuId === urlItem)

      if (current) {
        if (index === urlSplit.length - 1) {
          // 最后位，等于他自己的url
          current.url = item
        }

        if (index !== 0) {
          // parentId等于他上一级
          current.parentId = urlSplit[index - 1]
        } else {
          // 第一级都赋予parentId为0，用于合并成一棵树
          current.parentId = '0'
        }
      }
    }
  }

  ret.unshift({
    menuName: 'System',
    menuId: '0',
    parentId: '-1',
    url: ''
  })

  return ret
}

const genFileMenuTree = () => {
  const fileModulesPath = genFileModulesPath()
  const fileTreeList = genFileTreeList(fileModulesPath)
  const tree = listToTree(fileTreeList)
  const menu = treeToMenu(tree)

  return menu
}

export {
  IMenuProp,
  getRelateNodes,
  traverseTree,
  genFileMenuTree,
}