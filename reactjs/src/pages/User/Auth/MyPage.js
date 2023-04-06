import { useState } from "react";
import { useEffect } from "react";
import styled from "styled-components";
import { Title, Wrappers } from "../../../components/elements/UserContentTemplete";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MdEdit } from 'react-icons/md';
import theme from "../../../styles/theme";
import ContentTable from "../../../components/ContentTable";
import { CgToggleOn, CgToggleOff } from 'react-icons/cg';

const MyCard = styled.div`
display:flex;
width:100%;
height:250px;
border:1px solid ${props => props.theme.color.background3};
@media screen and (max-width:700px) {
    flex-direction:column;
    height:250px;
}
`
const ProfileContainer = styled.div`
width:50%;
display:flex;
flex-direction:column;
align-items:center;
height:250px;
@media screen and (max-width:700px) {
    width:100%;
}
`
const Container = styled.div`
width:100%;
font-size:14px;
`
const Content = styled.div`
width:100%;
display:flex;
`
const Category = styled.div`
width:100px;
padding:16px 0;
height:18px;
padding-left:16px;
border-right:1px solid ${props => props.theme.color.background1};
`
const Result = styled.div`
padding:16px 0;
height:18px;
padding-left:16px;
display:flex;
align-items:center;
`
const LogoutButton = styled.button`
width:160px;
height:40px;
margin:1rem auto;
border:none;
cursor:pointer;
background:${props => props.theme.color.font2};
color:#fff;
font-size:12px;
`
const MyPage = () => {
    const navigate = useNavigate();
    const [auth, setAuth] = useState({})
    const [subscribeList, setSubscribeList] = useState([])

    useEffect(() => {
        async function isAdmin() {
            const { data: response } = await axios('/api/auth')
            if (response.pk > 0) {
                await localStorage.setItem('auth', JSON.stringify(response))
                let obj = response;
                setAuth(obj);
                const { data: contentResponse } = await axios.get(`/api/getusercontent?pk=${response.pk}`)
                setSubscribeList(contentResponse?.data?.subscribes)
            } else {
                localStorage.removeItem('auth');
                navigate('/login')

            }
        }
        isAdmin();
    }, [])
    const onLogout = async () => {
        if (window.confirm('정말 로그아웃 하시겠습니까?')) {
            const { data: response } = await axios.post('/api/logout');
            if (response.result > 0) {
                navigate('/login');
            } else {
                alert('error');
            }
        }
    }
    const onChangeDarkMode = (num) =>{
        if(num==1){
            localStorage.setItem('dark_mode','1');
            window.location.reload();
        }else{
            localStorage.removeItem('dark_mode');
            window.location.reload();
        }
    }
    const getIdByNumber = (num, id) =>{
        if(!id){
            return "---";
        }else{
            if(num==0){
                return id;
            }else if(num==1){
                return "kakao";
            }else if(num==2){
                return "naver";
            }else if(num==3){
                return "apple";
            }else{
                return "---";
            }
        }
    }
    return (
        <>
            <Wrappers className="wrapper" style={{ maxWidth: '800px' }}>
                <Title>마이페이지</Title>
                <MdEdit style={{ margin: '2rem 0 1rem auto', color: `${theme.color.font2}`, fontSize: '24px', cursor: 'pointer' }} onClick={() => navigate('/editmyinfo')} />

                <MyCard>
                    {/* <ProfileContainer>
                        <img src={auth?.profile_img ? auth?.profile_img.substring(0,4)=="http"?auth?.profile_img : backUrl + auth?.profile_img : defaultImg} style={{ height: '125px', width: '125px', borderRadius: '50%', background: '#fff', margin: 'auto' }} />
                    </ProfileContainer> */}
                    <Container>
                        <Content>
                            <Category>닉네임</Category>
                            <Result>
                                {auth?.nickname ?? "---"}
                            </Result>
                        </Content>
                        <Content>
                            <Category>아이디</Category>
                            <Result>
                                {getIdByNumber(auth.type??0,auth?.id??"")}
                            </Result>
                        </Content>
                        <Content>
                            <Category>비밀번호</Category>
                            <Result>********</Result>
                        </Content>
                        <Content>
                            <Category>전화번호</Category>
                            <Result>{auth?.phone ?? "---"}</Result>
                        </Content>
                        <Content>
                            <Category>개인정보동의</Category>
                            <Result>{'동의'}</Result>
                        </Content>
                        
                    </Container>
                </MyCard>
                <Title>서비스 이용내역</Title>
                <ContentTable columns={[
                    { name: "대가명", column: "master_name", width: 25, type: 'text' },
                   // { name: "구매일자", column: "date", width: 25, type: 'text' },
                    //{ name: "금액", column: "yield", width: 25, type: 'text' },
                    { name: "취소", column: "", width: 25, type: 'delete' },
                ]}
                    data={subscribeList}
                    schema={'user_master_connect'} />
                <Title>서비스 만료내역</Title>
                <ContentTable columns={[
                    { name: "대가명", column: "master_name", width: 25, type: 'text' },
                   // { name: "구매일자", column: "date", width: 25, type: 'text' },
                   // { name: "금액", column: "yield", width: 25, type: 'text' },
                    { name: "취소", column: "", width: 25, type: 'delete' },
                ]}
                    data={[]}
                    schema={'user_master_connect'} />
                <LogoutButton onClick={onLogout}>
                    로그아웃
                </LogoutButton>
                <LogoutButton onClick={() => navigate('/appsetting')}>
                    설정
                </LogoutButton>
            </Wrappers>
        </>
    )
}
export default MyPage;