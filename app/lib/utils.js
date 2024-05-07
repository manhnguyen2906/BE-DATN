var moment = require('moment');
var cheerio = require('cheerio');
// var jwt = require(`../../config/jwt`);
var models = require('../models/products');
_async = require('async');
const _ObjectId = require('mongodb').ObjectId;
const _Excel = require('exceljs');
// const fsx =  require('fs.extra');
const { use } = require('passport');

exports.validateEmail = function (email) {
    var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

exports.validatePhone = function (phone) {
    if (phone === null) {
        return true;
    }
    return /^(0|84)(9|3|7|8|5)[0-9]{8}/.test(phone);
}

exports.validateDate = function (date) {
    if (date === null) {
        return false;
    }
    return moment(date, "YYYY-MM-DD", true).isValid();
}

/**
 * hàm thay thế tất cả chuỗi find thành chuỗi replace trong str
 * @param {*} str chuỗi đầu vào
 * @param {*} find chuỗi cần tìm 
 * @param {*} replace chuỗi cần thay thế
 * @returns {string} chuỗi đầu ra khi thay thế toàn bộ find thành replace
 */
exports.replaceAll = function (str, find, replace) {
    if (typeof str !== 'string') return str;
    return str.replace(new RegExp(_.escapeRegExp(find), 'g'), replace);
}

/**
 * hàm lấy nội dung của mã html
 * @param {*} str mã HTML truyền vào
 * @returns {string} nội dung của mã html đầu vào
 */
exports.plainTextHTML = function (str) {
    const $ = cheerio.load(str);
    plainText = $.text();
    return plainText;
}


/**
 * tìm kiếm giá trị của vị trí của val trong mảng arr1 trong mảng arr2
 * @param {*} val giá trị bạn muốn tìm kiếm trong mảng arr1
 * @param {array} arr1 mảng nguồn chứa các giá trị.
 * @param {array} arr2 mảng đích, chứa các giá trị tương ứng với arr1.
 * @returns {*} tìm kiếm giá trị của (vị trí của val trong mảng arr1) trong mảng arr2
 */
exports.switch = function (val, arr1, arr2) {
    return arr2[arr1.indexOf(val)];
}
/**
 * tìm source của user, ticket thông qua key source
 * @param {*} source 
 * @returns 
 */
exports.getSource = function (source) {
    return jwt.source[source];
}
//Chuyển từ số thành Chữ cái (Tên cột trong excel)
//VD: 1 - A, 2 - B
exports.columnToLetter = function (column) {
    var temp, letter = '';
    while (column > 0) {
        temp = (column - 1) % 26;
        letter = String.fromCharCode(temp + 65) + letter;
        column = (column - temp - 1) / 26;
    }
    return letter;
}

/**
 * chuyển mảng string thành mảng ObjectId
 * @param {array} arr mảng đầu vào (array string) 
 * @returns {array} mảng đầu ra (array ObjectID)
 */
exports.arrayObjectId = function (arr) {
    return _.chain(arr).map(function (id) {
        return new mongodb.ObjectId(id);
    }).value();
}

exports.stringRegex = function (text) {
    var txt = text.toLowerCase().replace(/^(\s*)|(\s*)$/g, '').replace(/\s+/g, ' ');

    var ss = '';

    function isValidCharacter(str) {
        return !/[~`!#$%\^&*+=\-\[\]\\';,/{}()|\\":<>\?]/g.test(str);
    }

    for (var i = 0; i < txt.length; i++) {
        ss = isValidCharacter(txt[i]) ? ss.concat(txt[i]) : ss.concat('\\', txt[i]);
    }
    txt = ss;

    var a = 'àáảãạâầấẩẫậăằắẳẵặa';
    var d = 'đd';
    var u = 'ùúủũụưừứửữựu';
    var i = 'ìíỉĩịi';
    var e = 'èéẻẽẹêềếểễệe';
    var o = 'òóỏõọôồốổỗộơờớởỡợo';
    var y = 'ỳýỷỹỵy';
    var str = '';
    for (var k = 0; k < txt.length; k++) {
        if (a.indexOf(txt[k]) >= 0) {
            str = str + '[' + a + ']';
        }
        else if (d.indexOf(txt[k]) >= 0) {
            str = str + '[' + d + ']';
        }
        else if (u.indexOf(txt[k]) >= 0) {
            str = str + '[' + u + ']';
        }
        else if (i.indexOf(txt[k]) >= 0) {
            str = str + '[' + i + ']';
        }
        else if (e.indexOf(txt[k]) >= 0) {
            str = str + '[' + e + ']';
        }
        else if (o.indexOf(txt[k]) >= 0) {
            str = str + '[' + o + ']';
        }
        else if (y.indexOf(txt[k]) >= 0) {
            str = str + '[' + y + ']';
        }
        else {
            str = str + txt[k];
        }
    }
    return str;
}

exports.regexAgg = function (text) {
    return { $regex: new RegExp(_.stringRegex(text), 'i') };
}

exports.cleanString = function (str) {
    return str.toLowerCase()
        .replace(/_/g, ' ')
        .replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a')
        .replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e')
        .replace(/ì|í|ị|ỉ|ĩ/g, 'i')
        .replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o')
        .replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u')
        .replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y')
        .replace(/đ/g, 'd')
        .replace(/!|@|\$|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\'| |\'|\&|\#|\[|\]|~/g, ' ')
        .replace(/-+-/g, ' ')
        .replace(/^\-+|\-+$/g, ' ');
}
/**
 * xóa key và value tương ứng, key thuộc array
 * @param {*} body 
 * @param {array} array 
 * @returns body sau khi xóa key và value tương ứng
 */
exports.deleteKeys = function (body, array) {
    if (!_.isArray(array)) return body;
    _.chain(array)
        .each((item) => {
            delete body[item]
        });
    return body;
}

/**
 * validate số điện thoại
 * @param {string} string 
 * @returns {boolen} kêt quả validate
 */
exports.validatePhoneNumber = function (string) {
    if (!_.isString(string)) return false;
    var phoneReg = new RegExp('^\\d+$');
    return string.match(phoneReg)
}

/**
 * đưa ra mảng số lần gọi và lần comment cuối tương ứng - dùng cho api hello bacsi va websale report
 * @param {*} arr 
 * @returns {array}  mảng số lần gọi và lần comment cuối tương ứng
 */
exports.splitArrayByCallId = function (arr) {
    // đầu vào không phải mảng => trả về 2 mảng null
    if (!_.isArray(arr)) return [[], []];
    const elementsWithoutCallId = []; // mảng chứa các comment 
    const elementsWithCallId = []; // mảng chứa các cuộc gọi
    let lastElementWithoutCallId;
    _.chain(arr)
        .each((item, index) => {
            if (item.call_id) {
                // nếu chưa có cuộc gọi nào
                if (elementsWithCallId.length <= 0) {
                    // nếu đó là phần tử cuối có call_id
                    if (index == arr.length - 1) {
                        // comment là rỗng => gọi nhưng chưa kịp comment
                        elementsWithoutCallId.push({});
                    }
                    // thêm vào mảng danh sách call_id
                    elementsWithCallId.push(item);
                } else {
                    // Nếu phần tử call_id là phần tử đầu tiên
                    if (index == 0) {
                        elementsWithCallId.push(item);
                        // nếu phần tử có call_id là phần tử cuối cùng
                    } else if (index == arr.length - 1) {
                        // nếu trước đó là 1 phần tử có call_id
                        if (arr[index - 1].call_id) {
                            // thêm comment rỗng cho phần tử call_id trước đó
                            elementsWithoutCallId.push({});
                        } else {
                            // thêm comment cuối liền trước cho phẩn tử có call_id trước
                            elementsWithoutCallId.push(arr[index - 1]);
                        }
                        // thêm vào danh sách cuộc gọi
                        elementsWithCallId.push(item);
                        // thêm comment rỗng cho cuộc gọi này
                        elementsWithoutCallId.push({});
                    } else {
                        // nếu trước đó là 1 phần tử có call_id
                        if (arr[index - 1].call_id) {
                            // thêm comment rỗng cho phần tử call_id trước đó
                            elementsWithoutCallId.push({});
                        } else {
                            // thêm comment cuối liền trước cho phẩn tử có call_id trước
                            elementsWithoutCallId.push(arr[index - 1])
                        }
                        // thêm vào danh sách cuộc gọi
                        elementsWithCallId.push(item);
                    }
                }
                // chưa có cuộc gọi nào => bỏ qua tất cả các comment này
            } else if (elementsWithCallId.length <= 0) {

                // nếu phần tử cuối là phần tử không có call_id, đã có cuộc gọi
            } else if (index == arr.length - 1) {
                // thêm comment cuối cho cuộc gọi có call_id gần nhất
                elementsWithoutCallId.push(item);
            }
        })
    return [elementsWithoutCallId, elementsWithCallId]
}


/**
 * lấy danh sách service từ db_acd mysql và đưa về object dạng key:id, value:name
 * @param {string} tenant_id tenant_id của dự án
 * @param {function} callback hàm gọi lại khi nhận được kết quả
 * @returns {object} kết quả object dạng key:id, value:name
 */
exports.getService = function (tenant_id, callback) {
    try {
        let knex = models.acd.table.select('id', 'name').from('3c_service');
        if (tenant_id) {
            knex.where(`tenant_id`, tenant_id);
        }
        knex
            .then(services => {
                // console.log(services);
                services = services.reduce((memo, el) => {
                    memo[el.id] = el.name;
                    return memo;
                }, {})
                return callback(null, services)
            }).catch(error => {
                return callback(error, null);
            })
    } catch (error) {
        return callback(error, null);
    }
}

/**
 * set độ rộng cho cột trong bảng trong excel
 * @param {*} worksheet đối tượng sheet trong excel 
 * @param {array} valueWidthColumn mảng độ dài tương ứng cột trong bảng
 */
exports.setWeightColumn = function (worksheet, valueWidthColumn) {
    _.each(valueWidthColumn, function (item, index) {
        worksheet.getColumn(++index).width = item || 25;
    })
}
/**
 * tạo title cho excel
 * @param {*} worksheet đối tượng sheet trong excel 
 * @param {string} titleReport tiêu đề của excel: vd: Báo cáo websale
 * @param {string} projectName tên dự án
 * @param {string} startDate ngày bắt đầu: YYYY-MM-DD HH:mm:ss 
 * @param {string} endDate ngày kết thúc: YYYY-MM-DD HH:mm:ss 
 * @param {*} titleHeadTable mảng danh sách các header của table excel
 */
exports.creatTitleExcel = function (worksheet, titleReport, projectName, startDate, endDate, titleHeadTable) {
    worksheet.addRow(['']);
    worksheet.addRow(['TELEHUB T3', '',
        '', '',
        'CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM']);
    worksheet.lastRow.alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.lastRow.font = { name: 'Time New Roman', size: 13, bold: true };
    worksheet.mergeCells('A2:D2');
    worksheet.mergeCells('E2:J2');

    worksheet.addRow([`${projectName}`, '',
        '', '',
        'Độc lập - Tự do - Hạnh phúc']);
    worksheet.lastRow.alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.lastRow.font = { name: 'Time New Roman', size: 13, bold: true }
    worksheet.mergeCells('A3:D3');
    worksheet.mergeCells('E3:J3');

    worksheet.addRow(['']);
    worksheet.addRow(['']);

    worksheet.addRow([titleReport]);
    worksheet.lastRow.alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.lastRow.font = { name: 'Time New Roman', family: 4, size: 18, underline: 'true', bold: true };
    // if(titleHeadTable.length >= 10){
    worksheet.mergeCells(`A6:J6`);
    // }else{
    //     worksheet.mergeCells(`A6:${_.columnToLetter(1 + titleHeadTable.length - 1)}6`);
    // }
    const column6 = worksheet.getRow(6);
    column6.height = 30;

    let str = '(Thời gian từ ngày: ';
    str += (startDate ? (startDate + " ") : "...");
    str += (endDate ? ("đến ngày " + endDate + ")") : "đến ngày ... )");
    worksheet.addRow([str]);
    worksheet.lastRow.font = { name: 'Time New Roman', size: 13 };
    worksheet.lastRow.alignment = { vertical: 'middle', horizontal: 'center' };
    // if(titleHeadTable.length >= 10){
    worksheet.mergeCells(`A7:J7`);
    // }else{
    //     worksheet.mergeCells(`A7:${_.columnToLetter(1 + titleHeadTable.length - 1)}7`);
    // }
    worksheet.addRow([""]);
}
/**
 * tạo header cho file excel => không merge cells
 * @param {*} worksheet đối tượng sheet trong excel 
 * @param {*} titleHeadTable mảng danh sách các header của table excel
 */
exports.createHead = function (worksheet, titleHeadTable) {
    //Header 01
    worksheet.addRow(_.pluck(titleHeadTable, 'value'));

    worksheet.lastRow.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    worksheet.lastRow.font = { name: 'Time New Roman', underline: 'true', bold: true, size: 11, color: { argb: 'FFFFFF' } };
    worksheet.lastRow.height = 30;

    for (var i = 1; i <= titleHeadTable.length; i++) {
        let charNameColumn = _.columnToLetter(i);
        const cell = worksheet.lastRow.getCell(charNameColumn)
        cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" }
        }
        // cell.fill  = {type: 'pattern', pattern: 'solid',fgColor: { argb: '0066FF' }};
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '585858' } };
    }
}

/**
 * 
 * @param {*} status 
 * @returns 
 */
exports.getStatus = function (status) {
    let allStt = {
        1: 'Chờ xử lý',
        2: 'Đang xử lý',
        3: 'Đã xử lý',
        // 4:'Reopen',
        5: 'Hoàn thành'
    };
    return allStt[status];
}

/**
 * chuyển chuỗi sang date
 * @param {*} date 
 * @returns 
 */
exports.convertDate = function (date) {
    try {
        return _moment(new Date(date)).format(`YYYY-MM-DD HH:mm:ss`);
    } catch (error) {
        return ``
    }
}

exports.getDate = function (date) {
    try {
        return _moment(new Date(date)).format(`DD/MM/YYYY`);
    } catch (error) {
        return ``
    }
}

exports.getTime = function (date) {
    try {
        return _moment(new Date(date)).format(`HH:mm:ss`);
    } catch (error) {
        return ``
    }
}



exports.getTicketDone = function (tickets) {
    try {
        return _.filter(tickets, (ticket) => { return ticket.status === 5 });
    } catch (error) {
        return 0;
    }
}

exports.getServicesWithAsnc = async (tenant_id) => {
    return new Promise((resolve, reject) => {
        try {
            let knex = models.acd.table.select('id', 'name').from('3c_service');
            if (tenant_id) {
                knex.where('tenant_id', tenant_id);
            }
            knex
                .then((services) => {
                    services = services.reduce((memo, el) => {
                        memo[el.id] = el.name;
                        return memo;
                    }, {});
                    resolve(services);
                })
                .catch((error) => {
                    reject(error);
                });
        } catch (error) {
            reject(error);
        }
    });
}

exports.convertDateMonth = function (date) {
    try {
        return _moment(new Date(date)).month() + 1;
    } catch (error) {
        return ``
    }
}

/**
 * xuất file excel
 * @param {*} dataMap => data
 * @param {*} req 
 * @param {*} res 
 * @param {*} tenant_id id dự án
 * @param {*} titleHeadTable danh sách các header của bảng excel
 * @param {*} titleReport tiêu đề file excel
 * @param {*} startTime ngày bắt đầu
 * @param {*} endTime ngày kết thúc
 */

// exports.exportExcel = function(dataMap, req, res, tenant_id, titleHeadTable, titleReport, startTime, endTime, folder, name){
//     var waterFallTask = [];

//     waterFallTask.push(function(next){
//         models.mongo.account.aggregate([{ $match: { _id: _ObjectId(tenant_id) } }], (err, account)=>{
//             if(err) next(err, null);
//             if(!account || account.length <= 0) next(new Error('Không có tenant với id ' + tenant_id), null);
//             next(err, account[0]);
//         })
//     })
//     waterFallTask.push(function (account, next) {
//         var workbook = new _Excel.Workbook();
//         workbook.creator = req.user ? req.user.displayName: 'HOÀNG ĐÌNH DŨNG - ICT-HN';
//         workbook.created = new Date();
//         next(null, account, workbook)
//     });


//     waterFallTask.push(function (account, workbook, next) {
//         var sheet = workbook.addWorksheet('sheet', { state: 'visible' });
//         _.setWeightColumn(sheet, _.pluck(titleHeadTable, 'length'));
//         _.creatTitleExcel(sheet, 
//             titleReport, 
//             account && account.name ? account.name.toUpperCase() : `ICT-HN`, 
//             startTime && _.convertDate(startTime) || ``,
//             endTime && _.convertDate(endTime) || ``,
//             titleHeadTable
//         );
//         _.createHead(sheet, titleHeadTable);

//         _.each(dataMap, dataMap_item =>{
//             _value = [];
//             _.each(titleHeadTable, titleHeadTable_item =>{
//                 _value.push(dataMap_item[titleHeadTable_item.key] || '');
//             })
//             // console.log(_value);
//             sheet.addRow(_value);
//             for (var i = 1; i <= titleHeadTable.length; i++) {
//                 let charNameColumn = _.columnToLetter(i);
//                 // console.log('charNameColumn', charNameColumn);
//                 sheet.lastRow.getCell(charNameColumn).border = {
//                     top: { style: "thin" },
//                     left: { style: "thin" },
//                     bottom: { style: "thin" },
//                     right: { style: "thin" }
//                 }
//             }
//         })
//         sheet.addRow([]);
//         next(null, workbook);
//     });


//     waterFallTask.push(
//         function (workbook, next) {
//             fsx.mkdirs(path.join('uploads', 'report', folder), function (error, result) {
//                 next(error, workbook);
//             });
//         },
//         function (workbook, next) {
//             var currentDate = new Date();
//             var fileName = path.join('uploads', 'report', folder, name + moment().format("YYYY_MM_DD_HH_mm_ss") + '.xlsx');
//             workbook.xlsx.writeFile(fileName).then(function (error, result) {
//                 next(error,fileName);
//             });
//         }
//     );

//     _async.waterfall(waterFallTask, function (error, result) {
//         if(error){
//             resp.throws(res, req, error)
//         }else{
//             res.download(result)
//         }
//     });
// }

/**
 * validate email
 * @param {string} email 
 * @returns {boolen} kêt quả validate
 */
exports.validateEMAIL = function (string) {
    if (!_.isString(string)) return false;
    var phoneReg = new RegExp(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/);
    return string.match(phoneReg)
}

exports.getAgent = function (tenant_id, callback) {
    try {
        let aggs = [];
        aggs.push({ $match: { tenant_id: tenant_id } });
        aggs.push({ $match: { role: { $ne: 'end_user' } } });
        models.mongo.user.aggregate(aggs, (err, users) => {
            if (err) return callback(err, users);
            users = users.reduce((memo, user) => {
                memo[user._id] = user.name;
                return memo;
            }, {});
            return callback(err, users);

        })
    } catch (error) {
        return callback(error, null);
    }
}

exports.trimData = function (obj) {
    if (!_.isObject(obj)) return obj;
    return _.chain(Object.keys(obj))
        .reduce((memo, key) => {
            if (_.isString(obj[key])) obj[key] = _.trim(obj[key]);
            memo[key] = obj[key];
            return memo;
        }, {})
        .value();
}

exports.isObjectId = function (str) {
    try {
        const objectId = new _ObjectId(str);
        // Nếu không có lỗi, đây là một ObjectId hợp lệ
        return true;
    } catch (error) {
        // Nếu có lỗi, đây không phải là một ObjectId hợp lệ
        return false;
    }
}

exports.capitalizeFirstLetter = function (str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

exports.capitalize = function (cityName) {
    if (cityName.length > 0) {
        return cityName.split(' ').map(word => _.capitalizeFirstLetter(word)).join(' ');
    } else {
        return cityName;
    }
}
exports.formatPrice = async (price) => {
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    }).format(price);
}