'use strict';

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _koa = require('koa');

var _koa2 = _interopRequireDefault(_koa);

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, "next"); var callThrow = step.bind(null, "throw"); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

var requestAsync = function requestAsync(opt) {
  return new Promise(function (resolve, reject) {
    (0, _request2.default)(opt, function (err, res, body) {
      if (err) return reject(err);

      resolve(body);
    });
  });
};

var app = new _koa2.default();

app.use((function () {
  var ref = _asyncToGenerator(function* (ctx) {
    var targetUrl = decodeURIComponent(ctx.query.target);

    var urlInfo = _url2.default.parse(targetUrl);

    if (urlInfo.hostname === 'm.tb.cn' || urlInfo.host === 'b.mashort.cn') {
      var body = yield requestAsync(targetUrl);
      var location = body.match(/<input type="hidden" id="J_Url" value=\'(.*)\'>/);
      if (location) location = location[1];
      location = body.match(/var url = '(.*)';\r\n/);
      if (location) location = location[1];
      urlInfo = _url2.default.parse(location, true);
    }

    if (urlInfo.host === 'b.mashort.cn') {
      var _body = yield requestAsync(targetUrl);
      location = _body.match(/var url = '(.*)';\r\n/);
      targetUrl = _body.match(/id="J_Url" value='(.*)'/)[1];
      urlInfo = _url2.default.parse(targetUrl, true);
    }

    if (urlInfo.pathname === '/scan/transit-sms.html') {
      targetUrl = unescape(urlInfo.query.url);
      urlInfo = _url2.default.parse(targetUrl, true);
    }

    if (urlInfo.hostname === 'tb.cn') {
      var _location = (yield requestAsync(targetUrl)).headers.location;
      urlInfo = _url2.default.parse(_location, true);
    }

    var source_id = urlInfo.query.id;

    if (urlInfo.hostname === 'a.m.taobao.com' && /^\/i(\d+)/i.test(urlInfo.pathname)) {
      source_id = urlInfo.pathname.match(/^\/i(\d+)/i)[1];
    }

    ctx.body = {
      id: source_id
    };
  });

  return function (_x) {
    return ref.apply(this, arguments);
  };
})());

app.listen(parseInt(process.env.PORT) || 80);