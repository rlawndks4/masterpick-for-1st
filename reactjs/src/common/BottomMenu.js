import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { useNavigate, useLocation } from "react-router-dom"
import '../styles/style.css'
import theme from '../styles/theme'
import { zBottomMenu } from '../data/Data'
const Container = styled.aside`
    background: #fff;
    border-top: 0.1rem solid #e6e6e6;
    position: fixed;
    right: 0;
    bottom: -1px;
    left: 0;
    z-index: 5;
    display:none;
    width:100%;
    max-width:1000px;
    margin: 0 auto;
    @media screen and (max-width:1050px) { 
        display:flex;
    }
`
const MenuContainer = styled.nav`
width: 100%;
max-width: 76.8rem;
height: 5rem;
display: -webkit-flex;
display: flex;
margin: 0 auto;

`
const OneMenuContainer = styled.div`
    color: inherit;
    text-decoration: none;
    width: 20%;
    min-width: 20%;
    height: 100%;
    display: flex;
    flex-direction:column;
    padding: 0.3rem 0 0.2rem;
    position: relative;
    text-align: center;
    cursor:pointer;
    align-items:center;
`
const OneMenuName = styled.span`
color: #ababab;
font-size:0.8rem;
font-weight:400;
@media screen and (max-width:400px) { 
    font-size:0.7rem;
  }
  @media screen and (max-width:300px) { 
    font-size:0.65rem;
  }
`

const BottomMenu = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [modal, setModal] = useState("none");

    const [beforeCount, setBeforeCount] = useState(0)
    const [colorList, setColorList] = useState([])
    const [display, setDisplay] = useState('flex');
    const [isPost, setIsPost] = useState(false);

    useEffect(() => {
        if (location.pathname.includes('/manager')) {
            setDisplay('none');
        } else {
            setDisplay('flex')
        }
        if (location.pathname.substring(0, 6) == '/post/' || location.pathname.substring(0, 7) == '/video/') {
            setIsPost(true);
        } else {
            setIsPost(false)
        }
        let arr = [];

        for (var i = 0; i < zBottomMenu.length; i++) {
            for (var j = 0; j < zBottomMenu[i].allowList.length; j++) {
                if (zBottomMenu[i].allowList[j] == location.pathname) {
                    break;
                }
            }
            if (j == zBottomMenu[i].allowList.length) {
                arr.push(localStorage.getItem('dark_mode')?'#fff':theme.color.font1);
            } else {
                arr.push(theme.color.background1);
            }
        }
        setColorList(arr);
    }, [location])

    return (
        <>
            {display == 'flex' ?
                <>
                    {isPost ?
                        <>
                        </>
                        :
                        <>
                            <Container className='menu-container' style={{ background: `${localStorage.getItem('dark_mode') ? '#222' : '#fff'}` }}>
                                <MenuContainer>
                                    {zBottomMenu.map((item, index) => (
                                        <>
                                            <OneMenuContainer onClick={() => { navigate(item.link) }} style={{ color: `${colorList[index]}` }} key={index}>
                                                {colorList[index] == theme.color.background1 ? item.activeIcon : item.icon}
                                                <OneMenuName style={{ color: `${colorList[index]}` }} >
                                                    {item.name}
                                                </OneMenuName>
                                            </OneMenuContainer>
                                        </>
                                    ))}

                                </MenuContainer>
                            </Container>
                        </>
                    }

                </>
                :
                <>
                </>}

        </>
    )
}

export default BottomMenu
