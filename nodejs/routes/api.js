const express = require('express')
//const { json } = require('body-parser')
const router = express.Router()
const cors = require('cors')
router.use(cors())
router.use(express.json())

const crypto = require('crypto')
//const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const { checkLevel, getSQLnParams, getUserPKArrStrWithNewPK,
    isNotNullOrUndefined, namingImagesPath, nullResponse,
    lowLevelResponse, response, removeItems, returnMoment, formatPhoneNumber, sendAlarm
} = require('../util')
const {
    getRowsNumWithKeyword, getRowsNum, getAllDatas,
    getDatasWithKeywordAtPage, getDatasAtPage,
    getKioskList, getItemRows, getItemList, dbQueryList, dbQueryRows, insertQuery, getTableAI
} = require('../query-util')

const db = require('../config/db')
const { upload } = require('../config/multerConfig')
const { Console } = require('console')
const { abort } = require('process')
const axios = require('axios')
//const { pbkdf2 } = require('crypto')
const salt = "435f5ef2ffb83a632c843926b35ae7855bc2520021a73a043db41670bfaeb722"
const saltRounds = 10
const pwBytes = 64
const jwtSecret = "djfudnsqlalfKeyFmfRkwu"

const geolocation = require('geolocation')
const kakaoOpt = {
    clientId: '4a8d167fa07331905094e19aafb2dc47',
    redirectUri: 'http://172.30.1.19:8001/api/kakao/callback',
};

router.get('/', (req, res) => {
    console.log("back-end initialized")
    res.send('back-end initialized')
});

/*
    회원가입 및 유저추가 기능입니다.
*/
const onSignUp = async (req, res) => {
    try {

        //logRequest(req)
        const id = req.body.id ?? "";
        const pw = req.body.pw ?? "";
        const name = req.body.name ?? "";
        const nickname = req.body.nickname ?? "";
        const phone = req.body.phone ?? "";
        const user_level = req.body.user_level ?? 0;
        const type_num = req.body.type_num ?? 0;
        const consulting_note = req.body.consulting_note;
        //중복 체크 
        let sql = "SELECT * FROM user_table WHERE id=? OR nickname=?"

        db.query(sql, [id, nickname], (err, result) => {
            if (result.length > 0) {
                let same_type = "";
                for (var i = 0; i < result.length; i++) {
                    if (result[i].id == id) {
                        same_type = "아이디";
                        break;
                    }
                    if (result[i].nickname == nickname) {
                        same_type = "닉네임";
                        break;
                    }
                }
                if (i != result.length) {
                    return response(req, res, -200, `${same_type}가 중복됩니다.`, [])
                }
            } else {
                crypto.pbkdf2(pw, salt, saltRounds, pwBytes, 'sha512', async (err, decoded) => {
                    // bcrypt.hash(pw, salt, async (err, hash) => {
                    let hash = decoded.toString('base64')

                    if (err) {
                        console.log(err)
                        response(req, res, -200, "비밀번호 암호화 도중 에러 발생", [])
                    }

                    sql = 'INSERT INTO user_table (id, pw, name, nickname , phone, user_level, type, consulting_note) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
                    await db.query(sql, [id, hash, name, nickname, phone, user_level, type_num, consulting_note], async (err, result) => {

                        if (err) {
                            console.log(err)
                            response(req, res, -200, "회원 추가 실패", [])
                        }
                        else {
                            await db.query("UPDATE user_table SET sort=? WHERE pk=?", [result?.insertId, result?.insertId], (err, resultup) => {
                                if (err) {
                                    console.log(err)
                                    response(req, res, -200, "회원 추가 실패", [])
                                }
                                else {
                                    response(req, res, 200, "회원 추가 성공", [])
                                }
                            })
                        }
                    })
                })
            }
        })

    }
    catch (err) {
        console.log(err)
        response(req, res, -200, "서버 에러 발생", [])
    }
}
/*
    아이디로 로그인 기능입니다.
*/
const onLoginById = async (req, res) => {
    try {
        let { id, pw } = req.body;
        if (!id) {
            return response(req, res, -100, "필요값이 비어있습니다.", [])
        }
        db.query('SELECT * FROM user_table WHERE id=?', [id], async (err, result1) => {
            if (err) {
                console.log(err)
                return response(req, res, -200, "서버 에러 발생", [])
            } else {
                if (result1.length > 0) {
                    await crypto.pbkdf2(pw, salt, saltRounds, pwBytes, 'sha512', async (err, decoded) => {
                        // bcrypt.hash(pw, salt, async (err, hash) => {
                        let hash = decoded.toString('base64');
                        if (hash == result1[0].pw) {
                            try {
                                const token = jwt.sign({
                                    pk: result1[0].pk,
                                    nickname: result1[0].nickname,
                                    id: result1[0].id,
                                    user_level: result1[0].user_level,
                                    phone: result1[0].phone,
                                    profile_img: result1[0].profile_img,
                                    type: result1[0].type
                                },
                                    jwtSecret,
                                    {
                                        expiresIn: '600m',
                                        issuer: 'fori',
                                    });
                                res.cookie("token", token, { httpOnly: true, maxAge: 60 * 60 * 1000 * 10 });
                                db.query('UPDATE user_table SET last_login=? WHERE pk=?', [returnMoment(), result1[0].pk], (err, result) => {
                                    if (err) {
                                        console.log(err)
                                        return response(req, res, -200, "서버 에러 발생", [])
                                    }
                                })
                                return response(req, res, 200, result1[0].nickname + ' 님 환영합니다.', result1[0]);
                            } catch (e) {
                                console.log(e)
                                return response(req, res, -200, "서버 에러 발생", [])
                            }
                        } else {
                            return response(req, res, -100, "아이디 또는 비밀번호를 확인해주세요.", [])

                        }
                    })
                } else {
                    return response(req, res, -100, "아이디 또는 비밀번호를 확인해주세요.", [])
                }
            }
        })

    } catch (e) {
        console.log(e)
        return response(req, res, -200, "서버 에러 발생", [])
    }
}
/*
    sns 로그인 기능입니다.
*/
const onLoginBySns = (req, res) => {
    try {
        let { id, typeNum, name, nickname, phone, user_level, profile_img } = req.body;
        console.log(req.body)
        if (!id) {
            return response(req, res, -100, "필요값이 비어있습니다.", []);
        }
        db.query("SELECT * FROM user_table WHERE id=? AND type=?", [id, typeNum], async (err, result) => {
            if (err) {
                console.log(err)
                return response(req, res, -200, "서버 에러 발생", [])
            } else {
                if (result.length > 0) {//기존유저
                    let token = jwt.sign({
                        pk: result[0].pk,
                        nickname: result[0].nickname,
                        id: result[0].id,
                        user_level: result[0].user_level,
                        phone: result[0].phone,
                        profile_img: result[0].profile_img,
                        type: typeNum
                    },
                        jwtSecret,
                        {
                            expiresIn: '600m',
                            issuer: 'fori',
                        });
                    res.cookie("token", token, { httpOnly: true, maxAge: 60 * 60 * 1000 * 10 });
                    await db.query('UPDATE user_table SET last_login=? WHERE pk=?', [returnMoment(), result[0].pk], (err, result) => {
                        if (err) {
                            console.log(err)
                            return response(req, res, -200, "서버 에러 발생", [])
                        }
                    })
                    return response(req, res, 200, result[0].nickname + ' 님 환영합니다.', result[0]);
                } else {//신규유저
                    return response(req, res, 50, '신규회원 입니다.', []);
                }
            }
        })
    } catch (e) {
        console.log(e)
        return response(req, res, -200, "서버 에러 발생", [])
    }
}

