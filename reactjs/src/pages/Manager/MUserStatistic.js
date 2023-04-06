import React from 'react'
import styled from 'styled-components'
import { useEffect, useState, useRef } from 'react';
import { useNavigate, Link, useParams, useLocation } from 'react-router-dom';
import ManagerWrappers from '../../components/elements/ManagerWrappers';
import SideBar from '../../common/manager/SideBar';
import ManagerContentWrappers from '../../components/elements/ManagerContentWrappers';
import axios from 'axios';
import Breadcrumb from '../../common/manager/Breadcrumb';
import ButtonContainer from '../../components/elements/button/ButtonContainer';
import AddButton from '../../components/elements/button/AddButton';
import { Card, Title, Input, Row, Col, ImageContainer, Select } from '../../components/elements/ManagerTemplete';

const MUserStatistic = () => {
    
    useEffect(()=>{
        async function fetchPosts(){

            const {data:response} = await axios.get('/api/getuserstatistic');
        }
        fetchPosts();
    },[])
    return (
        <>
           
                    <Breadcrumb title={'회원 통계'}/>
                    <Card>
                       
                    </Card>
                    <ButtonContainer>
                        <AddButton>{'저장'}</AddButton>
                    </ButtonContainer>
               
        </>
    )
}
export default MUserStatistic;