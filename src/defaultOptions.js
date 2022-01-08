
export default {
    // Request function
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

    // Behaviour
    submitOnFormChange: true,
    submitOnInit: true, 
    enableCaching: true, 
    submitOnFormSubmit: true,
    submitOnHashChange: true,
    defaultRequestParameters: {},
    shouldSubmitCheckFn: undefined,

    // Events
    onInit: function() {},
    onRequestStart: function() {},
    onRequestFinish: function() {},
    onRender: function() {},
    onSubmit: function() {},
    onFormChange: function() {},
    onHashChange: function() {},


    // Template (variable type can vary depending on the templateType. The default templateType is "mustache" and it should be provided as a string)
    template: `
        <div style="padding: 2rem; background: #eaeaea">
            Build your template using Handlebars syntax. Data must be provided thru the requestFn callback
        </div>
    `,
    templateType: "mustache"

}