/*
    유저가 구독한 컨텐츠 불러오기 기능입니다.
*/
const getUserContent = (req, res) => {
    try {
        let { pk } = req.query;
        db.query("SELECT * FROM user_table WHERE pk=?", [pk], (err, result1) => {
            if (err) {
                console.log(err)
                return response(req, res, -200, "서버 에러 발생", [])
            } else {
                db.query("SELECT user_master_connect_table.*, master_table.pk AS master_pk, master_table.name AS master_name, master_table.profile_img FROM user_master_connect_table LEFT JOIN master_table ON user_master_connect_table.master_pk=master_table.pk WHERE user_master_connect_table.user_pk=? ORDER BY user_master_connect_table.pk DESC", [pk], (err, result2) => {
                    if (err) {
                        console.log(err)
                        return response(req, res, -200, "서버 에러 발생", [])
                    } else {
                        return response(req, res, 100, "success", { user: result1[0], subscribes: result2 })
                    }
                })
            }
        })
    } catch (e) {
        console.log(e)
        return response(req, res, -200, "서버 에러 발생", [])
    }
}
/*
    구독하기 기능입니다.
*/
const addSubscribe = (req, res) => {
    try {
        const { user_pk, master_pk } = req.body;
        db.query("SELECT * FROM user_master_connect_table WHERE user_pk=? AND master_pk=? ", [user_pk, master_pk], async (err, result) => {
            if (err) {
                console.log(err)
                return response(req, res, -200, "서버 에러 발생", [])
            } else {
                if (result.length > 0) {
                    return response(req, res, -50, "이미 구독한 거장입니다.", [])
                } else {
                    await db.query("INSERT INTO user_master_connect_table (user_pk, master_pk) VALUES (?,?)", [user_pk, master_pk], (err, result) => {
                        if (err) {
                            console.log(err)
                            return response(req, res, -200, "서버 에러 발생", [])
                        } else {
                            return response(req, res, 100, "success", [])
                        }
                    })
                }

            }
        })

    } catch (err) {
        console.log(err)
        return response(req, res, -200, "서버 에러 발생", [])
    }
}
/*
    프로필 수정 기능입니다.
*/
const uploadProfile = (req, res) => {
    try {
        const image = '/image/' + req.file.fieldname + '/' + req.file.filename;
        const id = req.body.id;
        db.query('UPDATE user_table SET profile_img=? WHERE id=?', [image, id], (err, result) => {
            if (err) {
                console.log(err)
                return response(req, res, -200, "서버 에러 발생", [])
            } else {
                return response(req, res, 100, "success", [])
            }
        })
    } catch (e) {
        console.log(e)
        return response(req, res, -200, "서버 에러 발생", [])
    }
}
/*
    자신의 정보 수정 기능입니다.
*/
const editMyInfo = (req, res) => {
    try {
        let { pw, nickname, newPw, phone, id, type } = req.body;
        crypto.pbkdf2(pw, salt, saltRounds, pwBytes, 'sha512', async (err, decoded) => {
            // bcrypt.hash(pw, salt, async (err, hash) => {
            let hash = decoded.toString('base64')

            if (err) {
                console.log(err)
                response(req, res, -200, "비밀번호 암호화 도중 에러 발생", [])
            }

            await db.query("SELECT * FROM user_table WHERE id=? AND pw=?", [id, hash], async (err, result) => {
                if (err) {
                    console.log(err);
                    response(req, res, -100, "서버 에러 발생", [])
                } else {
                    if (result.length > 0 || type != 0) {
                        if (newPw) {
                            await crypto.pbkdf2(newPw, salt, saltRounds, pwBytes, 'sha512', async (err, decoded) => {
                                // bcrypt.hash(pw, salt, async (err, hash) => {
                                let new_hash = decoded.toString('base64')
                                if (err) {
                                    console.log(err)
                                    response(req, res, -200, "새 비밀번호 암호화 도중 에러 발생", [])
                                }
                                await db.query("UPDATE user_table SET pw=? WHERE id=?", [new_hash, id], (err, result) => {
                                    if (err) {
                                        console.log(err)
                                        return response(req, res, -100, "서버 에러 발생", []);
                                    } else {
                                        return response(req, res, 100, "success", []);
                                    }
                                })
                            })
                        } else if (nickname || phone) {
                            let selectSql = "";
                            let updateSql = "";
                            let zColumn = [];
                            if (nickname) {
                                selectSql = "SELECT * FROM user_table WHERE nickname=? AND id!=?"
                                updateSql = "UPDATE user_table SET nickname=? WHERE id=?";
                                zColumn.push(nickname);
                            } else if (phone) {
                                selectSql = "SELECT * FROM user_table WHERE phone=? AND id!=?"
                                updateSql = "UPDATE user_table SET phone=? WHERE id=?";
                                zColumn.push(phone);
                            }
                            zColumn.push(id);
                            await db.query(selectSql, zColumn, async (err, result1) => {
                                if (err) {
                                    console.log(err)
                                    return response(req, res, -100, "서버 에러 발생", []);
                                } else {
                                    if (result1.length > 0) {
                                        let message = "";
                                        if (nickname) {
                                            message = "이미 사용중인 닉네임 입니다.";
                                        } else if (phone) {
                                            message = "이미 사용중인 전화번호 입니다.";
                                        }
                                        return response(req, res, -50, message, []);
                                    } else {
                                        await db.query(updateSql, zColumn, (err, result2) => {
                                            if (err) {
                                                console.log(err)
                                                return response(req, res, -100, "서버 에러 발생", []);
                                            } else {
                                                return response(req, res, 100, "success", []);
                                            }
                                        })
                                    }
                                }
                            })
                        }
                    } else {
                        response(req, res, -50, "비밀번호가 일치하지 않습니다.", [])
                    }
                }
            })
        })


    } catch (e) {
        console.log(e)
        return response(req, res, -200, "서버 에러 발생", [])
    }
}
/*
    회원 탈퇴 기능입니다.
*/
const onResign = (req, res) => {
    try {
        let { id } = req.body;
        db.query("DELETE FROM user_table WHERE id=?", [id], (err, result) => {
            if (err) {
                console.log(err)
                return response(req, res, -100, "서버 에러 발생", []);
            } else {
                return response(req, res, 100, "success", []);
            }
        })
    } catch (e) {
        console.log(e)
        return response(req, res, -200, "서버 에러 발생", [])
    }
}
/*

*/
const kakaoCallBack = (req, res) => {
    try {
        const token = req.body.token;
        async function kakaoLogin() {
            let tmp;

            try {
                const url = 'https://kapi.kakao.com/v2/user/me';
                const Header = {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                };
                tmp = await axios.get(url, Header);
            } catch (e) {
                console.log(e);
                response(req, res, -200, "서버 에러 발생", [])
            }

            try {
                const { data } = tmp;
                const { id, properties } = data;
                response(req, res, 100, "success", { id, properties });

            } catch (e) {
                console.log(e);
                response(req, res, -100, "서버 에러 발생", [])
            }

        }
        kakaoLogin();

    } catch (err) {
        console.log(err)
        response(req, res, -200, "서버 에러 발생", [])
    }
}



