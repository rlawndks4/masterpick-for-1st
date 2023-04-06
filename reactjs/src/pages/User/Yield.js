import React from 'react'
import styled from 'styled-components'
import { useEffect, useState, useCallback } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { Wrappers } from '../../components/elements/UserContentTemplete';
import Loading from '../../components/Loading';
import MasterSlide from '../../components/MasterSlide';
import ContentTable from '../../components/ContentTable';
import { backUrl } from '../../data/Data';

const Yield = () => {
    const navigate = useNavigate();

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [typeNum, setTypeNum] = useState(0)
    const [overlapList, setOverlapList] = useState([]);
    const [bannerImg, setBannerImg] = useState('')
    useEffect(() => {
        async function fetchPost() {
            setLoading(true)

            const { data: response } = await axios.post('/api/getmastercontents', {
                table: 'master_yield',
                order: 'yield',
                status: 1,
                desc: true
            })
            setPosts(response?.data?.data);
            let main_content = await JSON.parse(localStorage.getItem('main_content') ?? '{}')
            setBannerImg(main_content?.yield_banner_img ? (backUrl + main_content?.yield_banner_img): '');
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
    const { data: response } = await axios.post('/api/getmastercontents', {
        table: 'master_yield',
        order: 'yield',
        desc: true,
        status: 1,
        pk: num
        //overlap_list:overlap_list
    })
    console.log(num)
    if (num == 0) {
        let main_content = await JSON.parse(localStorage.getItem('main_content') ?? '{}')
        setBannerImg(main_content?.yield_banner_img ? (backUrl + main_content?.yield_banner_img) : '');
    } else {
        setBannerImg(response?.data?.master?.yield_banner ? (backUrl + response?.data?.master?.yield_banner) : '');
    }
    setPosts(response?.data?.data)
    setLoading(false);
}
return (
    <>
        <Wrappers className='wrappers'>
            <MasterSlide onClickMaster={onClickMaster} schema={'master_yield'} num={typeNum} width={'90%'} status={1} />
            {loading ?
                <>
                    <Loading />
                </>
                :
                <>
                    {bannerImg ?
                        <>
                            <img src={bannerImg} alt="#" style={{ width: '90%', maxWidth: '900px', margin: '16px auto' }} />
                        </>
                        :
                        <>
                        </>}
                    <div style={{ position: 'relative' }}>
                        <ContentTable columns={[
                            { name: "대가명", column: "master_name", width: "", type: 'text' },
                            { name: "종목명", column: "name", width: "", type: 'text' },
                            { name: "매수가", column: "purchase_price", type: 'number' },
                            // { name: "매도가", column: "sell_price", width: "", type: 'number' },
                            { name: "수익률", column: "yield", width: "", type: 'percent' },
                            { name: "매수月", column: "period", width: "", type: 'text' }
                        ]}
                            data={posts}
                            fontSize={'14px'}
                        />
                    </div>
                </>}
        </Wrappers>
    </>
)
}
export default Yield;