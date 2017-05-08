let express = require('express')
let urlencode = require('urlencode');
let request = require('request');
let cheerio = require('cheerio');
let bodyParser = require('body-parser');
let mongoose = require('mongoose');
let Chart = require('./Chart');

let app = express()
app.use(express.static(__dirname +'/css'));
app.use(bodyParser.urlencoded({ extended: true })); 
app.set('view engine', 'jade');
app.set('views', 'html');

let db = mongoose.connection;
db.on('error', console.error);
db.once('open', function(){
    // CONNECTED TO MONGODB SERVER
    console.log("Connected to mongod server");
});
mongoose.connect('mongodb://127.0.0.1/chartdb');

function lpadNum(num){
    if(num < 10) return '0'+num
    else return String(num)
}

function getYymmddhh(param){
    let date = param || new Date();
    return date.getFullYear()+
        lpadNum(date.getMonth()+1)+
        lpadNum(date.getDate())+
        lpadNum(date.getHours())
}

app.get('/song', (req, res)=>{
	let yymmddhh= getYymmddhh();
    Chart.find({yymmddhh: yymmddhh},(err,result)=>{
        if(err) console.log('chart find error...', err)

        if(err || !result || result.length === 0){
            console.log(`${yymmddhh} result not exists`)
            getChartByUrlRequest(res);
        }else{
            
            console.log(`${yymmddhh} result exists`)
            res.render('index', {
                result: result,
                index: 0,
                totNum: result.length
            });
        }

    })
})

function getChartByUrlRequest(res){
    Chart.remove({},(err)=>{
        if(err) console.log('chart remove error...',err)

        console.log('date : ', new Date(), 'chart url request.. ')
        urlRequest('http://www.melon.com/chart/')
        .then(($)=>{
            if(!$) res.send('Error')
            let postElements = $('form table .wrap_song_info');
            let result = [];
            let index = 0;
            let yymmddhh = getYymmddhh()

            postElements.each(function(i, obj) {
                let $obj = $(obj);
                let song = $obj.find('.rank01 a').text(), singer = $obj.find('.rank02 a span').first().text();
                let encodedSrchparam = urlencode(song+' '+singer);
                let param = {
                    num: ++index,
                    song : song,
                    singer : singer,
                    url : 'https://www.youtube.com/results?search_query='+encodedSrchparam
                }
                result.push(param)

                let chart = new Chart();
                chart.yymmddhh = yymmddhh;
                chart.num = param.num;
                chart.song = song;
                chart.singer = singer;
                chart.url = param.url;
                chart.videoId = '';
                chart.save((err,result)=>{
                    if(err) console.log('chart insert error...'.err)
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
}

app.post('/song/change', (req,res)=>{
    let body = req.body;
    
    Chart.findOne({yymmddhh:body.yymmddhh, num:body.num},(err,chart)=>{
        if(!err && chart && chart.videoId){
            console.log('date : ', new Date(), 'videoId exists', chart.videoId)
            res.send({url: chart.videoId});
        }else{
            console.log('date : ', new Date(), 'videoId not exists')
            urlRequest(body.url)
            .then(($)=>{
                if(!$) res.send({err:'Error'})
                // let href = $('#results ol li ol li a').first().attr('href');
                let href = $('.yt-lockup-video a').first().attr('href');
                href = href.replace('/watch?v=','');

                if(chart){
                    chart.videoId = href;
                    chart.save((err)=>{
                        if(err) console.log('chart videoId update error...',err)
                    })
                }

                res.send({
                    url: href
                });
            }, (error)=>{
                res.send({err:'url request Call Erro :::\n'+error});
            });
        }
    })

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