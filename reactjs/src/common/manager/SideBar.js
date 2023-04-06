import React from 'react'
import styled from 'styled-components'
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { GiHamburgerMenu } from 'react-icons/gi'
import logo from '../../assets/images/test/logo.svg'
import { BiRadioCircle } from 'react-icons/bi'
import { BsPerson, BsCameraVideo, BsAlarm  } from 'react-icons/bs'
import { FaChalkboardTeacher } from 'react-icons/fa'
import { AiOutlineQuestionCircle, AiOutlineRotateLeft } from 'react-icons/ai'
import { SiYoutubemusic } from 'react-icons/si'
import { RiPagesLine } from 'react-icons/ri'
import axios from 'axios';
import $ from 'jquery'
const Wrappers = styled.div`
display:flex;
flex-direction:column;
width:250px;
min-height:100vh;
box-shadow:0 2px 4px rgb(15 34 58 / 12%);
z-index:25;
position:fixed;
background:#fff;
overflow-y:auto;
padding-bottom:16px;
@media screen and (max-width:1000px) {
    position:fixed;
    display:${(props => props.display)};
    transition:1s;
    @keyframes fadein {
        from {
            left:-500px;
        }
        to {
            left:0;
        }
      }
}
`
const LogoWrappers = styled.div`
text-align:center;
font-size:32px;
font-weight:bold;
padding-top:24px;
padding-bottom:24px;
color:${(props) => props.theme.color.background1};
`
const SelectMenuContent = styled.div`
width:192px;
padding:16px 12px 16px 16px;
background:${(props) => props.theme.color.manager.background2}29;
margin:0.3rem auto;
border-radius:3px;
font-size:15px;
display:flex;
align-items:center;
color:${(props) => props.theme.color.manager.background1};
cursor:pointer;
`
const MenuContent = styled.div`
width:192px;
padding:16px 12px 16px 16px;
background:#fff;
margin:0.3rem auto;
border-radius:12px;
font-size:15px;
display:flex;
align-items:center;
color:${(props) => props.theme.color.manager.font3};
cursor:pointer;
transition: 0.4s;
&:hover{  
    color:${(props) => props.theme.color.manager.font1};
}
`
const MenuText = styled.p`
margin:0 0 0 8px;
`
const HambergurContainer = styled.div`
display:none;
position:fixed;
top:0;
left:0;
z-index:5;
padding:12px;
@media screen and (max-width:1000px) {
    display:flex;
}
`
const SideBar = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [auth, setAuth] = useState({})
    const [issueCategoryDisplay, setIssueCategoryDisplay] = useState(false);
    const [zMaster, setZMaster] = useState([])
    const [issueMasterDisplay, setIssueMasterDisplay] = useState(false);

    const [featureCategoryDisplay, setFeatureCategoryDisplay] = useState(false);

    const [mainCategoryDisplay, setMainCategoryDisplay] = useState(false)
    const [settingCategoryDisplay, setSettingCategoryDisplay] = useState(false);
    const [userDisplsy, setUserDisplay] = useState(false);
    const zUser = [
        { name: '회원관리', param: '/manager/list/user' },
        { name: '회원통계', param: '/manager/list/user_statistics' },
        { name: '결제내역관리', param: '/manager/list/subscribe' },
    ]
    const zMain = [
        { name: '배너등록', param: 'banner_img' },
        { name: '대가의종목', param: 'recommendation_list' },
        { name: '대가 수익률 대회', param: 'best_master_yield_list' },
        { name: 'BEST 상승 TOP10', param: 'best_list' },
    ]
    const zSetting = [
        { name: '메인 배너', param: '/manager/edit/setting/main_img' },
        { name: '소개', param: '/manager/edit/setting/introduce' },
        { name: '활용법', param: '/manager/edit/setting/how_to_use' },
        { name: '필독사항', param: '/manager/list/must_read' },
    ]
    const [display, setDisplay] = useState('none');
    useEffect(() => {
        if (localStorage.getItem('auth')) {
            let obj = JSON.parse(localStorage.getItem('auth'))
            setAuth(obj);
        }
    }, [location]);
    useEffect(() => {
        async function fetchPost() {
            const { data: response } = await axios.get('/api/items?table=master')
            setZMaster(response?.data);
        }
        fetchPost()
        // $('html').on('click', function (e) {
        //     console.log($(e.target).attr('class'))
        //     if ($(e.target).parents('.header-container').length < 1 && $(e.target).attr('class') != 'hamburgur-button') {
        //         setDisplay('none')
        //     }
        // });
    }, [])
    const onClickMenu = (link) => {
        if (link == '/manager/list/issue') {
            changeIssueCategoryDisplay();
        } else if (link == 'user_onoff') {
            changeUserDisplay();
        }else if (link == '/manager/list/feature') {
            changeFeatureCategoryDisplay();
        } else if (link == '/manager/list/master_subscribe') {
            changeMasterDisplay();
        } else if (link == '/manager/edit/main') {
            changeMainCategoryDisplay();
        } else if (link == '/manager/edit/setting') {
            changeSettingCategoryDisplay();
        } else {
            navigate(link);
        }
    }
    const changeUserDisplay = () => {
        setUserDisplay(!userDisplsy);
    }
    const changeIssueCategoryDisplay = () => {
        setIssueCategoryDisplay(!issueCategoryDisplay);
    }
    const changeFeatureCategoryDisplay = () => {
        setFeatureCategoryDisplay(!featureCategoryDisplay);
    }
    const changeMasterDisplay = () => {
        setIssueMasterDisplay(!issueMasterDisplay);
    }
    const changeMainCategoryDisplay = () => {
        setMainCategoryDisplay(!mainCategoryDisplay)
    }
    const changeSettingCategoryDisplay = () => {
        setSettingCategoryDisplay(!settingCategoryDisplay)
    }
    return (
        <>
            <HambergurContainer className='hamburgur-button' onClick={() => { setDisplay('flex') }}>
                <GiHamburgerMenu className='hamburgur-button'/>
            </HambergurContainer>
            <Wrappers display={display} className='scroll-css header-container'>
                <HambergurContainer onClick={() => { setDisplay('none') }}>
                    <GiHamburgerMenu />
                </HambergurContainer>
                <LogoWrappers>
                    <img src={logo} alt="#" style={{ height: '40px', width: 'auto' }} />
                </LogoWrappers>
                <div style={{ maxHeight: '80vh', paddingBottom: '32px' }}>
                    {JSON.parse(localStorage.getItem('auth'))?.user_level ?? 0 >= 40 ?
                        <>
                            {['/manager/list/user'].includes(location.pathname) ?
                                <>
                                    <SelectMenuContent onClick={() => { onClickMenu(`user_onoff`) }}>
                                        <BsPerson />
                                        <MenuText>{'회원관리'}</MenuText>
                                    </SelectMenuContent>
                                </>
                                :
                                <>
                                    <MenuContent onClick={() => { onClickMenu(`user_onoff`) }}>
                                        <BsPerson />
                                        <MenuText>{'회원관리'}</MenuText>
                                    </MenuContent>
                                </>}
                        </>
                        :
                        <>
                        </>
                    }
                    {userDisplsy ?
                        <>
                            {zUser.map((item, idx) => (
                                <>
                                    <MenuContent key={idx} onClick={() => { navigate(`${item.param}`) }} style={{ color: `${location.pathname == `${item.param}` ? '#000' : ''}` }}>
                                        <MenuText style={{ marginLeft: '15px' }}>{item.name}</MenuText>
                                    </MenuContent>
                                </>
                            ))}
                        </>
                        :
                        <>
                        </>
                    }
                    {JSON.parse(localStorage.getItem('auth'))?.user_level ?? 0 >= 40 ?
                        <>
                            {zMain.map(item=>{return `/manager/edit/main/${item.param}`}).includes(location.pathname) ?
                                <>
                                    <SelectMenuContent onClick={() => { onClickMenu('/manager/edit/main') }}>
                                        <RiPagesLine />
                                        <MenuText>{'메인페이지'}</MenuText>
                                    </SelectMenuContent>
                                </>
                                :
                                <>
                                    <MenuContent onClick={() => { onClickMenu('/manager/edit/main') }}>
                                        <RiPagesLine />
                                        <MenuText>{'메인페이지'}</MenuText>
                                    </MenuContent>
                                </>}
                        </>
                        :
                        <>
                        </>
                    }
                    {mainCategoryDisplay ?
                        <>
                            {zMain.map((item, idx) => (
                                <>
                                    <MenuContent key={idx} onClick={() => { navigate(`/manager/edit/main/${item.param}`) }} style={{ color: `${location.pathname == `/manager/edit/main/${item.param}` ? '#000' : ''}` }}>
                                        <MenuText style={{ marginLeft: '15px' }}>{item.name}</MenuText>
                                    </MenuContent>
                                </>
                            ))}
                        </>
                        :
                        <>
                        </>
                    }

                    {JSON.parse(localStorage.getItem('auth'))?.user_level ?? 0 >= 40 ?
                        <>
                            {['/manager/edit/setting'].includes(location.pathname) ?
                                <>
                                    <SelectMenuContent onClick={() => { onClickMenu(`/manager/edit/setting`) }}>
                                        <AiOutlineRotateLeft />
                                        <MenuText>{'필독!활용법'}</MenuText>
                                    </SelectMenuContent>
                                </>
                                :
                                <>
                                    <MenuContent onClick={() => { onClickMenu(`/manager/edit/setting`) }}>
                                        <AiOutlineRotateLeft />
                                        <MenuText>{'필독!활용법'}</MenuText>
                                    </MenuContent>
                                </>}
                        </>
                        :
                        <>
                        </>
                    }
                    {settingCategoryDisplay ?
                        <>
                            {zSetting.map((item, idx) => (
                                <>
                                    <MenuContent key={idx} onClick={() => { navigate(`${item.param}`) }} style={{ color: `${location.pathname == `${item.param}` ? '#000' : ''}` }}>
                                        <MenuText style={{ marginLeft: '15px' }}>{item.name}</MenuText>
                                    </MenuContent>
                                </>
                            ))}
                        </>
                        :
                        <>
                        </>
                    }
                    {JSON.parse(localStorage.getItem('auth'))?.user_level ?? 0 >= 40 ?
                        <>
                            {['/manager/list/master'].includes(location.pathname) ?
                                <>
                                    <SelectMenuContent onClick={() => { onClickMenu(`/manager/list/master`) }}>
                                        <FaChalkboardTeacher />
                                        <MenuText>{'대가관리'}</MenuText>
                                    </SelectMenuContent>
                                </>
                                :
                                <>
                                    <MenuContent onClick={() => { onClickMenu(`/manager/list/master`) }}>
                                        <FaChalkboardTeacher />
                                        <MenuText>{'대가관리'}</MenuText>
                                    </MenuContent>
                                </>}
                        </>
                        :
                        <>
                        </>
                    }
                    {JSON.parse(localStorage.getItem('auth'))?.user_level ?? 0 >= 40 ?
                        <>
                            {['/manager/list/master_subscribe'].includes(location.pathname) ?
                                <>
                                    <SelectMenuContent onClick={() => { onClickMenu(`/manager/list/master_subscribe`) }}>
                                        <SiYoutubemusic />
                                        <MenuText>{'구독전용'}</MenuText>
                                    </SelectMenuContent>
                                </>
                                :
                                <>
                                    <MenuContent onClick={() => { onClickMenu(`/manager/list/master_subscribe`) }}>
                                        <SiYoutubemusic />
                                        <MenuText>{'구독전용'}</MenuText>
                                    </MenuContent>
                                </>}
                        </>
                        :
                        <>
                        </>
                    }
                    {issueMasterDisplay ?
                        <>
                            {zMaster.map((item, idx) => (
                                <>
                                    <MenuContent key={idx} onClick={() => { navigate(`/manager/list/master_subscribe/${item.pk}`) }} style={{ color: `${location.pathname == `/manager/list/master_subscribe/${item.pk}` ? '#000' : ''}` }}>
                                        <MenuText style={{ marginLeft: '15px' }}>{item.name}</MenuText>
                                    </MenuContent>
                                </>
                            ))}
                        </>
                        :
                        <>
                        </>}
                        {JSON.parse(localStorage.getItem('auth'))?.user_level??0 >= 40 ?
                        <>
                            {'/manager/list/notice' == location.pathname ?
                                <>
                                    <SelectMenuContent onClick={() => { onClickMenu('/manager/list/notice') }}>
                                        <AiOutlineQuestionCircle />
                                        <MenuText>공지사항</MenuText>
                                    </SelectMenuContent>
                                </>
                                :
                                <>
                                    <MenuContent onClick={() => { onClickMenu('/manager/list/notice') }}>
                                        <AiOutlineQuestionCircle />
                                        <MenuText>공지사항</MenuText>
                                    </MenuContent>
                                </>}
                        </>
                        :
                        <>
                        </>
                    }
                    {JSON.parse(localStorage.getItem('auth'))?.user_level??0 >= 40 ?
                        <>
                            {'/manager/list/alarm' == location.pathname ?
                                <>
                                    <SelectMenuContent onClick={() => { onClickMenu('/manager/list/alarm') }}>
                                        <BsAlarm />
                                        <MenuText>푸시알람</MenuText>
                                    </SelectMenuContent>
                                </>
                                :
                                <>
                                    <MenuContent onClick={() => { onClickMenu('/manager/list/alarm') }}>
                                        <BsAlarm />
                                        <MenuText>푸시알람</MenuText>
                                    </MenuContent>
                                </>}
                        </>
                        :
                        <>
                        </>
                    }
                    <div style={{paddingBottom:'36px'}} />
                    {/* {issueCategoryDisplay ?
                        <>
                            {zIssueCategory.map((item, idx) => (
                                <>
                                    <MenuContent key={idx} onClick={() => { navigate(`/manager/list/issue/${item.pk}`) }} style={{ color: `${location.pathname == `/manager/list/issue/${item.pk}` ? '#000' : ''}` }}>
                                        <MenuText style={{ marginLeft: '15px' }}>{item.title}</MenuText>
                                    </MenuContent>
                                </>
                            ))}
                        </>
                        :
                        <>
                        </>}
                    {JSON.parse(localStorage.getItem('auth'))?.level??0 >= 40 ?
                        <>
                            {'/manager/list/notice' == location.pathname ?
                                <>
                                    <SelectMenuContent onClick={() => { onClickMenu('/manager/list/notice') }}>
                                        <AiOutlineQuestionCircle />
                                        <MenuText>공지사항</MenuText>
                                    </SelectMenuContent>
                                </>
                                :
                                <>
                                    <MenuContent onClick={() => { onClickMenu('/manager/list/notice') }}>
                                        <AiOutlineQuestionCircle />
                                        <MenuText>공지사항</MenuText>
                                    </MenuContent>
                                </>}
                        </>
                        :
                        <>
                        </>
                    } */}
                    <div style={{ paddingBottom: '36px' }} />
                </div>
            </Wrappers>
        </>
    )
}
export default SideBar