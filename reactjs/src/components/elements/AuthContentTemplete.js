import styled from "styled-components";

export const WrapperForm = styled.div`
width:98%;
max-width:800px;
margin: 0 auto;
display:flex;
flex-direction:column;
`

export const CategoryName = styled.div`
width:364px;
margin:1rem auto 0 auto;
font-size:15px;
font-weight:500;
margin-top: 36px;
@media (max-width: 600px) {
    width:85%;
}
`
export const Input = styled.input`
width:336px;
padding:16px 12px;
border:1px solid #cccccc;
margin:1rem auto 0 auto;
outline:none;
font-size:12px;
::placeholder {
    color:#dddddd;
    font-size:12px;
}
@media (max-width: 600px) {
    width:75%;
}
`
export const Button = styled.button`
width:364px;
margin:0 auto;
height:48px;
border:none;
background:${(props) => props.theme.color.background1};
color:#fff;
font-size:16px;
font-weight:600;
cursor:pointer;
border: 1px solid transparent;
@media (max-width: 600px) {
width:79.8%;
}
@media (max-width: 550px) {
    width:80.5%;
}
@media (max-width: 500px) {
    width:81%;
}
@media (max-width: 450px) {
    width:81.5%;
}
@media (max-width: 400px) {
    width:82.5%;
}
@media (max-width: 375px) {
    width:83%;
}
@media (max-width: 350px) {
    width:83.5%;
}
@media (max-width: 325px) {
    width:84.5%;
}
@media (max-width: 300px) {
    width:85.5%;
}
`
export const FlexBox = styled.div`
width:364px;
margin:1rem auto;
display:flex;
align-items:center;
font-weight:600;
@media (max-width: 600px) {
    width:85%;
}
`
export const SnsLogo = styled.img`
width:42px;
margin-right:16px;
cursor:pointer;
`
export const RegularNotice = styled.div`
font-size:${props=>props.theme.size.font5};
color:red;
width:364px;
height:20px;
margin: 0 auto;
padding-top:6px;
@media (max-width: 600px) {
    width:79.8%;
    }
    @media (max-width: 550px) {
        width:80.5%;
    }
    @media (max-width: 500px) {
        width:81%;
    }
    @media (max-width: 450px) {
        width:81.5%;
    }
    @media (max-width: 400px) {
        width:82.5%;
    }
    @media (max-width: 375px) {
        width:83%;
    }
    @media (max-width: 350px) {
        width:83.5%;
    }
    @media (max-width: 325px) {
        width:84.5%;
    }
    @media (max-width: 300px) {
        width:85.5%;
    }
`