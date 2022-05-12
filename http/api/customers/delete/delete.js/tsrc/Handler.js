'use strict';

describe('http.api.orders.delete.delete.js', ()=>{

    const assert = require('assert');
    let api;
    let Router, Response, Delete;
    let helpers, Model, createDbName;
    let addOrders;
    before(()=>{
        api = require('yeap_app_server');
        Router = api.lib.express.Router;
        Response = api.lib.express.Response;
        Delete = api.lib.express.Delete;
        const yeap_db = require('yeap_db');
        helpers = yeap_db.postgres.helpers;
        Model = require('../../../../../../src/Model');
        createDbName=(name)=>{ return yeap_db.Db.createDbName('http_api_orders_delete_post_') + name };
        addOrders = (index, count, cb)=>{
            if(index<count) {
                model.orders.add(
                    {
                        name:`SomeName-${index}`,
                        phone:`${index}${index}${index}`
                    },
                    (err)=>{
                        if(err) {
                            cb(err);
                        } else {
                            addOrders(index+1, count, cb);
                        }
                    });
            } else {
                cb();
            }
        }
    });

    let router, method, model;
    describe('Setup', ()=>{
        it('Create method', ()=>{
            const ROUTE = '/api/orders/delete';
            const METHOD = 'DELETE';
            router = new Router();
            method = api.app_server.routerHelper.createHandler(router, 'http/api/orders/delete/delete.js');
            assert.equal(method.route, ROUTE);
            assert.equal(method.method, METHOD);
            Delete = Delete.bind(undefined, (req)=>{
            });
        });
    });

    describe('Main cases', (done)=>{
        before((done)=>{
            assert(!global.g_application);
            global.g_application = {};
            Model.create(createDbName('main'), (err, m)=>{
                model = m;
                g_application.model = model;
                done();
            });
        });

        after((done)=>{
            global.g_application = undefined;
            model.close(done);
        });

        it('Add 10 orders', (done)=>{
            addOrders(0, 10, (err)=>{
                assert(!err);
                done();
            });
        });

        it('Count orders', (done)=>{
            model.orders.count((err, count)=>{
                assert(!err);
                assert.equal(count, 10);
                done();
            });
        });

        it('Delete not existing order', (done)=>{
            const req = new Delete(
                {
                    id:'1000',
                }
            );

            const res = new Response();
            res.wait(()=>{
                //console.log('res:', res);
                assert.equal(200, res.result.code);
                assert(!res.result.value);

                model.orders.count((err, count)=>{
                    assert(!err, err);
                    assert.equal(count, 10);
                    done();
                });
            });

            router.handle(method.route, req, res, router.next);        
        });

        it('Delete existing order 1', (done)=>{
            const req = new Delete(
                {
                    id:'1',
                }
            );

            const res = new Response();
            res.wait(()=>{
                //console.log('res:', res);
                assert.equal(200, res.result.code);
                assert(!res.result.value);

                model.orders.count((err, count)=>{
                    assert(!err, err);
                    assert.equal(count, 9);
                    done();
                });
            });

            router.handle(method.route, req, res, router.next);        
        });

        it('Delete existing order 2', (done)=>{
            const req = new Delete(
                {
                    id:'2',
                }
            );

            const res = new Response();
            res.wait(()=>{
                //console.log('res:', res);
                assert.equal(200, res.result.code);
                assert(!res.result.value);

                model.orders.count((err, count)=>{
                    assert(!err, err);
                    assert.equal(count, 8);
                    done();
                });
            });

            router.handle(method.route, req, res, router.next);        
        });

        it('Delete existing order 3', (done)=>{
            const req = new Delete(
                {
                    id:'3',
                }
            );

            const res = new Response();
            res.wait(()=>{
                //console.log('res:', res);
                assert.equal(200, res.result.code);
                assert(!res.result.value);

                model.orders.count((err, count)=>{
                    assert(!err, err);
                    assert.equal(count, 7);
                    done();
                });
            });

            router.handle(method.route, req, res, router.next);        
        });
    });

    describe('Error cases', (done)=>{
        before((done)=>{
            assert(!global.g_application);
            global.g_application = {};
            Model.create(createDbName('errors'), (err, m)=>{
                model = m;
                g_application.model = model;
                done();
            });
        });

        after((done)=>{
            global.g_application = undefined;
            model.close(done);
        });

        it('Add 10 orders', (done)=>{
            addOrders(0, 10, (err)=>{
                assert(!err);
                done();
            });
        });

        it('Count orders', (done)=>{
            model.orders.count((err, count)=>{
                assert(!err);
                assert.equal(count, 10);
                done();
            });
        });

        it('Delete order, missing id', (done)=>{
            const req = new Delete(
                {
                }
            );

            const res = new Response();
            res.wait(()=>{
                //console.log('res:', res);
                assert.equal(400, res.result.code);
                assert(res.result.value);
                done();
            });

            router.handle(method.route, req, res, router.next);        
        });

        it('Count orders', (done)=>{
            model.orders.count((err, count)=>{
                assert(!err);
                assert.equal(count, 10);
                done();
            });
        });
    });
});
