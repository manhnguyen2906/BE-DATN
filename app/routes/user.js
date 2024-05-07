
var resp = require('../response');
var users = require('../lib/user/index');
// var middlewarePermission = require('../middleware/checkPermission');

module.exports = function (app, passport) {
    // Tạo mới người dùng
    app.post('/signup', (req, res) => {
        // console.log("data", req.body);
        users.Signup(req).then((ok) => {
            resp.sendOK(res, req, ok)
        }).catch(function (err) {
            resp.throws(res, req, err)
        })
    });
    // đăng nhập
    app.post('/login', (req, res) => {
        console.log("data", req.body);
        users.Login(req.body).then((ok) => {
            resp.sendOK(res, req, ok)
        }).catch(function (err) {
            resp.throws(res, req, err)
        })
    });
    // Đọc danh sách 
    app.get('/users', (req, res) => {
        users.allUser().then((ok) => {
            resp.sendOK(res, req, ok)
        }).catch(function (err) {
            resp.throws(res, req, err)
        })
    })
    // Cập nhật 
    app.put('/users/:id', (req, res) => {
        users.updateUser(req.params.id, req).then((ok) => {
            resp.sendOK(res, req, ok)
        }).catch(function (err) {
            resp.throws(res, req, err)
        })
    });
    // Xóa 
    app.delete('/users/:id', (req, res) => {
        users.deleteUser(req.params.id).then((ok) => {
            resp.sendOK(res, req, ok)
        }).catch(function (err) {
            resp.throws(res, req, err)
        })
    });
    // Tìm kiếm
    app.post('/users/:data', (req, res) => {
        users.SearchUser(req.params).then((ok) => {
            resp.sendOK(res, req, ok)
        }).catch(function (err) {
            resp.throws(res, req, err)
        })
    });



}