//const { request } = require('express')
const jwt = require('jsonwebtoken')
const db = require('./config/db')
const jwtSecret = "djfudnsqlalfKeyFmfRkwu"
const firebase = require("firebase-admin");
const fcmNode = require("fcm-node");
const serviceAccount = require("./config/privatekey_firebase.json");
const { insertQuery } = require('./query-util');
const firebaseToken = 'fV0vRpDpTfCnY_VggFEgN7:APA91bHdHP6ilBpe9Wos5Y72SXFka2uAM3luANewGuw7Bx2XGnvUNjK5e5k945xwcXpW8NNei3LEaBtKT2_2A6naix8Wg5heVik8O2Aop_fu8bUibnGxuCe3RLQDtHNrMeC5gmgGRoVh';
const fcmServerKey = "AAAAyc6UIaw:APA91bFEm_fc-0_cA8ZrxvB078OAhHRds_bPLuP3x9I6AT25Y-NwkOgKCqnbFvhvnSGajo3XAiOaOZkxGLl1mL8flZrJ29K2_k9nRR0NOTG4kcF0Pd4e33XcqvUFV1w4T-UAlE5oeuLY";
firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount)
});
const sendAlarm = (title, note, url, table, pk) => {
    console.log(title)
    console.log(note)
    console.log(table)
    console.log(pk)
    let fcm = new fcmNode(fcmServerKey)
    let message = {
        to: '/topics/' + 'masterpick',
        "click_action": "FLUTTER_NOTIFICATION_CLICK",
        "priority": "high",
        notification: {
            title: (table == 'notice' ? '공지사항: ' : '') + title,
            body: (table == 'notice' ? '' : note),
            url: url ?? '/',
            click_action: "FLUTTER_NOTIFICATION_CLICK",
            badge: "1",
            "sound": "default"
        },
        data: {
            table: table,
            pk: pk.toString(),
            title: (table == 'notice' ? '공지사항 ' : '') + title,
            body: (table == 'notice' ? '' : note),
            url: url ?? '/'
        }
    }
    fcm.send(message, (err, res) => {
        if (err) {
            console.log("Error sending message:", err);
        } else {
            console.log("Successfully sent message:", res);
        }
    })
}
let checkLevel = (token, level) => {
    try {
        if (token == undefined)
            return false

        //const decoded = jwt.decode(token)
        const decoded = jwt.verify(token, jwtSecret, (err, decoded) => {
            //console.log(decoded)
            if (err) {
                console.log("token이 변조되었습니다." + err);
                return false
            }
            else return decoded;
        })
        const user_level = decoded.user_level

        if (level > user_level)
            return false
        else
            return decoded
    }
    catch (err) {
        console.log(err)
        return false
    }
}
const formatPhoneNumber = (input) => {
    const cleanInput = input.replaceAll(/[^0-9]/g, "");
    let result = "";
    const length = cleanInput.length;
    if (length === 8) {
        result = cleanInput.replace(/(\d{4})(\d{4})/, '$1-$2');
    } else if (cleanInput.startsWith("02") && (length === 9 || length === 10)) {
        result = cleanInput.replace(/(\d{2})(\d{3,4})(\d{4})/, '$1-$2-$3');
    } else if (!cleanInput.startsWith("02") && (length === 10 || length === 11)) {
        result = cleanInput.replace(/(\d{3})(\d{3,4})(\d{4})/, '$1-$2-$3');
    } else {
        result = undefined;
    }
    return result;
}
const lowLevelException = {
    code: 403,
    message: "권한이 없습니다."
}
const nullRequestParamsOrBody = {
    code: 400,
    message: "입력이 잘못되었습니다.(요청 데이터 확인)"
}

