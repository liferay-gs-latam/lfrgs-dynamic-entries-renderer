/*!
   * Dynamic Entries Renderer - Render and filter served entries using mustache templates
   * https://github.com/liferay-gs-latam/lfrgs-dynamic-items-container
   */

import utils from "./utils";
import HashRouter from './HashRouter';
import defaultOptions from './defaultOptions';

const hashRouter = new HashRouter();
export default class DynamicEntriesRenderer {
    
    constructor(wrapperId, options) {

        options = {...defaultOptions, ...options}

        // Essential settings
        this.$wrapper = document.getElementById(wrapperId);
        this.$form = this.$wrapper.querySelector('[data-dynamic-entries-renderer-form]');
        this.$results = this.$wrapper.querySelector('[data-dynamic-entries-renderer-results]');
        this.template = options.template;
        this.requestFn = options.requestFn;

        // Behaviour settings
        this.onInit = options.onInit;
        this.onFormChange = options.onFormChange;
        this.onRequestStart = options.onRequestStart;
        this.onRequestFinish = options.onRequestFinish;
        this.onRender = options.onRender;
        this.onSubmit = options.onSubmit;
        this.submitOnFormChange = options.submitOnFormChange;
        this.enableCaching = options.enableCaching;
        this.defaultRequestParameters = options.defaultRequestParameters;
        this.submitOnInit = options.submitOnInit;
        this.shouldSubmitCheckFn = options.shouldSubmitCheckFn;
        this.submitOnFormSubmit = options.submitOnFormSubmit;
        this.submitOnHashChange = options.submitOnHashChange;

        // Init if has wrapper and list elements
        if(this.$wrapper && this.$results) {
            this.init()
        } else {
            console.log('DynamicEntriesRenderer: A "wrapper" and "list" element should be defined')
        }

    }

    registerEvents() {

        let handleFormChange = () => {
            console.log('handleFormChange')
            this.onFormChange && this.onFormChange();
            (this.submitOnFormChange) && this.submit()

        }

        let handleFormSubmit = (e) => {
            console.log('handleFormSubmit')

            e.preventDefault();
            (this.submitOnFormSubmit) && this.submit()
        }

        let handleHashChange = () => {  
            console.log('handleHashChange')

            if(this._isLoading) {
                this.cancelRequest()
            }

            let routerData = hashRouter.readHashData();
            let routerParameters = routerData.params;

            Object.keys(this.getFilterElements()).forEach(key => {
                if(routerParameters[key] && routerParameters[key].length) {
                    this.setFilterValue(key, routerParameters[key])
                } else {
                    let filterDefaultValue = this.getFilterDefaultValue(key);
                    this.setFilterValue(key, filterDefaultValue)
                }
            })

            this.submitOnHashChange && this.submit(false)
            
        }

        if(this.$form) {
            this.$form.addEventListener('submit', handleFormSubmit)
            this.$form.addEventListener('change', handleFormChange)
        }
        
        window.addEventListener('hashchange', handleHashChange)

    }

    init() {
        
        // Initialize 
        this._cache = {};
        this._isLoading = false;
        this.currentRenderData = {}
        this.currentRequestParameters = {};

        // Register events to listen to form changes and hash changes
        this.registerEvents()

        let routerData = hashRouter.readHashData();
        let routerParameters = routerData.params;

        let parametersDefinedFromRouter = {};
        let filterElements = this.getFilterElements();

        // Set filter element's default value attributes (if missing)
        Object.keys(filterElements).forEach(key => {
            let filterElement = filterElements[key];
            if(!filterElement.hasAttribute('data-dynamic-entries-renderer-filter-default-value')) {
                filterElement.setAttribute('data-dynamic-entries-renderer-filter-default-value', filterElement.value)
            } else {
                let defaultValue = this.getFilterDefaultValue(key);
                if(filterElement.value !== defaultValue) {
                    this.setFilterValue(key, defaultValue)
                }
            }
        })
        
        // Set filter element's values based on hash parameters
        Object.keys(filterElements).forEach(key => {
            if(routerParameters[key] && routerParameters[key].length) {
                this.setFilterValue(key, routerParameters[key]);
                parametersDefinedFromRouter[key] = routerParameters[key];
            } else {
                let filterDefaultValue = this.getFilterDefaultValue(key);
                this.setFilterValue(key, filterDefaultValue)
            }
            
        })



        if(this.submitOnInit || Object.keys(parametersDefinedFromRouter).length) {
            this.submit(false);
        }
        
        this.onInit && this.onInit();

    }

    reset() {
        Object.keys(this.getFilterElements()).forEach(parameter => {
            let defaultValue = this.getFilterDefaultValue(parameter);
            this.setFilterValue(parameter, defaultValue);
        })

        this.submit();
    }

    getFilterElements() {
        let filterElements = {};
        if(!this.$form) {
            return filterElements
        }
        let _filterElements = Array.from(this.$form.elements);
        _filterElements.forEach(filterElement => {
            if(filterElement.hasAttribute('data-dynamic-entries-renderer-filter-parameter')) {
                let parameter = filterElement.getAttribute('data-dynamic-entries-renderer-filter-parameter');
                if(parameter.length) {
                    filterElements[parameter] = filterElement
                }
            }
        })
        return filterElements
        
    }
 
