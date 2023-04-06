import { useEffect, useState } from "react";
import styled from "styled-components";
import { WrapperForm, CategoryName, Input, Button, FlexBox, SnsLogo, RegularNotice } from './elements/AuthContentTemplete';
import { Title, SelectType } from "./elements/UserContentTemplete";
import theme from "../styles/theme";
import $ from 'jquery';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { formatPhoneNumber } from "../functions/utils";
import defaultImg from '../assets/images/icon/default-profile.png';
import { backUrl } from "../data/Data";


const Type = styled.div`
width:50%;
text-align:center;
padding: 0.75rem 0;
font-weight:bold;
cursor:pointer;
font-size:1rem;
@media screen and (max-width:700px) {
    font-size:0.8rem;
}
@media screen and (max-width:350px) {
    font-size:0.65rem;
}
`
const ResignCard = () => {
    const navigate = useNavigate();
    const [typeNum, setTypeNum] = useState(0);

    const [myPk, setMyPk] = useState(0);
    const [myId, setMyId] = useState("");
    const [phoneCheckIng, setPhoneCheckIng] = useState(false);
    const [isCheckId, setIsCheckId] = useState(false);
    const [isCheckNickname, setIsCheckNickname] = useState(false);
    const [isCheckPhoneNumber, setIsCheckPhoneNumber] = useState(false)
    const [isCheckIdAndPhone, setIsCheckIdAndPhone] = useState(false)
    const [url, setUrl] = useState('')
    const [content, setContent] = useState(undefined)
    const [formData] = useState(new FormData())
    const [randNum, setRandNum] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [num, setNum] = useState("");
    const [isCoinside, setIsCoinside] = useState(false);
    const [isSendSms, setIsSendSms] = useState(false)
    const [fixPhoneNumber, setFixPhoneNumber] = useState("")
    const [auth, setAuth] = useState({});

    const zType = [{ title: "프로필 변경" }, { title: "닉네임 변경" }, { title: "비밀번호 변경" }, { title: "전화번호 변경" }];
    useEffect(() => {
        let auth = JSON.parse(localStorage.getItem('auth'))
        if (auth.profile_img) {
            setUrl(auth.profile_img.substring(0, 4) == "http" ? auth.profile_img : backUrl + auth.profile_img)
        }
        setMyId(auth.id);
        setAuth(auth);
    }, [])
    const sendSms = async () => {
        if (typeNum == 2 && !$('.id').val()) {
            alert("아이디를 입력해 주세요.")
            return;
        }
        if (!$('.phone').val()) {
            alert("핸드폰 번호를 입력해주세요.")
            return;
        }
        setIsCheckPhoneNumber(false);
        let fix_phone = $('.phone').val().replace('-', '');
        setFixPhoneNumber(fix_phone);
        let content = "";
        for (var i = 0; i < 6; i++) {
            content += Math.floor(Math.random() * 10).toString();
        }

        let string = `\n인증번호를 입력해주세요 ${content}.\n\n-masterpick-`;
        try {
            const { data: response } = await axios.post(`/api/sendsms`, {
                receiver: [fix_phone, formatPhoneNumber(fix_phone)],
                content: string
            })
            if (response?.result > 0) {
                alert('인증번호가 발송되었습니다.');

                setIsSendSms(true)
                setRandNum(content);
                $('phone-check').focus();
            } else {
                setIsSendSms(false)
            }
        } catch (e) {
        }
    }

    
    
    const onResign = async () => {

        let str = '/api/resign';
        let obj = { id: myId, pw: $('.pw').val() };


        if (!randNum) {
            alert("인증번호를 발송해 주세요.");
            return;
        }
        if (fixPhoneNumber != auth.phone) {
            alert("가입한 전화번호와 일치하지 않습니다.");
            return;
        }
        if ($('.phone-check').val() != randNum) {
            alert("인증번호가 일치하지 않습니다.");
            return;
        }
        const { data: response } = await axios.post(str, obj);
        if (response.result > 0) {
            alert("성공적으로 탈퇴되었습니다.");
            const { data: response } = await axios.post('/api/logout');
            navigate('/login');
        } else {
            alert(response.message);
        }
    }
    return (
        <>
            <WrapperForm>
                <Title>회원탈퇴</Title>

                <CategoryName>가입한 전화번호</CategoryName>
                <Input className="phone" placeholder="전화번호를 입력해 주세요." onKeyPress={(e) => e.key == 'Enter' ? sendSms() : null} />
                <RegularNotice></RegularNotice>
                <Button onClick={sendSms}>인증번호 발송</Button>
                <CategoryName>인증번호</CategoryName>
                <Input className="phone-check" placeholder="인증번호를 입력해 주세요." onKeyPress={(e) => e.key == 'Enter' ? onResign() : null} />

                <Button style={{ marginTop: '36px' }} onClick={() => onResign()}>탈퇴</Button>
            </WrapperForm>
        </>
    )
}
export default ResignCard;