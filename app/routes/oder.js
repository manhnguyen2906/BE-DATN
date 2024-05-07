
var resp = require('../response');
var oders = require('../lib/oder/oder');
// var middlewarePermission = require('../middleware/checkPermission');

module.exports = function (app, passport) {
    // Tạo mới 
    app.post('/oders', (req, res) => {
        console.log("data 111111", req.body);
        oders.createOder(req.body).then((ok) => {
            resp.sendOK(res, req, ok)
        }).catch(function (err) {
            resp.throws(res, req, err)
        })
    }),
        // Đọc danh sách 
        app.get('/oders', (req, res) => {
            console.log("data allOder", req.query.statusOder);
            oders.allOder(req.query.statusOder).then((ok) => {
                resp.sendOK(res, req, ok)
            }).catch(function (err) {
                resp.throws(res, req, err)
            })
        })
    // Đọc danh sách 
    app.get('/oders/:user_id', (req, res) => {
        console.log("data 1", req.query.user_id);
        oders.allOderByUser(req.params.user_id).then((ok) => {
            resp.sendOK(res, req, ok)
        }).catch(function (err) {
            resp.throws(res, req, err)
        })
    })

    app.put('/oders', (req, res) => {
        console.log("data updateOder", req.body);
        oders.updateOder(req.body).then((ok) => {
            resp.sendOK(res, req, ok)
        }).catch(function (err) {
            resp.throws(res, req, err)
        })
    })
    // Tìm kiếm sản phẩm
    app.post('/oders/search/:data', (req, res) => {
        products.SearchOder(req.params).then((ok) => {
            resp.sendOK(res, req, ok)
        }).catch(function (err) {
            resp.throws(res, req, err)
        })
    });
}