import styled from "styled-components";

export const ContentWrappers = styled.div`
width:100%;
display:flex;
background:#f1f2f6;
flex-wrap:wrap;
margin-top:2rem;
margin-bottom:5rem;
@media screen and (max-width:500px) { 
    flex-direction:column;
}
`