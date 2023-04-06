import React from 'react'
import styled from 'styled-components'
import { useEffect, useState } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import '../styles/style.css'
import {ImSpinner11} from 'react-icons/im'
import {IoChevronBackOutline} from 'react-icons/io5'
const Wrappers = styled.div`
position:absolute;
width:100%;
height:4rem;
align-items:center;
display:flex;
justify-content:space-between;
@media screen and (max-width:1000px) { 
    height:3.5rem;
}
`
const ContentHeader = (props) => {
    const navigate = useNavigate();
    const params = useParams();
    return (
        <>
        <Wrappers>
        <IoChevronBackOutline onClick={()=>{navigate(`/${params.franchise}`)}} style={{marginLeft:'1.2rem',fontSize:'1.2rem'}} />
        <div style={{fontSize:'0.8rem',fontWeight:'bold'}}>{props?.title}</div>
        <ImSpinner11 onClick={()=>{window.location.reload()}} style={{marginRight:'1.2rem'}} />
        </Wrappers>
        </>
    );
};
export default ContentHeader;