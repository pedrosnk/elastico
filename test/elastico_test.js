var should    =  require('should')
  , Elastico  =  require('../lib/elastico').Elastico;

describe('Elastico', function(){
  var elastic_search = new Elastico();
  before(function(done){
    elastic_search.removeIndex('test',function(){
      elastic_search.removeIndex('indice',function(){
        done();
      });
    });
  });

  it('should get an object of the elastic search', function(done){
    elastic_search.insertWithId("test","ids","lol",'{"lol": "zomg"}', function(){
      elastic_search.getIndex("test","ids","lol", function(json){
        json.should.be.ok;
        done();
      });      
    });
  });

  it('should get all the index objects of the elastic search', function(done){
    elastic_search.insert("test","ids",'{"quelquechose": "je parle quelquechose"}', function(){
      elastic_search.getAll("test","ids",function(json){
        json.should.be.ok; 
        done();
      });
    });
  });

  it('should insert an data into the elastic search', function(done){
    elastic_search.insert("test","ids", '{"key": "value"}', function(created){
      created.should.be.true;
      done();
    });
  });

  it('should insert an data into the elastic search with an pre existing id', function(done){
    elastic_search.insertWithId("test","ids", "zomgid" , '{"key": "value"}', function(created){
      created.should.be.true;
         done();
    });
  });

  it('should remove a data of the elastic search by an id', function(done){
    elastic_search.insertWithId("test","ids", "zomgid" , '{"key": "value"}', function(created){
      elastic_search.remove("test","ids", "zomgid", function(removed){
        removed.should.be.true;
        done();
      });
    });
  });

  it('should create an index and remove it',function(done) {
    elastic_search.createIndex('create_index',function(created){
      created.should.be.true;
      elastic_search.removeIndex('create_index',function(removed){
        removed.should.be.true;
        done();
      });      
    });
  });

  after(function(done){
    elastic_search.removeIndex('test', function(removed){
      done();
    });
  });

});
