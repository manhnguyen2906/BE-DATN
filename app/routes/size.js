
var resp = require('../response');
var sizes = require('../lib/size/index');
// var middlewarePermission = require('../middleware/checkPermission');

module.exports = function (app, passport) {
    // Tạo mới 
    app.post('/sizes', (req, res) => {
        console.log("data", req.body);
        sizes.createSize(req.body).then((ok) => {
            resp.sendOK(res, req, ok)
        }).catch(function (err) {
            resp.throws(res, req, err)
        })
    }),
        // Đọc danh sách 
        app.get('/sizes', (req, res) => {
            sizes.allSize().then((ok) => {
                resp.sendOK(res, req, ok)
            }).catch(function (err) {
                resp.throws(res, req, err)
            })
        })
    // Đọc danh sách hoạt động
    app.get('/sizes-on', (req, res) => {
        sizes.allSizeOn().then((ok) => {
            resp.sendOK(res, req, ok)
        }).catch(function (err) {
            resp.throws(res, req, err)
        })
    })
    // Cập nhật 
    app.put('/sizes/:id', (req, res) => {
        sizes.updateSize(req.params.id, req.body).then((ok) => {
            resp.sendOK(res, req, ok)
        }).catch(function (err) {
            resp.throws(res, req, err)
        })
    });
    // Xóa 
    app.delete('/sizes/:id', (req, res) => {
        sizes.deleteSize(req.params.id).then((ok) => {
            resp.sendOK(res, req, ok)
        }).catch(function (err) {
            resp.throws(res, req, err)
        })
    });

    // Tìm kiếm
    app.post('/sizes/:data', (req, res) => {
        sizes.searchSize(req.params).then((ok) => {
            resp.sendOK(res, req, ok)
        }).catch(function (err) {
            resp.throws(res, req, err)
        })
    });


}