const sendAligoSms = ({ receivers, message }) => {
    return axios.post('https://apis.aligo.in/send/', null, {
        params: {
            key: 'xbyndmadqxp8cln66alygdq12mbpj7p7',
            user_id: 'firstpartner',
            sender: '1522-1233',
            receiver: receivers.join(','),
            msg: message
        },
    }).then((res) => res.data).catch(err => {
        console.log('err', err);
    });
}
/*
    문자발송 기능입니다.
*/
const sendSms = (req, res) => {
    try {
        let receiver = req.body.receiver;
        const content = req.body.content;
        sendAligoSms({ receivers: receiver, message: content }).then((result) => {
            console.log(result)
            if (result.result_code == '1') {
                return response(req, res, 100, "success", [])
            } else {
                return response(req, res, -100, "fail", [])
            }
        });
    } catch (e) {
        console.log(e)
        return response(req, res, -200, "서버 에러 발생", [])
    }
}
/*
    휴대폰번호로 아이디 찾기 기능입니다.
*/
const findIdByPhone = (req, res) => {
    try {
        const phone = req.body.phone;
        db.query("SELECT pk, id FROM user_table WHERE phone=?", [phone], (err, result) => {
            if (err) {
                console.log(err)
                return response(req, res, -200, "서버 에러 발생", [])
            } else {
                return response(req, res, 100, "success", result[0])
            }
        })
    } catch (e) {
        console.log(e)
        return response(req, res, -200, "서버 에러 발생", [])
    }
}
/*
    아이디와 휴대폰 번호로 유저찾기 기능입니다.
*/
const findAuthByIdAndPhone = (req, res) => {
    try {
        const id = req.body.id;
        const phone = req.body.phone;
        db.query("SELECT * FROM user_table WHERE id=? AND phone=?", [id, phone], (err, result) => {
            if (err) {
                console.log(err)
                return response(req, res, -200, "서버 에러 발생", [])
            } else {
                if (result.length > 0) {
                    return response(req, res, 100, "success", result[0]);
                } else {
                    return response(req, res, -50, "아이디 또는 비밀번호를 확인해주세요.", []);
                }
            }
        })
    } catch (e) {
        console.log(e)
        return response(req, res, -200, "서버 에러 발생", [])
    }
}
/*
    아이디 존재여부 확인 기능입니다.
*/
const checkExistId = (req, res) => {
    try {
        const id = req.body.id;
        db.query(`SELECT * FROM user_table WHERE id=? `, [id], (err, result) => {
            if (err) {
                console.log(err)
                return response(req, res, -200, "서버 에러 발생", [])
            } else {
                if (result.length > 0) {
                    return response(req, res, -50, "이미 사용중인 아이디입니다.", []);
                } else {
                    return response(req, res, 100, "사용가능한 아이디입니다.", []);
                }
            }
        })

    } catch (e) {
        console.log(e)
        return response(req, res, -200, "서버 에러 발생", [])
    }
}
/*
    닉네임 존재여부 확인 기능입니다.
*/
const checkExistNickname = (req, res) => {
    try {
        const nickname = req.body.nickname;
        db.query(`SELECT * FROM user_table WHERE nickname=? `, [nickname], (err, result) => {
            if (err) {
                console.log(err)
                return response(req, res, -200, "서버 에러 발생", [])
            } else {
                if (result.length > 0) {
                    return response(req, res, -50, "이미 사용중인 닉네임입니다.", []);
                } else {
                    return response(req, res, 100, "사용가능한 닉네임입니다.", []);
                }
            }
        })

    } catch (e) {
        console.log(e)
        return response(req, res, -200, "서버 에러 발생", [])
    }
}
/*
    비밀번호 수정 기능입니다.
*/
const changePassword = (req, res) => {
    try {
        const id = req.body.id;
        let pw = req.body.pw;
        crypto.pbkdf2(pw, salt, saltRounds, pwBytes, 'sha512', async (err, decoded) => {
            // bcrypt.hash(pw, salt, async (err, hash) => {
            let hash = decoded.toString('base64')

            if (err) {
                console.log(err)
                response(req, res, -200, "비밀번호 암호화 도중 에러 발생", [])
            }

            await db.query("UPDATE user_table SET pw=? WHERE id=?", [hash, id], (err, result) => {
                if (err) {
                    console.log(err)
                    return response(req, res, -200, "서버 에러 발생", [])
                } else {
                    return response(req, res, 100, "success", [])
                }
            })
        })
    } catch (e) {
        console.log(e)
        return response(req, res, -200, "서버 에러 발생", [])
    }
}
/*
    유저 토큰 디코딩 기능입니다.
*/
const getUserToken = (req, res) => {
    try {
        const decode = checkLevel(req.cookies.token, 0)
        if (decode) {
            let id = decode.id;
            let pk = decode.pk;
            let nickname = decode.nickname;
            let phone = decode.phone;
            let user_level = decode.user_level;
            let profile_img = decode.profile_img;
            let type = decode.type;

            res.send({ id, pk, nickname, phone, user_level, profile_img, type })
        }
        else {
            res.send({
                pk: -1,
                level: -1
            })
        }
    } catch (e) {
        console.log(e)
        return response(req, res, -200, "서버 에러 발생", [])
    }
}
/*
    로그아웃 기능입니다.
*/
const onLogout = (req, res) => {
    try {
        res.clearCookie('token')
        //res.clearCookie('rtoken')
        return response(req, res, 200, "로그아웃 성공", [])
    }
    catch (err) {
        console.log(err)
        return response(req, res, -200, "서버 에러 발생", [])
    }
}
/*
    유저 리스트 불러오기 기능입니다.
*/
const getUsers = (req, res) => {
    try {
        let sql = "SELECT * FROM user_table ";
        let pageSql = "SELECT COUNT(*) FROM user_table ";
        let page_cut = req.query.page_cut;
        let whereStr = " WHERE 1=1 ";
        if (req.query.level) {
            whereStr += ` AND user_level=${req.query.level} `;
        }
        if (!page_cut) {
            page_cut = 15
        }
        pageSql = pageSql + whereStr;
        sql = sql + whereStr + " ORDER BY sort DESC ";
        if (req.query.page) {
            sql += ` LIMIT ${(req.query.page - 1) * page_cut}, ${page_cut}`;
            db.query(pageSql, async (err, result1) => {
                if (err) {
                    console.log(err)
                    return response(req, res, -200, "서버 에러 발생", [])
                } else {
                    await db.query(sql, (err, result2) => {
                        if (err) {
                            console.log(err)
                            return response(req, res, -200, "서버 에러 발생", [])
                        } else {
                            let maxPage = result1[0]['COUNT(*)'] % page_cut == 0 ? (result1[0]['COUNT(*)'] / page_cut) : ((result1[0]['COUNT(*)'] - result1[0]['COUNT(*)'] % page_cut) / page_cut + 1);
                            return response(req, res, 100, "success", { data: result2, maxPage: maxPage });
                        }
                    })
                }
            })
        } else {
            db.query(sql, (err, result) => {
                if (err) {
                    console.log(err)
                    return response(req, res, -200, "서버 에러 발생", [])
                } else {
                    return response(req, res, 100, "success", result)
                }
            })
        }
    }
    catch (err) {
        console.log(err)
        return response(req, res, -200, "서버 에러 발생", [])
    }
}