    getRequestParameters() {
        return {...this.defaultRequestParameters, ...this.getFiltersValues()};
    }

    submit(changeHash=true) {
        
        let _submit = () => {
            (changeHash) && this.updateHashParameters();
            this.request();
            (this.onSubmit) && this.onSubmit();
        }
        
        if(this.shouldSubmitCheckFn) {
            this.shouldSubmitCheckFn((cb) => {
                cb && _submit()
            })
        } else {
            _submit()
        }
        
    }

    request(requestParameters) {

        if(!this.requestFn || this._isLoading) {
            return;
        }

        if(!requestParameters) {
            requestParameters = this.getRequestParameters()
        }
        
        let _render = (renderData) => {
            this.currentRequestParameters = requestParameters;
            this.currentRenderData = renderData;
            this.render()
        }

        if(!this.$form) {

            this.requestFn(requestParameters, (renderData) => {
                _render(renderData)
            })
            
        } else {

            let stringfiedCurrentRequestParameters = JSON.stringify(this.currentRequestParameters);
            let stringfiedRequestParameters = JSON.stringify(requestParameters);

            if(stringfiedRequestParameters !== stringfiedCurrentRequestParameters) {
    
                if(this.enableCaching && this._cache[stringfiedRequestParameters]) {

                    let renderData = this._cache[stringfiedRequestParameters];
                    _render(renderData)
                    
                } else {

                    this._isLoading = true;
                    this.disable()
                    

                    let cancelledRequest = false;
                    this.cancelRequest = () => {
                        
                        cancelledRequest = true;
                        this.enable()
                        this._isLoading = false;

                        
                        let filterElements = this.getFilterElements();
                        Object.keys(filterElements).forEach(key => {
                            let value = this.currentRequestParameters[key];
                            if(value !== undefined) {
                                this.setFilterValue(key, this.currentRequestParameters[key])
                            }
                        })
                        this.updateHashParameters()

                        _render(this.currentRenderData);
                        this.submit()
                        
                    }

                    this.onRequestStart && this.onRequestStart(requestParameters);
                    this.requestFn(requestParameters, (renderData) => {

                        if(this.enableCaching) {
                            this._cache[stringfiedRequestParameters] = renderData;
                        } else {
                            this._cache[stringfiedRequestParameters] = {}
                            delete this._cache[stringfiedRequestParameters]
                        }

                        if(!cancelledRequest) {
                            this.enable()
                            this._isLoading = false;
    
                            this.onRequestFinish && this.onRequestFinish();
    
                            _render(renderData)
                    

                        }  


                    })

                }
    
            }
        }
        
    }

    render(renderData, templateString) {

        if(!renderData) {
            renderData = this.currentRenderData
        }
        if(!templateString) { 
            templateString = this.template
        }

        this.$results.innerHTML = "";
        this.$results.appendChild(utils.parseTemplate(templateString, renderData))
        this.onRender && this.onRender();

    }

    updateHashParameters() {
       
        let filtersValues = this.getFiltersValues();
        let hashParameters = {}
        Object.keys(filtersValues).forEach(key => {
            let value = filtersValues[key];
            if(value !== this.getFilterDefaultValue(key)) {
                hashParameters[key] = value
            }
        })

        let routerData = hashRouter.readHashData();
        let routerParameters = routerData.params;
        let stringfiedRouterParameters = JSON.stringify(routerParameters);
        let stringfiedHashParameters = JSON.stringify(hashParameters);

        if(stringfiedRouterParameters !== stringfiedHashParameters) {
            console.log('updating hash params')
            hashRouter.setHashData({params: hashParameters});
        }
        
    }

    getFilterValue(filterParameter) {
        let filterElement = this.getFilterElements()[filterParameter];
        return filterElement.value;
    }

    getFilterDefaultValue(filterParameter) {
        let filterElement = this.getFilterElements()[filterParameter];
        if(filterElement.hasAttribute('data-dynamic-entries-renderer-filter-default-value')) {
            return filterElement.getAttribute('data-dynamic-entries-renderer-filter-default-value')
        }
        return ''
    }

    setFilterValue(filterParameter, value) {
        if(this._isLoading && !this.getFilterElements()[filterParameter]) {
            return false;
        }

        let filterElement = this.getFilterElements()[filterParameter];
        filterElement.value = decodeURIComponent(value);
        // (this.submitOnFormChange) && this.submit();

    }

    getFiltersValues() {
        let filtersValues = {};
        Object.keys(this.getFilterElements()).forEach(parameter => {
            filtersValues[parameter] = this.getFilterValue(parameter)
        })
        return filtersValues
    }

    disable() {
        Object.keys(this.getFilterElements()).forEach(key => {
            let filterElement = this.getFilterElements()[key];
            if(filterElement.hasAttribute('disabled')) {
                filterElement.setAttribute('data-originally-disabled', 'true')
            } else {
                filterElement.disabled = true;
                filterElement.classList.add('disabled')
            }
        })
    }

    enable() {
        Object.keys(this.getFilterElements()).forEach(key => {
            let filterElement = this.getFilterElements()[key];
            if(!filterElement.hasAttribute('data-originally-disabled')) {
                filterElement.disabled = false;
                filterElement.removeAttribute('data-originally-disabled')
                filterElement.classList.remove('disabled')
            }
        })
    }



}