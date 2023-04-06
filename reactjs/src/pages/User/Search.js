import React from 'react'
import styled from 'styled-components'
import { useEffect, useState } from 'react';
import { useNavigate, Link, useParams, useLocation } from 'react-router-dom';
import Slider from 'react-slick'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import theme from '../../styles/theme';
import SelectSubType from '../../components/elements/SelectSubType';
import { zTalk, zTheme } from '../../data/TestData';
import SubType from '../../components/elements/SubType';
import testImg from '../../assets/images/test/test5.jpg';
import axios from 'axios';
import { backUrl, slideSetting } from '../../data/Data';
import { getIframeLinkByLink } from '../../functions/utils';
import { Wrappers, Title, Content, Card, Img, WrapDiv, SliderDiv } from '../../components/elements/UserContentTemplete';
import ThemeCard from '../../components/ThemeCard'
import VideoCard from '../../components/VideoCard';
import Loading from '../../components/Loading';
import { AiOutlineSearch } from 'react-icons/ai'
import $ from 'jquery'
const Input = styled.input`
width:336px;
padding:16px 12px;
border-radius:0;
border:none;
outline:none;
font-size:12px;
display:none;
::placeholder {
    color:#dddddd;
    font-size:12px;
}
@media (max-width: 600px) {
    width:75%;
}
`
const Search = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [oneWords, setOneWords] = useState([]);
    const [oneEvents, setOneEvents] = useState([]);
    const [issues, setIssues] = useState([]);
    const [features, setFeatures] = useState([]);
    const [themes, setThemes] = useState([]);
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(false);

    const settings = {
        infinite: true,
        speed: 500,
        autoplay: false,
        autoplaySpeed: 2500,
        slidesToShow: 1,
        slidesToScroll: 1,
    };
    useEffect(()=>{
        if(location.state){
            $('.search').val(location.state);
            let str = location.state;
            if(str.length>=2){
                onSearchAllItem();
            }
        }
    },[location.state])
    const onSearchAllItem = async () => {
        let str = $('.search').val()
        if (str.length < 2) {
            alert('두글자 이상 입력해 주세요.');
        } else {
            setLoading(true)
            const { data: response } = await axios.get(`/api/onsearchallitem?keyword=${str}`);
            if(response.data.oneWord.length==0&&
                response.data.oneEvent.length==0&&
                response.data.issues.length==0&&
                response.data.features.length==0&&
                response.data.themes.length==0&&
                response.data.videos.length==0){
                alert('해당 검색 결과가 없습니다.');
            }
            setOneWords(response.data.oneWord);
            setOneEvents(response.data.oneEvent);
            setIssues(response.data.issues);
            setFeatures(response.data.features);
            setThemes(response.data.themes);
            let video_list = response.data?.videos
            for (var i = 0; i < video_list.length; i++) {
                video_list[i].link = getIframeLinkByLink(video_list[i].link);
            }
            setVideos(video_list);
            setLoading(false)
        }
    }
    return (
        <>
            <Wrappers className='wrappers'>
                {/* <Content style={{ position: 'relative' }}>
                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #cccccc', margin: '0 auto' }}> */}
                        <Input className='search' placeholder='두 글자 이상 입력해주세요.'  />
                        {/* <AiOutlineSearch className='search-button' style={{ padding: '14px', cursor: 'pointer' }} onClick={onSearchAllItem} />
                    </div>
                </Content> */}
                {loading ?
                    <>
                        <Loading />
                    </>
                    :
                    <>

                        {oneWords && oneWords.length > 0 ?
                            <>
                                <Title className='pointer' link={'/onewordlist'}>하루 1단어</Title>
                                <Content className='pointer'>
                                    {oneWords.map((item, idx) => (
                                        <>
                                            <div style={{ padding: '16px 0', borderBottom: '1px solid #cccccc' }} onClick={() => navigate(`/post/oneword/${item?.pk}`)}>{item?.title ?? ""}</div>
                                            {/* <div style={{ fontSize: `${theme.size.font4}`, padding: '6px 0 0 0' }}>{item?.hash ?? ""}</div>      */}
                                        </>
                                    ))}

                                </Content>
                            </>
                            :
                            <>
                            </>
                        }
                        {oneEvents && oneEvents.length > 0 ?
                            <>
                                <Title link={'/oneeventlist'} className='pointer'>하루 1종목</Title>
                                <Content className='pointer'>
                                    {oneEvents.map((item, idx) => (
                                        <>
                                            <div style={{ padding: '16px 0', borderBottom: '1px solid #cccccc' }} onClick={() => navigate(`/post/oneevent/${item?.pk}`)}>{item?.title ?? ""}</div>
                                            {/* <div style={{ fontSize: `${theme.size.font4}`, padding: '6px 0 0 0' }}>{item?.hash ?? ""}</div>      */}
                                        </>
                                    ))}
                                </Content>
                            </>
                            :
                            <>
                            </>
                        }
                        {issues && issues.length > 0 ?
                            <>
                                <Title className='pointer' link={'/selectissuecategory'} >핵심 이슈{'&'}공시</Title>
                                <Content className='pointer'>
                                    <WrapDiv>
                                        {issues.map((item, idx) => (
                                            <>
                                                <Card onClick={() => navigate(`/post/issue/${item?.pk}`)} >
                                                    <Img style={{ backgroundImage: `url(${backUrl + item?.main_img})` }} />
                                                    <div style={{ padding: '16px 16px 0 16px', fontWeight: 'bold' }}>{item?.date.substring(0, 10) ?? ""} {item?.title}</div>
                                                    <div style={{ fontSize: `${theme.size.font4}`, padding: '6px 16px 16px 16px' }}>{item?.hash}</div>
                                                </Card>
                                            </>
                                        ))}

                                    </WrapDiv>
                                    <SliderDiv>
                                        <Slider {...slideSetting} className='board-container'>
                                            {issues.map((item, idx) => (
                                                <>
                                                    <Card onClick={() => navigate(`/post/issue/${item?.pk}`)} style={{ color: `${item?.font_color}`, background: `${item?.background_color}`, width: `${window.innerWidth <= 600 ? '95%' : ''}` }} >
                                                        <Img style={{ backgroundImage: `url(${backUrl + item?.main_img})` }} />
                                                        <div style={{ padding: '16px', height: '70px', fontWeight: 'bold' }}> {item?.title}</div>
                                                        <div style={{ fontSize: `${theme.size.font4}`, padding: '8px 16px', height: '50px' }}>{item?.hash}</div>
                                                    </Card>
                                                </>
                                            ))}
                                        </Slider>
                                    </SliderDiv>
                                </Content>
                            </>
                            :
                            <>
                            </>
                        }
                        {features && features.length > 0 ?
                            <>
                                <Title className='pointer' link={'/selectissuecategory'} >특징주</Title>
                                <Content className='pointer'>
                                    <WrapDiv>
                                        {features.map((item, idx) => (
                                            <>
                                                <Card onClick={() => navigate(`/post/issue/${item?.pk}`)} >
                                                    <Img style={{ backgroundImage: `url(${backUrl + item?.main_img})` }} />
                                                    <div style={{ padding: '16px 16px 0 16px', fontWeight: 'bold' }}>{item?.date.substring(0, 10) ?? ""} {item?.title}</div>
                                                    <div style={{ fontSize: `${theme.size.font4}`, padding: '6px 16px 16px 16px' }}>{item?.hash}</div>
                                                </Card>
                                            </>
                                        ))}

                                    </WrapDiv>
                                    <SliderDiv>
                                        <Slider {...slideSetting} className='board-container'>
                                            {features.map((item, idx) => (
                                                <>
                                                    <Card onClick={() => navigate(`/post/issue/${item?.pk}`)} style={{ color: `${item?.font_color}`, background: `${item?.background_color}`, width: `${window.innerWidth <= 600 ? '95%' : ''}` }} >
                                                        <Img style={{ backgroundImage: `url(${backUrl + item?.main_img})` }} />
                                                        <div style={{ padding: '16px', height: '70px', fontWeight: 'bold' }}> {item?.title}</div>
                                                        <div style={{ fontSize: `${theme.size.font4}`, padding: '8px 16px', height: '50px' }}>{item?.hash}</div>
                                                    </Card>
                                                </>
                                            ))}
                                        </Slider>
                                    </SliderDiv>
                                </Content>
                            </>
                            :
                            <>
                            </>
                        }


                        {/* <Title link={'/masterlist'} className='pointer'>퍼스트 전문가</Title>

                        <SelectSubType className='subtype-container' style={{ marginBottom: '16px' }}>
                            <SubType style={{ borderBottom: `2px solid ${0 == subTypeNum ? theme.color.background1 : '#fff'}`, fontWeight: `${0 == subTypeNum ? 'bold' : 'normal'}` }} onClick={() => { onChangeStrategyNum(0, 0) }}>
                                All
                            </SubType>
                            {masters && masters.map((item, index) => (
                                <>
                                    <SubType style={{ borderBottom: `2px solid ${index + 1 == subTypeNum ? theme.color.background1 : '#fff'}`, fontWeight: `${index + 1 == subTypeNum ? 'bold' : 'normal'}` }} onClick={() => { onChangeStrategyNum(index + 1, item.pk) }}>
                                        {item.nickname}
                                    </SubType>
                                </>
                            ))}
                        </SelectSubType> */}
                        {themes && themes.length > 0 ?
                            <>
                                <Title link={'/themelist'}>핵심 테마</Title>
                                <Content>
                                    <WrapDiv>

                                        {themes.map((item, idx) => (
                                            <>
                                                <Card onClick={() => navigate(`/post/theme/${item?.pk}`)} style={{ color: `${item?.font_color}`, background: `${item?.background_color}` }}>
                                                    <Img style={{ backgroundImage: `url(${backUrl + item?.main_img})` }} />
                                                    <div style={{ padding: '16px', minHeight: '50px', justifyContent: 'space-between', display: 'flex', flexDirection: 'column' }}>
                                                        <div style={{ fontSize: `${theme.size.font4}`, fontWeight: 'bold' }}>{item?.title}</div>
                                                        <div style={{ fontSize: `${theme.size.font5}` }}>{item?.date.substring(0, 10) ?? ""}</div>
                                                    </div>

                                                </Card>

                                            </>
                                        ))}
                                    </WrapDiv>
                                    <SliderDiv>
                                        <Slider {...slideSetting} className='board-container'>
                                            {themes.map((item, idx) => (
                                                <>
                                                    <Card onClick={() => navigate(`/post/theme/${item?.pk}`)} style={{ color: `${item?.font_color}`, background: `${item?.background_color}`, width: `${window.innerWidth <= 600 ? '95%' : ''}` }}>
                                                        <Img style={{ backgroundImage: `url(${backUrl + item?.main_img})` }} />
                                                        <div style={{ padding: '16px', minHeight: '50px', justifyContent: 'space-between', display: 'flex', flexDirection: 'column' }}>
                                                            <div style={{ fontSize: `${theme.size.font4}`, fontWeight: 'bold' }}>{item?.title}</div>
                                                            <div style={{ fontSize: `${theme.size.font5}`, padding: '16px 0 32px 0' }}>{item?.date.substring(0, 10) ?? ""}</div>
                                                        </div>

                                                    </Card>

                                                </>
                                            ))}
                                        </Slider>
                                    </SliderDiv>
                                </Content>
                            </>
                            :
                            <>
                            </>
                        }
                        {videos && videos.length > 0 ?
                            <>
                                <Title link={'/videolist'}>핵심 비디오</Title>
                                <Content>
                                    <WrapDiv>
                                        {videos.map((item, idx) => (
                                            <>
                                                <VideoCard item={item} isImgPadding={true} />
                                            </>
                                        ))}
                                    </WrapDiv>
                                    <SliderDiv>
                                        <Slider {...slideSetting} className='board-container'>
                                            {videos.map((item, idx) => (
                                                <>
                                                    <VideoCard item={item} paddingBottom={'32px'} isSlide={true} isImgPadding={true} isTerm={true} />
                                                </>
                                            ))}
                                        </Slider>
                                    </SliderDiv>
                                </Content>
                            </>
                            :
                            <>
                            </>
                        }

                    </>}


            </Wrappers>
        </>
    )
}
export default Search;