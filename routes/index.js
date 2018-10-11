var express = require('express');
var router = express.Router();

var cheerio = require('cheerio');
var superagent = require('superagent');
var async = require('async');
var url = require('url');

var eventproxy = require('eventproxy');
var ep = eventproxy();

var baseUrl = 'http://blog.csdn.net/web/index.html';
var pageUrls = [];
for (var _i = 1; _i < 4; _i++) {
    pageUrls.push(baseUrl + '?&page=' + _i);
}

/* GET home page. */
router.get('/', function(req, res, next) {
    var authorUrls = [];
    ep.after('get_topic_html',pageUrls.length,function (eps) {
        console.log('已爬取完',eps)
    })

    pageUrls.forEach((page)=>{
        superagent.get(page).end((err,result)=>{
            // 常规的错误处理
            if (err) {
                return next(err);
            }
            var $ = cheerio.load(result.text);
            $('.blog_list').each((index,e)=>{
                var u = $('.nickname', e).attr('href');
                if (authorUrls.indexOf(u) === -1) {
                    authorUrls.push(u);
                }
            })
            console.log('get authorUrls successful!\n', authorUrls);
            ep.emit('get_topic_html', 'get authorUrls successful');
        })
    })
});

module.exports = router;
