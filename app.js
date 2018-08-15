let express = require('express');
let urlencode = require('urlencode');
let request = require('request');
let cheerio = require('cheerio');
let bodyParser = require('body-parser');
let mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
let Chart = require('./model/Chart');
let Count = require('./model/Count');

let app = express()
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(bodyParser.json());

/* original */
app.set('view engine', 'ejs')
app.use(express.static(__dirname +'/static'));
// app.set('views', 'html');
app.set('views', 'vue');

/* react 
let path = require('path')
app.set('views', path.join(__dirname, 'build'));
*/
// app.use(express.static(__dirname +'/build'));
// app.engine('html', require('ejs').renderFile);
// app.set('view engine', 'html')
// app.set('views', 'build');

//routing
let message = require('./router/message')(express);
app.use('/song/message',message);

//passport
app.use('/song/passport',require('./router/passport')(express));

// socket.io
let server = require('http').createServer()
let io = require('socket.io')(server)
require('./socket.io/message')(io.sockets)
io.listen(3001)

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
function getYymmdd(param){
    let date = param || new Date();
    return date.getFullYear()+
        lpadNum(date.getMonth()+1)+
        lpadNum(date.getDate())
}

app.get('/', (req, res)=>{
    return res.redirect('/song');
})

app.get('/song', (req, res)=>{
    res.render('index')
})

app.get('/song/list', (req, res)=>{
	let yymmddhh= getYymmddhh();
    Chart.find({yymmddhh: yymmddhh},null,{sort: {num: 1}},(err,result)=>{
        if(err) console.log('chart find error...', err)

        if(err || !result || result.length === 0){
            console.log(`${yymmddhh} result not exists`)
            getChartByUrlRequest(res);
        }else{
            
            // getChartByUrlRequest(res);
            console.log(`${yymmddhh} result exists`)
            
            //prevent dup data(temp)
            let filteredResult = [];
            let tempIndex = -1;
            let totNum = Math.min(result.length, 100)
            for (let i = 0; i < totNum; i++) {
                let element = result[i];
                if(element.num == tempIndex) continue;
                tempIndex = element.num;
                filteredResult.push(element);
            }
            
            res.send({
                result: filteredResult,
                index: 0,
                totNum: totNum,
                yymmddhh: yymmddhh
            });
        }

    })
})

function getChartByUrlRequest(res){

    let yymmddhh = getYymmddhh()
    console.log(yymmddhh, 'chart url request.. ')
    urlRequest('http://www.melon.com/chart/')
    .then(($)=>{
        if(!$) res.send('Error')
        // let postElements = $('form table .wrap_song_info');
        let postElements = $('table tr[class^="lst"]');
        let result = [];
        let index = 0;
        let reg = new RegExp('\\(.*?\\)','g')
        if(postElements.length > 0){
            postElements.each(function(i, obj) {
                let $obj = $(obj);
                let song = $obj.find('.rank01 a').text(), singer = $obj.find('.rank02 a').eq(0).text();

                let encodedSrchparam = urlencode(song.replace(reg,'')+' '+singer.replace(reg,''));
                let param = {
                    yymmddhh: yymmddhh,
                    num: ++index,
                    song : song,
                    singer : singer,
                    url : 'https://www.youtube.com/results?search_query='+encodedSrchparam,
                    videoId: '',
                    srch : song.replace(reg,'')+' '+singer.replace(reg,'')
                }
                result.push(param)
            });
            Chart.remove({yymmddhh:yymmddhh}).then(()=>Chart.insertMany(result))
            
            res.send({
                result: result,
                index: 0,
                totNum: result.length,
                yymmddhh: yymmddhh
            });
        }else{
            Chart.find({},null,{sort: {num: 1}},(err,chart)=>{
                result = chart;
                yymmddhh = chart[0].yymmddhh;
                res.send({
                    result: result,
                    index: 0,
                    totNum: result.length,
                    yymmddhh: yymmddhh
                });
            })  
        }

    }, (error)=>{
        res.send('url request Call Erro :::\n'+error);
    });
}

app.get('/song/change', (req,res)=>{
    let param = req.query
    ,paramYymmddhh = param.yymmddhh
    ,paramNum = param.num
    
    Chart.findOne({yymmddhh:paramYymmddhh, num:paramNum},(err,chart)=>{
        if(!err && chart && chart.videoId){
            console.log(paramYymmddhh, ' ', paramNum, ' videoId exists', chart.videoId)
            res.send({url: chart.videoId});
        }else{
            console.log(paramYymmddhh, ' ', paramNum, ' videoId not exists')
            if(chart){
                urlRequest(chart.url)
                .then(($)=>{
                    if(!$) res.send({err:'Error'})
                    // let href = $('#results ol li ol li a').first().attr('href');
                    let $tag = $('.yt-lockup-video a')
                    let tagLoop = 0, href='';
                    let passedHref = []
                    let videoTime = ''
                    loop:
                    while(tagLoop < 15){
                        let $targetTag = $tag.eq(tagLoop++)
                        href = $targetTag.attr('href')
                        videoTime = $targetTag.find('.video-time').html()
                        if (href && href.length < 30 && href.indexOf('/watch?v=') != -1){
                            if(!passedHref.includes(href)) passedHref.push(href)
                            else continue loop;

                            if(videoTime){
                                let timeArr = videoTime.split(':')
                                if(timeArr.length !== 2) continue loop; // over 1hour continue
                                else if(timeArr[0] >= 10) continue loop; // over 10 minuites continue
                            }
                            break loop;
                        }
                    }

		            href = href.replace('/watch?v=','');
			
                    chart.videoId = href;
                    chart.videoTime = videoTime;
                    chart.save((err)=>{if(err) console.log('chart videoId update error...',err)})
                    res.send({url: href, videoTime: videoTime});

                }, (error)=>{res.send({err:'url request Call Error :::\n'+error});});
            }else res.send({err:'change error ... chart is not ready'});
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
  console.log('app listening on port 3000!!')
})