/*
    유저 수정 기능입니다.
*/
const updateUser = (req, res) => {
    try {
        let { id, pw, name, nickname, phone, user_level, consulting_note, pk } = req.body;
        let sql = `UPDATE user_table SET id=?, name=?, nickname=?, phone=?, user_level=?,consulting_note=?`;
        let zColumn = [id, name, nickname, phone, user_level, consulting_note];
        if (pw) {
            crypto.pbkdf2(pw, salt, saltRounds, pwBytes, 'sha512', async (err, decoded) => {
                // bcrypt.hash(pw, salt, async (err, hash) => {
                let hash = decoded.toString('base64')

                if (err) {
                    console.log(err)
                    response(req, res, -200, "비밀번호 암호화 도중 에러 발생", [])
                }
                zColumn.push(hash);
                sql += `,pw=? WHERE pk=${pk}`
                await db.query(sql, zColumn, (err, result) => {
                    if (err) {
                        console.log(err)
                        response(req, res, -200, "fail", [])
                    }
                    else {
                        response(req, res, 200, "success", [])
                    }
                })
            })
        } else {
            zColumn.push(pk);
            sql += `WHERE pk=${pk}`;
            db.query(sql, zColumn, (err, result) => {
                if (err) {
                    console.log(err)
                    response(req, res, -200, "fail", [])
                }
                else {
                    response(req, res, 200, "success", [])
                }
            })
        }

    } catch (err) {
        console.log(err)
        return response(req, res, -200, "서버 에러 발생", [])
    }
}

/*
    대가 추가 기능입니다.
*/
const addMaster = (req, res) => {
    try {
        const name = req.body.name ?? "";
        const yield = req.body.yield ?? 0;

        const masterImg = '/image/' + req.file.fieldname + '/' + req.file.filename;
        const backgroundColor = req.body.backgroundColor;
        const motto = req.body.motto;
        const principle = req.body.principle;
        const style = req.body.style;
        const sectorList = req.body.sectorList;
        //중복 체크 
        db.query("INSERT INTO master_table (name, yield, profile_img, background_color, motto, investment_principle, investment_style, sector_list) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [name, masterImg, backgroundColor, motto, principle, style, sectorList], async (err, result) => {

            if (err) {
                console.log(err)
                response(req, res, -200, "fail", [])
            }
            else {
                await db.query("UPDATE master_table SET sort=? WHERE pk=?", [result?.insertId, result?.insertId], (err, resultup) => {
                    if (err) {
                        console.log(err)
                        response(req, res, -200, "fail", [])
                    }
                    else {
                        response(req, res, 200, "success", [])
                    }
                })
            }
        })
    } catch (err) {
        console.log(err)
        return response(req, res, -200, "서버 에러 발생", [])
    }
}
/*
    대가 수정 기능입니다.
*/
const updateMaster = (req, res) => {
    try {
        const name = req.body.name ?? "";
        const yield = req.body.yield ?? 0;
        const pk = req.body.pk;
        const backgroundColor = req.body.backgroundColor;
        const motto = req.body.motto;
        const principle = req.body.principle;
        const style = req.body.style;
        const sectorList = req.body.sectorList;
        let masterImg = "";
        let columns = "name=?, yield=?, background_color=?, motto=?, investment_principle=?, investment_style=?, sector_list=?";
        let zColumn = [name, yield, backgroundColor, motto, principle, style, sectorList];
        if (req.file) {
            masterImg = '/image/' + req.file.fieldname + '/' + req.file.filename;
            columns += ",profile_img=?";
            zColumn.push(masterImg);
        }
        zColumn.push(pk)
        db.query(`UPDATE master_table SET ${columns} WHERE pk=?`, zColumn, (err, result) => {
            if (err) {
                console.log(err)
                return response(req, res, -200, "서버 에러 발생", [])
            } else {
                return response(req, res, 100, "success", [])
            }
        })


    }
    catch (err) {
        console.log(err)
        return response(req, res, -200, "서버 에러 발생", [])
    }
}

/*

*/
const getChannelList = (req, res) => {
    try {
        db.query("SELECT * FROM user_table WHERE user_level IN (25, 30) ", (err, result) => {
            if (err) {
                console.log(err)
                return response(req, res, -200, "서버 에러 발생", [])
            } else {
                return response(req, res, 100, "success", result)
            }
        })
    } catch (err) {
        console.log(err)
        return response(req, res, -200, "서버 에러 발생", [])
    }
}
/*
    비디오 불러오기 기능입니다.
*/
const getVideo = (req, res) => {
    try {
        const pk = req.params.pk;
        let sql = `SELECT video_table.* , user_table.nickname, user_table.name FROM video_table LEFT JOIN user_table ON video_table.user_pk = user_table.pk WHERE video_table.pk=${pk} LIMIT 1`;
        db.query(sql, async (err, result) => {
            if (err) {
                console.log(err)
                return response(req, res, -200, "서버 에러 발생", [])
            } else {
                console.log(result)
                let relate_video = JSON.parse(result[0].relate_video);
                relate_video = relate_video.join();
                console.log(relate_video)
                await db.query(`SELECT title,date,pk FROM video_table WHERE pk IN (${relate_video})`, (err, result2) => {
                    if (err) {
                        console.log(err)
                        return response(req, res, -200, "서버 에러 발생", [])
                    } else {
                        return response(req, res, 100, "success", { video: result[0], relate: result2 })
                    }
                })
            }
        })
        db.query(sql)
    } catch (err) {
        console.log(err)
        return response(req, res, -200, "서버 에러 발생", [])
    }
}

/*
    게시물 추가 기능입니다.
*/
const addItem = (req, res) => {
    try {
        const { title, hash, suggest_title, note, user_pk, table, category, font_color, background_color } = req.body;
        let zColumn = [title, hash, suggest_title, note, user_pk, font_color, background_color];
        let columns = "(title, hash, suggest_title, note, user_pk, font_color, background_color";
        let values = "(?, ?, ?, ?, ?, ?, ?";
        if (category) {
            zColumn.push(category);
            columns += ', category_pk '
            values += ' ,? '
        }
        let image = "";
        if (req.file) {
            image = '/image/' + req.file.fieldname + '/' + req.file.filename;
        } else {
            image = req.body.url ?? "";
        }
        zColumn.push(image);
        columns += ', main_img)'
        values += ',?)'
        db.query(`INSERT INTO ${table}_table ${columns} VALUES ${values}`, zColumn, async (err, result) => {
            if (err) {
                console.log(err)
                return response(req, res, -200, "서버 에러 발생", []);
            } else {
                await db.query(`UPDATE ${table}_table SET sort=? WHERE pk=?`, [result?.insertId, result?.insertId], (err, resultup) => {
                    if (err) {
                        console.log(err)
                        response(req, res, -200, "fail", [])
                    }
                    else {
                        response(req, res, 200, "success", [])
                    }
                })
            }
        })
    } catch (err) {
        console.log(err)
        return response(req, res, -200, "서버 에러 발생", [])
    }
}

