var btnClassNm = 'btn-info';
var url = document.URL.replace(new RegExp('(\/song)(.*)'), '$1');
var curIndex = '', totNum = ''
var hiddenVideo = false;
function resize(){
  var $listDiv = $('#listDiv');
  //- var $listSinger = $('#listSinger');
  var targetHeight = window.innerHeight-$('#iframeDiv').height()-90;
  var singerDivHeight = $('#selectBtn').hasClass('btn-default')? 0: $('#singerDiv').height();
  if($('#singerDiv').css('display') == 'none') singerDivHeight = 0;
  if(($('#singerDiv').position().top || $listDiv.position().top) < 50){
    $listDiv.height(450-singerDivHeight)
    //- $listSinger.height(450)
  }else {
    $listDiv.height(targetHeight-singerDivHeight)
    //- $listSinger.height(targetHeight)
  }
}
function displayTime(){
  var yymmddhh = $('#yymmddhh').val()
  if(yymmddhh){
    $('.btn-group e').text(
      [yymmddhh.substr(2,2),yymmddhh.substr(4,2),yymmddhh.substr(6,2)].join('.')+
      ' '+yymmddhh.substr(8,2)+':00'
    )
  }
}
function hiddenTempFooter(){
  $('#tempfooter').attr('style', 'display:none;')
}
window.onload = function(){
  //temp hidden
  if(url && url.indexOf('mlchart') == -1){
    $('#tempfooter').attr('style', 'display:inline-block;position:fixed;bottom:0;left:0;right:0;height:30px;background-color:rgba(247, 247, 20, 0.68);')
  }
  
1
  if(url && url.indexOf('song') != -1){
    
    fetch(url+'/list')
    .then(res => res.json())
    .then(data => {
      
      curIndex = data.index; totNum = data.totNum;
      $('#yymmddhh').val(data.yymmddhh)
      let html = data.result.map((obj,index,array)=>{
        return `<tr name=trtr id='${obj.num}'>  
          <input type="hidden" name=videoId value='${obj.videoId}' />
          <input type="hidden" name=srch value='${obj.srch}' />
          <td name=select hidden=true>
            <input type="checkbox" checked />
          </td>
          <td name=num onclick="changeMusic('${obj.num-1}', '', 1)">${obj.num}</td>
          <td name=song onclick="changeMusic('${obj.num-1}', '', 1)">${obj.song}</td>
          <td name=singer onclick="changeMusic('${obj.num-1}', '', 1)">${obj.singer}</td>
        </tr>`
      })
      $('#listDiv').append(html.join(''))

      displayTime();
      resize();
      callCount();

      changeMusic(0)
    })
  }
}
function titleClick(){
  window.location.href = url+'/#'+(Number(curIndex)+1)
}
function callCount(){
  $.ajax({
    type: "get",
    dataType: "json",
    url: url+'/count',
    success: function(data){
      if(data.err){
        console.log(data.err)
      }else{
        var total = data.total
        var today = data.today
        //- console.log('data',data)
        if(total && today) $('.btn-group i').text('today '+today+'  total '+total)
      }
    }
  });
}
function playVideoCustom(videoId){
  if(videoId) player.cuePlaylist([videoId]);
  else player.playVideo()
  // 플레이하지 않는 경우 방지, 5초후 다시 실행
  setTimeout(function(){
    // console.log('prevent error', new Date())
    player && player.getPlayerState() != 1 && player.playVideo()
   }, 5000);
}
function changeMusic(ii, loopR, clicked){
  //Video id input
  var $div = $('#playIdDiv');
  if(!$div.attr('hidden')){
    var playIdVal = $div.find('input').val()
    if(playIdVal){
      //- player.cuePlaylist([playIdVal]);
      playVideoCustom(playIdVal)
      //- player.playVideo()
      return;
    }
  }
  var $tr = $($('[name="trtr"]')[ii])
  var $tdInputChk = $('td input:checked');
  // select song condition
  if(!clicked &&
      !$('th[name="select"]').attr('hidden') &&
      !$tr.find('input:checked').length &&
      $tdInputChk.length > 0){
     if(loopR){
      var nextObj = $tdInputChk[Math.floor($tdInputChk.length * Math.random())]
      ii = $(nextObj).parent().parent().attr('id')-1
      $tr = $($('[name="trtr"]')[ii])
     }else{
      nextSong(ii);
      return;
     }
  }
  var $videoIdInput = $tr.find('[name="videoId"]')
    ,videoId = $videoIdInput.val()
    ,song = $tr.find('[name="song"]').text()
    ,singer = $tr.find('[name="singer"]').text()
  $('title').text(song+' - '+singer)
  $('#iframeDiv h4 strong').text(song)
  $('#iframeDiv h4 small').html('&nbsp;&nbsp;'+singer)
  $($('[name="trtr"]')[curIndex]).removeClass('success')
  $tr.addClass('success')
  curIndex = ii;
  if(!clicked) window.location.href = url+'/#'+(Number(ii)+1);
  if(videoId){
    //- player.cuePlaylist([videoId]);
    playVideoCustom(videoId)
    //- player.playVideo()
    return;
  }
  $.ajax({
        type: "get",
        dataType: "json",
        data: {
          yymmddhh: $('#yymmddhh').val(),
          num: $tr.find('[name="num"]').text()
        },
        url: url+'/change',
        success: function(data){
            if(data.err){
              console.log(data.err)
            }else{
              $videoIdInput.val(data.url)
              if(player && player.cuePlaylist){
                //- player.cuePlaylist([data.url]);
                playVideoCustom(data.url)
                //- player.playVideo()
              }
            }
        },
        error: function (error) {
            console.log('change ajax call error :', $('#yymmddhh').val(),' ',$tr.find('[name="num"]').text(), error);
            nextSong();
        }
    });
}
function onSingerCheck(singer, args){
  //- var checked = !!args.checked;
  var checked = !args.classList.contains('btn-link')
  if(!checked) $(args).removeClass('btn-link').addClass('btn-dark')
  else $(args).addClass('btn-link').removeClass('btn-dark')
  $('#listDiv tbody tr').each(function(i, obj){
    var $obj = $(obj)
    if ($obj.find('[name="singer"]').text() == singer){
      $obj.find('input:checkbox').prop('checked', checked)
    }
  })
}
function makeSingerList($listSinger){
  var uniqueSingerList = [];
  var $tbody = $listSinger.find('tbody')
  $tbody.append(
    "<tr>\
      <th><input type='checkbox' onchange='toggleChange2(this)' checked /></td>\
      <th>singer</td>\
    </tr>"
  )
  $('td[name="singer"]').each(function(i,obj){
    var tempSinger = obj.innerHTML;
    if(uniqueSingerList.indexOf(tempSinger) === -1){
      uniqueSingerList.push(tempSinger)
      $tbody.append(
        "<tr>\
          <td><input type='checkbox' onchange='onSingerCheck(\""+tempSinger+"\", this)' checked /></td>\
          <td>"+tempSinger+"</td>\
        </tr>"
      )
    }
  })
}
function makeSingerList2(toHidden){
  if(!toHidden){ //show
    if($('#singerArrCont').hasClass('glyphicon-arrow-up')) $('#singerDiv').css('display', 'inline-block')
    if($('#singerDiv button').length == 0){
      var uniqueSingerList = [];
      $('td[name="singer"]').each(function(i,obj){
        var tempSinger = obj.innerHTML;
        if(uniqueSingerList.indexOf(tempSinger) === -1){
          uniqueSingerList.push(tempSinger)
        }
      })
      uniqueSingerList.sort()
      for(var i = 0; i < uniqueSingerList.length ; i ++){
        var tempSinger = uniqueSingerList[i]
        $('#singerDiv').append(
          "<button class='btn btn-link singerBtn' onclick='onSingerCheck(\""+tempSinger+"\", this)'>"+
            tempSinger
          +"</button>"
        )
      }
    }
  }else{
    $('#singerDiv').css('display', 'none')
  }
}
function playIdChk(){
  var $div = $('#playIdDiv');
  $div.attr('hidden', !$div.attr('hidden'))
}
function selectSongChk(target){
  var $thselect = $('th[name="select"]');
  var toHidden = !$thselect.attr('hidden');
  $thselect.attr('hidden', toHidden);
  $('td[name="select"]').each(function(i,obj){
    $(obj).attr('hidden', toHidden);
  })
  var $target = $(target);
  var $listSinger = $('#listSinger');
  if(!toHidden){
    $target.removeClass('btn-default'); $target.addClass('btn-warning')
    $('#singerArrCont').css('display', 'inline-block');
    //- $('#listDiv').css('width', '70%')
    //- $listSinger.css('width', '30%')
    //- $listSinger.css('display', 'inline-block')
    //- if($listSinger.find('tr').length == 0){
    //-   makeSingerList($listSinger)
    //- }
  }else{
    $target.removeClass('btn-warning'); $target.addClass('btn-default')
    $('#singerArrCont').css('display', 'none');
    //- $('#listDiv').css('width', '100%')
    //- $listSinger.css('display', 'none')
  }
  makeSingerList2(toHidden)
  resize()
}
function toggleChange(args){
  var checked = !!args.checked;
  $('td[name="select"] input').each(function(i,obj){
    obj.checked = checked;
  })
}
function toggleChange2(args){
  var checked = !!args.checked;
  $('#listSinger input:checkbox').each(function(i,obj){
    $(obj).prop('checked', checked)
  })
}
function playYoutube() {
  if(player) player.playVideo();
}
function pauseYoutube() {
  if(player) player.pauseVideo();
}


