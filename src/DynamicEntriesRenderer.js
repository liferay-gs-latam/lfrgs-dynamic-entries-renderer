/*!
   * Dynamic Entries Renderer - Render and filter served entries using mustache templates
   * https://github.com/liferay-gs-latam/lfrgs-dynamic-items-container
   */

import utils from "./utils";
import HashRouter from './HashRouter';
import defaultOptions from './defaultOptions';

export default class DynamicEntriesRenderer {
    
    constructor(wrapperId, options) {

        options = {...defaultOptions, ...options}

        this.$wrapper = document.getElementById(wrapperId);
        this.$form = this.$wrapper.querySelector('[data-dynamic-entries-renderer-form]')
        this.$list = this.$wrapper.querySelector('[data-dynamic-entries-renderer-list]')
        this.template = options.template;
        this.requestFn = options.requestFn;
        this.onLoadingStart = options.onLoadingStart;
        this.onLoadingFinish = options.onLoadingFinish;
        this.submitOnFormChange = options.submitOnFormChange;
        this.enableCaching = options.enableCaching;
        
        if(this.$wrapper && this.$form && this.$list) {
            this.init()
        } else {
            console.log('DynamicEntriesRenderer: A "wrapper" and "list" element should be defined')
        }

    }

    registerEvents() {

        let handleFormChange = () => {
            (this.submitOnFormChange) && this.submit()
        }
        let handleFormSubmit = (e) => {
            e.preventDefault();
            this.submit()
        }
        let handleHashChange = () => {  
            let routerData = this._hashRouter.readHashData();
            let routerParameters = routerData.params;
            this.updateFilterElementsValues(routerParameters)
            this.submit(false)
        }

        this.$form.addEventListener('submit', handleFormSubmit)
        this.$form.addEventListener('change', handleFormChange)
        window.addEventListener('hashchange', handleHashChange)

    }

    init() {
        
        this._cache = {};
        this._hashRouter = new HashRouter();
        this.filterElements = {};
        this.isLoading = false;
        this.response = {}
        this.lastRequestParams = {};

        this.registerEvents()

        let filterElements = Array.from(this.$form.querySelectorAll('[data-dynamic-entries-renderer-filter-parameter]'));
        filterElements.forEach(filterElement => {
            let parameter = filterElement.getAttribute('data-dynamic-entries-renderer-filter-parameter');
            if(parameter.length) {
                this.filterElements[parameter] = filterElement
            }
            
        })

        window.dispatchEvent(new Event('hashchange'));
        this.onInit && this.onInit(this);

    }

    submit(changeHash=true) {
        let requestParameters = this.getFilterElementsValues();
        (changeHash) && this.setHashParameters(requestParameters)
        this.request(requestParameters)
        
    }

    request(requestParams) {
        if(!this.requestFn || this.isLoading) {
            return;
        }
        
        let stringfiedRequestParams = JSON.stringify(requestParams);
        
        if(stringfiedRequestParams !== JSON.stringify(this.lastRequestParams)) {
            this.isLoading = true;
            this.disable()
            this.onLoadingStart && this.onLoadingStart(this);

            if(this.enableCaching && this._cache[stringfiedRequestParams]) {
                let cachedRenderObject = this._cache[stringfiedRequestParams];
                this.response = cachedRenderObject;
                this.render()
                this.isLoading = false;
                
            } else {
                this.requestFn(requestParams, (renderObject) => {
                    this.response = renderObject;
                    this.render()
                    this.isLoading = false;
                    if(this.enableCaching) {
                        this._cache[stringfiedRequestParams] = renderObject;
                    } else {
                        this._cache[stringfiedRequestParams] = {}
                        delete this._cache[stringfiedRequestParams]
                    }
                })
            }

            this.lastRequestParams = requestParams;

        }

    }

    render() {
        this.$list.innerHTML = "";
        this.$list.appendChild(utils.parseTemplate(this.template, this.response))

        this.enable()
        this.onLoadingFinish && this.onLoadingFinish(this);
        
    }
    
    updateFilterElementsValues(parameters) {
        Object.keys(this.filterElements).forEach(key => {
            if(parameters[key] && parameters[key].length) {
                this.setFilterElementValue(key, parameters[key])
            } else {
                let filterDefaultValue = this.getFilterElementDefaultValue(key);
                this.setFilterElementValue(key, filterDefaultValue)
            }
        })
    }

    setHashParameters(_parameters) {
        let parameters = {}
        Object.keys(_parameters).forEach(key => {
            let value = _parameters[key];
            if(value && value.length > 0 && value !== this.getFilterElementDefaultValue(key)) {
                parameters[key] = value
                //parameters[key] = encodeURIComponent(value)

            }
        })
        this._hashRouter.setHashData({params: parameters});
    }

    getFilterElementValue(filterParameter) {
        let filterElement = this.filterElements[filterParameter];
        return filterElement.value;
    }

    getFilterElementDefaultValue(filterParameter) {
        let filterElement = this.filterElements[filterParameter];
        if(filterElement.hasAttribute('data-dynamic-entries-renderer-filter-default-value')) {
            return filterElement.getAttribute('data-dynamic-entries-renderer-filter-default-value')
        }
        return ''
    }

    setFilterElementValue(filterParameter, value) {
        if(!this.filterElements[filterParameter]) {
            return false;
        }
        if(this.isLoading) {
            return false;
        }
        let filterElement = this.filterElements[filterParameter];
        filterElement.value = decodeURIComponent(value);
    }
    
    getFilterElementsValues() {
        let elementsValues = {};
        Object.keys(this.filterElements).forEach(parameter => {
            elementsValues[parameter] = this.getFilterElementValue(parameter)
        })
        return elementsValues
    }

    disable() {
        Object.keys(this.filterElements).forEach(key => {
            let filterElement = this.filterElements[key];
            if(filterElement.hasAttribute('disabled')) {
                filterElement.setAttribute('data-originally-disabled', 'true')
            } else {
                filterElement.disabled = true;
                filterElement.classList.add('disabled')
            }
        })

    }

    enable() {
        Object.keys(this.filterElements).forEach(key => {
            let filterElement = this.filterElements[key];
            if(!filterElement.hasAttribute('data-originally-disabled')) {
                filterElement.disabled = false;
                filterElement.removeAttribute('data-originally-disabled')
                filterElement.classList.remove('disabled')
            }
        })

    }

}