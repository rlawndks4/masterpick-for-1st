// 리다이렉트될 화면
// KakaoRedirectHandeler.js
import React, { useEffect } from "react";
import axios from 'axios';
import { KAKAO_CLIENT_ID, KAKAO_REDIRECT_URI } from "../../../data/Data";
import { useNavigate } from "react-router-dom";

const KakaoRedirectHandler = () => {
    const navigate = useNavigate();

    useEffect(() => {
        async function fechKakao() {
            let params = new URL(document.location.toString()).searchParams;
            console.log(params)

            let code = params.get("code"); // 인가코드 받는 부분
            console.log(code)
            let grant_type = "authorization_code";

            let result = await axios.post(`https://kauth.kakao.com/oauth/token?grant_type=${grant_type}&client_id=${KAKAO_CLIENT_ID}&redirect_uri=${KAKAO_REDIRECT_URI}&code=${code}`, {
                headers: {
                    'Content-type': 'application/x-www-form-urlencoded;charset=utf-8'
                }
            })
            console.log(result)
            if (result.status == 200) {
                const { data: response } = await axios.post('/api/kakao/callback', {
                    token: result?.data['access_token']
                })
                console.log(response)
                let obj = {
                    id: response.data.id,
                    login_type: 1,
                    profile_image_url: response.data.properties.profile_image,
                    profile_nickname: response.data.properties.nickname,
                }
                onLoginBySns(obj);
            } else {
                navigate('/login');
            }
        }
        fechKakao();
    }, [])
    const onLoginBySns = async (obj) => {
        let nick = "";
        if (obj.login_type == 1) {
            nick = "카카오" + new Date().getTime()
        } else if (obj.login_type == 2) {
            nick = "네이버" + new Date().getTime()
        } else if (obj.login_type == 3) {
            nick = "애플" + new Date().getTime()
        }
        let objs = {
            id: obj.id,
            name: obj.profile_nickname,
            nickname: nick,
            phone: obj.phone_number,
            user_level: 0,
            typeNum: obj.login_type,
            profile_img: obj.profile_image_url
        }
        const { data: response } = await axios.post('/api/loginbysns', objs);
        if (response.result > 0) {
            if (response.result <= 50) {//신규유저
                navigate('/signup', { state: { id: objs.id, typeNum: objs.typeNum, profile_img: objs.profile_img, name: objs.name } })
            } else {
                await localStorage.setItem('auth', JSON.stringify(response.data));
                navigate('/mypage');
            }
        } else {
            //alert(response.message);
        }
    }
    return <div>사실 이페이지는 크게 의미 없다. 첫화면으로 로직이 끝나면 이동시켜주면 된다.</div>;
};

export default KakaoRedirectHandler;