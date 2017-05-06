let express = require('express')
let urlencode = require('urlencode');
let request = require('request');
let cheerio = require('cheerio');
let bodyParser = require('body-parser');

let app = express()
app.use(express.static(__dirname +'/css'));
app.use(bodyParser.urlencoded({ extended: true })); 
app.set('view engine', 'jade');
app.set('views', 'html');


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
                num: ++index,
                song : song,
                singer : singer,
                url : 'https://www.youtube.com/results?search_query='+encodedSrchparam
            })
        });
        res.render('index', {
            result: result,
            index: 0,
            totNum: result.length
        });
        // res.redirect('/song/0')
    }, (error)=>{
        res.send('url request Call Erro :::\n'+error);
    });
})

app.get('/song/change', (req,res)=>{
    urlRequest(req.query.url)
    .then(($)=>{
        if(!$) res.send({err:'Error'})
        let href = $('#results ol li ol li a').first().attr('href');
        href = href.replace('/watch?v=','');
        res.send({
            url: href
        });
    }, (error)=>{
        res.send({err:'url request Call Erro :::\n'+error});
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