/*
    게시물 수정 기능입니다.
*/
const updateItem = (req, res) => {
    try {
        const { title, hash, suggest_title, note, user_pk, table, category, font_color, background_color, pk } = req.body;
        let zColumn = [title, hash, suggest_title, note, user_pk, font_color, background_color];
        let columns = " title=?, hash=?, suggest_title=?, note=?, user_pk=?, font_color=?, background_color=? ";
        if (category) {
            zColumn.push(category);
            columns += ', category_pk=? '
        }
        let image = "";
        if (req.file) {
            image = '/image/' + req.file.fieldname + '/' + req.file.filename;
        } else {
            image = req.body.url ?? "";
        }
        zColumn.push(image);
        columns += ', main_img=? '
        zColumn.push(pk)
        db.query(`UPDATE ${table}_table SET ${columns} WHERE pk=? `, zColumn, (err, result) => {
            if (err) {
                console.log(err)
                return response(req, res, -200, "서버 에러 발생", []);
            } else {
                return response(req, res, 100, "success", []);
            }
        })
    } catch (err) {
        console.log(err)
        return response(req, res, -200, "서버 에러 발생", [])
    }
}
/*
    게시물 불러오기 기능입니다.
*/
const getItem = (req, res) => {
    try {
        let table = req.query.table ?? "user";
        let pk = req.query.pk ?? 0;
        let whereStr = " WHERE pk=? ";
        if (table == "setting") {
            whereStr = "";
        }

        let sql = `SELECT * FROM ${table}_table ` + whereStr;

        if (req.query.views) {
            db.query(`UPDATE ${table}_table SET views=views+1 WHERE pk=?`, [pk], (err, result_view) => {
                if (err) {
                    console.log(err)
                    response(req, res, -200, "서버 에러 발생", [])
                } else {
                }
            })
        }
        db.query(sql, [pk], (err, result) => {
            if (err) {
                console.log(err)
                return response(req, res, -200, "서버 에러 발생", [])
            } else {
                return response(req, res, 100, "success", result[0])
            }
        })

    }
    catch (err) {
        console.log(err)
        return response(req, res, -200, "서버 에러 발생", [])
    }
}
/*
    공지사항 추가 기능입니다.
*/
const addNotice = (req, res) => {
    try {
        const { title, note, url, user_pk } = req.body;
        db.query("INSERT INTO notice_table ( title, note, url, user_pk) VALUES (?, ?, ?, ?)", [title, note, url, user_pk], async (err, result) => {
            if (err) {
                console.log(err)
                return response(req, res, -200, "서버 에러 발생", [])
            } else {
                sendAlarm(title, "", url, "notice", result.insertId);
                await db.query("UPDATE notice_table SET sort=? WHERE pk=?", [result?.insertId, result?.insertId], (err, resultup) => {
                    if (err) {
                        console.log(err)
                        response(req, res, -200, "fail", [])
                    }
                    else {
                        response(req, res, 200, "success", [])
                    }
                })
            }
        })
    }
    catch (err) {
        console.log(err)
        return response(req, res, -200, "서버 에러 발생", [])
    }
}
/*
    공지사항 수정 기능입니다.
*/
const updateNotice = (req, res) => {
    try {
        const { title, note, url, pk } = req.body;
        db.query("UPDATE notice_table SET  title=?, note=?, url=? WHERE pk=?", [title, note, url, pk], (err, result) => {
            if (err) {
                console.log(err)
                return response(req, res, -200, "서버 에러 발생", [])
            } else {
                return response(req, res, 100, "success", [])
            }
        })
    }
    catch (err) {
        console.log(err)
        return response(req, res, -200, "서버 에러 발생", [])
    }
}
/*
    푸시알림 추가 기능입니다.
*/
const addAlarm = (req, res) => {
    try {
        // 바로할지, 0-1, 요일, 시간, 
        const { title, url, note, type, start_date, days, time } = req.body;


        db.query("INSERT INTO alarm_table (title, url, note, type, start_date, days, time) VALUES (?, ?, ?, ?, ?, ?, ?)", [title, url, note, type, start_date, days, time], async (err, result) => {
            if (err) {
                console.log(err)
                response(req, res, -200, "알람 추가 실패", [])
            }
            else {
                if (type == 0) {
                    sendAlarm(title, note, url, "alarm", result.insertId);
                    insertQuery("INSERT INTO alarm_log_table (title, note, item_table, item_pk) VALUES (?, ?, ?, ?)", [title, note, "alarm", result.insertId])
                }
                await db.query("UPDATE alarm_table SET sort=? WHERE pk=?", [result.insertId, result.insertId], (err, result) => {
                    if (err) {
                        console.log(err)
                        response(req, res, -200, "알람 추가 실패", [])
                    }
                    else {
                        response(req, res, 200, "알람 추가 성공", [])
                    }
                })
            }
        })
    } catch (err) {
        console.log(err)
        response(req, res, -200, "서버 에러 발생", [])
    }
}
/*
    푸시알림 수정 기능입니다.
*/
const updateAlarm = (req, res) => {
    try {
        // 바로할지, 0-1, 요일, 시간, 
        const { title, note, url, type, start_date, days, time, pk } = req.body;
        db.query("UPDATE alarm_table SET title=?, note=?, url=? type=?, start_date=?, days=?, time=? WHERE pk=?", [title, note, url, type, start_date, days, time, pk], (err, result) => {
            if (err) {
                console.log(err)
                response(req, res, -200, "알람 수정 실패", [])
            }
            else {
                response(req, res, 200, "알람 수정 성공", [])
            }
        })

    } catch (err) {
        console.log(err)
        response(req, res, -200, "서버 에러 발생", [])
    }
}
/*
    필독 추가 기능입니다.
*/
const addMustRead = (req, res) => {
    try {
        const { title, note, user_pk } = req.body;
        db.query("INSERT INTO must_read_table ( title, note,user_pk) VALUES (?, ?, ?)", [title, note, user_pk], async (err, result) => {
            if (err) {
                console.log(err)
                return response(req, res, -200, "서버 에러 발생", [])
            } else {
                await db.query("UPDATE must_read_table SET sort=? WHERE pk=?", [result?.insertId, result?.insertId], (err, resultup) => {
                    if (err) {
                        console.log(err)
                        response(req, res, -200, "fail", [])
                    }
                    else {
                        response(req, res, 200, "success", [])
                    }
                })
            }
        })
    }
    catch (err) {
        console.log(err)
        return response(req, res, -200, "서버 에러 발생", [])
    }
}
/*
    필독 수정 기능입니다.
*/
const updateMustRead = (req, res) => {
    try {
        const { title, note, pk } = req.body;
        db.query("UPDATE must_read_table SET  title=?, note=? WHERE pk=?", [title, note, pk], (err, result) => {
            if (err) {
                console.log(err)
                return response(req, res, -200, "서버 에러 발생", [])
            } else {
                return response(req, res, 100, "success", [])
            }
        })
    }
    catch (err) {
        console.log(err)
        return response(req, res, -200, "서버 에러 발생", [])
    }
}
/*
    게시물 에디터 안에 이미지 추가 기능입니다.
*/
const addNoteImage = (req, res) => {
    try {
        console.log(req.file)
        if (req.file) {
            return response(req, res, 100, "success", { filename: `/image/note/${req.file.filename}` })
        } else {
            return response(req, res, -100, "이미지가 비어 있습니다.", [])
        }
    }
    catch (err) {
        console.log(err)
        return response(req, res, -200, "서버 에러 발생", [])
    }
}

