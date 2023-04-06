import { Circles } from 'react-loader-spinner';
import styled from 'styled-components';
import theme from '../styles/theme';
import loadingGif from '../assets/images/icon/logo.gif'
const LoadingContainer = styled.div`
margin:-15vh auto;
@media screen and (max-width:700px) {
    position:absolute;
width:100vw;
height:100vh;
display:flex;
z-index:100;
margin:0;
}

`
const Loading = () => {
    return (
        <>
            <LoadingContainer>
                <img src={loadingGif} alt="#" style={{width:'100px',margin:'35vh auto auto auto'}}/>
            </LoadingContainer>
        </>
    )
}
export default Loading;