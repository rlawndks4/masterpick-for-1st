import { useState } from "react";
import { useEffect } from "react";
import styled from "styled-components";
import { Title, Wrappers } from "../../components/elements/UserContentTemplete";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { CgToggleOn, CgToggleOff } from 'react-icons/cg'
import theme from "../../styles/theme";
const Content = styled.div`
width:100%;
display:flex;
justify-content:space-between;
padding: 16px 0;
border-bottom: 1px solid #cccccc;
align-items:center;
padding: 14px 0;
`

const AppSetting = () => {
    const navigate = useNavigate();
    const [wantAlarm, setWantAlarm] = useState(1)
    const [isWebView, setIsWebView] = useState(false)
    const [wantDark, setWantDark] = useState(false)
    useEffect(() => {
        if (window && window.flutter_inappwebview) {
            window.flutter_inappwebview.callHandler('get_allow_alarm', {}).then(async function (result) {
                //result = "{'code':100, 'message':'success', 'data':{'login_type':1, 'id': 1000000}}"
                let obj = JSON.parse(result);
                setWantAlarm(obj.data?.is_want_alarm);
                setIsWebView(true)
            });
        } else {
            setIsWebView(false)
        }
    }, [])
    const changeWantAlarm = (num) => {
        setWantAlarm(num);
        if (window && window.flutter_inappwebview) {
            var params = { 'is_allow_alarm': num };
            window.flutter_inappwebview.callHandler('set_allow_alarm', JSON.stringify(params)).then(async function (result) {
                //result = "{'code':100, 'message':'success', 'data':{'login_type':1, 'id': 1000000}}"
            });
        }
    }
    const changeWantDark = (num) => {
        if (num == 1) {
            localStorage.setItem('dark_mode', '1');
            window.location.reload();
        } else {
            localStorage.removeItem('dark_mode');
            window.location.reload();
        }
    }
    return (
        <>
            <Wrappers className="wrapper" style={{ maxWidth: '800px' }}>
                <Title>설정</Title>
                {isWebView ?
                    <>
                        <Content>
                            <div>푸시알림</div>
                            {wantAlarm == 1 ?
                                <CgToggleOn style={{ color: `${theme.color.background1}`, cursor: 'pointer', fontSize: '30px' }} onClick={() => changeWantAlarm(0)} /> :
                                <CgToggleOff style={{ color: '#aaaaaa', cursor: 'pointer', fontSize: '30px' }} onClick={() => changeWantAlarm(1)} />}

                        </Content>
                    </>
                    :
                    <>
                    </>}

                <Content>
                    <div>다크모드</div>
                    {localStorage.getItem('dark_mode') ?
                        <CgToggleOn style={{ color: `${theme.color.background1}`, cursor: 'pointer', fontSize: '30px' }} onClick={() => changeWantDark(0)} /> :
                        <CgToggleOff style={{ color: '#aaaaaa', cursor: 'pointer', fontSize: '30px' }} onClick={() => changeWantDark(1)} />}

                </Content>
                <Content onClick={()=>{navigate('/resign')}} style={{cursor:'pointer'}}>
                    <div>회원탈퇴</div>
                    <div/>

                </Content>
            </Wrappers>
        </>
    )
}
export default AppSetting;