/*
    대가 불러오기 기능입니다.
*/
const getMasterContent = (req, res) => {
    try {
        let { table, pk } = req.query;
        db.query(`SELECT ${table}_table.*, master_table.name AS master_name, master_table.profile_img AS master_profile_img FROM ${table}_table LEFT JOIN master_table ON ${table}_table.master_pk=master_table.pk WHERE ${table}_table.pk=?`, [pk], (err, result) => {
            if (err) {
                console.log(err)
                return response(req, res, -200, "서버 에러 발생", [])
            } else {
                return response(req, res, 100, "success", result[0])
            }
        })
    } catch (err) {
        console.log(err)
        return response(req, res, -200, "서버 에러 발생", [])
    }
}
/*
    대가 콘텐츠 불러오기 기능입니다.
*/
const getMasterContents = async (req, res) => {
    try {
        let { table, pk, order, desc, is_subscribe, user_pk, overlap_list, status } = req.body;
        let sql = "";
        let tableSelectStr = ``;
        if (table == 'master_event') {
            tableSelectStr = `${table}_table.pk, ${table}_table.name, ${table}_table.level, ${table}_table.date `;
        } else if (table == 'master_yield') {
            tableSelectStr = `${table}_table.pk, ${table}_table.name, ${table}_table.purchase_price, ${table}_table.sell_price, ${table}_table.yield, ${table}_table.period, ${table}_table.date `;
        } else if (table == 'master_subscribe') {
            tableSelectStr = `${table}_table.pk, ${table}_table.name, ${table}_table.base_price, ${table}_table.capture_date, ${table}_table.exchange_date, ${table}_table.existing_possession ,${table}_table.date `;
        } else {
            return response(req, res, -200, "잘못된 데이터 입니다.", []);
        }
        let selectStr = `SELECT ${tableSelectStr}, master_table.name AS master_name, master_table.yield_banner AS yield_banner FROM ${table}_table LEFT JOIN master_table ON ${table}_table.master_pk = master_table.pk `
        let whereStr = "";
        let orderStr = "";
        if (status) {
            whereStr += ` WHERE master_table.status=${status} `;
        }
        if (pk) {
            whereStr += ` ${status ? 'AND' : 'WHERE'} master_pk=${pk} `;
        } else if (overlap_list && overlap_list.length > 0) {
            let join = overlap_list.join();
            whereStr += ` ${status ? 'AND' : 'WHERE'} master_pk IN (${join}) `;
        }
        if (status) {

        }
        if (order) {
            orderStr = ` ORDER BY ${table}_table.${order} ${desc ? 'DESC' : 'ASC'}`;
        }
        sql = `${selectStr} ${whereStr} ${orderStr}`;
        let contents = await dbQueryList(sql);
        contents = contents?.result;
        let master = {};
        if (pk) {
            master = await dbQueryList(`SELECT * FROM master_table WHERE pk=${pk}`);
            master = master?.result[0];
        }

        return response(req, res, 100, "success", { data: contents, master: master });

    } catch (err) {
        console.log(err)
        return response(req, res, -200, "서버 에러 발생", [])
    }
}
/*
    구독한 콘텐츠 수정 기능입니다.
*/
const updateMasterContent = async (req, res) => {
    try {
        let { list, columns, table, master_pk, } = req.body;

        if (!columns || !table || !master_pk) {
            return response(req, res, -100, "필요값이 비어있습니다.", [])
        } else {
            if (typeof columns == 'string') {
                columns = JSON.parse(columns);
            }
            if (typeof list == 'string') {
                list = JSON.parse(list);
            }
            let joins = columns.join();
            db.beginTransaction();
            if (req.file) {
                let image = '/image/' + req.file.fieldname + '/' + req.file.filename;
                let image_sql = "";
                if (table == 'master_yield') {
                    image_sql = `UPDATE master_table SET yield_banner=? WHERE pk=${master_pk}`;
                }
                if (table == 'master_event') {

                }
                let image_result = await insertQuery(image_sql, [image]);
            }
            let result1 = await insertQuery(`DELETE FROM ${table}_table WHERE master_pk=?`, [master_pk]);
            let result2 = await insertQuery(`INSERT INTO ${table}_table (${joins}) VALUES ?`, [list]);

            await db.commit();
            return response(req, res, 100, "success", []);
        }
    } catch (err) {
        console.log(err)
        await db.rollback();
        return response(req, res, -200, "서버 에러 발생", [])
    }
}
/*
    거장 구독 컨텐츠 추가 기능입니다.
*/
const addSubscribeContent = (req, res) => {
    try {
        let { name, base_price, capture_date, exchange_date, existing_possession, score, weather, master_pk, main_note, take_list, operating_profit_list, company_overview_note, investment_point_list, investment_point_note,
            major_bussiness_list, major_bussiness_text, major_bussiness_note, share_list, capital_change_text, capital_change_note, investment_indicator_note, etc_note } = req.body;
        let major_bussiness_img = "";
        let investment_indicator_img = "";
        let capital_change_img = "";
        let columns = ['name', 'base_price', 'capture_date', 'exchange_date', 'existing_possession', 'score', 'weather', 'master_pk', 'main_note', 'take_list', 'operating_profit_list', 'company_overview_note', 'investment_point_list', 'investment_point_note',
            'major_bussiness_list', 'major_bussiness_text', 'major_bussiness_note', 'share_list', 'capital_change_text', 'capital_change_note', 'investment_indicator_note', 'etc_note'];
        let zColumn = [name, base_price, capture_date, exchange_date, existing_possession, score, weather, master_pk, main_note, take_list, operating_profit_list, company_overview_note, investment_point_list, investment_point_note,
            major_bussiness_list, major_bussiness_text, major_bussiness_note, share_list, capital_change_text, capital_change_note, investment_indicator_note, etc_note];
        let inputs = '(?';
        for (var i = 1; i < columns.length; i++) {
            inputs += ', ?';
        }
        columns = columns.join();
        if (req.files.major_bussiness_img) {
            major_bussiness_img = '/image/' + req.files.major_bussiness_img[0].fieldname + '/' + req.files.major_bussiness_img[0].filename;
            zColumn.push(major_bussiness_img);
            inputs += ', ?';
            columns += ', major_bussiness_img';
        }
        if (req.files.investment_indicator_img) {
            investment_indicator_img = '/image/' + req.files.investment_indicator_img[0].fieldname + '/' + req.files.investment_indicator_img[0].filename;
            zColumn.push(investment_indicator_img);
            inputs += ', ?';
            columns += ', investment_indicator_img';

        }
        if (req.files.capital_change_img) {
            capital_change_img = '/image/' + req.files.capital_change_img[0].fieldname + '/' + req.files.capital_change_img[0].filename;
            zColumn.push(capital_change_img);
            inputs += ', ?';
            columns += ', capital_change_img';

        }
        inputs += ")";
        db.query(`INSERT INTO master_subscribe_table (${columns}) VALUES ${inputs}`, zColumn, async (err, result) => {
            if (err) {
                console.log(err)
                return response(req, res, -200, "서버 에러 발생", [])
            } else {
                await db.query("UPDATE master_subscribe_table SET sort=? WHERE pk=?", [result?.insertId, result?.insertId], (err, result) => {
                    if (err) {
                        console.log(err)
                        return response(req, res, -200, "서버 에러 발생", [])
                    }
                })
                return response(req, res, 100, "success", [])
            }
        })

    } catch (err) {
        console.log(err)
        return response(req, res, -200, "서버 에러 발생", [])
    }
}
/*
    거장 구독 콘텐츠 수정 기능입니다.
*/
const updateSubscribeContent = (req, res) => {
    try {
        let sql = "";
        let { name, base_price, capture_date, exchange_date, existing_possession, score, weather, master_pk, main_note, take_list, operating_profit_list, company_overview_note, investment_point_list, investment_point_note,
            major_bussiness_list, major_bussiness_text, major_bussiness_note, share_list, capital_change_text, capital_change_note, investment_indicator_note, etc_note, pk } = req.body;
        let major_bussiness_img = "";
        let investment_indicator_img = "";
        let capital_change_img = "";
        let columns = ['name', 'base_price', 'capture_date', 'exchange_date', 'existing_possession', 'score', 'weather', 'master_pk', 'main_note', 'take_list', 'operating_profit_list', 'company_overview_note', 'investment_point_list', 'investment_point_note',
            'major_bussiness_list', 'major_bussiness_text', 'major_bussiness_note', 'share_list', 'capital_change_text', 'capital_change_note', 'investment_indicator_note', 'etc_note'];
        let zColumn = [name, base_price, capture_date, exchange_date, existing_possession, score, weather, master_pk, main_note, take_list, operating_profit_list, company_overview_note, investment_point_list, investment_point_note,
            major_bussiness_list, major_bussiness_text, major_bussiness_note, share_list, capital_change_text, capital_change_note, investment_indicator_note, etc_note];

        columns = columns.join("=?,");
        columns += '=?'
        if (req.files.major_bussiness_img) {
            major_bussiness_img = '/image/' + req.files.major_bussiness_img[0].fieldname + '/' + req.files.major_bussiness_img[0].filename;
            zColumn.push(major_bussiness_img);
            columns += ', major_bussiness_img=?';
        }
        if (req.files.investment_indicator_img) {
            investment_indicator_img = '/image/' + req.files.investment_indicator_img[0].fieldname + '/' + req.files.investment_indicator_img[0].filename;
            zColumn.push(investment_indicator_img);
            columns += ', investment_indicator_img=?';

        }
        if (req.files.capital_change_img) {
            capital_change_img = '/image/' + req.files.capital_change_img[0].fieldname + '/' + req.files.capital_change_img[0].filename;
            zColumn.push(capital_change_img);
            columns += ', capital_change_img=?';
        }
        sql = `UPDATE master_subscribe_table SET ${columns} WHERE pk=${pk}`;
        db.query(sql, zColumn, (err, result) => {
            if (err) {
                console.log(err)
                return response(req, res, -200, "서버 에러 발생", [])
            } else {
                return response(req, res, 100, "success", [])
            }
        })
    } catch (err) {
        console.log(err)
        return response(req, res, -200, "서버 에러 발생", [])
    }
}