const logRequestResponse = (req, res) => {

    let requestIp;
    try {
        requestIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.ip || '0.0.0.0'
    } catch (err) {
        requestIp = '0.0.0.0'
    }

    let request = {
        url: req.originalUrl,
        headers: req.headers,
        query: req.query,
        params: req.params,
        body: req.body,
        file: req.file || req.files || null
    }
    request = JSON.stringify(request)
    let response = JSON.stringify(res)
    // console.log(request)
    // console.log(response)
    const decode = checkLevel(req.cookies.token, 0)
    let user_pk = 0;
    let user_id = "";
    if (decode) {
        user_pk = decode.pk;
        user_id = decode.id;
    } else {
        user_pk = -1;
    }
    db.query(
        "INSERT INTO log_table (request, response, request_ip, user_id, user_pk) VALUES (?, ?, ?, ?, ?)",
        [request, response, requestIp, user_id, user_pk],
        (err, result, fields) => {
            if (err)
                console.log(err)
            else {
                //console.log(result)
            }
        }
    )

}
const logRequest = (req) => {
    const requestIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.ip
    let request = {
        url: req.originalUrl,
        headers: req.headers,
        query: req.query,
        params: req.params,
        body: req.body
    }
    request = JSON.stringify(request)
    db.query(
        "INSERT INTO log_information_tb (request, request_ip) VALUES (?, ?)",
        [request, requestIp],
        (err, result, fields) => {
            if (err)
                console.log(err)
            else {
                console.log(result)
            }
        }
    )
}
const logResponse = (req, res) => {
    const requestIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.ip
    let response = JSON.stringify(res)
    // db.query(
    //     "UPDATE log_information_tb SET response=? WHERE request_ip=? ORDER BY pk DESC LIMIT 1",
    //     [response, requestIp],
    //     (err, result, fields) => {
    //         if(err)
    //             console.log(err)
    //         else {
    //             console.log(result)
    //         }
    //     }
    // )
}

/*

*/
const getUserPKArrStrWithNewPK = (userPKArrStr, newPK) => {
    let userPKList = JSON.parse(userPKArrStr)
    if (userPKList.indexOf(newPK) == -1)
        userPKList.push(newPK)
    return JSON.stringify(userPKList)
}

const isNotNullOrUndefined = (paramList) => {
    for (let i in paramList)
        if (i == undefined || i == null)
            return false
    return true
}

// api가 ad인지 product인지 확인 후 파일 네이밍
const namingImagesPath = (api, files) => {
    if (api == "ad") {
        return {
            image: (files) ? "/image/ad/" + files.filename : "/image/ad/defaultAd.png",
            isNull: !(files)
        }
    }
    else if (api == "product") {
        return {
            mainImage: (files.mainImage) ? "/image/item/" + files.mainImage[0].filename : "/image/item/defaultItem.png",
            detailImage: (files.detailImage) ? "/image/detailItem/" + files.detailImage[0].filename : "/image/detailItem/defaultDetail.png",
            qrImage: (files.qrImage) ? "/image/qr/" + files.qrImage[0].filename : "/image/qr/defaultQR.png",
            isNull: [!files.mainImage, !files.detailImage, !files.qrImage]
        }
    }
}
function removeItems(arr, value) {
    var i = 0;
    while (i < arr.length) {
        if (arr[i] === value) {
            arr.splice(i, 1);
        } else {
            ++i;
        }
    }
    return arr;
}

function getSQLnParams(query, params, colNames) {
    let sql = query
    let returnParams = []

    for (let i = 0, count = 0; i < params.length; i++) {
        if (params[i]) {
            if (count > 0)
                sql += ', '
            sql += colNames[i] + '=?'
            returnParams.push(params[i])
            count++
        }
    }
    return { sql, param: returnParams }
}

function response(req, res, code, message, data) {
    var resDict = {
        'result': code,
        'message': message,
        'data': data,
    }
    //logRequestResponse(req, resDict)
    res.send(resDict);
}
function nullResponse(req, res) {
    response(req, res, -200, "입력이 잘못되었습니다.(요청 데이터 확인)", [])
}
function lowLevelResponse(req, res) {
    response(req, res, -200, "권한이 없습니다", [])
}
const returnMoment = () => {
    var today = new Date();
    var year = today.getFullYear();
    var month = ('0' + (today.getMonth() + 1)).slice(-2);
    var day = ('0' + today.getDate()).slice(-2);
    var dateString = year + '-' + month + '-' + day;
    var hours = ('0' + today.getHours()).slice(-2);
    var minutes = ('0' + today.getMinutes()).slice(-2);
    var seconds = ('0' + today.getSeconds()).slice(-2);
    var timeString = hours + ':' + minutes + ':' + seconds;
    let moment = dateString + ' ' + timeString;
    return moment;
}
module.exports = {
    checkLevel, lowLevelException, nullRequestParamsOrBody,
    logRequestResponse, logResponse, logRequest,
    getUserPKArrStrWithNewPK, isNotNullOrUndefined,
    namingImagesPath, getSQLnParams,
    nullResponse, lowLevelResponse, response, removeItems, returnMoment, formatPhoneNumber, sendAlarm
}