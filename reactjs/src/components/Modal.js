import React from 'react'
import styled from 'styled-components'
import { useEffect, useState } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import '../styles/style.css'
import logo from '../assets/images/test/test_logo.png'
const ModalContainer = styled.div`

position: fixed;
top:0;
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

position: relative;
border-radius: 12px;
width:50%;

top: 0;
align-items: center;
display:flex;
flex-direction:column;
@media screen and (max-width:950px) {
width:80%;

}
`

const XButton = styled.button`
width: 28px;
height: 28px;
color: #000;
border: none;
border-radius: 16px;
font-size: 16px;
right: 0px;
top: 0px;
background-color: rgba( 255, 255, 255, 0 );
position: absolute;
font-family: ${({ theme }) => theme.font.thin};
cursor: ${({ background }) => background === 'disabled' ? 'arrow' : 'pointer'};
&:focus {
outline: none;
}
@media screen and (max-width:950px) {
width: 36px;
height: 36px;
}
`
const Modal = (props) => {
    const [modal, setModal] = useState("none");
    useEffect(() => {
        setModal('flex')
    }, [])
    const handleModal = () => {
        if (modal == "none") {
            setModal("flex");
        }
        else {
            setModal("none");
        }
    };
    return (
        <>
            <ModalContainer modal={modal}>
                
                <ModalOverlay onClick={handleModal} />
                <ModalContent>
                <img src={logo} alt="#" style={{position:'absolute',zIndex:5,top:'28px',width:'48px'}} />
                    <XButton onClick={handleModal}>
                        X
                    </XButton>
                    <div style={{ width: '12rem', padding: '7rem 2rem 3rem 2rem' }}>
                        {props.comment}
                    </div>


                </ModalContent>
            </ModalContainer>
        </>
    )
}
export default Modal;