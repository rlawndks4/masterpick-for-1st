import { useEffect, useState } from "react";
import { Wrappers, Title, TransparentButton, ViewerContainer } from "../../../components/elements/UserContentTemplete";
import styled from "styled-components";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import MasterSlide from "../../../components/MasterSlide";
import MasterCard from "../../../components/MasterCard";
import Loading from "../../../components/Loading";
import { Viewer } from '@toast-ui/react-editor';
import MetaTag from "../../../components/MetaTag";
import { commarNumber } from "../../../functions/utils";
import theme from "../../../styles/theme";
import $ from 'jquery'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
ChartJS.register(ArcElement, Tooltip, Legend);
const Button = styled.button`
width:364px;
margin:0 auto;
height:62px;
border:none;
background:linear-gradient(to right, ${(props) => props.theme.color.background1}, ${(props) => props.theme.color.background2});
color:#fff;
font-size:${(props) => props.theme.size.font1};
font-weight:600;
cursor:pointer;
border: 1px solid transparent;
border-radius:10px;
@media (max-width: 600px) {
width:90%;
}

`
const SectorContainer = styled.div`
width:90%;
max-width:700px;
margin:0 auto;
margin-bottom:20px;
font-size:${(props) => props.theme.size.font3};
font-weight:bold;
`
const Progress = styled.progress`

appearance: none;
width: 100%;
height:8px;
color:red;
background: #red;

::-webkit-progress-bar {
    background: #fff;
    border-radius: 0;
}
::-webkit-progress-value{
    background: #3BBAD5;

}
`
const DonutContainer = styled.div`
width:30%;
margin:16px auto;
@media screen and (max-width:700px) {
    width:70%;

}`
const Master = () => {
    const navigate = useNavigate();
    const params = useParams();
    const { state } = useLocation();
    const [item, setItem] = useState({})
    const [sectorList, setSectorList] = useState([])
    const [sectorMax, setSectorMax] = useState(0)
    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState("");
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
    const [donutObj, setDonutObj] = useState(donut_data ?? {})

    useEffect(() => {
        async function fetchPost() {
            setLoading(true)
            const { data: response } = await axios.get(`/api/item?table=master&pk=${params.pk}`)
            setItem(response.data)
            setTitle("masterpick - 대가프로필 / " + response.data.name);
            let donut_obj = donut_data;
            donut_obj.labels = [];
            donut_obj.datasets[0].data = [];
            let sector_list = JSON.parse(response.data?.sector_list);
            sector_list = sector_list.sort(function (a, b) {
                return b.percent - a.percent
            })
            let max = 0;
            for (var i = 0; i < sector_list.length; i++) {
                if (sector_list[i].percent > max) {
                    max = sector_list[i].percent;
                }
                donut_obj.labels.push(sector_list[i].title)
                donut_obj.datasets[0].data.push(parseFloat(sector_list[i].percent))
            }
            console.log(donut_obj)
            setDonutObj(donut_obj);
            setSectorMax(max)
            setSectorList(sector_list)
            console.log(sector_list)
            setLoading(false)
            if (localStorage.getItem('dark_mode')) {
                await new Promise((r) => setTimeout(r, 500));
                $('.toastui-editor-contents p').attr('style', 'color:#fff !important');
            }
        }
        fetchPost();
    }, [params])
    const addSubscribeMaster = async () => {
        if (localStorage.getItem('auth')) {
            if (window.confirm('구독 하시겠습니까?')) {
                const { data: response } = await axios.post('/api/addsubscribe', {
                    user_pk: JSON.parse(localStorage.getItem('auth'))?.pk,
                    master_pk: params.pk
                })
                if (response.result > 0) {
                    alert("구독을 완료하였습니다.")
                } else {
                    alert(response.message);
                }
            }
        } else {
            alert('로그인을 해주세요.');
            navigate('/login');
            return;
        }
    }
    return (
        <>
            <Wrappers>
                <MetaTag title={title} />
                <MasterSlide />
                <Title>대가 프로필</Title>
                <div style={{ margin: '0 2px 24px auto' }}>
                    <TransparentButton onClick={addSubscribeMaster} style={{ position: 'absolute', top: '102px', right: '0', color: `${localStorage.getItem('dark_mode') ? '#fff' : theme.color.font1}`, background: theme.color.background1 }}>+ 구독</TransparentButton>
                </div>
                {loading ?
                    <>
                        <Loading />
                    </>
                    :
                    <>
                        <MasterCard item={item} />
                        <Title>대가 수익률</Title>
                        <ViewerContainer style={{ width: '90%' }}>
                            <Viewer initialValue={item?.yield ?? `<body></body>`} />
                        </ViewerContainer>
                        <Title>대가 투자원칙</Title>
                        <ViewerContainer style={{ width: '90%' }}>
                            <Viewer initialValue={item?.investment_principle ?? `<body></body>`} />
                        </ViewerContainer>
                        <Title>대가 투자 스타일</Title>
                        <ViewerContainer style={{ width: '90%' }}>
                            <Viewer initialValue={item?.investment_style ?? `<body></body>`} />
                        </ViewerContainer>
                        {sectorList && sectorList.length > 0 ?
                            <>

                                <Title>투자 섹터 비중</Title>
                                <DonutContainer>
                                    <Doughnut data={donutObj.labels.length > 0 ? donutObj : donut_data} options={donut_option} />
                                </DonutContainer>
                                {/* <SectorContainer>
                                    <DonutContainer>
                                        <Doughnut data={donutObj.labels.length > 0 ? donutObj : donut_data} options={donut_option} />
                                    </DonutContainer>
                                    {sectorList.map((itm, idx) => (
                                        <>
                                            <div style={{ display: 'flex', marginBottom: '4px' }}>
                                                <div style={{ color: '#2F2F6E', width: '35%', textAlign: 'end' }}>{itm.title}</div>
                                                <div style={{ display: 'flex', alignItems: 'center', width: '10%', textAlign: 'left', marginLeft: '8px' }}>{itm.percent}</div>
                                                <div style={{ display: 'flex', alignItems: 'center', width: '55%' }}><Progress value={`${itm.percent}`} max={sectorMax} /></div>
                                            </div>
                                        </>
                                    ))} 
                                </SectorContainer> */}


                            </>
                            :
                            <>
                            </>}
                        <Button onClick={addSubscribeMaster}>구독하기</Button>
                    </>}


            </Wrappers>
        </>
    )
}
export default Master;