
export default {

    submitOnFormChange: true,
    submitOnInit: true, 
    enableCaching: true, 
    submitOnFormSubmit: true,
    submitOnHashChange: true,
    defaultRequestParameters: {},
    requestFn: (params, callback) => {
        var headers = new Headers();
        headers.append("app-id", '61cc1e2f679cb9641fa3f88f');
        var myInit = { method: 'GET',
               headers,
         };

        var myRequest = new Request('https://dummyapi.io/data/v1/user?page='+(Number(params.pageNumber)-1)+'&limit='+params.perPage, myInit);

        fetch(myRequest)
        .then(response => {
            return response.json()
        })
        .then(response => {
            let renderObject = {
                total: response.total,
                entries: response.data,
                delta: params.perPage,
                page: params.pageNumber
            }
            callback(renderObject)
        }).catch(error => {
            // error catch
        })
       
    },

    onInit: function() {},
    onRequestStart: function() {},
    onRequestFinish: function() {},
    onRender: function() {},
    onSubmit: function() {},

    shouldSubmitCheckFn: undefined,
    
    template: `
        <div>
            Build your template using Handlebars syntax. Data must be provided thru the requestFn callback
        </div>
    
    `
    
}



/* --------------------------------

 <div>

            Exibindo {{start}} a {{end}} de {{total}}

            <div class="row">
                
                {{#each entries}}

                    <div class="col-md-4 mb-4">      

                        <div class="card h-100">
                            <div class="card-body">
                                <h5 class="card-title">
                                    <img class="" width="40" src="{{picture}}"> 
                                    {{firstName}} {{lastName}}
                                </h5>
                                <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                                <a href="#" class="btn btn-primary">Lorem</a>
                            </div>
                        </div>
                        
                    </div>

                {{/each}}

            </div>
            
        </div>
*/