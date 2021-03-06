'use strict';

describe('yeap_app_server_example.http.api.customers.get.js', ()=>{

    const assert = require('assert');
    let api;
    let Router, Response, Get;
    let helpers, Model, createDbName;
    let addCustomers;
    before(()=>{
        api = require('yeap_app_server');
        const dev_tools = require('yeap_dev_tools');
        Router = dev_tools.express.Router;
        Response = dev_tools.express.Response;
        Get = dev_tools.express.Get;
        helpers = api.db.postgres.helpers;
        Model = require('../../../../../src/Model');
        createDbName=(name)=>{ return api.db.Db.createDbName('http_api_customers_get_') + name };
        addCustomers = (index, count, cb)=>{
            if(index<count) {
                model.customers.create(
                    {
                        name:`SomeName-${index}`,
                        phone:`${index}${index}${index}`
                    },
                    (err)=>{
                        if(err) {
                            cb(err);
                        } else {
                            addCustomers(index+1, count, cb);
                        }
                    });
            } else {
                cb();
            }
        }
        process.env.YEAP_APP_SERVER_ROOT = __dirname + '/../../../../../';
    });

    after(()=>{
        process.env.YEAP_APP_SERVER_ROOT = undefined;
    });

    let router, method, model;
    describe('Setup', ()=>{
        it('Create method', ()=>{
            const ROUTE = '/api/customers';
            const METHOD = 'GET';
            router = new Router();
            method = api.app_server.routerHelper.createHandler(router, 'http/api/customers/get.js');
            assert.equal(method.route, ROUTE);
            assert.equal(method.method, METHOD);
            Get = Get.bind(undefined, (req)=>{
            });
        });
    });

    describe('Main cases', (done)=>{
        before((done)=>{
            assert(!global.g_application);
            global.g_application = {};
            Model.create(helpers.DB_CRIDENTIALS, createDbName('main'), (err, m)=>{
                model = m;
                g_application.model = model;
                done();
            });
        });

        after((done)=>{
            global.g_application = undefined;
            model.close(done);
        });

        it('Collecting empty model', (done)=>{
            const req = new Get(
                {
                }
            );

            const res = new Response();
            res.wait(()=>{
              //console.log('res:', res);
                assert.equal(200, res.result.code);
                assert(res.result.value);

                model.customers.count((err, count)=>{
                    assert(!err, err);
                    assert.equal(count, 0);
                    done();
                });
            });

            router.handle(method.route, req, res, router.next);        
        });

        it('Add 1 record', (done)=>{
            addCustomers(0, 1, (err)=>{
                assert(!err);
                model.customers.count((err, count)=>{
                    assert(!err);
                    assert.equal(count, 1);
                    done();
                });
            })
        });

        it('Collecting customers with 1 record', (done)=>{
            const req = new Get(
                {
                }
            );

            const res = new Response();
            res.wait(()=>{
              //console.log('res:', res);
                assert.equal(200, res.result.code);
                assert(res.result.value);

                const customers = res.result.value.customers;
                assert.equal(1, Object.keys(customers).length);
                assert.equal(customers[0].cid, '1');
                assert.equal(customers[0].name, 'SomeName-0');
                assert.equal(customers[0].phone, '000');
                done();
            });

            router.handle(method.route, req, res, router.next);        
        });

        it('Add 5 records', (done)=>{
            addCustomers(1, 6, (err)=>{
                assert(!err);
                model.customers.count((err, count)=>{
                    assert(!err);
                    assert.equal(count, 1+5);
                    done();
                });
            })
        });

        it('Collecting customers with 6 record', (done)=>{
            const req = new Get(
                {
                }
            );

            const res = new Response();
            res.wait(()=>{
              //console.log('res:', res);
                assert.equal(200, res.result.code);
                assert(res.result.value);

                const customers = res.result.value.customers;
                assert.equal(1+5, Object.keys(customers).length);
                assert.equal(customers[0].cid, '1');
                assert.equal(customers[0].name, 'SomeName-0');
                assert.equal(customers[0].phone, '000');
                    assert.equal(customers[1].cid, '2');
                    assert.equal(customers[1].name, 'SomeName-1');
                    assert.equal(customers[1].phone, '111');
                assert.equal(customers[2].cid, '3');
                assert.equal(customers[2].name, 'SomeName-2');
                assert.equal(customers[2].phone, '222');
                    assert.equal(customers[3].cid, '4');
                    assert.equal(customers[3].name, 'SomeName-3');
                    assert.equal(customers[3].phone, '333');
                assert.equal(customers[4].cid, '5');
                assert.equal(customers[4].name, 'SomeName-4');
                assert.equal(customers[4].phone, '444');
                    assert.equal(customers[5].cid, '6');
                    assert.equal(customers[5].name, 'SomeName-5');
                    assert.equal(customers[5].phone, '555');
                done();
            });

            router.handle(method.route, req, res, router.next);        
        });

        it('Collecting customer by id', (done)=>{
            const req = new Get(
                {
                    cid:'1'
                }
            );

            const res = new Response();
            res.wait(()=>{
              //console.log('res:', res);
                assert.equal(200, res.result.code);
                assert(res.result.value);

                const customer = res.result.value;
                assert.equal(customer.name, 'SomeName-0');
                assert.equal(customer.phone, '000');
                done();
            });

            router.handle(method.route, req, res, router.next);        
        });
    });

    describe('Error cases', (done)=>{
        before((done)=>{
            assert(!global.g_application);
            global.g_application = {};
            Model.create(helpers.DB_CRIDENTIALS, createDbName('errors'), (err, m)=>{
                model = m;
                g_application.model = model;
                done();
            });
        });

        after((done)=>{
            global.g_application = undefined;
            model.close(done);
        });

        it('Collecting customer by missing id', (done)=>{
            const req = new Get(
                {
                    cid:'1000'
                }
            );

            const res = new Response();
            res.wait(()=>{
              //console.log('res:', res);
                assert.equal(204, res.result.code);
                assert(!res.result.value);
                done();
            });

            router.handle(method.route, req, res, router.next);        
        });
    });
});

