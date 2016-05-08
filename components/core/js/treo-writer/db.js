/* global Promise */
/* global global */
'use strict';

var MAX_TRANSACTIONS = 5;

function DB(treo, max) {
	this.treo = treo;
  this.tm = {};
  this.count = 0;
  this.outstanding = [];
  this.runningTotal = 0;
  this.puts = 0;
  this.max = MAX_TRANSACTIONS;
  if (max) {
    this.max = max;
  }
}

DB.prototype.treo = null;

DB.prototype.tm = null;

DB.prototype.max = 0;

DB.prototype.puts = 0;

DB.prototype.runningTotal = 0;

DB.prototype.outstanding = null;

DB.prototype.countQueue = function() {
  return this.puts;
};

DB.prototype.countTransactionsQueue = function() {
  return this.outstanding.length;
};

DB.prototype.countTransactions = function() {
  return this.count;
};

DB.prototype.runningTransactionTotal = function() {
  return this.runningTotal;
};

DB.prototype.shiftq = function(store, q, name, on) {
  if (on === undefined) {
    on = 1;
  }
  var self = this;
  var e = q.shift();
  if (e) {
    var req = store.put(e.v, e.k);
    this.puts = this.puts - 1;
    req.onsuccess = function() {
      // Technically the transaction could still be aborted/fail so slightly wrong
      e.r();
      self.shiftq(store, q, name, (on+1));
    };
    req.onerror = function(event) {
      e.j(event);
    };
  } else {
    // done, transaction will close
    // console.log('Drained', name, 'on', on);
    this.tm[name] = null;
  }
}

DB.prototype.gate = function(cb) {
    var self = this;
    
    function invoke() {
      var called = false;
      self.count = self.count + 1;
      try {
        self.runningTotal = self.runningTotal + 1;
        cb(function() {
          if (!called) {
            called = true;
            self.count = self.count - 1;
          }
          var next = self.outstanding.shift();
          if (next) {
            self.gate(next);
          }
        });
      }
      catch (e) {
        if (!called) {
          called = true;
          self.count = self.count - 1;
        }
        throw e;
      }
    }      

    if (this.count >= this.max) {
      // console.log(this.count, 'transactions reached, moved to the q');
      this.outstanding.push(cb);
    } else {
      invoke();
    }
}

DB.prototype.put = function(store, val, optionalKey) {
  var self = this;
  var treo = this.treo;
  var tm = this.tm;
  var q = tm[store];
  this.puts = this.puts + 1;
  return new Promise(function (resolve, reject) {
    var entry = { v: val, r: resolve, j: reject, k: optionalKey };
    if (q == null) {
      q = [ entry ];
      tm[store] = q;
      
      self.gate(function(release) {
        treo.transaction('readwrite', [ store ], function(err, tr) {
          if (err) {
            release();
            q.forEach(function(e) {
              e.j();
            });
            return;
          }
          
          tr.oncomplete = function() { 
            release();
            tm[store] = null;
          };
          
          tr.onerror = function(event) {
            q.forEach(function(e) {
              e.j();
            });
            release();
            tm[store] = null;
          };
          
          // start the drain
          self.shiftq(tr.objectStore(store), q, store);            
        });
      });
    } else {
      q.push(entry);        
    }
  });
};


var TreoWriter = {
	wrap: function(treo, max) {
    return new DB(treo, max);
  }
};

if (typeof module !== 'undefined' && module.exports) { module.exports = TreoWriter; } // CommonJs export
if (typeof define === 'function' && define.amd) { define([], function () { return TreoWriter; }); } // AMD
