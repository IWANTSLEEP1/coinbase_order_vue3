/**
 * @description 项目简体中文配置
 * @author hu-snail 1217437592@qq.com
 */

export default {
  route: {
    home: '首页',
    user: '用户管理',
    role: '角色管理',
    userPage: '用户界面',
    errorPages: '错误页面',
    page401: '401',
    page404: '404',
  },
  navbar: {
    logOut: '退出登录',
    theme: '切换换肤',
    full: '全屏',
    noFull: '退出全屏',
    refresh: '刷新',
    fold: '收起',
    unfold: '展开',
    size: '布局大小',
    profile: '个人中心',
    editPwd: '修改密码',
    oldPwd: '请输入原密码',
    pwd: '请输入要修改的密码',
    pwd_agin: '请确认密码',
    pwd_match_error: '两次密码不匹配，请重新输入',
    pwdFormat: '密码过于简单(至少8个字符,至少1个字母,1个数字和1个特殊字符)',
  },
  login: {
    title: '登录',
    rules: {
      username: '请输入用户名',
      password: '请输入密码',
      captcha: '请输入验证码',
    },
    captcha: '请输入验证码',
    loginBtn: '登录',
    desc: 'orderapi admin订单管理系统',
    tip: '点击登录订单管理系统',
    username: '账号',
    password: '密码',
    thirdparty: '第三方登录',
  },
  user: {
    rules: {
      username: '请输入用户名',
      password: '请输入密码',
      email: '请输入邮箱',
      mobile: '请输入手机号码',
      is_robot: '请选择是否是机器人',
      is_superuser: '请选择是否是管理员',
      emailFormat: '邮箱格式不正确',
      mobileFormat: '手机号码格式不正确',
      role: '请选择职位',
    },
    roleName: '请输入角色名称',
    desc: '请输入角色描述',
    delete: '请确认是否要删除该用户信息，删除后不可恢复！',
    delRole: '请确认是否要删除该角色信息，删除后不可恢复！',
  },

  theme: {
    change: '纵向',
    documentation: '换肤文档',
    tips: 'Tips: 它区别于 navbar 上的 theme-pick, 是两种不同的换肤方法，各自有不同的应用场景，具体请参考文档。',
    loading: '主题正在努力重置...',
    options: {
      theme1: '蓝白',
      theme2: '蓝黑',
      theme3: '绿白',
      theme4: '绿黑',
      theme5: '红白',
      theme6: '红黑',
    },
  },
  tagsView: {
    refresh: '重新加载',
    closeLeft: '关闭左侧',
    closeRight: '关闭右侧',
    closeOthers: '关闭其它',
    closeAll: '关闭所有',
  },
  settings: {
    title: '主题设置',
    layout: '布局',
    theme: '主题',
    menuBg: '菜单主题',
    logo: 'Logo',
    tag: '标签',
    breadcurmb: '面包导航',
    fixed: '固定头部',
    fullscreen: '全屏',
    refresh: '刷新',
    notice: '通知',
    defaultBtn: '恢复默认',
    saveBtn: '保存',
  },
  layout: {
    vertical: '纵向',
    horizontal: '横向',
  },
  sayHi: {
    early: '早上好',
    morning: '上午好',
    noon: '中午好',
    afternoon: '下午好',
    evening: '晚上好',
  },
  notice: {
    msg: '欢迎登录',
  },
  tabs: {
    notice: '通知',
    message: '消息',
    email: '邮件',
  },
  indexPage: {
    descTitle: '开始您一天的工作吧！',
    resourceTitle: 'Vue3相关资源推荐',
    orderTitle: '订单清单',
    order: {
      planned: '计划订单',
      finished: '已完成订单',
      unfinished: '未完成订单',
    },
    skillTitle: '技能列表',
    envTitle: '生产环境依赖信息',
    chartTitle: '基础平滑折线图',
  },
  errorPages: {
    title: '抱歉!',
    btn: '返回首页',
    404: {
      desc: '当前页面不存在...',
      remark: '请检查您输入的网址是否正确，或点击下面的按钮返回首页',
    },
    401: {
      desc: '你没有权限去该页面...',
      remark: '请联系管理员，或点击下面的按钮返回首页',
    },
  },
  confirm: {
    title: '操作提示',
    msg: '您确定要退出',
  },
  btn: {
    confirm: '确定',
    cancel: '取消',
  },
};
