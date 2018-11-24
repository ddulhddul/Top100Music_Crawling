Vue.component('mysong-component', {
    template:
        `<div style="margin-top:10px;">
            <div id="temp" style="display:none;"></div>
            <div v-if="!user" class="form-horizontal">
                <div class="form-group" v-bind:class="validate('userId') ? 'has-success' : 'has-error'">
                    <label for="userId" class="col-xs-2 control-label">Username</label>
                    <div class="col-xs-10">
                        <input type="text" class="form-control" v-model="userId" @keyup.enter="login" placeholder="Username">
                    </div>
                </div>
                <div class="form-group" v-bind:class="validate('userPw') ? 'has-success' : 'has-error'">
                    <label for="userPw" class="col-xs-2 control-label">Password</label>
                    <div class="col-xs-10">
                        <input type="password" class="form-control" v-model="userPw" @keyup.enter="login" placeholder="Password">
                    </div>
                </div>
                <p class="text-danger" v-if="errorMsg">{{errorMsg}}</p>
                <div class="form-group">
                    <div class="col-xs-offset-1 col-xs-10">
                    <button @click="login" class="btn btn-default">Log in</button>
                    <button @click="signin" class="btn btn-default">Sign in</button>
                    </div>
                </div>
            </div>
            <div v-if="user">
                <div class="panel panel-primary">
                    <div class="panel-heading"><b>{{user.userId}}</b>'s songs</div>
                    <div style="padding:5px;">
                        <div class="panel panel-info">
                            <div class="panel-heading" @click="mySongSearch=!mySongSearch"><small>Search Song</small></div>
                            <div v-if="mySongSearch" class="panel-body">
                                <div class="input-group">
                                    <input type="text" @keyup.enter="search()" class="form-control" placeholder="Search for..." v-model="searchInput">
                                    <span class="input-group-btn">
                                        <button @click="search" class="btn btn-default" type="button">Go!</button>
                                    </span>
                                </div>
                    
                                <table class="table table-striped table-hover">
                                    <thead>
                                        <tr>
                                            <th>Title</th>
                                            <th>Time</th>
                                            <th>Href</th>
                                        </tr>
                                    </thead>    
                                    <tbody>
                                        <tr v-for="searchObj in searchList" @click="addToMySong(searchObj)">
                                            <td>{{ searchObj.title }}</td>
                                            <td>{{ searchObj.videoTime }}</td>
                                            <td>{{ searchObj.href }}</td>
                                        </tr>
                                    </tbody>
                                </table>            
                            </div>
                        </div>
                    </div>
                    <div class="panel-body">
                        <table class="table table-striped table-dark">
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Time</th>
                                </tr>
                            </thead>    
                            <tbody>
                                <tr v-for="mySong in user.songList"
                                    v-bind:class='currentMusic.num == mySong.num && currentMusic.tab == mySong.tab ? "success" : ""'
                                >
                                    <td @click='changeMusic(mySong)'>{{ mySong.title }}</td>
                                    <td @click='changeMusic(mySong)'>{{ mySong.videoTime }}</td>
                                    <td>
                                        <div class="col-xs-2 btn-group btn-group-xs">
                                            <button @click="removeMySong(mySong)" class="btn btn-danger">
                                                <span aria-hidden="true" class="glyphicon glyphicon-remove"></span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>            
                    </div>
                </div>
                <p><a class="btn btn-primary btn-sm" href="#none" @click="logout" role="button">Log out</a></p>
            </div>
        </div>`,
    props: ['changeMusic', 'tabinfo','currentMusic'],
    data: function(){
        return {
            userId:undefined,
            userPw:undefined,
            errorMsg:undefined,
            user: undefined,
            searchInput: undefined,
            searchList: [],
            mySongSearch: false
        }
    },
    created: function () {
        if(typeof localStorage !== 'undefined'){
            this.user = JSON.parse(localStorage.getItem('user'))
            this.tabinfo.mySong.musicList = this.user ? (this.user.songList || []) : []
        }
    },
    methods: {
        addToMySong: function(song){
            var listCheck = this.user.songList.filter(function(obj){
                return obj.href == song.href
            })
            if(!listCheck.length){
                this.user.songList.push(song)
                this.updateMySongList()
            }
        },

        removeMySong: function(song){
            this.user.songList = this.user.songList.filter(function(obj){
                return obj.videoId != song.videoId
            })
            this.updateMySongList()
        },

        updateMySongList: function(){
            (async () => {
                var response = await fetch('song/passport/updateMySongList',{   
                    method: "POST",
                    headers: {"Content-type": "application/json; charset=UTF-8"},              
                    body: JSON.stringify({
                        userId: this.user.userId,
                        songList: this.user.songList
                    })
                });
                var body = await response.json();
                if (response.status !== 200) throw Error(body.message);
                return body;
              })()
                .then(res => {
                    console.log('rese', res)
                    if(res.err){
                        alert(res.err)
                    }else{
                        this.user.songList = res.songList
                        //localStorage
                        typeof localStorage !== 'undefined' && localStorage.setItem('user', JSON.stringify(this.user))
                        this.tabinfo.mySong.musicList = res.songList
                    }
                })
                .catch(err => console.log(err));
        },

        search: function(){
            console.log('search', this.searchInput)

            var curThis = this
            //Youtube Search
            fetch(`song/search?searchInput=${this.searchInput}`)
            .then(res => res.json())
            .then(result => {
                var list = result ? (result.resultList||[]) : []
                list = list.map(function(obj){
                    var $temp = document.querySelector('#temp')
                    $temp.innerHTML = obj.title
                    obj.title = $temp.innerHTML
                    return obj
                })
                curThis.searchList = list
                console.log('search///', result)
                console.log('search2//', decodeURI(encodeURI(result.resultList[0].title)))
            })

        },

        login: function(event){
            if(!this.validate('userId') || !this.validate('userPw')) return
            (async () => {
                var response = await fetch('song/passport/login',{   
                    method: "POST",
                    headers: {"Content-type": "application/json; charset=UTF-8"},              
                    body: JSON.stringify({
                        userId: this.userId,
                        userPw: this.userPw
                    })
                });
                var body = await response.json();
                if (response.status !== 200) throw Error(body.message);
                return body;
              })()
                .then(res => {
                    console.log('rese', res)
                  if(!res.userId){
                    this.errorMsg = res.result
                  }else{
                    this.errorMsg = undefined
                    this.user = res
                    //localStorage
                    typeof localStorage !== 'undefined' && localStorage.setItem('user', JSON.stringify(res))
                    this.tabinfo.mySong.musicList = res.songList
                  }
                  
                })
                .catch(err => console.log(err));
        },
        validate: function(target){
            if(this[target]){
                return true
            }else{
                return false
            }
        },
        signin: function(){
            if(!this.validate('userId') || !this.validate('userPw')) return
            (async () => {
                var response = await fetch('song/passport/sign',{   
                    method: "POST",
                    headers: {"Content-type": "application/json; charset=UTF-8"},              
                    body: JSON.stringify({
                        userId: this.userId,
                        userPw: this.userPw
                    })
                });
                var body = await response.json();
                if (response.status !== 200) throw Error(body.message);
                return body;
              })()
                .then(res => {
                    console.log('rese', res)
                  this.errorMsg = res.result
                  if(!res.result){
                      this.userId = ''
                      this.userPw = ''
                  }
                })
                .catch(err => console.log(err));
        },
        logout: function(){
            this.user = undefined
            if(typeof localStorage !== 'undefined') localStorage.removeItem('user')
        }
    }
})
