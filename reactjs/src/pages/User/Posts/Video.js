import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { Title, Wrappers } from "../../../components/elements/UserContentTemplete";
import { backUrl, slideSetting } from "../../../data/Data";
import theme from "../../../styles/theme";
import '@toast-ui/editor/dist/toastui-editor-viewer.css';
import { commarNumber, getIframeLinkByLink } from "../../../functions/utils";
import $ from 'jquery';
import { Content, SliderDiv, WrapDiv } from "../../../components/elements/UserContentTemplete";
import Slider from 'react-slick'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import VideoCard from "../../../components/VideoCard";
import styled from "styled-components";
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";
import logo from '../../../assets/images/test/logo.svg'

const Logo = styled.img`
position: fixed;
bottom: 0;
height:18px;
`
const Iframe = styled.iframe`
width: 100%;
height: auto;
height: 80vw;
max-height: 500px;
max-width: 750px;
margin: 0 auto;
`
const Progress = styled.progress`

    appearance: none;
    position: fixed;
    bottom: 0;
    width: 100%;
    left: 0;
    right: 0;
    height:16px;

::-webkit-progress-bar {
    background: #f0f0f0;
    border-radius: 0;
}

::-webkit-progress-value {
    background:transparent;
    border-bottom: 16px solid #FB8200;
    border-right: 10px solid transparent;
}
`
const NextArrow = ({ onClick }) => {
    return (
        <div className="nextArrow" onClick={onClick}>
            <MdNavigateNext style={{ color: '#fff' }} />
        </div>
    );
};

const PrevArrow = ({ onClick }) => {
    return (
        <div className="prevArrow" onClick={onClick}>
            <MdNavigateBefore style={{ color: '#fff' }} />
        </div>
    );
};

const Video = () => {
    const params = useParams();
    const { pathname } = useLocation();
    const [post, setPost] = useState({});
    const [latests, setLatests] = useState([]);
    const [relates, setRelates] = useState([]);
    const [percent, setPercent] = useState(0);

    const settings = {
        infinite: false,
        speed: 500,
        autoplay: false,
        autoplaySpeed: 2500,
        slidesToShow: 1,
        slidesToScroll: 1,
        nextArrow: <NextArrow onClick />,
        prevArrow: <PrevArrow onClick />,
    };
    useEffect(()=>{
        window.addEventListener('scroll', function (el) {
            let per = Math.floor(($(window).scrollTop() / ($(document).height() - $(window).height())) * 100);
            setPercent(per);
        })
    },[])
    useEffect(() => {
        async function fetchPost() {
            const { data: response } = await axios.get(`/api/getvideocontent?pk=${params.pk}&views=1`);
            let obj = response.data.video;
            obj.link = getIframeLinkByLink(obj.link);
            obj.note = stringToHTML(obj.note)
            $('.note').append(obj.note)
            setPost(obj);
            let relate_list = response.data?.relates ?? [];
            for (var i = 0; i < relate_list.length; i++) {
                relate_list[i].link = getIframeLinkByLink(relate_list[i].link);
            }
            setRelates(relate_list);
            let video_list = response.data?.latests ?? []
            for (var i = 0; i < video_list.length; i++) {
                video_list[i].link = getIframeLinkByLink(video_list[i].link);
            }
            setLatests(video_list);
        }
        fetchPost();
    }, [pathname])
    const stringToHTML = (str) => {
        let parser = new DOMParser();
        str = str.replaceAll('http://localhost:8001', backUrl);
        str = str.replaceAll('http://127.0.0.1:8001', backUrl);
        str = str.replaceAll('<img', '<img style="width:100%;" ');
        let doc = parser.parseFromString(str, 'text/html');
        return doc.body;
    };
    return (
        <>
            <Wrappers>
                <div style={{ width: '100%', textAlign: 'end' }}>{post.nickname} / {post?.date?.substring(5, 10)} / {commarNumber(post?.views??0)}</div>
                <Title>{post.title}</Title>
                <Iframe src={`https://www.youtube.com/embed/${post.link}`} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen>

                </Iframe>
                <div style={{ fontSize: `${theme.size.font4}`, color: `${theme.color.font2}` }}>{post.hash}</div>
                <div className="note">
                </div>
                <Title>관련 영상</Title>
                <Content>
                    <WrapDiv>
                        {relates.map((item, idx) => (
                            <>
                                <VideoCard item={item} />
                            </>
                        ))}
                    </WrapDiv>
                    <SliderDiv>
                        <Slider {...slideSetting} className='board-container'>
                            {relates.map((item, idx) => (
                                <>
                                    <VideoCard item={item} isSlide={true} isImgPadding={true}  />
                                </>
                            ))}
                        </Slider>
                    </SliderDiv>
                </Content>
                <Title>최신 영상</Title>
                <Content>
                    <WrapDiv>
                        {latests.map((item, idx) => (
                            <>
                                <VideoCard item={item} />
                            </>
                        ))}
                    </WrapDiv>
                    <SliderDiv>
                        <Slider {...slideSetting} className='board-container'>
                            {latests.map((item, idx) => (
                                <>
                                    <VideoCard item={item} isSlide={true} isImgPadding={true}  />
                                </>
                            ))}
                        </Slider>
                    </SliderDiv>
                </Content>
                <Progress value={`${percent}`} max="100"></Progress>
                {/* <Logo src={logo} style={{left:`${percent*0.94}%`}}/> */}
            </Wrappers>
        </>
    )
}
export default Video;