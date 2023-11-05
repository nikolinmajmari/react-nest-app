

class Storage{
    static AUTH = "/app/auth";
    setAuthData(data:object){
        localStorage.setItem(Storage.AUTH,JSON.stringify(data));
    }
    getAuthData(){
        const data =  localStorage.getItem(Storage.AUTH);
        return data && JSON.parse(data);
    }
    clearAuthData(){
        return localStorage.removeItem(Storage.AUTH);
    }


    clear(){
        localStorage.clear();
    }
}


export default new Storage();
