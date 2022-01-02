export default class HashRouter {

    constructor() {
        this.hashRoutes = [];
        this.hashParams = {};
    }

    readHashData() {

        this.hashRoutes = [];
        this.hashParams = {};
        
        let hash = window.location.hash.substr(1);

        let _hashRoutes = hash.split('?')[0];
        let _hashParams = hash.split('?')[1];
        
        if(_hashParams) {
            this.hashParams = _hashParams.split('&').reduce(function (res, item) {
                let parts = item.split('=');
                res[parts[0]] = parts[1];
                return res;
            }, {});
        }

        if(_hashRoutes) {
            if(_hashRoutes.split('/').length == 1) {
                this.hashRoutes = [_hashRoutes]
            } else {
                this.hashRoutes = _hashRoutes.split('/').filter(function (route) {
                    return (route.length)
                });
            }
            
        }

        return {routes: this.hashRoutes, params: this.hashParams}

    }



    getHashString(hashData) {
        
        let newHash = "";
        hashData.routes && hashData.routes.forEach(route => {
            newHash += '/'+route
        })

        let i = 0;
        hashData.params && Object.keys(hashData.params).forEach((param) => {
            if(hashData.params[param].length) {
                newHash += (i==0?'?':'&')+param+'='+hashData.params[param];
                i++;
            }
        })

        return newHash;
        
    }

    setHashData(hashData) {

        history.pushState({}, '', '#'+this.getHashString(hashData));

    }


    listen(cb=()=>{}) {

        let handleHashChange = () => {
            return cb(this.readHashData());
        }
        cb(this.readHashData());
        window.addEventListener("hashchange", handleHashChange);		

    }

}
