import React from 'react'
import styled from 'styled-components'
import { useEffect, useState } from 'react';
import { useNavigate, Link, useParams, useLocation } from 'react-router-dom';
import '../styles/style.css'
import logo from '../assets/images/test/logo.svg'
import { AiOutlineBell, AiOutlineSearch, AiOutlineSetting } from 'react-icons/ai'
import Modal from '../components/Modal';
import axios from 'axios'
import { backUrl, zBottomMenu } from '../data/Data';
import { MdNavigateBefore } from 'react-icons/md';
import theme from '../styles/theme';
import { IoMdArrowBack } from 'react-icons/io';
import $ from 'jquery';
import hamburgurIcon from '../assets/images/icon/hamburgur.svg'
const Header = styled.header`
position:fixed;
height:6rem;
width:100%;
top:0;
z-index:10;
background:#fff;
box-shadow: 5px 10px 10px rgb(0 0 0 / 3%);
@media screen and (max-width:1050px) { 
  box-shadow:none;
  height:3.5rem;
}
`
const HeaderContainer = styled.div`
width:90%;
position:relative;
max-width:1000px;
margin:0 auto;
display:none;
align-items:center;
justify-content: space-between;
@media screen and (max-width:1050px) { 
  display:flex;
}
`
const HeaderMenuContainer = styled.div`
width:90%;
position:relative;
margin:0 auto;
display:flex;
align-items:center;
justify-content: space-between;
@media screen and (max-width:1050px) { 
  display:none;
}
`
const HeaderMenu = styled.div`
text-align:center;
font-size:${props => props.theme.size.font3};
padding:0.3rem;
margin-right:0.5rem;
font-weight:bold;
cursor:pointer;
&:hover{  
  color:${(props) => props.theme.color.background1};
}
@media screen and (max-width:1200px) { 
  font-size:${props => props.theme.size.font4};
}
`
const SearchInput = styled.input`
outline:none;
border:none;
border-bottom:1px solid #cccccc;
border-radius:0;
width:80%;
padding:10px 0;
margin:0 6px;
font-size:12px;
::placeholder {
  color:#dddddd;
  font-size:12px;
}
`
const ModalContainer = styled.div`

    position: fixed;
    bottom:0;
    left:0;
    width:100%;
    height: 100%;
    display: ${props => props.modal};
    justify-content: center;
    align-items: center;
    z-index:10;
`
const ModalOverlay = styled.div`
    background-color: black;
    width:100%;
    height: 100%;
    position: absolute;
    opacity: 0.4;
`
const ModalContent = styled.div`
box-shadow: 0px 10px 40px #00000029;
background-color:white;
animation: fadein 0.3s;
  -moz-animation: fadein 0.3s;
  -webkit-animation: fadein 0.3s;
  -o-animation: fadein 0.3s; 
 
position: absolute;
width:50%;
bottom:0;
height:80vh;
align-items: flex-start;
display:flex;
flex-direction:column;
width:500px;
@media screen and (max-width:700px) {
  width:80%;
  bottom:0;
  right:0;
  @keyframes fadein {
    from {
        right:-500px;
    }
    to {
        right:0;
    }
  }
  
  
}

`

