import { useState } from 'react';
import { useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import theme from '../styles/theme';
import axios from 'axios';
import styled from 'styled-components';

const SelectSubType = styled.div`
overflow-x: auto;
width: 100%;
display: flex;
flex-wrap:wrap;
background:#fff;
margin:0 auto;
@media screen and (max-width:1000px) {
    width: 90%;
}
`
const SubType = styled.div`
padding:0.5rem 0;
cursor:pointer;
font-size:1rem;
border-radius:4px;
margin:0 0.5% 1% 0.5%;
width:24%;
text-align:center;
font-size:${props=>props.theme.size.font3};
font-weight:bold;
@media screen and (max-width:350px) {
    margin:0 0.5% 1% 0.5%;
    width:32%;
}
`
const MasterYieldSlide = (props) => {
    const { selectTypeNum, num } = props;
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const params = useParams();
    const [masterList, setMasterList] = useState([])
    useEffect(() => {
        async function fetchPosts() {
            const { data: response } = await axios.get('/api/items?table=master');
            setMasterList(response.data);
        }
        fetchPosts();
    }, [])
    return (
        <>
            <SelectSubType className='subtype-container' style={{ marginBottom: '16px' }}>
                {masterList.map((item, index) => (
                    <>
                        <SubType style={{ color: `${theme.color.font1}`, background: `${num == item.pk ? theme.color.background2 : theme.color.background3}` }} onClick={() => { selectTypeNum(item.pk) }}>
                            {item.name}
                        </SubType>
                    </>
                ))}
            </SelectSubType>
        </>
    )
}
export default MasterYieldSlide;