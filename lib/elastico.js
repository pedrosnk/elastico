// Elastico.js 0.0.1
// -----------------

// Elastico may be distrubited under MIT license 

// Requores http dependecy to make request to elasticsearch
var http = require('http');

// Declaration of Class Elastic Search
Elastico = function(){
  // This are the custom options that
  // can be used to configure the connection with
  // the elasticsearch client.
  // 
  //     var client = new Elastico();
  //     client.options.host = 'my_elastic_search_ip';
  // 
  this.options = {
    host: 'localhost'
   ,port: 9200
   ,protocol: "http"
  };
};

Elastico.prototype = {

  // Function used to generate get an index from the
  // elasticsearch client it will return the raw json from the
  // elasticsearch.
  //
  //     client.getIndex('my_index','my_type', 'my_key', function(data){
  //       console.log(data);
  //     });
  //
  getIndex: function (index, type, key, callback){
    var req = http.request(this.options.protocol + "://" + this.options.host + ":" +
      this.options.port + "/" + index + "/" + type + "/" + key, function(res) {
      var jsonData  = [];
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
  
  // Used to get all the data from an expecific index and type
  // returning the raw json from elastic search it is possible
  // to pass some options at the body of the request. sse more
  // at [elasticsearch docs](http://www.elasticsearch.org/guide)
  //
  //     client.getAll('my_index', 'my_type', function(data){
  //       console.log(data);
  //     });
  //
  // with options
  // 
  //     client.getAll('my_index', 'my_type', function(data){
  //       console.log(data);
  //     }, {size: 30} );
  //
  getAll: function (index, type, callback, extras){
    var body = JSON.stringify(extras);
    var options = {
      host: this.options.host,
      port: this.options.port,
      path: index + "/" + type + "/_search",
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    };

    var req = http.request(options, function(res) {
      var jsonData  = [];
      res.on('data',function(chucked){
        jsonData.push(chucked);
      });
      res.on('end', function(){
        jsonData = jsonData.join('');
        callback(JSON.parse(jsonData));
      });
    });

    if(body !== undefined){
      req.setHeader('Content-Length', body.length.toString() );
      req.write(JSON.stringify(extras));
    }
    req.end();
  },

  // Responsable to insert some object data into the
  // elasticsearch client. the data must be passad as
  // string. recommended to use JSON.stringfy(value)
  // it will let elasticsearch to auto generate an id for
  // the object
  //
  //     var obj = {foo: "bar" };
  //     client.insert('my_index','my_type',JSON.strinfy(obj), function(success) {
  //       if (success === true){
  //         console.log('success')
  //       } else {}
  //         console.log('some error occoured');
  //       }
  //     });
  //
  insert: function (index, type, value, callback) {
    var options = {
      host: this.options.host,
      port: this.options.port,
      path: "/" + index + "/" + type,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }
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

  // Does the same job as the insert function, but
  // it is possible to pass an id predetermined to the elasticsearch
  // it is useful in case you need to overwrite a data into elasticsearch
  //
  //     var obj = {foo: "bar" };
  //     client.insertWithId('my_index','my_type','my_id',JSON.strinfy(obj), function(success) {
  //       if (success === true){
  //         console.log('success')
  //       } else {}
  //         console.log('some error occoured');
  //       }
  //     });
  //
  insertWithId: function (index, type, id, value, callback) {
    var options = {
      host: this.options.host,
      port: this.options.port,
      path: "/" + index + "/" + type + "/" + id,
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

  // Useful to remove some data by passing it id into elasticsearch
  // 
  //     client.remove('my_index','my_type','my_id', function(success) {
  //       console.log("removed? - " + success);
  //     });
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
    var options = {
      host: this.options.host,
      port: this.options.port,
      path: "/" + index,
      method: 'POST'
    }
    var req = http.request(options, function(res){
      if (callback != undefined){
        callback(res.statusCode < 300 && res.statusCode >= 200);
      }
    });
    req.end();
  },

  removeIndex: function(index, callback){
    var options = {
      host: this.options.host,
      port: this.options.port,
      path: "/" + index,
      method: 'DELETE',
    }
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
  
  bulk: function(index, type, values, callback){
    var options = {
        host: this.options.host,
        port: this.options.port,
        path: "/" + index + "/" + type + "/_bulk",
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
      req.write(values);
      req.end();
  }

};

module.exports.Elastico = Elastico;
