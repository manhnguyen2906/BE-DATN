
var resp = require('../response');
var carts = require('../lib/oder/cart');
// var middlewarePermission = require('../middleware/checkPermission');

module.exports = function (app, passport) {
    // Tạo mới 
    app.post('/carts', (req, res) => {
        console.log("data", req.body);
        carts.createCart(req.body).then((ok) => {
            resp.sendOK(res, req, ok)
        }).catch(function (err) {
            resp.throws(res, req, err)
        })
    }),
        // Đọc danh sách 
        app.get('/carts', (req, res) => {
            console.log("data 1", req.query.user_id);
            carts.allCart(req.query.user_id).then((ok) => {
                resp.sendOK(res, req, ok)
            }).catch(function (err) {
                resp.throws(res, req, err)
            })
        })
    // Xóa 
    app.delete('/carts/:id', (req, res) => {
        console.log("req.params.id, product_data", req.params.id, req.body);
        carts.deleteCartItem(req.params.id, req.body.product_id).then((ok) => {
            resp.sendOK(res, req, ok)
        }).catch(function (err) {
            resp.throws(res, req, err)
        })
    });


}