/*****************************
 * Create youtube player
*****************************/
var player;
// videoId : 공유URL(http://youtu.be/UaY9xbHmVAc)에서 'http://youtu.be'만 제거한 아이디
// playerVars : autoplay-자동시작, controls-하단컨트롤 사용여부, html5-html5 사용여부
function onYouTubePlayerAPIReady() {
    player = new YT.Player('player', {
    height: '100%',
    width: '100%',
    videoId: '',
    playerVars: { 'autoplay': 1, 'controls': 1, 'html5': 1 },
    events: {
        'onReady': onPlayerReady,
        'onStateChange': onPlayerStateChange,
        'onError': onPlayerError
    }
    });
}
function onPlayerError(event){
    console.log('onPlayerError', event)
    if(!!$('#playIdDiv').attr('hidden')) nextSong();
}
// autoplay video
function onPlayerReady(event) {
    //- setTimeout(function(){
    // changeMusic(0)
    //- }, 1000);
    //- console.log('onPlayerReady',event)
    //- player.cuePlaylist(quelist);
    //- event.target.playVideo()
}
// when video ends
function onPlayerStateChange(event) {
    //- console.log('onPlayerStateChange', event.data)
    if(event.data === 5) {
    //- player.playVideo()
    playVideoCustom()
    }else if(event.data === 0) {
    //동영상 끝난 후 이벤트
    var ii = curIndex;
    switch($('#loop').val()){
        case 's':
        ii = (Number(curIndex)+1)%totNum;
        break;
        case 'r':
        ii = Math.floor(Math.random()*totNum)
        break;
    }
    changeMusic(ii)
    }else{
    //- if(event.data === -1) player.playVideo()
    if(event.data === -1) playVideoCustom()
    //- console.log('player state exception !', event, player)
    }
    //else if(player) player.playVideo()
}
function nextSong(arg){
    args = arg === undefined ? curIndex : arg;
    var ii = (Number(args)+1)%totNum;
    var loopR  = $('#loop').val() == 'r';
    if(loopR) ii = Math.floor(Math.random()*totNum)
    changeMusic(ii, loopR)
}
function btnClick(obj){
    var $obj = $(obj);
    $('#btnGroup button').each(function(i, each){
    $(each).removeClass(btnClassNm)
    })
    $obj.addClass(btnClassNm)
    $('#loop').val($obj.attr('name'))
}
function playerHiddenBtnClick(){
    var $playerHiddenBtn = $('#playerHiddenBtn')
    var $playerEmbedDiv = $('#playerEmbedDiv')
    if(hiddenVideo){
    $playerHiddenBtn.removeClass('btn-warning')
    $playerHiddenBtn.addClass('btn-dark')
    $playerEmbedDiv.removeAttr('style')
    }else{
    $playerHiddenBtn.removeClass('btn-dark')
    $playerHiddenBtn.addClass('btn-warning')
    $playerEmbedDiv.css('display', 'none')
    }
    hiddenVideo = !hiddenVideo
    if(hiddenVideo) $('body').css('display', 'inline-block');
    else $('body').removeAttr('style')
    resize()
}
function showSingerArr(){
    //- span#singerArrCont(class='glyphicon glyphicon-arrow-up' aria-hidden="true" onclick='showSingerArr()' style='cursor:pointer')
    if($('#singerArrCont').hasClass('glyphicon-arrow-up')){
    $('#singerArrCont').removeClass('glyphicon-arrow-up')
                        .addClass('glyphicon-arrow-down')
    $('#singerDiv').css('display', 'none')
    }else{
    $('#singerArrCont').addClass('glyphicon-arrow-up')
                        .removeClass('glyphicon-arrow-down')
    $('#singerDiv').css('display','inline-block')
    }
    resize()
}