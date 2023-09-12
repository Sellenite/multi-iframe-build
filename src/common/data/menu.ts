interface ITreeItemProp {
  menuId: string;
  menuName: string;
  parentId?: string;
  url?: string;
}

const flatTreeList: ITreeItemProp[] = [
  {
    menuId: '0',
    menuName: '研发平台',
    parentId: '-1',
    url: ''
  },
  {
    menuId: '1',
    menuName: '菜单一',
    parentId: '0',
    url: ''
  },
  {
    menuId: '1-1',
    menuName: '页面1',
    parentId: '1',
    url: '/menu1/page1'
  },
  {
    menuId: '1-2',
    menuName: '页面2',
    parentId: '1',
    url: '/menu1/page2'
  },
  {
    menuId: '2',
    menuName: '菜单二',
    parentId: '0',
    url: ''
  },
  {
    menuId: '2-1',
    menuName: '页面1',
    parentId: '2',
    url: '/menu2/page2'
  },
  {
    menuId: '2-2',
    menuName: '页面2',
    parentId: '2',
    url: '/menu2/page2'
  },
]

export {
  flatTreeList
}