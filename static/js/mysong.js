Vue.component('mysong-component', {
    template:
        `<div style="margin-top:10px;">
            <form class="form-horizontal">
                <div class="form-group" v-bind:class="validate('userId') ? 'has-success' : 'has-error'">
                    <label for="userId" class="col-xs-2 control-label">Username</label>
                    <div class="col-xs-10">
                        <input type="text" class="form-control" v-model="userId" placeholder="Username">
                    </div>
                </div>
                <div class="form-group" v-bind:class="validate('userPw') ? 'has-success' : 'has-error'">
                    <label for="userPw" class="col-xs-2 control-label">Password</label>
                    <div class="col-xs-10">
                        <input type="password" class="form-control" v-model="userPw" placeholder="Password">
                    </div>
                </div>
                <p class="text-danger" v-if="errorMsg">{{errorMsg}}</p>
                <div class="form-group">
                    <div class="col-xs-offset-1 col-xs-10">
                        <button type="submit" @click="login" class="btn btn-default">Sign in</button>
                        <button type="submit" @click="login" class="btn btn-default">Log in</button>
                    </div>
                </div>
            </form>
      
        </div>`,
    data: function(){
        return {
            userId:undefined,
            userPw:undefined,
            mySongList: [],
            errorMsg:undefined,
            user: {}
        }
    },
    created: function () {
        
    },
    methods: {
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
                  if(!res.userId){
                    this.errorMsg = res.result
                  }else{
                    this.errorMsg = undefined
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
        }
    }
})
