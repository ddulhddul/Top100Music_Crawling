Vue.component('message-component', {
    template: 
        `<div>
            <div class="row">
                <div class="col-xs-4">
                    <input class="form-control input-sm" placeholder='Name' />
                </div>
                <div class="col-xs-8">
                    <div class="input-group">
                        <input class="form-control input-sm" placeholder='Contents' />
                        <span class="input-group-btn">
                            <button class="btn btn-default btn-sm" @click="notYet()">Enter</button>
                        </span>
                    </div>
                </div>
            </div>
            <table class="table table-striped table-hover listTable">
            <colgroup>
                <col width="10%"></col>
                <col width="20%"></col>
                <col width="70%"></col>
            </colgroup>
            <tbody>
                <div>To be continued...</div>
            </tbody>
            </table>
        </div>`,
    // data: {
    // }
    methods: {
        notYet: function(){
            alert(1)
        }
    }
})
