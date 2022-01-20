var ReCapClient = {};
ReCapClient.recapApiUrl = "http://{{host}}/recap/api";
ReCapClient.getRequest = function(name, params, callback) {
    params["method"] = name;
    HTTP.get(ReCapClient.recapApiUrl, params, callback);
};
ReCapClient.postRequest = function(name, params, callback) {
    HTTP.post(ReCapClient.recapApiUrl + "?method=" + name, params, callback);
};
ReCapClient.log = function(object) {
    var isDev = ("{{isDev}}" === "true");
    if (isDev) {
        console.log(object);
        ReCapClient.postRequest("api.game.log", object);
    }
};
