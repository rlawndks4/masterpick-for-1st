import React from 'react'
import { useEffect, useState, useCallback } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { Wrappers } from '../../components/elements/UserContentTemplete';
import Loading from '../../components/Loading';
import MasterSlide from '../../components/MasterSlide';
import ContentTable from '../../components/ContentTable';
import theme from '../../styles/theme';

const SubscriptionOnly = () => {
    const navigate = useNavigate();
    const [subTypeNum, setSubTypeNum] = useState(0)
    const [posts, setPosts] = useState([]);
    const [downPosts, setDownPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [typeNum, setTypeNum] = useState(0)
    const [overlapList, setOverlapList] = useState([]);


    const onClickMaster = async (num) => {
        setLoading(true)
        setTypeNum(num)
        let auth_obj = JSON.parse(localStorage.getItem('auth'))
        const { data: response } = await axios.post(`/api/getmastercontents`, {
            table: 'master_subscribe',
            order: 'pk',
            desc: true,
            status: 1,
            is_subscribe: true,
            user_pk: auth_obj?.pk ?? 0,
            pk:num
        })
        let list = response?.data?.data??[];
        let top_list = [];
        let down_list = [];
        for(var i = 0;i<list.length;i++){
            if(list[i].existing_possession==2){
                down_list.push(list[i]);
            }else{
                top_list.push(list[i]);
            }
        }
        setPosts(top_list)
        setDownPosts(down_list)
        setTimeout(() => setLoading(false), 500);
    }
    return (
        <>
            <Wrappers className='wrappers'>
                <MasterSlide onClickMaster={onClickMaster} schema={'master_subscribe'} num={typeNum} width={'90%'} is_subscribe={true} status={1} />
                {/* <div className='subtype-container' style={{ display: 'flex', width: '90%', margin: '8px auto', alignItems: 'center', fontSize: theme.size.font3, fontWeight: 'bold' }} >
                    <div style={{ padding: '5px', background: theme.color.background1, marginRight: '4px' }}></div>
                    <div style={{ marginRight: '4px' }}>매수, 매도는 기준가에서</div>
                    <div style={{ color: '#ff0000', marginRight: '4px' }}>±3%</div>
                    <div>이내 권장</div>
                </div> */}
                {loading ?
                    <>
                        <Loading />
                    </>
                    :
                    <>
                        <div style={{ position: 'relative' }}>
                            <ContentTable columns={[
                                { name: "종목명", column: "name", width: "", type: 'text' },
                                { name: "기준가", column: "base_price", width: "", type: 'number' },
                                { name: "기준일", column: "capture_date", width: "", type: 'subscribe_date' },
                                { name: "종목교체일", column: "exchange_date", width: "", type: 'subscribe_date' },
                                { name: "기존보유", column: "existing_possession", width: 70, type: 'existing_possession' },
                            ]} click={'/post/master_subscribe'}
                                isPointer={true}
                                data={posts}
                                schema={'master_subscribe'} />
                        </div>
                        <div style={{borderTop:`2px dashed ${theme.color.background1}`,width:'90%',margin:'16px auto'}} />
                        <div style={{ position: 'relative' }}>
                            <ContentTable columns={[
                                { name: "종목명", column: "name", type: 'text' },
                                { name: "기준가", column: "base_price", width: "", type: 'number' },
                                { name: "기준일", column: "capture_date", width: "", type: 'subscribe_date' },
                                { name: "종목교체일", column: "exchange_date", width: "", type: 'subscribe_date' },
                                { name: "기존보유", column: "existing_possession", width: 70, type: 'existing_possession' },
                            ]} click={'/post/master_subscribe'}
                                isPointer={true}
                                data={downPosts}
                                schema={'master_subscribe'} />
                        </div>
                    </>}
            </Wrappers>
        </>
    )
}
export default SubscriptionOnly;