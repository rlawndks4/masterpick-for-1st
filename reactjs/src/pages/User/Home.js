import React from 'react'
import styled from 'styled-components'
import { useEffect, useState } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import Slider from 'react-slick'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { zTalk, zTheme } from '../../data/TestData';
import axios from 'axios';
import { backUrl, masterSlideSetting, slideSetting } from '../../data/Data';
import { Wrappers, Title, Content, Card, Img, WrapDiv, SliderDiv, ImgTitle } from '../../components/elements/UserContentTemplete';
import Loading from '../../components/Loading';
import megaphoneIcon from '../../assets/images/icon/megaphone.svg';
import megaphoneWhiteIcon from '../../assets/images/icon/megaphone-white.svg';
import theme from '../../styles/theme';
import ThemeCard from '../../components/ThemeCard';
import ContentTable from '../../components/ContentTable';
import { commarNumber } from '../../functions/utils';
import SelectSubType from '../../components/elements/SelectSubType';
import SubType from '../../components/elements/SubType';

const Banner = styled.div`
width: 960px; 
margin-bottom:16px;
background: ${props => props.theme.color.background3};
cursor:pointer;
margin: 0 auto;
padding:20px;
font-size: ${props => props.theme.size.font3};
flex-direction:column;
font-weight:bold;
@media screen and (max-width:1000px) {
    width:85vw;
    padding:2.5vw;
}
`
const BannerContent = styled.div`
display:flex;
`
const BannerTitle = styled.div`
width:100px;
margin-bottom:8px;
@media screen and (max-width:700px) {
width:40%;
}
`
const BannerResult = styled.div`
word-break: break-all;
@media screen and (max-width:700px) {
    width:60%;
}
`
const BannerImg = styled.img`
width:100%;
max-width:1000px;
margin:0 auto;
margin-top:16px;
cursor:pointer;
@media screen and (max-width:700px) {
    width:90%;
}
`
const BestMasterContainer = styled.div`
display: flex;
position: absolute;
align-items: center; 
top: 6px;
left: 20%;
font-size: ${props=>props.theme.size.font3};
@media screen and (max-width:700px) {
    font-size: ${props=>props.theme.size.font4};
    left: 4%;
}
`
const Home = () => {
    const navigate = useNavigate();
    const [subTypeNum, setSubTypeNum] = useState(0)
    const [posts, setPosts] = useState([]);
    const [setting, setSetting] = useState({});
    const [loading, setLoading] = useState(false);

    const [bestMasterObj, setBestMasterObj] = useState({});
    const [bestMasterYieldList, setBestMasterYieldList] = useState([])
    const [bestList, setBestList] = useState([])
    const [bestMonthList, setBestMonthList] = useState([])
    const [masterList, setMasterList] = useState([])
    const [masterPk, setMasterPk] = useState(0);
    const [dayType, setDayType] = useState(0)
    const settings = {
        infinite: true,
        speed: 500,
        autoplay: false,
        autoplaySpeed: 2500,
        slidesToShow: 1,
        slidesToScroll: 1,
    };

    useEffect(() => {
        setPosts(zTalk[0].image_list);
        async function fetchPost() {
            setLoading(true)
            const { data: masterResponse } = await axios.get('/api/items?table=master');

            const { data: response } = await axios.get('/api/getmaincontent');

            let best_list = JSON.parse(response?.data?.best_list)?.week;
            let best_month_list = JSON.parse(response?.data?.best_list)?.month;

            let best_master_yield_list = JSON.parse(response?.data?.best_master_yield_list);//컨텐츠에 쓸것
            let best_master_yield_obj = JSON.parse(response?.data?.best_master_yield_list);
            setBestMasterYieldList(bestMasterObj)
            let recommendation_list = JSON.parse(response?.data?.recommendation_list);

            let master_list = [];
            let max_yield = 0;
            let max_index = 0;

            for (var i = 0; i < masterResponse.data.length; i++) {
                if (masterResponse.data[i]?.status != 0) {
                    master_list.push(masterResponse.data[i]);
                    let master_item = masterResponse.data[i]
                    master_item.yield = best_master_yield_list[master_item.pk].best_master_yield;
                    master_item.yield_title = best_master_yield_list[master_item.pk].best_master_yield_title;
                    master_item.yield_motto = best_master_yield_list[master_item.pk].best_master_yield_motto;
                    master_item.yield_sequence = best_master_yield_list[master_item.pk].best_master_sequence;
                    master_item.recommend_obj = recommendation_list[master_item.pk];
                    if (parseFloat(master_item.yield) > max_yield) {
                        max_yield = master_item.yield;
                        max_index = master_list.length - 1;
                    }
                }
            }
            setBestMasterObj(master_list[max_index])

            setMasterPk(master_list[0].pk);
            setMasterList(master_list)
            setBestList(best_list)
            setBestMonthList(best_month_list)
            setSetting(response?.data)

            setTimeout(() => setLoading(false), 1500);
        }
        fetchPost();
        async function isLogined(){
            await window.flutter_inappwebview.callHandler('native_app_logined',{}).then(async function (result) {
                //result = "{'code':100, 'message':'success', 'data':{'login_type':1, 'id': 1000000}}"
                // JSON.parse(result)
                console.log(result)
                let obj = JSON.parse(result);
                if(obj['is_ios']){
                    await localStorage.setItem('is_ios','1');
                }
                await onLoginBySns(obj.data);
            });
        }
        if (window && window.flutter_inappwebview) {
            isLogined();
        }
    }, [])
    const getListByYieldList = (list) => {
        let result = list;
        for(var i =0;i<result.length;i++){
            if(parseInt(result[i].yield_sequence)<0){
                result.splice(i, 1);
                i--;
            }
        }
        result = result.sort(function (a, b) {
            return parseInt(a.yield_sequence) - parseInt(b.yield_sequence)
        })
        console.log(result)
        return result;
    }
    const onLoginBySns = async (obj) => {
        let nick = "";
        if (obj.login_type == 1) {
            nick = "카카오" + new Date().getTime();
        } else if (obj.login_type == 2) {
            nick = "네이버" + new Date().getTime();
        }
        let objs = {
            id: obj.id,
            name: obj.legal_name,
            nickname: nick,
            phone: obj.phone_number,
            user_level: 0,
            typeNum: obj.login_type,
            profile_img: obj.profile_image_url
        }
        const { data: response } = await axios.post('/api/loginbysns', objs);
        if (response.result > 0) {
            await localStorage.setItem('auth', JSON.stringify(response.data));
        } else {
            //alert(response.message);
        }
    }
    return (
        <>
            <Wrappers className='wrappers'>
                {loading ?
                    <>
                        <Loading />
                    </>
                    :
                    <>
                        <Content>
                            <img src={backUrl + setting?.main_img} alt="#" style={{ width: '100%', maxWidth: '500px', margin: '0 auto' }} />
                        </Content>

                        <Title>대가의 투자 스타일</Title>
                        <Content>
                            <div style={{ display: 'flex', width: '100%', border: '1px solid #D9D9D9' }} onClick={() => navigate(`/yield`)}>
                                <div style={{ borderRight: '20px solid transparent', borderBottom: `80px solid #FFB92B`, width: '40%', position: 'relative' }}>
                                    <BestMasterContainer>
                                        <img src={backUrl + bestMasterObj?.profile_img ?? ''} alt="#" style={{ height: '75px', marginRight: '2vw' }} />
                                        <div style={{ color: '#670D0D', fontWeight:'bold', fontSize:theme.size.font3 }}>{bestMasterObj?.name ?? ''}</div>
                                    </BestMasterContainer>
                                </div>
                                <div style={{ position: 'relative', width: '60%', display: 'flex' }}>
                                    <div style={{ margin: 'auto', alignItems: 'center', textAlign: 'center', fontSize: `${theme.size.font2}`, fontWeight: 'bold',display:'flex' }}>
                                        <div>누적 수익률</div>
                                        <div style={{  color: '#FB0000' }}>+{commarNumber(bestMasterObj?.yield ?? '0')}%</div>
                                    </div>

                                </div>
                            </div>
                        </Content>
                        <Title>BEST 투자대가</Title>
                        <Content>
                            <WrapDiv>
                                {getListByYieldList(masterList).map((item, idx) => (
                                    <>
                                        <ThemeCard data={item} />

                                    </>
                                ))}
                            </WrapDiv>
                            <SliderDiv>
                                <Slider {...slideSetting} className='board-container pointer'>
                                    {getListByYieldList(masterList).map((item, idx) => (
                                        <>
                                            <ThemeCard data={item} />

                                        </>
                                    ))}
                                </Slider>
                            </SliderDiv>

                        </Content>
                        <ImgTitle img={localStorage.getItem('dark_mode')?megaphoneWhiteIcon:megaphoneIcon}>대가의 추천 종목</ImgTitle>
                        <Content>
                            <SelectSubType className='subtype-container' style={{ marginBottom: '16px' }}>

                                {masterList.map((item, index) => (
                                    <>
                                        <SubType style={{ color: `${masterPk == item.pk ? '#fff' : theme.color.font1}`, background: `${masterPk == item.pk ? theme.color.background1 : theme.color.background3}` }} onClick={() => { setMasterPk(item.pk) }}>
                                            {item.name}
                                        </SubType>
                                    </>
                                ))}

                            </SelectSubType>
                        </Content>
                        {masterList.map((item, idx) => (
                            <>
                                <Banner style={{ display: `${masterPk == item.pk ? 'flex' : 'none'}`,background:`${localStorage.getItem('dark_mode')?'#222':theme.color.background3}`,border:`1px solid ${localStorage.getItem('dark_mode')?'#fff':theme.color.background3}` }}>
                                    <BannerContent>
                                        <BannerTitle>종목명</BannerTitle>
                                        <BannerResult>{'비공개'}</BannerResult>
                                    </BannerContent>
                                    <BannerContent>
                                        <BannerTitle>종목설명</BannerTitle>
                                        <BannerResult>{item.recommend_obj.note}</BannerResult>
                                    </BannerContent>
                                    <BannerContent>
                                        <BannerTitle>추천가</BannerTitle>
                                        <BannerResult>{commarNumber(item.recommend_obj.recommend_price)}</BannerResult>
                                    </BannerContent>
                                    <BannerContent>
                                        <BannerTitle>현재가</BannerTitle>
                                        <BannerResult>{commarNumber(item.recommend_obj.current_price)}</BannerResult>
                                    </BannerContent>
                                    <BannerContent style={{ color: '#FB0000' }}>
                                        <BannerTitle style={{ marginBottom: '0' }}>현재 수익률</BannerTitle>
                                        <BannerResult>+{commarNumber(item.recommend_obj.yield)}%</BannerResult>
                                    </BannerContent>
                                </Banner>
                            </>
                        ))}
                        <BannerImg src={backUrl + setting?.recommendation_banner_img} alt="#"
                            onClick={() => navigate('/masterevent')} />
                        <ImgTitle img={localStorage.getItem('dark_mode')?megaphoneWhiteIcon:megaphoneIcon}>주간/월간 BEST 수익</ImgTitle>

                        <Content>
                            <div style={{ width: '90%', margin: '0 auto', alignItems: 'end', display: 'flex', flexDirection: 'column' }}>
                                <div style={{ display: 'flex' }}>
                                    <SubType style={{ color: `${dayType == 0 ? '#fff' : theme.color.font1}`, background: `${dayType == 0 ? theme.color.background1 : theme.color.background3}`, width: '36px', minWidth: '36px' }} onClick={() => { setDayType(0) }}>
                                        {'주'}
                                    </SubType>
                                    <SubType style={{ color: `${dayType == 1 ? '#fff' : theme.color.font1}`, background: `${dayType == 1 ? theme.color.background1 : theme.color.background3}`, width: '36px', minWidth: '36px' }} onClick={() => { setDayType(1) }}>
                                        {'월'}
                                    </SubType>
                                </div>
                            </div>
                            <div style={{ display: `${dayType == 0 ? '' : 'none'}` }}>
                                <ContentTable columns={[
                                    { name: "대가명", column: "master_name", width: 25, type: 'text' },
                                    { name: "종목명", column: "name", width: 25, type: 'text' },
                                    { name: "수익률", column: "yield", width: 25, type: 'percent', color: '#FB0000',bold:true },
                                    { name: "보유기간", column: "days", width: 25, type: 'text' }
                                ]}
                                    columnsBold={true}
                                    data={bestList} />
                            </div>
                            <div style={{ display: `${dayType == 1 ? '' : 'none'}` }}>
                                <ContentTable columns={[
                                    { name: "대가명", column: "master_name", width: 25, type: 'text' },
                                    { name: "종목명", column: "name", width: 25, type: 'text' },
                                    { name: "수익률", column: "yield", width: 25, type: 'percent', color: '#FB0000',bold:true },
                                    { name: "보유기간", column: "days", width: 25, type: 'text' }
                                ]}
                                    data={bestMonthList} />
                            </div>
                            <img src={backUrl + setting?.banner_img} alt="#" style={{ width: '90%', maxWidth: '900px', margin: '0 auto', marginTop: '16px', cursor: 'pointer' }}
                                onClick={() => navigate('/masterlist')} />
                        </Content>
                    </>}

            </Wrappers>
        </>
    )
}
export default Home;