let express = require('express')
let urlencode = require('urlencode');
let request = require('request');
let cheerio = require('cheerio');

let app = express()
app.use(express.static(__dirname +'/css'));
app.set('view engine', 'jade');
app.set('views', 'html')

let songList = [];

app.get('/song', (req, res)=>{
	urlRequest('http://www.melon.com/chart/')
    .then(($)=>{
        if(!$) res.send('Error')
        let postElements = $('form table .wrap_song_info');
        let result = [];
        let index = 0;
        postElements.each(function(i, obj) {
            let $obj = $(obj);
            let song = $obj.find('.rank01 a').text(), singer = $obj.find('.rank02 a span').first().text();
            let encodedSrchparam = urlencode(song+' '+singer);
            result.push({
                num: index++,
                song : song,
                singer : singer,
                url : 'https://www.youtube.com/results?search_query='+encodedSrchparam
            })
        });
        songList = result;
        // res.render('index', {
        //     result: songList
        // });
        res.redirect('/song/0')
    }, (error)=>{
        res.send('url request Call Erro :::\n'+error);
    });
})

app.get('/song/:index', (req,res)=>{
    let index = req.params.index;
    // console.log('params...', req.query)
    if(!index) return;
    if(!songList[index]) res.redirect('/song/')
    for (let i = 0, len = songList.length; i < len; i++) {
        if(i == index) songList[i].class = 'success'
        else songList[i].class = ''
    }
    // console.log('comecomecomecome ::', songList[index], index)
    urlRequest(songList[index].url)
    .then(($)=>{
        if(!$) res.send('Error')
        let href = $('#results ol li ol li a').first().attr('href');
        href = href.replace('/watch?v=','');
        res.render('index', {
            result: songList, 
            url: href,
            index: index,
            totNum: songList.length,
            loop: req.query.loop
        });
    }, (error)=>{
        res.send('url request Call Erro :::\n'+error);
    });
})

let urlRequest = function (param) {
	return new Promise(function (resolve, reject) {
		let url = param;
        request(url, function (error, response, body) {
            try {
                if (error) reject('Unexpected Error :::');
                let $ = cheerio.load(body);
                resolve($);
                
            } catch(e) {
                resolve();
                console.log('request Error :::', e);
            }
        })
	});
};

app.listen(3000, function () {
  console.log('app listening on port 3000!')
})