class DB {
    constructor(treo, max = 5) {
        this.treo = treo;
        this.tm = {};
        this.count = 0;
        this.outstanding = [];
        this.runningTotal = 0;
        this.puts = 0;
        this.max = max
        if (max) {
            this.max = max;
        }
    }

    countQueue() {
        return this.puts;
    }

    countTransactionsQueue() {
        return this.outstanding.length;
    }

    countTransactions() {
        return this.count;
    }

    runningTransactionTotal() {
        return this.runningTotal;
    }

    shiftq(store, q, name, on) {
        if (on === undefined) {
            on = 1;
        }
        let self = this;
        let e = q.shift();
        if (e) {
            let req = store.put(e.v, e.k);
            this.puts = this.puts - 1;
            req.onsuccess = function() {
                // Technically the transaction could still be aborted/fail so slightly wrong
                e.r();
                self.shiftq(store, q, name, (on + 1));
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

    gate(cb) {
        let self = this;

        function invoke() {
            let called = false;
            self.count = self.count + 1;
            try {
                self.runningTotal = self.runningTotal + 1;
                cb(function() {
                    if (!called) {
                        called = true;
                        self.count = self.count - 1;
                    }
                    let next = self.outstanding.shift();
                    if (next) {
                        self.gate(next);
                    }
                });
            } catch (e) {
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

    put(store, val, optionalKey) {
        let self = this;
        let treo = this.treo;
        let tm = this.tm;
        let q = tm[store];
        this.puts = this.puts + 1;
        return new Promise(function(resolve, reject) {
            let entry = {
                v: val,
                r: resolve,
                j: reject,
                k: optionalKey
            };
            if (q == null) {
                q = [entry];
                tm[store] = q;

                self.gate(function(release) {
                    treo.transaction('readwrite', [store], function(err, tr) {
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
    }
}

let TreoWriter = {
    wrap(treo, max) {
        return new DB(treo, max);
    }
};

export { TreoWriter };
