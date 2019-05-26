Vue.component('message-component', {
    template:
        `<div style="margin-top:10px;">
            <div class="row">
                <div class="col-xs-4">
                    <input v-model="writer" class="form-control input-sm" placeholder='Anonymous' />
                </div>
                <div class="col-xs-8">
                    <div class="input-group">
                        <input v-model="content" class="form-control input-sm" placeholder='Content' v-on:keypress="enterMessage" />
                        <span class="input-group-btn">
                            <button class="btn btn-default btn-sm" @click="saveMessage">Enter</button>
                        </span>
                    </div>
                </div>
            </div>
            <div class="listTable">
                <table class="table table-striped table-hover">
                <colgroup>
                    <col width="20%"></col>
                    <col width="80%"></col>
                </colgroup>
                <tbody>
                    <tr v-for="message in messageList">
                        <td><b>{{message.writer}}</b></td>
                        <td>
                            {{message.content}}
                            <div style='color:grey;text-align:right'><small><small>{{message.formattedDate}}</small></small></div>
                        </td>
                        
                    </tr>
                </tbody>
            </div>
            </table>
        </div>`,
    data: function(){
        return {
            writer : '',
            content: '',
            messageList: []
        }
    },
    created: function () {
        fetch(`song/message/10`)
        .then(res => res.json())
        .then(result => {
            this.messageList = result.messageList || []
            console.log('messageList', this.messageList)
        })
    },
    methods: {
        enterMessage: function(event){
            if(event.code === 'Enter'){
                this.saveMessage()
            }
        },
        saveMessage: function () {
            var writer = this.writer || 'Anonymous'
            var content = this.content
            if (!content) return
            fetch(`song/message`,{ 
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({writer: writer, content: content})
            })
            .then(res => res.json())
            .then(result => {
                this.messageList = result.messageList
                this.content = ''
            })
        }
    }
})