/*
 * Elastico is a library created to make connections with the elastic search
 */

var http = require('http');

Elastico = function(){
  this.options = {
    host: 'localhost'
   ,port: 9200
   ,protocol: "http"
  };
};

Elastico.prototype = {
  getIndex: function (index, type, key, callback){
    var req = http.request(this.options.protocol + "://" + this.options.host + ":" +
      this.options.port + "/" + index + "/" + type + "/" + key, function(res) {
      var jsonData  = []
      res.on('data',function(chucked){
        jsonData.push(chucked);
      });
      res.on('end', function(){
        jsonData = jsonData.join('');
        callback(JSON.parse(jsonData));
      });
    });
    req.method = 'GET';
    req.end();
  },

  getAll: function (index, type, callback){
    var req = http.request(this.options.protocol + "://" + this.options.host + ":" +
      this.options.port + "/" + index + "/" + type + "/_search?size=9001", function(res) {
      var jsonData  = []
      res.on('data',function(chucked){
        jsonData.push(chucked);
      });
      res.on('end', function(){
        jsonData = jsonData.join('');
        callback(JSON.parse(jsonData));
      });
    });
    req.method = 'GET';
    req.end();
  },

  /*
   * TODO: return the id of the object
   */
  insert: function (index, type, value, callback) {
    var options = {
      host: this.options.host,
      port: this.options.port,
      path: "/" + index + "/" + type + "?refresh=true",
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    };
    var req = http.request(options, function(res){
      if (callback != undefined){
        if (res.statusCode < 300 && res.statusCode >= 200){
          callback(true);
        } else{
          callback(false);
        }
      }
    });
    req.write(value);
    req.end();
  },

  insertWithId: function (index, type, id, value, callback) {
    var options = {
      host: this.options.host,
      port: this.options.port,
      path: "/" + index + "/" + type + "/" + id + "?refresh=true",
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      }
    };
    var req = http.request(options, function(res){
      if (callback != undefined){
        if (res.statusCode < 300 && res.statusCode >= 200){
          callback(true);
        } else{
          callback(false);
        }
      }
    });
    req.write(value);
    req.end();
  },

  remove: function(index, type, id, callback) {
    var options = {
      host: this.options.host,
      port: this.options.port,
      path: "/" + index + "/" + type + "/" + id,
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    };
    var req = http.request(options, function(res){
      if (callback != undefined){
        if (res.statusCode < 300 && res.statusCode >= 200){
          callback(true);
        } else{
          callback(false);
        }
      }
    });
    req.end();
  },

  createIndex: function(index, callback){
    var req = http.request(this.options.protocol + "://" + this.options.host + ":" + 
      this.options.port + "/" + index + "?refresh=true", function(res){
      if (callback != undefined){
        callback(res.statusCode < 300 && res.statusCode >= 200);
      }
    });
    req.method = "POST";
    req.end();
  },

  removeIndex: function(index, callback){
    var req = http.request(this.options.protocol + "://" + this.options.host + ":" + 
      this.options.port + "/" + index + "?refresh=true", function(res){
      if (callback != undefined){
        if (res.statusCode < 300 && res.statusCode >= 200){
          callback(true);
        } else{
          callback(false);
        }
      }
    });
    req.method = "DELETE";
    req.end();
  }
};

module.exports.Elastico = Elastico;