const Headers = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [type, setType] = useState(1)
  const [isModal, setIsModal] = useState(false);
  const [display, setDisplay] = useState('flex');
  const [isPost, setIsPost] = useState(false);
  const [searchDisplay, setSearchDisplay] = useState('none')
  const [isSearch, setIsSearch] = useState(false);
  const [headerImg, setHeaderImg] = useState("");
  useEffect(() => {
    async function fetchPost() {
      const { data: response } = await axios.get('/api/getmaincontent')
      setHeaderImg(response.data?.header_img)
      await localStorage.setItem('main_content',JSON.stringify(response.data??{}));
    }
    fetchPost();
  }, [])
  useEffect(() => {
    if (location.pathname.substring(0, 6) == '/post/' || location.pathname.substring(0, 7) == '/video/') {
      setIsPost(true);
    } else {
      setIsPost(false)
    }
    if (location.pathname.includes('/manager')) {
      setDisplay('none');
      $('html').addClass('show-scrollbar');
    } else {
      setDisplay('flex');
    }
    if (localStorage.getItem('dark_mode')) {
      $('body').addClass("dark-mode");
      $('p').addClass("dark-mode");
      $('.toastui-editor-contents p').addClass("dark-mode");
      $('.menu-container').addClass("dark-mode");
      $('.menu-container').css("border-top", "none");
      $('.header').addClass("dark-mode");
      $('.select-type').addClass("dark-mode");
      $('.footer').addClass("dark-mode");
    } else {

    }
  }, [location])
  const [modal, setModal] = useState("none");

  const handleModal = async () => {
    if (modal == "none") {
      setModal("flex");
    }
    else {

      setModal("none");
    }
  };
  const myAuth = async () => {
    const { data: response } = await axios('/api/auth')
    if (response.pk > 0) {
      navigate('/mypage');
    } else {
      navigate('/login');
    }
  }
  const changeSearchModal = () => {
    if (window.innerWidth <= 1050) {//모바일
      setIsSearch(true)
    } else {//pc
      setIsSearch(!isSearch)
    }
  }
  const onKeyPress = (e) => {
    if (e.key == 'Enter') {
      if ($('.search').val().length < 2) {
        alert('두 글자 이상 입력해주세요.');
      } else {
        setIsSearch(false);
        navigate('/search', { state: $('.search').val() });
      }
    }
  }
  const onKeyPressPc = (e) => {
    if (e.key == 'Enter') {
      if ($('.search-pc').val().length < 2) {
        alert('두 글자 이상 입력해주세요.');
      } else {
        setIsSearch(false);
        navigate('/search', { state: $('.search-pc').val() });
      }
    }
  }
  const onClickBell = () => {
    if (window.flutter_inappwebview) {
      window.flutter_inappwebview.callHandler('native_alarm_count_zero', {}).then(async function (result) {
        //result = "{'code':100, 'message':'success', 'data':{'login_type':1, 'id': 1000000}}"
      });
    }
    navigate('/noticelist');
  }
  return (
    <>

      <Header style={{ display: `${display}` }} className="header">

        <HeaderContainer>{/*모바일 */}

          {/* <IoMdArrowBack style={{ fontSize: '24px' }} onClick={() => setIsSearch(false)} />
              <SearchInput type={'text'} placeholder='두 글자 이상 입력해주세요.' className='search' onKeyPress={onKeyPress} />
              <AiOutlineSearch style={{ fontSize: '24px' }} onClick={() => {
                if ($('.search').val().length < 2) {
                  alert('두 글자 이상 입력해주세요.');
                } else {
                  setIsSearch(false);
                  navigate('/search', { state: $('.search').val() });
                }
              }} /> */}

          <div style={{ display: 'flex', color: `${localStorage.getItem('dark_mode') ? '#fff' : theme.color.font1}`, fontSize: '1.2rem', width: '80px', alignItems: 'center', justifyContent: 'space-between' }}>
            {isPost ?
              <>
                <MdNavigateBefore style={{ fontSize: '30px', marginLeft: '-7px' }} onClick={() => { navigate(-1) }} />
              </>
              :
              <>
                <img src={logo} style={{ height: '2.5rem', marginTop: '0.25rem' }} alt="#" onClick={() => { navigate('/') }} />
              </>}
          </div>
          {headerImg ?
            <>
              <img src={backUrl+headerImg} style={{ height: '2.5rem', marginTop: '0.25rem' }} alt="#" onClick={() => { window.location.href = '/' }} />
            </>
            :
            <>
            </>}
          <div style={{ display: 'flex', color: `${localStorage.getItem('dark_mode') ? '#fff' : theme.color.font1}`, fontSize: '1.2rem', width: '70px', alignItems: 'center', justifyContent: 'space-between' }}>
            {/* <AiOutlineSearch onClick={changeSearchModal} style={{ width: '2rem', height: '1.5rem', cursor: 'pointer' }} /> */}
            <AiOutlineBell onClick={onClickBell} style={{ width: '2rem', height: '1.5rem', cursor: 'pointer' }} />
            <AiOutlineSetting onClick={myAuth} style={{ width: '2rem', height: '1.5rem', cursor: 'pointer' }} />
          </div>


        </HeaderContainer>
        <HeaderMenuContainer>{/* pc */}
          <div style={{ display: 'flex', margin: '2rem 0', height: '2rem' }}>
            {zBottomMenu.map((item, idx) => (
              <>
                <HeaderMenu key={idx} onClick={() => { navigate(item.link) }} style={{ color: `${item.allowList.includes(location.pathname) ? theme.color.background1 : ''}` }}>{item.name}</HeaderMenu>
              </>
            ))}
          </div>
          <div style={{ position: 'absolute', right: '48%', top: '0.5rem' }}>
            <img src={logo} style={{ height: '5rem' }} onClick={() => { navigate('/') }} alt="#" />
          </div>

          <div style={{ display: 'flex', color: `${localStorage.getItem('dark_mode') ? '#fff' : theme.color.font1}`, fontSize: '1.2rem', width: '70px', justifyContent: 'space-between' }}>
            {/* <AiOutlineSearch onClick={changeSearchModal} style={{ width: '2rem', height: '1.5rem', cursor: 'pointer' }} /> */}
            <AiOutlineBell onClick={onClickBell} style={{ width: '2rem', height: '1.5rem', cursor: 'pointer' }} />
            <AiOutlineSetting onClick={myAuth} style={{ width: '2rem', height: '1.5rem', cursor: 'pointer' }} />
            {isSearch ?
              <>
                <div style={{ position: 'absolute', top: '72px', right: '48px', background: '#fff', padding: '16px', boxShadow: '0px 2px 8px #00000029', borderRadius: '8px', display: 'flex', alignItems: 'center' }}>
                  <SearchInput type={'text'} placeholder='두 글자 이상 입력해주세요.' className='search-pc' style={{ width: '300px' }} onKeyPress={onKeyPressPc} />
                  {/* <AiOutlineSearch style={{ fontSize: '24px', cursor: 'pointer' }} onClick={() => {
                    if ($('.search-pc').val().length < 2) {
                      alert('두 글자 이상 입력해주세요.');
                    } else {
                      setIsSearch(false);
                      navigate('/search', { state: $('.search-pc').val() });
                    }
                  }} /> */}
                </div>
              </>
              :
              <>
              </>
            }

          </div>

        </HeaderMenuContainer>

      </Header>

      {/* <ModalContainer modal={modal}>
          <ModalOverlay onClick={handleModal} />
          <ModalContent>
            <div style={{ margin: '1rem 0 0 1rem', fontSize: '0.9rem', fontWeight: 'bold' }}>2022.07.15</div>
            <div style={{ margin: '1rem 0 0 1rem', paddingLeft: '1rem', fontSize: '0.9rem' }}>7월 15일 뉴스레터</div>
            <div style={{ margin: '1rem 0 0 1rem', fontSize: '0.9rem', fontWeight: 'bold' }}>2022.07.13</div>
            <div style={{ margin: '1rem 0 0 1rem', paddingLeft: '1rem', fontSize: '0.9rem' }}>7월 13일 뉴스레터</div>
            <button style={{ position: 'absolute', bottom: '2rem', left: '3rem', right: '3rem', border: 'none', padding: '0.7rem 0', background: '#000', color: '#fff', fontSize: '1rem' }} onClick={() => {  }}>앱 설정</button>
          </ModalContent>
        </ModalContainer>
        {isModal ?
          <>
            <Modal comment={'준비중입니다.'} modal={isModal} />
          </>
          :
          <>
          </>
        } */}
    </>
  )
}
export default Headers;