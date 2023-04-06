import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import $ from 'jquery'
import { useState } from "react";
import thumbImg from '../../assets/images/icon/thumb.svg';
import thumbWhiteImg from '../../assets/images/icon/thumb-white.svg';
export const WrappersStyle = styled.div`
position:relative;
display:flex;
flex-direction:column;
width:100%;
max-width:1000px;
margin-top:8rem;
margin-left:auto;
margin-right:auto;
margin-bottom:6rem;
min-height:58vh;
@media screen and (max-width:1050px) { 
    margin-top:4rem;
}
`

export const Wrappers = (props) =>{
    let {maxWidth, width_percent} = props;
    const [minHeight, setMinHeight] = useState(500);
    const {pathname} = useLocation();
    useEffect(()=>{
        setMinHeight($(window).height()-224-173);
    },[pathname])
    useEffect(()=>{

    },[])
    return (
        <>
        <WrappersStyle style={{minHeight:`${minHeight}px`,maxWidth:`${maxWidth?maxWidth:''}px`,width:`${width_percent?width_percent:''}%`}}>
            {props.children??""}
        </WrappersStyle>
        </>
    )
}

export const TitleStyle = styled.div`
font-size:${props => props.theme.size.font2};
font-weight:bold;
margin-right:16px;
cursor:pointer;
`
export const TitleImg = styled.img`
height:36px;
margin:0 8px;
@media screen and (max-width:1050px) { 
    margin:0 8px 0 5vw;
}
`
export const Title = (props) =>{
    const navigate = useNavigate();
    return (
        <>
        <div style={{display:'flex',alignItems:'center',marginTop:'24px',marginBottom:'8px'}} onClick={()=>{navigate(props.link)}}>
        <TitleImg src={localStorage.getItem('dark_mode')?thumbWhiteImg:thumbImg} alt="#"/>
        <TitleStyle>
            {props?.children??""}
        </TitleStyle>
        <hr className="bar"/>
        </div>
        
        </>
    )
}
export const ImgTitle = (props) =>{
    const navigate = useNavigate();
    return (
        <>
        <div style={{display:'flex',alignItems:'center',marginTop:'24px',marginBottom:'8px'}} onClick={()=>{navigate(props.link)}}>
        <TitleImg src={props.img} alt="#"/>
        <TitleStyle>
            {props?.children??""}
        </TitleStyle>
        <hr className="bar"/>
        </div>
        
        </>
    )
}
export const Content = styled.div`
margin:0 auto 1rem 0;
width:100%;
font-size:${props => props.theme.size.font3};
display:flex;
flex-direction:column;
font-weight:normal;
@media screen and (max-width:700px) { 
    width:99.5%; 
}
`
export const Img = styled.div`
width: 100%;
height:320px;
background:#fff;
background-size: cover;
background-repeat: no-repeat;
background-position: center center;
background-blend-mode: multiply;
@media screen and (max-width:1200px) {
    height: 28.266666666vw;
}
@media screen and (max-width:600px) {
    height: 60vw;
}
`
export const Width90Component = styled.div`
display:flex;
width:90%;
margin: 0 auto;
`
export const Card = styled.div`
width: 48%; 
margin-bottom:16px;
background: ${props => props.theme.color.background3};
cursor:pointer;
@media screen and (max-width:600px) {
    width:100%;
}
`
export const WrapDiv = styled.div`
display: flex;
justify-content: space-between;
flex-wrap: wrap;
@media screen and (max-width:600px) { 
    display:none;
}
`
export const SliderDiv = styled.div`
display:none;
@media screen and (max-width:602px) { 
    display:flex;
}
`
export const TransparentButton = styled.button`
width:90px;
height:35px;
background:transparent;
border-radius:4px;
color:${props=>props.theme.color.font1};
border:1px solid ${props=>props.theme.color.background1};
cursor:pointer;
font-size:${props=>props.theme.size.font3};
`
export const ViewerContainer = styled.div`
max-width:700px;
width:100%;
margin:0 auto;
`
export const Table = styled.table`
font-size:${props => props.theme.size.font4};
width:100%;
text-align:center;
border-collapse: collapse;
min-width:350px;
`
export const Tr = styled.tr`
width:100%;
height:26px;
border-bottom:1px solid ${props => props.theme.color.font4};
`
export const Td = styled.td`
border-bottom:1px solid ${props => props.theme.color.font4};
`
export const SelectType = styled.div`
display:flex;
width:100%;
z-index:5;
background:#fff;
margin:16px 0;
`