/*
    게시물 리스트 불러오기 기능입니다.
*/
const getItems = (req, res) => {
    try {
        let { level, category_pk, status, user_pk, keyword, limit, page, page_cut, master_pk, order } = req.query;
        let table = req.query.table ?? "user";
        let sql = `SELECT * FROM ${table}_table `;
        let pageSql = `SELECT COUNT(*) FROM ${table}_table `;
        let orderSql = ` ORDER BY ${order ? order : 'sort'} DESC `
        let whereStr = " WHERE 1=1 ";
        if (level) {
            whereStr += ` AND user_level=${level} `;
        }
        if (category_pk) {
            whereStr += ` AND category_pk=${category_pk} `;
        }
        if (status) {
            whereStr += ` AND status=${status} `;
        }
        if (user_pk) {
            whereStr += ` AND user_pk=${user_pk} `;
        }
        if (keyword) {
            if (table == 'user') {
                whereStr += ` AND (id LIKE '%${keyword}%' OR name LIKE '%${keyword}%' OR nickname LIKE '%${keyword}%')`;
            } else if (table == 'master') {
                whereStr += ` AND (name LIKE '%${keyword}%' OR motto LIKE '%${keyword}%')`;
            } else if (table == 'master_subscribe') {
                whereStr += ` AND (name LIKE '%${keyword}%')`;
            } else {
                whereStr += ` AND title LIKE '%${keyword}%' `;
            }
        }
        if (master_pk) {
            whereStr += ` AND master_pk=${master_pk} `;
        }
        if (!page_cut) {
            page_cut = 15;
        }
        pageSql = pageSql + whereStr;

        sql = sql + whereStr + orderSql;
        if (limit && !page) {
            sql += ` LIMIT ${limit} `;
        }
        if (page) {

            sql += ` LIMIT ${(page - 1) * page_cut}, ${page_cut}`;
            db.query(pageSql, async (err, result1) => {
                if (err) {
                    console.log(err)
                    return response(req, res, -200, "서버 에러 발생", [])
                } else {
                    await db.query(sql, (err, result2) => {
                        if (err) {
                            console.log(err)
                            return response(req, res, -200, "서버 에러 발생", [])
                        } else {
                            let maxPage = result1[0]['COUNT(*)'] % page_cut == 0 ? (result1[0]['COUNT(*)'] / page_cut) : ((result1[0]['COUNT(*)'] - result1[0]['COUNT(*)'] % page_cut) / page_cut + 1);
                            return response(req, res, 100, "success", { data: result2, maxPage: maxPage });
                        }
                    })
                }
            })
        } else {
            db.query(sql, (err, result) => {
                if (err) {
                    console.log(err)
                    return response(req, res, -200, "서버 에러 발생", [])
                } else {
                    return response(req, res, 100, "success", result)
                }
            })
        }
    } catch (err) {
        console.log(err)
        return response(req, res, -200, "서버 에러 발생", [])
    }
}
/*
    기본설정 불러오기 기능입니다.
*/
const getSetting = (req, res) => {
    try {
        db.query("SELECT * FROM setting_table ORDER BY pk DESC LIMIT 1", (err, result) => {
            if (err) {
                console.log(err)
                return response(req, res, -200, "서버 에러 발생", [])
            } else {
                return response(req, res, 100, "success", result[0])
            }
        })
    } catch (err) {
        console.log(err)
        return response(req, res, -200, "서버 에러 발생", [])
    }
}
/*
    요소 삭제 기능입니다.
*/
const deleteItem = (req, res) => {
    try {
        let pk = req.body.pk ?? 0;
        let table = req.body.table ?? "";
        let sql = `DELETE FROM ${table}_table WHERE pk=? `
        db.query(sql, [pk], (err, result) => {
            if (err) {
                console.log(err)
                return response(req, res, -200, "서버 에러 발생", [])
            } else {
                return response(req, res, 100, "success", [])
            }
        })
    }
    catch (err) {
        console.log(err)
        return response(req, res, -200, "서버 에러 발생", [])
    }
}
/*
    홈 화면 불러오기 기능입니다.
*/
const getMainContent = (req, res) => {
    db.query("SELECT * FROM main_table ORDER BY pk DESC", (err, result) => {
        if (err) {
            console.log(err)
            return response(req, res, -200, "서버 에러 발생", [])
        } else {
            return response(req, res, 100, "success", result[0])
        }
    })
}
/*
    홈화면에 사용될 내용 수정 기능입니다.
*/
const editMainContent = (req, res) => {
    try {
        let { category, best_master_yield_list, recommendation_list, best_list, pk } = req.body;
        let key = "";
        let value = undefined;
        let sql = `UPDATE main_table SET ?=? WHERE pk=?`;
        let zColumn = [];
        if (category == 'main_img') {
            if (!req.files.main) {
                return response(req, res, 100, "success", [])
            } else {
                value = '/image/' + req.files.main[0].fieldname + '/' + req.files.main[0].filename;
                zColumn = [value];
                sql = `UPDATE main_table SET main_img=? WHERE pk=?`;
            }
        } else if (category == 'header_img') {
            if (!req.files.main) {
                return response(req, res, 100, "success", [])
            } else {
                value = '/image/' + req.files.main[0].fieldname + '/' + req.files.main[0].filename;
                zColumn = [value];
                sql = `UPDATE main_table SET header_img=? WHERE pk=?`;
            }
        } else if (category == 'best_master_yield_list') {
            value = best_master_yield_list;
            zColumn = [value];
            sql = `UPDATE main_table SET best_master_yield_list=? WHERE pk=?`;
        } else if (category == 'recommendation_list') {
            value = recommendation_list;
            zColumn = [value];
            sql = `UPDATE main_table SET recommendation_list=? WHERE pk=?`;
        } else if (category == 'best_list') {
            value = best_list;
            zColumn = [value];
            sql = `UPDATE main_table SET best_list=? WHERE pk=?`;
        } else if (category == 'banner_img') {
            if (!req.files.recommendation_banner && !req.files.banner && !req.files.yield_banner) {
                return response(req, res, 100, "success", [])
            } else {
                sql = `UPDATE main_table SET `;
                let img_name_list = ['banner', 'recommendation_banner', 'yield_banner'];
                for (var i = 0; i < img_name_list.length; i++) {
                    if (req.files[img_name_list[i]]) {
                        if (zColumn.length > 0) {
                            sql += ',';
                        }
                        sql += ` ${img_name_list[i]}_img=? `;
                        let image = '/image/' + req.files[img_name_list[i]][0].fieldname + '/' + req.files[img_name_list[i]][0].filename;
                        zColumn.push(image);
                    }
                }
                sql += 'WHERE pk=?';
            }
        } else {
            return response(req, res, -100, "fail", [])
        }


        db.query('SELECT * FROM main_table ORDER BY pk DESC', async (err, result) => {
            if (err) {
                console.log(err)
                return response(req, res, -200, "서버 에러 발생", [])
            } else {
                if (result.length > 0) {//update
                    zColumn.push(result[0].pk)
                    await db.query(sql, zColumn, (err, result) => {
                        if (err) {
                            console.log(err)
                            return response(req, res, -200, "서버 에러 발생", [])
                        } else {
                            return response(req, res, 100, "success", [])
                        }
                    })
                } else {//insert
                    return response(req, res, -100, "fail", [])
                }
            }
        })
    } catch (err) {
        console.log(err)
        return response(req, res, -200, "서버 에러 발생", [])
    }
}

