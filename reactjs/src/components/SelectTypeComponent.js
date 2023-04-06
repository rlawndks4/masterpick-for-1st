import { useState } from 'react';
import { useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import SelectSubType from '../components/elements/SelectSubType';
import theme from '../styles/theme';
import styled from 'styled-components';

const SubType = styled.div`
padding:0.5rem 0;
cursor:pointer;
font-size:1rem;
border-radius:4px;
margin-right:4px;
width:32.5%;
text-align:center;
font-size:${props=>props.theme.size.font1};
font-weight:bold;
`
const SelectTypeComponent = (props) => {
    const { posts, num, selectTypeNum } = props;
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const params = useParams();

    return (
        <>
            <SelectSubType className='subtype-container' style={{ marginBottom: '16px',justifyContent:'space-between',overflowX:'initial',display:'flex',width:'100%' }}>
                {posts.map((item, index) => (
                    <>
                        <SubType style={{ color: `${index == num ? theme.color.font1 : theme.color.background3}`, background: `${index == num ? theme.color.background2 : theme.color.font1}`,margin:'0' }} onClick={() => { selectTypeNum(index) }}>
                            {item.title}
                        </SubType>
                    </>
                ))}
            </SelectSubType>
        </>
    )
}
export default SelectTypeComponent;