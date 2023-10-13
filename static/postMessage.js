// iframe发布订阅通信
!(function (context, global, fn) {
  typeof exports === 'object' && typeof module === 'object'
    ? (module.exports = fn(global))
    : typeof exports === 'object'
      ? (exports.pm = fn(global))
      : (context.pm = fn(global))
})(this, window, function (global) {
  // 将hub放在内存中，避免篡改
  var typeHub = {}

  var postmessage = function () {
    this.version = '1.0'
  }

  // 判断是否对象
  var isObject = function (value) {
    return Object.prototype.toString.call(value) === '[object Object]'
  }

  // 设置私有变量，表面其他有相同的type传入导致出现问题
  var prefix = function (v) {
    var TYPE_PREFIX = '__postmessage__'
    return TYPE_PREFIX + v
  }

  postmessage.prototype.bind = function (type, callback) {
    if (typeHub[prefix(type)] || typeof callback !== 'function') {
      return
    }

    typeHub[prefix(type)] = callback
  }

  postmessage.prototype.unbind = function (type) {
    if (typeHub[prefix(type)]) {
      delete typeHub[prefix(type)]
    }
  }

  postmessage.prototype.send = function (type, source, data = {}) {
    // message会被结构化克隆算法序列化，这里只能传普通对象，不能带Error或Function等
    if (!isObject(data)) {
      // 限制统一传值格式
      console.warn(`send ${type}: data must be an object`)
      return
    }
    var params = {
      type: prefix(type),
      data: data
    }
    source.postMessage(params, '*')
  }

  global.addEventListener('message', (event) => {
    // 需要更安全的话这里再判断下event的source，相当于发送方的window，例如判断下url是否与自己有相同的host
    var data = event.data
    if (typeHub[data.type]) {
      typeHub[data.type]({
        event: event,
        data: data.data
      })
    }
  })

  return new postmessage()
})








