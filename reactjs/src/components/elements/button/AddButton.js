import styled from "styled-components";

const AddButton = styled.button`
background:${props=>props.theme.color.background1};
color:#fff;
border:none;
border-radius:4px;
width:64px;
height:34px;
cursor:pointer;
box-shadow:0px 0px 8px #dddddd;
font-weight:bold;
`
export default AddButton;