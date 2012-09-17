ELASTICO
========

Elastico is an API to easialy connect a node application with
elastic search.

USAGE
-----
Install it

    npm install elastico

Use on your projects

```js
var Elastico = require('elastico').Elastico;
var client = new Elastico();
client.getIndex('my_index','my_type', 'my_key', function(data){
  console.log(data);
};
```

REFERENCE
---------

You can find some reference in how to use elastico inside the
[Annoted Source Code](http://pedrosnk.github.com/elastico/docs/elastico.html)

License
-------

Elastico is released under the MIT license:

http://www.opensource.org/licenses/MIT
