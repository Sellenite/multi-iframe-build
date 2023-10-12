// 简易版iframe发布订阅通信
(function (global) {
  // 将hub放在内存中，避免篡改
  var typeHub = {}

  var postMessage = function () {
  }

  var isObject = function (value) {
    return Object.prototype.toString.call(value) === '[object Object]'
  }

  // 将订阅加个前缀
  var prefixType = function (v) {
    var TYPE_PREFIX = '__post_message__'
    return TYPE_PREFIX + v
  }

  global.addEventListener('message', (e) => {
    var payload = e.data
    if (!isObject(payload)) {
      return
    }
    if (typeHub[payload.type]) {
      typeHub[payload.type]({
        event: e,
        data: payload.params
      })
    }
  })

  postMessage.prototype.bind = function (type, callback) {
    if (typeHub[prefixType(type)]) {
      return
    }

    typeHub[prefixType(type)] = callback
  }

  postMessage.prototype.send = function (type, source, params = {}) {
    // message会被结构化克隆算法序列化，这里只能传普通对象，不能带Error或Function等
    var payload = {
      type: prefixType(type),
      params: params
    }
    source.postMessage(payload, '*')
  }

  global.pm = new postMessage()
})(window)