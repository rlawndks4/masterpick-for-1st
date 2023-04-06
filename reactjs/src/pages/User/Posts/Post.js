import axios from "axios";
import { useEffect, useState, useRef, React } from "react";
import { useParams } from "react-router-dom";
import { ViewerContainer, Wrappers } from "../../../components/elements/UserContentTemplete";
import { backUrl, zWeather } from "../../../data/Data";
import theme from "../../../styles/theme";
import '@toast-ui/editor/dist/toastui-editor-viewer.css';
import $ from 'jquery'
import styled from "styled-components";
import { commarNumber } from "../../../functions/utils";
import firstPartnersImg from '../../../assets/images/test/first-partners.svg'
import { AiFillCaretDown } from 'react-icons/ai'
import Loading from "../../../components/Loading";
import { Viewer } from '@toast-ui/react-editor';
import { logoSrc } from "../../../data/Data";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import MetaTag from "../../../components/MetaTag";
import thermometer1 from '../../../assets/images/icon/thermometer/thermometer1.svg'
import thermometer2 from '../../../assets/images/icon/thermometer/thermometer2.svg'
import thermometer3 from '../../../assets/images/icon/thermometer/thermometer3.svg'
import thermometer4 from '../../../assets/images/icon/thermometer/thermometer4.svg'
import thermometer5 from '../../../assets/images/icon/thermometer/thermometer5.svg'
import thermometer6 from '../../../assets/images/icon/thermometer/thermometer6.svg'
import thermometer7 from '../../../assets/images/icon/thermometer/thermometer7.svg'
import thermometer8 from '../../../assets/images/icon/thermometer/thermometer8.svg'
import thermometer9 from '../../../assets/images/icon/thermometer/thermometer9.svg'
import weatherPopupImg from '../../../assets/images/icon/thermometer/weather-popup.svg'
ChartJS.register(ArcElement, Tooltip, Legend);

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
const TitleStyle = styled.div`
font-size:${props => props.theme.size.font1};
font-weight:bold;
margin-right:16px;
margin-top:16px;
margin-bottom:8px;
`
const SubTitleStyle = styled.div`
font-size:${props => props.theme.size.font2};
font-weight:bold;
margin-right:16px;
cursor:pointer;
margin-left:16px;
margin-bottom:8px;
margin-top:8px;
`
const Content = styled.div`
margin:0 auto 1rem 0;
width:90%;
margin:0 auto;
font-size:${props => props.theme.size.font3};
display:flex;
flex-direction:column;
font-weight:normal;

`
const InvestmentPointDetail = styled.div`
display:flex;
flex-wrap: wrap;
background: ${props => props.theme.color.background3};
max-width: 468px;
margin: 8px auto ;
width: 100%;
padding: 16px;
@media screen and (max-width:500px) {
    padding: 2.5vw;
    width:85vw
}
`
const DonutContainer = styled.div`
width:40%;
@media screen and (max-width:700px) {
    width:100%;

}
`
const DonutExplainContainer = styled.div`
text-align:end;
width:60%;
@media screen and (max-width:700px) {
    width:100%;
}
`
const Img = styled.img`
width:100%;
max-width:700px;
margin:0 auto;
`
const TwoButtonContainer = styled.div`
width: 100%;
max-width: 500px;
margin: 16px auto;
display: flex;
background: #E4E4E4;
border-radius: 20px;
height: 48px;
font-size: ${props => props.theme.size.font3};
cursor: pointer;
padding:2px;
outline:none;
-webkit-tap-highlight-color : transparent;
`
const PopupImg = styled.img`
position: absolute; 
right: 17%;
top:-3%;
height: 133px;
@media screen and (max-width:700px) {
    right: 22vw;
}
`
const Post = () => {
    const params = useParams();

    const chartRef = useRef(null);
    const chart2Ref = useRef(null);
    const thermometer_list = [
        { image_src: '', }
    ]
    const getThermometerByNumber = (num) => {
        if (num >= 97) {
            return { image_src: thermometer1, temperature: num };
        } else if (num >= 88) {
            return { image_src: thermometer2, temperature: num };
        } else if (num >= 72) {
            return { image_src: thermometer3, temperature: num };
        } else if (num >= 65) {
            return { image_src: thermometer4, temperature: num };
        } else if (num >= 50) {
            return { image_src: thermometer5, temperature: num };
        } else if (num >= 37) {
            return { image_src: thermometer6, temperature: num };
        } else if (num >= 25) {
            return { image_src: thermometer7, temperature: num };
        } else if (num >= 12) {
            return { image_src: thermometer8, temperature: num };
        } else {
            return { image_src: thermometer9, temperature: num };
        }
    }
    const donut_data = {
        labels: [],
        labelSuffix: "%",
        datasets: [
            {
                label: '# of Votes',
                data: [],
                backgroundColor: ['#f7efef', '#f8e0df', '#f6c6c4', '#f5ae8f', '#f2c096', '#e6a975', '#f7c15f', '#ffa700', '#ec8733', '#f06d00'],
                borderColor: ['#f7efef', '#f8e0df', '#f6c6c4', '#f5ae8f', '#f2c096', '#e6a975', '#f7c15f', '#ffa700', '#ec8733', '#f06d00'],
                borderWidth: 1,

            },

        ],

    };
    const donut_share_data = {
        labels: [],
        labelSuffix: "%",
        datasets: [
            {
                label: '# of Votes',
                data: [],
                backgroundColor: ['#f7efef', '#f8e0df', '#f6c6c4', '#f5ae8f', '#f2c096', '#e6a975', '#f7c15f', '#ffa700', '#ec8733', '#f06d00'],
                borderColor: ['#f7efef', '#f8e0df', '#f6c6c4', '#f5ae8f', '#f2c096', '#e6a975', '#f7c15f', '#ffa700', '#ec8733', '#f06d00'],
                borderWidth: 1,

            },

        ],

    };
    const donut_option = {
        plugins: {
            datalabels: {
                backgroundColor: function (context) {
                    return context.dataset.backgroundColor;
                },
                formatter: (val, context) => `${val}%`,
                borderRadius: 25,
                borderWidth: 3,
                color: "black",
                font: {
                    weight: "bold"
                },
                padding: 6
            },
            tooltip: {
                callbacks: {
                    label: (ttItem) => `${ttItem.label}: ${ttItem.parsed}%`
                }
            }
        }
    }
    const [loading, setLoading] = useState(false)

    const [isShowDonut, setIsShowDonut] = useState(false)
    const [percent, setPercent] = useState(0);
    const [item, setItem] = useState({})
    const [typeNum, setTypeNum] = useState(0);//매출액-0,영업이익-1
    const [takeList, setTakeList] = useState([])//매출액
    const [operatingProfitList, setOperatingProfitList] = useState([])//영업이익

    const [investmentPointList, setInvestmentPointList] = useState([])//투자포인트-막대그래프
    const [investmentPointDetailDisplay, setInvestmentPointDetailDisplay] = useState(false)
    const [majorBussinessList, setMajorBussinessList] = useState([])//주요사업-원형그래프
    const [donutObj, setDonutObj] = useState(donut_data ?? {})
    const [shareList, setShareList] = useState([])//최대주주 및 특수관계인 지분
    const [donutShareObj, setDonutShareObj] = useState(donut_data ?? {})
    const [etcNoteDisplay, setEtcNoteDisplay] = useState(true)
    const [title, setTitle] = useState("")

    const [weatherPopupDisplay, setWeatherPopupDisplay] = useState(false)
    useEffect(() => {
        async function fetchPost() {
            setLoading(true)
            const { data: response } = await axios.get(`/api/getmastercontent?table=${params.table}&pk=${params.pk}`)
            let obj = response.data;
            setTitle("masterpick - 구독전용 / " + obj.name)
            //list
            let take_list = JSON.parse(response?.data?.take_list);
            setTakeList(take_list);

            let operating_profit_list = JSON.parse(response?.data?.operating_profit_list);
            setOperatingProfitList(operating_profit_list);

            let investment_point_list = JSON.parse(response?.data?.investment_point_list);
            setInvestmentPointList(investment_point_list);

            let major_bussiness_list = JSON.parse(response?.data?.major_bussiness_list);
            setMajorBussinessList(major_bussiness_list);
            let donut_obj = donut_data;
            donut_obj.labels = [];
            donut_obj.datasets[0].data = [];
            if (major_bussiness_list.length ?? 0 > 0) {
                for (var i = 0; i < major_bussiness_list.length; i++) {
                    donut_obj.labels.push(major_bussiness_list[i].element + `(${commarNumber(major_bussiness_list[i].price)}원)`)
                    donut_obj.datasets[0].data.push(parseFloat(major_bussiness_list[i].percent))
                }
                setDonutObj(donut_obj)
            }
            let share_list = JSON.parse(response?.data?.share_list);
            setShareList(share_list);
            let donut_share_obj = donut_share_data;
            donut_share_obj.labels = [];
            donut_share_obj.datasets[0].data = [];

            if (share_list?.length ?? 0 > 0) {
                for (var i = 0; i < share_list.length ?? 0; i++) {
                    donut_share_obj.labels.push(share_list[i].element)
                    donut_share_obj.datasets[0].data.push(parseFloat(share_list[i].percent))
                }
                setDonutShareObj({ ...donut_share_obj })
            }
            await new Promise((r) => setTimeout(r, 100));
            //note
            obj.main_note = (obj.main_note ?? "").replaceAll('http://localhost:8001', backUrl);
            obj.company_overview_note = (obj.company_overview_note ?? "").replaceAll('http://localhost:8001', backUrl);
            obj.investment_point_note = (obj.investment_point_note ?? "").replaceAll('http://localhost:8001', backUrl);
            //obj.major_bussiness_note = obj.major_bussiness_note.replaceAll('http://localhost:8001', backUrl);
            //obj.share_note = obj.share_note.replaceAll('http://localhost:8001', backUrl);
            obj.capital_change_note = (obj.capital_change_note ?? "").replaceAll('http://localhost:8001', backUrl);
            //obj.investment_indicator_note = obj.investment_indicator_note.replaceAll('http://localhost:8001', backUrl);
            obj.etc_note = (obj.etc_note ?? "").replaceAll('http://localhost:8001', backUrl);
            let etc_text_in_note = obj.etc_note.replaceAll("<p>", "")
            etc_text_in_note = etc_text_in_note.replaceAll("</p>", "")
            etc_text_in_note = etc_text_in_note.replaceAll("<br>", "")
            if (!etc_text_in_note) {
                setEtcNoteDisplay(false)
            }
            $('.toastui-editor-contents').attr("style", "max-width:500px !important;");
            $('.note > body').css('margin', '0');
            $('.donutchart').css("width", '100%');
            $('.donutchart').attr("style", "width:100% !important;");
            setItem(obj);
            await new Promise((r) => setTimeout(r, 100));
            setTimeout(() => setLoading(false), 1500);
            if (localStorage.getItem('dark_mode')) {
                await new Promise((r) => setTimeout(r, 1600));
                $('.toastui-editor-contents p').attr('style', 'color:#fff !important');
            }
        }
        fetchPost();

        window.addEventListener('scroll', function (el) {

            let per = Math.floor(($(window).scrollTop() / ($(document).height() - $(window).height())) * 100);
            setPercent(per);
        })
        if (localStorage.getItem('dark_mode')) {
            $('body').addClass("dark-mode");
            $('p').addClass("dark-mode");
            $('.toastui-editor-contents p').attr("style", "color:#fff!important");
            $('.menu-container').addClass("dark-mode");
            $('.header').addClass("dark-mode");
            $('.select-type').addClass("dark-mode");
            $('.wrappers > .viewer > p').addClass("dark-mode");
            $('.footer').addClass("dark-mode");
            $('.viewer > div > div > div > p').addClass("dark-mode");
        }
    }, [])

    const onChangeWheatherDisplay = () => {
        setWeatherPopupDisplay(!weatherPopupDisplay);
    }
    // 1-1,2-4,3-5,4-2
    return (
        <>
            <Wrappers className="wrapper" maxWidth={700}>
                {/* {weatherPopupDisplay ?
                    <>
                        <div style={{ position: 'absolute', width: '1000vw', height: '1000vh', zIndex: '50', top: '-100vw', left: '-100vh', opacity: '0.5', background: '#666' }} onClick={onChangeWheatherDisplay}>
                        </div>
                        
                    </>
                    :
                    <>
                    </>
                } */}

                <MetaTag title={title} />
                {loading ?
                    <>
                        <Loading />
                    </>
                    :
                    <>
                        <Content>
                            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'end', margin: '16px 0 32px 0', position: 'relative' }}>
                                <img src={logoSrc} style={{ height: '50px' }} alt="#" />
                                <img src={backUrl + item.master_profile_img} style={{ height: '96px' }} alt="#" />
                                {weatherPopupDisplay ?
                                    <>
                                        <PopupImg src={weatherPopupImg} />
                                    </>
                                    :
                                    <>
                                    </>}
                            </div>
                            <div style={{ display: 'flex', margin: '8px 0', justifyContent: 'space-between', alignItems: 'end' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', marginRight: '12px' }}>
                                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#FB0000', marginBottom: '4px' }}>{item?.name}</div>
                                    <div style={{ fontSize: theme.size.font3 }}>기준가 {commarNumber(item?.base_price ?? '0')}원</div>
                                    <div style={{ fontSize: theme.size.font3 }}>기준일 {item?.capture_date} </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'end' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', marginRight: '12px', cursor: 'pointer' }} onClick={onChangeWheatherDisplay}>
                                        <img src={zWeather[item?.weather ?? 0].icon} alt="#" style={{ height: '27px', marginBottom: '4px' }} />
                                        <div style={{ fontSize: theme.size.font5 }}>투자날씨</div>
                                    </div >
                                    <div style={{ display: 'flex', flexDirection: 'column', marginRight: '12px', textAlign: 'center' }} onClick={() => { }}>
                                        <img src={getThermometerByNumber(item?.score ?? 0).image_src} alt="#" style={{ height: '30px' }} />
                                        <div style={{ fontSize: theme.size.font4, margin: '2px 0' }}>{item?.score}</div>
                                        <div style={{ fontSize: theme.size.font5 }}>투자점수</div>
                                    </div >
                                </div>
                            </div>
                            <ViewerContainer>
                                <Viewer initialValue={item?.main_note ?? `<body></body>`} />
                            </ViewerContainer>
                            <TwoButtonContainer style={{ color: `${localStorage.getItem('dark_mode') ? '#222' : '#fff'}` }}>
                                <div onClick={() => setTypeNum(0)} style={{ width: '49%', borderRadius: '20px', textAlign: 'center', background: `${typeNum == 0 ? '#fff' : '#E4E4E4'}`, padding: '12px 0', margin: 'auto', color: '#2c2c2c' }}>매출액</div>
                                <div onClick={() => setTypeNum(1)} style={{ width: '49%', borderRadius: '20px', textAlign: 'center', background: `${typeNum == 1 ? '#fff' : '#E4E4E4'}`, padding: '12px 0', margin: 'auto', color: '#2c2c2c' }}>영업이익</div>
                            </TwoButtonContainer>
                            <div style={{ display: 'flex', maxWidth: '500px', width: '100%', margin: '16px auto', overflowX: 'auto' }}>
                                {typeNum == 0 ?
                                    <>
                                        {takeList.map((post, idx) => (
                                            <>
                                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '6px', fontSize: `${theme.size.font4}` }}>
                                                    <div>{post.price}</div>
                                                    <div style={{ height: '50px', border: `1px solid ${theme.color.background1}`, width: '20px', background: `${theme.color.background1}`, margin: '6px' }}>
                                                        <div style={{ height: `${50 - parseFloat(post.score) / 100 * 50}px`, background: `${theme.color.background2}`, marginTop: 'auto' }} />
                                                    </div>
                                                    <div>{post.year}</div>
                                                </div>
                                            </>
                                        ))}
                                    </>
                                    :
                                    <>
                                        {operatingProfitList.map((post, idx) => (
                                            <>
                                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '6px', fontSize: `${theme.size.font4}` }}>
                                                    <div>{post.price}</div>
                                                    <div style={{ height: '50px', border: `1px solid ${theme.color.background1}`, width: '20px', background: `${theme.color.background1}`, margin: '6px' }}>
                                                        <div style={{ height: `${50 - parseFloat(post.score) / 100 * 50}px`, background: `${theme.color.background2}`, marginTop: 'auto' }} />
                                                    </div>
                                                    <div>{post.year}</div>
                                                </div>
                                            </>
                                        ))}
                                    </>
                                }
                            </div>
                            <TitleStyle>1. 기업개요</TitleStyle>
                            <ViewerContainer>
                                <Viewer initialValue={item?.company_overview_note ?? `<body></body>`} />
                            </ViewerContainer>
                            <TitleStyle>2. 투자포인트</TitleStyle>
                            <div style={{ display: 'flex', maxWidth: '500px', width: '100%', margin: '16px auto', overflowX: 'auto' }}>
                                {investmentPointList.map((post, idx) => (
                                    <>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '6px', fontSize: `${theme.size.font4}` }}>
                                            <div>{post.score}</div>
                                            <div style={{ height: '50px', border: `1px solid ${theme.color.background1}`, width: '20px', background: `${theme.color.background1}`, margin: '6px' }}>
                                                <div style={{ height: `${50 - parseFloat(post.score) / 100 * 50}px`, background: `${theme.color.background2}`, marginTop: 'auto' }} />
                                            </div>
                                            <div>{post.element}</div>
                                        </div>
                                    </>
                                ))}
                            </div>
                            <div style={{ width: '100%', maxWidth: '500px', margin: '0 auto 16px auto', background: `${theme.color.background3}`, textAlign: 'center', display: 'flex', padding: '16px 0', cursor: 'pointer' }}
                                onClick={() => { setInvestmentPointDetailDisplay(!investmentPointDetailDisplay) }}>
                                <div style={{ display: 'flex', margin: '0 auto', alignItems: 'center' }}>
                                    <div style={{ marginRight: '4px' }}>지표별 설명보기</div>
                                    <AiFillCaretDown />
                                </div>
                            </div>
                            {investmentPointDetailDisplay ?
                                <>
                                    <InvestmentPointDetail>
                                        {investmentPointList.map((post, idx) => (
                                            <>
                                                <div style={{ display: 'flex', flexDirection: 'column', width: '50%', fontWeight: 'bold', fontSize: theme.size.font3, marginBottom: '22px' }}>
                                                    <div style={{ display: 'flex', marginBottom: '4px' }}>
                                                        <div style={{ marginRight: '4px' }}>{post.element}</div>
                                                        <div style={{ color: '#FB0000' }}>{post.score}</div>
                                                    </div>
                                                    <div style={{ fontSize: theme.size.font4, color: theme.color.font2 }}>
                                                        {post.sub_title}
                                                    </div>
                                                </div>
                                            </>
                                        ))}
                                    </InvestmentPointDetail>
                                </>
                                :
                                <>
                                </>
                            }
                            <ViewerContainer>
                                <Viewer initialValue={item?.investment_point_note ?? `<body></body>`} />
                            </ViewerContainer>
                            <TitleStyle>3. 주요 사업</TitleStyle>
                            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                                <DonutContainer>

                                    <Doughnut data={donutObj.labels.length > 0 ? donutObj : donut_data} options={donut_option} />


                                </DonutContainer>
                                <DonutExplainContainer>
                                    <Img src={backUrl + item?.major_bussiness_img} alt="#" />
                                    {/* <div style={{ marginLeft: 'auto', fontSize: theme.size.font4 }}>
                                        {item?.major_bussiness_text}
                                    </div> */}
                                </DonutExplainContainer>
                            </div>
                            {/* <ViewerContainer>
                                <Viewer initialValue={item?.major_bussiness_note ?? `<body></body>`} />
                            </ViewerContainer> */}
                            <TitleStyle>4. 지배구조, 자본금 변동사항</TitleStyle>
                            <SubTitleStyle>(1) 최대주주 및 특수관계인 지분</SubTitleStyle>
                            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                                <DonutContainer>
                                    <Doughnut data={donutShareObj.labels.length > 0 ? donutShareObj : donut_data} options={donut_option} />
                                </DonutContainer>
                                <DonutExplainContainer />
                            </div>
                            {/* <ViewerContainer>
                                <Viewer initialValue={item?.share_note ?? `<body></body>`} />
                            </ViewerContainer> */}
                            <SubTitleStyle>(2) 자본금 변동사항</SubTitleStyle>
                            <Img src={backUrl + item?.capital_change_img} alt="#" />
                            {/* <div style={{ marginLeft: 'auto', fontSize: theme.size.font4 }}>
                                {item?.capital_change_text}
                            </div> */}
                            <ViewerContainer>
                                <Viewer initialValue={item?.capital_change_note ?? `<body></body>`} />
                            </ViewerContainer>
                            <TitleStyle>5. 투자 지표</TitleStyle>
                            <Img src={backUrl + item?.investment_indicator_img} alt="#" />
                            {/* <ViewerContainer>
                                <Viewer initialValue={item?.investment_indicator_note ?? `<body></body>`} />
                            </ViewerContainer> */}
                            {etcNoteDisplay ?
                                <>
                                    <TitleStyle>6. 특이 변동사항</TitleStyle>
                                    <ViewerContainer>
                                        <Viewer initialValue={item?.etc_note ?? `<body></body>`} />
                                    </ViewerContainer>
                                </>
                                :
                                <>
                                </>
                            }

                        </Content>
                    </>
                }

                <Progress value={`${percent}`} max="100"></Progress>

            </Wrappers>
        </>
    )
}
export default Post;