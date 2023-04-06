import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { backUrl } from "../data/Data";
import theme from "../styles/theme";
import { Card, Img } from "./elements/UserContentTemplete";
import { AiFillHeart } from 'react-icons/ai'
export const Image = styled.img`
width: 90%;
height:280px;
background:#fff;
background-size: cover;
background-repeat: no-repeat;
background-position: center center;
background-blend-mode: multiply;
@media screen and (max-width:1200px) {
    height: 28.266666666vw;
}
@media screen and (max-width:600px) {
    height: 58vw;
}
`
const TextContainer = styled.div`
padding: 0 20px;
min-height: 50px;
justify-content: space-between;
display: flex;
flex-direction: column;
@media screen and (max-width:600px) {
    height: 100px;
}
@media screen and (max-width:400px) {
    height: 130px;
}
`
const VideoCard = (props) => {
    const { paddingBottom, item, isSlide, isImgPadding, isImgDiv, isChangeColor, background, isTerm } = props;
    const navigate = useNavigate();
    return (
        <>
            <Card onClick={() => { navigate(`/video/${props.item.pk}`) }}
                style={{
                    background: `${background?background: props?.item?.background_color ? props?.item?.background_color : ''}`,
                    color: `${background?'#000':props?.item?.font_color ? props?.item?.font_color : ''}`,
                    paddingTop: `${isImgPadding ? '0.5%' : '0'}`,
                    width:`${isTerm && window.innerWidth<=600?'95%':''}`
                }}>
                {isImgDiv ?
                    <>
                        <Img style={{ backgroundImage: `url(${`https://img.youtube.com/vi/${props.item.link}/0.jpg`})` }} />
                    </>
                    :
                    <>
                        <Image src={`https://img.youtube.com/vi/${props.item.link}/0.jpg`} alt="#" style={{ width: `${isImgPadding ? '90%' : '100%'}`, margin: `${isImgPadding ? '5%' : '0'}` }} />
                    </>}
                {/* <iframe style={{ width: '100%', height: 'auto', height: '80vw', maxHeight: '450px' }} src={`https://www.youtube.com/embed/${videos.link}`} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe> */}
                <TextContainer style={{padding:`${isImgPadding?'0 20px':'20px'}`}}>
                    <div style={{ fontSize: `${theme.size.font3}` }}>{props?.item?.title}</div>
                    {props.isVideoList ?
                        <>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center' }}><AiFillHeart style={{ fontSize: '18px', color: `${theme.color.font3}` }} /><p style={{ margin: '0', marginLeft: '6px' }}>{'2'}</p></div>
                                <img src={backUrl + props.channelImg} alt="#" style={{ width: '28px', height: '28px', borderRadius: '50%' }} />
                            </div>
                        </>
                        :
                        <>
                            <div style={{ fontSize: `${theme.size.font5}`, padding: '16px 0 32px 0', textAlign: 'center' }}>{"자세히보기 >"}</div>
                        </>
                    }
                    {props.isSlide ?
                        <>
                        </>
                        :
                        <>
                        </>
                    }
                </TextContainer>
            </Card>
        </>
    )
}
export default VideoCard;