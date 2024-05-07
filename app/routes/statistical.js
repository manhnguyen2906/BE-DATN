
var resp = require('../response');
var statistical = require('../lib/statistical');
// var middlewarePermission = require('../middleware/checkPermission');

module.exports = function (app, passport) {
    // Đọc danh sách http://localhost:3838/statistical?type=${this.type}
    app.get('/statistical', (req, res) => {
        console.log("data statistical", req.query.type);
        statistical.allOrder(req.query.type).then((ok) => {
            resp.sendOK(res, req, ok)
        }).catch(function (err) {
            resp.throws(res, req, err)
        })
    })

}