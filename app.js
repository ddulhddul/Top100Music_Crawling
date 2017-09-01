let express = require('express');
let urlencode = require('urlencode');
let request = require('request');
let cheerio = require('cheerio');
let bodyParser = require('body-parser');
let mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
let Chart = require('./Chart');
let Count = require('./Count');

let app = express()
app.use(express.static(__dirname +'/static'));
app.use(bodyParser.urlencoded({ extended: true })); 
app.set('view engine', 'jade');
app.set('views', 'html');

//routing
let message = require('./router/message')(express);
app.use('/song/message',message);

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

function newCountSave(yymmdd, ip){
    let countSch = new Count();
    countSch.yymmdd = yymmdd;
    countSch.cnt = 1;
    if(ip) countSch.ip = [ip];
    countSch.save((err,result)=>{
        if(err) console.log(`new ${yymmdd} save error...`,err)
    })
}

app.get('/song/count', (req, res)=>{
    try {
        // let ip = req.headers['x-forwarded-for'] ||
        // req.connection.remoteAddress ||
        // req.socket.remoteAddress;
        // if(!ip && req.connection.socket) ip = req.connection.socket.remoteAddress;
        // if(ip){
        //     ip = ip.split(',')[0];
        //     ip = ip.split(':').slice(-1)[0]; //in case the ip returned in a format: "::ffff:146.xxx.xxx.xxx"
        // }
        let ip = 'tempIp'
        if(!ip){
            res.send({err:'Undefined Ip'})

        }else{
            console.log('ip connected... ', ip)
            let yymmdd = getYymmdd();
            Count.findOne({yymmdd:yymmdd}, (err, count)=>{
                if(err) res.send({err:'Ip Find Error'})
                else{
                    Count.findOne({yymmdd:'Total'}, (err, total)=>{
                        if(err) res.send({err:'Total Find Error'})
                        else{
                            let totalCnt = 0;
                            let todayCnt = 0;

                            if(!total){
                                newCountSave('Total');
                                totalCnt = 1;
                            }

                            if(!count){
                                Count.remove({'yymmdd': { $ne: 'Total' }}, (err)=>{
                                    if(err) console.log('remove before count error...',err)
                                    newCountSave(yymmdd);
                                })
                                todayCnt = 1;
                            }
                            
                            // let iplist = count? count.ip: [];
                            // if(iplist.includes(ip)){
                            //     totalCnt = total.cnt;
                            //     todayCnt = count.ip.length;
                            // }else{
                                if(total){
                                    total.cnt +=1
                                    total.save((err,result)=>{
                                        if(err) console.log('total save error...',err)
                                    })
                                    totalCnt = total.cnt;
                                }

                                if(count){
                                    count.ip.push(ip);
                                    todayCnt = count.ip.length;
                                    count.cnt = todayCnt;
                                    count.save((err,result)=>{
                                        if(err) console.log('iplist save error...',err)
                                    })
                                }
                            // }
                            res.send({
                                total: totalCnt,
                                today: todayCnt
                            })
                        }
                    })
                }
            })
        }
        
    } catch (error) {
        res.send({err:'Call Count Error'+error})
    }
})

app.get('/', (req, res)=>{
    return res.redirect('/song');
})

app.get('/song', (req, res)=>{
	let yymmddhh= getYymmddhh();
    Chart.find({yymmddhh: yymmddhh},null,{sort: {num: 1}},(err,result)=>{
        if(err) console.log('chart find error...', err)

        // if(err || !result || result.length === 0){
            console.log(`${yymmddhh} result not exists`)
            getChartByUrlRequest(res);
        // }else{
            
        //     // getChartByUrlRequest(res);
        //     console.log(`${yymmddhh} result exists`)
            
        //     //prevent dup data(temp)
        //     let filteredResult = [];
        //     let tempIndex = -1;
        //     for (let i = 0; i < result.length; i++) {
        //         let element = result[i];
        //         if(element.num == tempIndex) continue;
        //         tempIndex = element.num;
        //         filteredResult.push(element);
        //     }
            
        //     res.render('index', {
        //         result: filteredResult,
        //         index: 0,
        //         totNum: result.length,
        //         yymmddhh: yymmddhh
        //     });
        // }

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
            // Chart.remove({},(err)=>{
            //     if(err) console.log('chart remove error...',err)
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

                    let chart = new Chart();
                    chart.yymmddhh = yymmddhh;
                    chart.num = param.num;
                    chart.song = song;
                    chart.singer = singer;
                    chart.url = param.url;
                    chart.videoId = '';
                    chart.srch = param.srch;
                    chart.save((err,result)=>{
                        if(err) console.log('chart insert error...',err)
                    })
                });
                res.render('index', {
                    result: result,
                    index: 0,
                    totNum: result.length,
                    yymmddhh: yymmddhh
                });
            // })
        }else{
            Chart.find({},null,{sort: {num: 1}},(err,chart)=>{
                result = chart;
                yymmddhh = chart[0].yymmddhh;
                res.render('index', {
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
                    while(tagLoop < 5){
                        href = $tag.eq(tagLoop++).attr('href')
                        if (href && href.length < 30) break;
                    }

		            href = href.replace('/watch?v=','');
			
                    chart.videoId = href;
                    chart.save((err)=>{if(err) console.log('chart videoId update error...',err)})
                    res.send({url: href});

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
