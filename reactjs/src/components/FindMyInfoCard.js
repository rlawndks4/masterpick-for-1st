import { useEffect, useState } from "react";
import styled from "styled-components";
import { WrapperForm, CategoryName, Input, Button, FlexBox, SnsLogo } from './elements/AuthContentTemplete';
import { Title } from "./elements/UserContentTemplete";
import theme from "../styles/theme";
import $ from 'jquery';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { formatPhoneNumber } from "../functions/utils";

const SelectType = styled.div`
display:flex;
width:100%;
z-index:5;
background:#fff;
margin: 16px 0;
`
const Type = styled.div`
width:50%;
text-align:center;
padding: 0.75rem 0;
font-weight:bold;
cursor:pointer;
font-size:1rem;
`
const FindMyInfoCard = () => {
    const navigate = useNavigate();
    const [typeNum, setTypeNum] = useState(1);

    const [myPk, setMyPk] = useState(0);
    const [myId, setMyId] = useState("");
    const [phoneCheckIng, setPhoneCheckIng] = useState(false);
    const [isCheckId, setIsCheckId] = useState(false);
    const [isCheckNickname, setIsCheckNickname] = useState(false);
    const [isCheckPhoneNumber, setIsCheckPhoneNumber] = useState(false)
    const [isCheckIdAndPhone, setIsCheckIdAndPhone] = useState(false)
    const [randNum, setRandNum] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [num, setNum] = useState("");
    const [isCoinside, setIsCoinside] = useState(false);
    const [isSendSms, setIsSendSms] = useState(false)
    const [fixPhoneNumber, setFixPhoneNumber] = useState("")
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
            console.log(e)
        }
    }
    const confirmCoincide = async (e) => {
        if (randNum === $('.phone-check').val()) {
            alert("인증번호가 일치합니다.");
            const { data: response } = await axios.post('/api/findidbyphone', {
                phone: fixPhoneNumber
            })
            if (response.result > 0) {
                if (response.data?.id) {
                    setMyId(response.data?.id);
                    setIsCheckPhoneNumber(true);
                } else {

                }
            } else {

            }

        } else {
            setIsCheckPhoneNumber(false);
            alert("인증번호가 일차하지 않습니다.");
        }
    }
    const onKeyPressId = (e) => {
        if (e.key == 'Enter') {
            $('.phone').focus();
        }
    }
    const onKeyPressPhone = (e) => {
        if (e.key == 'Enter') {
            sendSms();
        }
    }
    const onKeyPressPhoneCheck = (e) => {
        if (e.key == 'Enter') {
            if (typeNum == 1) {
                confirmCoincide();
            } else {
                confirmCoincideIdAndPhone();
            }
        }
    }
    const onKeyPressPw = (e) => {
        if (e.key == 'Enter') {
            $('.pw-check').focus();
        }
    }
    const onKeyPressPwCheck = (e) => {
        if (e.key == 'Enter') {
            changePassword();
        }
    }
    const onChangeTypeNum = (num) => {
        if (num != typeNum) {
            setTypeNum(num);
            $('.id').val('');
            $('.phone').val('');
            $('.phone-check').val('');
            $('.pw').val('');
            $('.pw-check').val('');
            setIsCheckPhoneNumber(false);
            setIsCheckIdAndPhone(false);
        }
    }
    const confirmCoincideIdAndPhone = async () => {
        if (randNum === $('.phone-check').val()) {
            alert("인증번호가 일치합니다.");
            const { data: response } = await axios.post('/api/findauthbyidandphone', {
                id: $('.id').val(),
                phone: fixPhoneNumber
            })
            if (response.result > 0) {
                $('.pw').val('');
                $('.pw-check').val('');
                setMyId($('.id').val())
                $('.id').val('');
                $('.phone').val('');
                setIsCheckIdAndPhone(true);
            } else {
                alert(response.message);
            }
        } else {
            setIsCheckIdAndPhone(false);
            alert("인증번호가 일차하지 않습니다.");
        }
    }
    const changePassword = async () => {
        if ($('.pw').val() != $('.pw-check').val()) {
            alert('비밀번호가 일치하지 않습니다.');
            return;
        } else {
            if (window.confirm("저장 하시겠습니까?")) {
                const { data: response } = await axios.post('/api/changepassword', {
                    pw: $('.pw').val(),
                    id: myId
                })
                if (response.result > 0) {
                    alert('저장되었습니다.')
                    navigate('/login');
                } else {
                    alert(response.message);
                }
            }
        }
    }
    
    return (
        <>
            <WrapperForm>
                <Title>아이디/비밀번호 찾기</Title>
                <SelectType className="select-type">
                    <Type style={{ borderBottom: `4px solid ${typeNum == 1 ? theme.color.background1 : '#fff'}`, color: `${typeNum == 1 ? theme.color.background1 : '#ccc'}` }} onClick={() => { onChangeTypeNum(1) }}>아이디찾기</Type>
                    <Type style={{ borderBottom: `4px solid ${typeNum == 2 ? theme.color.background1 : '#fff'}`, color: `${typeNum == 2 ? theme.color.background1 : '#ccc'}` }} onClick={() => { onChangeTypeNum(2) }}>비밀번호 찾기</Type>
                </SelectType>

                {typeNum == 1 ?
                    <>
                        {isCheckPhoneNumber ?
                            <>
                                <CategoryName>고객님의 아이디는 "{myId}" 입니다.</CategoryName>
                            </>
                            :
                            <>
                                <CategoryName>전화번호</CategoryName>
                                <Input placeholder='전화번호를 입력해주세요.' type={'text'} className='phone' disabled={isCheckPhoneNumber} onKeyPress={onKeyPressPhone} />
                                <Button onClick={sendSms} disabled={isCheckPhoneNumber}>인증번호 발송</Button>
                                <Input style={{ marginTop: '36px' }} placeholder='인증번호를 입력해주세요.' type={'text'} className='phone-check' disabled={isCheckPhoneNumber} onKeyPress={onKeyPressPhoneCheck} />
                                <Button onClick={confirmCoincide} disabled={isCheckPhoneNumber}>{isCheckPhoneNumber ? '확인완료' : '인증번호 확인'}</Button>
                            </>
                        }

                    </>
                    :
                    <>
                        {isCheckIdAndPhone ?
                            <>
                                <CategoryName>비밀번호</CategoryName>
                                <Input placeholder='비밀번호를 입력해주세요.' type={'password'} className='pw' onKeyPress={onKeyPressPw} />
                                <CategoryName>비밀번호 확인</CategoryName>
                                <Input placeholder='비밀번호를 한번더 입력해주세요.' type={'password'} className='pw-check' onKeyPress={onKeyPressPwCheck} />
                                <Button style={{ marginTop: '36px' }} onClick={changePassword} >저장</Button>
                            </>
                            :
                            <>
                                <CategoryName>아이디</CategoryName>
                                <Input placeholder='아이디를 입력해주세요.' type={'text'} className='id' disabled={isCheckId} onKeyPress={onKeyPressId} />
                                <CategoryName>전화번호</CategoryName>
                                <Input placeholder='전화번호를 입력해주세요.' type={'text'} className='phone' disabled={isCheckIdAndPhone} onKeyPress={onKeyPressPhone} />
                                <Button onClick={sendSms} disabled={isCheckIdAndPhone}>인증번호 발송</Button>
                                <Input style={{ marginTop: '36px' }} placeholder='인증번호를 입력해주세요.' type={'text'} className='phone-check' disabled={isCheckIdAndPhone} onKeyPress={onKeyPressPhoneCheck} />
                                <Button onClick={confirmCoincideIdAndPhone} disabled={isCheckIdAndPhone}>{'인증번호 확인'}</Button>
                            </>
                        }

                    </>
                }
            </WrapperForm>
        </>
    )
}
export default FindMyInfoCard;