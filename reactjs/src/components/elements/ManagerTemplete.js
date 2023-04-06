import styled from "styled-components";

export const Col = styled.div`
display:flex;
flex-direction:column;
`

export const Row = styled.div`
display:flex;
@media screen and (max-width:800px) {
    flex-direction:column;
}
`

export const Card = styled.div`
background:#fff;
display:flex;
flex-direction:column;
width:95%;
margin:12px auto;
box-shadow:${props=>props.theme.boxShadow};
border-radius:3px;
padding: 24px 0;
min-height:320px;
`
export const Title = styled.div`
margin:12px auto 6px 24px;
width:90%;
color:${props=>props.theme.color.manager.font2};
font-weight:bold;
margin-top:32px;
`
export const Input = styled.input`
margin:12px auto 6px 24px;
width:200px;
padding:8px;
outline:none;
border:1px solid ${props=>props.theme.color.font4};
border-radius:4px;
::placeholder {
    color: #cccccc;
}
`
export const Textarea = styled.textarea`
margin:12px auto 6px 24px;
width:400px;
padding:8px;
border:1px solid #dadde6;
border-radius:4px;
outline:none;
resize:none;
height:84px;
::placeholder {
    color: #cccccc;
}
@media screen and (max-width:700px) {
    width:80%;
}
`
export const Select = styled.select`
margin:12px auto 6px 24px;
width:218px;
padding:8px;
outline:none;
border:1px solid ${props=>props.theme.color.font4};
border-radius:4px;
`
export const ImageContainer = styled.label`
border: 2px dashed ${props=>props.theme.color.manager.font3};
margin:12px auto 6px 24px;
width:100%;
height:12rem;
border-radius:2rem;
text-align:center;
@media screen and (max-width:700px) {
    width:90%;
}
`
export const Container = styled.div`
margin:12px auto 6px 24px;
width:90%;
color:${props => props.theme.color.manager.font2};
font-weight:bold;
margin-top:32px;
@media screen and (max-width:650px) {
    overflow-x:auto;
}
`
export const SectorInput = styled.input`
width:90%;
outline:none;
border:none;
::placeholder {
    color: #cccccc;
}
`
export const Table = styled.table`
width:560px;
text-align:center;
border-spacing: 0px;
border-style: none;
padding: 0px;
background:#fff;

`
export const Tr = styled.tr`
display:flex;
`
export const Td = styled.td`
border:1px solid ${props => props.theme.color.font4};
width:40%;
`
export const SectorAddButton = styled.button`
width:560px;
border:1px solid ${props => props.theme.color.font4};
background:#fff;
cursor:pointer;
height:36px;
`