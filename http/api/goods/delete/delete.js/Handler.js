'use strict';

const assert = require('assert');

module.exports = function (api) {
    assert(api);

    const Handler = function(opts) {
        assert(opts.route);
        assert(opts.method);
        this.route = opts.route;
        this.method = opts.method;
        this._logPrefix = `${this.method}${this.route}`;
    }

    Handler.prototype.handle = function(req, res, next) {
//      console.log(`${this._logPrefix}.handle()`);

        const params = req.body;
        const gid = params.gid;
//      console.log(`${this._logPrefix}.handle, params:`, params);
//      console.log(`${this._logPrefix}.handle, gid:`, gid);

        const container = g_application.model.goods;
        container.remove(gid, (err)=>{
            if(err) {
                res.status(204);
            } else {
                res.sendStatus(200);
            }
        });
    }

    return Handler;
}