/*
    기본설정 수정 기능입니다.
*/
const updateSetting = (req, res) => {
    try {
        const pk = req.body.pk;
        const category = req.body.category;
        const { introduce, howToUse } = req.body;
        let columns = "";
        let zColumn = [];
        if (req.file) {
            columns += "main_img=?"
            zColumn.push('/image/' + req.file.fieldname + '/' + req.file.filename)
        } else {
            if (category == 'main_img') {
                return response(req, res, 100, "success", [])
            } else if (category == 'introduce') {
                columns += "introduce=?"
                zColumn.push(introduce)
            } else if (category == 'how_to_use') {
                columns += "how_to_use=?"
                zColumn.push(howToUse)
            }
        }
        zColumn.push(pk)
        db.query(`UPDATE setting_table SET ${columns} WHERE pk=?`, zColumn, (err, result) => {
            if (err) {
                console.log(err)
                return response(req, res, -200, "서버 에러 발생", [])
            } else {
                return response(req, res, 100, "success", [])
            }
        })
    }
    catch (err) {
        console.log(err)
        return response(req, res, -200, "서버 에러 발생", [])
    }
}
/*
    상태값 변경 기능입니다.
*/
const updateStatus = (req, res) => {
    try {
        const { table, pk, num } = req.body;
        db.query(`UPDATE ${table}_table SET status=? WHERE pk=? `, [num, pk], (err, result) => {
            if (err) {
                console.log(err)
                return response(req, res, -200, "서버 에러 발생", [])
            } else {
                return response(req, res, 100, "success", [])
            }
        })
    } catch (err) {
        console.log(err)
        return response(req, res, -200, "서버 에러 발생", [])
    }
}

/*
    게시물 맨위로 올리기 기능입니다.
*/
const onTheTopItem = (req, res) => {
    try {
        console.log(req.body)
        const { table, pk } = req.body;
        db.query(`SHOW TABLE STATUS LIKE '${table}_table' `, async (err, result1) => {
            if (err) {
                console.log(err)
                return response(req, res, -200, "서버 에러 발생", [])
            } else {
                let ai = result1[0].Auto_increment;
                await db.query(`UPDATE ${table}_table SET sort=? WHERE pk=? `, [ai, pk], async (err, result2) => {
                    if (err) {
                        console.log(err)
                        return response(req, res, -200, "서버 에러 발생", [])
                    } else {
                        await db.query(`ALTER TABLE ${table}_table AUTO_INCREMENT=?`, [ai + 1], (err, result3) => {
                            if (err) {
                                console.log(err)
                                return response(req, res, -200, "서버 에러 발생", [])
                            } else {
                                return response(req, res, 100, "success", [])
                            }
                        })
                    }
                })
            }
        })
    } catch (err) {
        console.log(err)
        return response(req, res, -200, "서버 에러 발생", [])
    }
}
/*
    게시물 순서 변경 기능입니다.
*/
const changeItemSequence = (req, res) => {
    try {
        console.log(req.body)
        const { pk, sort, table, change_pk, change_sort } = req.body;
        let date = new Date();
        date = parseInt(date.getTime() / 1000);

        let sql = `UPDATE ${table}_table SET sort=${change_sort} WHERE pk=?`;
        let settingSql = "";
        if (sort > change_sort) {
            settingSql = `UPDATE ${table}_table SET sort=sort+1 WHERE sort < ? AND sort >= ? AND pk!=? `;
        } else if (change_sort > sort) {
            settingSql = `UPDATE ${table}_table SET sort=sort-1 WHERE sort > ? AND sort <= ? AND pk!=? `;
        } else {
            return response(req, res, -100, "둘의 값이 같습니다.", [])
        }
        db.query(sql, [pk], async (err, result) => {
            if (err) {
                console.log(err)
                return response(req, res, -200, "서버 에러 발생", [])
            } else {
                await db.query(settingSql, [sort, change_sort, pk], async (err, result) => {
                    if (err) {
                        console.log(err)
                        return response(req, res, -200, "서버 에러 발생", [])
                    } else {
                        return response(req, res, 100, "success", [])
                    }
                })
            }
        })
    } catch (err) {
        console.log(err)
        return response(req, res, -200, "서버 에러 발생", [])
    }
}
module.exports = {
    onLoginById, getUserToken, onLogout, checkExistId, checkExistNickname, sendSms, kakaoCallBack, editMyInfo, uploadProfile, onLoginBySns,//auth
    getUsers, getItems, getItem, getSetting, getChannelList, getVideo,  findIdByPhone, findAuthByIdAndPhone, getMasterContents, getMainContent, getUserContent, getMasterContent,//select
    addMaster, onSignUp,  addItem,  addNoteImage,  addNotice, addSubscribeContent, addSubscribe, addMustRead, addAlarm, //insert 
    updateUser, updateItem,  updateMaster, updateSetting, updateStatus, updateNotice, onTheTopItem, changeItemSequence, changePassword, updateMasterContent, updateSubscribeContent, editMainContent, updateMustRead, updateAlarm,//update
    deleteItem, onResign
};