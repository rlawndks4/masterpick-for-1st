import styled from "styled-components"
import { AiOutlineUp } from 'react-icons/ai';
import $ from 'jquery';
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
const Button = styled.div`
position:fixed;
right:6px;
bottom:6rem;
background:${props => props.theme.color.background2};
padding:7px 8px 5px 8px;
color:#000;
border-radius:50%;
font-size:16px;
cursor:pointer;
animation: fadein 0.5s;
@keyframes fadein {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}
`
const ScrollToTopButton = () => {
    const { pathname } = useLocation();
    const [isPost, setIsPost] = useState(false);
    const [display, setDisplay] = useState(true);
    useEffect(()=>{
        window.addEventListener('scroll',function(){
            if(window.scrollY<=50){
                setDisplay("none");
            }else{
                setDisplay("");
            }
        })
    },[])
    useEffect(() => {
        if (pathname.includes('/manager')) {
            setDisplay('none');
        } else {
            setDisplay('')
        }
        if(window.scrollY<=50){
            setDisplay("none");
        }else{
            setDisplay("");
        }
        if (pathname.substring(0, 6) == '/post/' || pathname.substring(0, 7) == '/video/' || window.innerWidth > 600) {
            setIsPost(true);
        } else {
            setIsPost(false);
        }
    }, [pathname])
    const scrollToTop = () => {
        $("html, body").animate({ scrollTop: 0 }, 600);
    }
    return (
        <>
            <Button onClick={scrollToTop} style={{bottom:`${isPost?'2rem':'6rem'}`, display:`${display}`}}>
                <AiOutlineUp />
            </Button>
        </>
    )
}
export default ScrollToTopButton;