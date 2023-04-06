import React from 'react'
import { useEffect, useState, useCallback } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { Wrappers, Title, Content, TransparentButton } from '../../components/elements/UserContentTemplete';
import Loading from '../../components/Loading';
import ContentTable from '../../components/ContentTable';
import styled from 'styled-components';
import $ from 'jquery'
import MasterSlide from '../../components/MasterSlide';
const ScreenDiv = styled.div`
width:90%;
height:260px;
position:absolute;
background:linear-gradient(to left, #FFB92B, #FB8200);
opacity:0.97;
left:5%;
top:30px;
font-size:${props => props.theme.size.font1};
font-weight:bold;
color:#fff;
display:flex;
cursor:pointer;
`
const MasterEvent = () => {
    const navigate = useNavigate();
    const [subTypeNum, setSubTypeNum] = useState(0)
    const [posts, setPosts] = useState([]);

    const [loading, setLoading] = useState(false);
    const [typeNum, setTypeNum] = useState(0);
    const [overlapList, setOverlapList] = useState([]);


    const settings = {
        infinite: true,
        speed: 500,
        autoplay: false,
        autoplaySpeed: 2500,
        slidesToShow: 1,
        slidesToScroll: 1,
    };

    useEffect(() => {

        async function fetchPost() {
            setLoading(true)

            const { data: response } = await axios.post('/api/getmastercontents', {
                table: 'master_event',
                order: 'level',
                desc: true,
                status: 1
            })
            setPosts(response?.data?.data);
            setTimeout(() => setLoading(false), 1000);
        }
        fetchPost();

    }, [])

    const onClickMaster = async (num) => {
        setLoading(true)
        setTypeNum(num)
        let overlap_list = [...overlapList];
        if (overlap_list.includes(num)) {
            for (var i = 0; i < overlap_list.length; i++) {
                if (overlap_list[i] === num) {
                    overlap_list.splice(i, 1);
                    i--;
                }
            }
        } else {
            overlap_list.push(num);
        }
        setOverlapList(overlap_list)
        let obj = {
            table: 'master_event',
            order: 'level',
            desc: true,
            status: 1,
            pk: num
        }

        const { data: response } = await axios.post(`/api/getmastercontents`, obj)
        setPosts(response?.data?.data);
        setLoading(false);
    }
    return (
        <>
            <Wrappers className='wrappers'>
                <Content>
                    <Title>대가들의 종목</Title>
                    {/* <TransparentButton style={{ position: 'absolute', top: '25px', right: '0',background:'#fff',border:'none', fontWeight:'bold' }}
                        onClick={()=>onClickMaster(0)}>전체보기</TransparentButton> */}
                </Content>
                <MasterSlide isPhoto={true} onClickMaster={onClickMaster} num={typeNum} schema={'master_event'} width={'90%'} status={1} />
                {loading ?
                    <>
                        <Loading />
                    </>
                    :
                    <>
                        <div style={{ position: 'relative' }}>
                            {/* <ScreenDiv onClick={() => navigate('/masterlist')}>
                                <p style={{ margin: 'auto' }}>TOP 10 보러가기</p>
                            </ScreenDiv> */}
                            <ContentTable columns={[
                                { name: "대가이름", column: "master_name", width: "", type: 'text' },
                                { name: "종목명", column: "name", width: "", type: 'text' },
                                { name: "등급", column: "level", width: "", type: 'star' }
                            ]}
                                marginBottom={'200px'}
                                data={posts} />
                        </div>
                    </>
                }

            </Wrappers>
        </>
    )
}
export default MasterEvent;