import React from 'react'
import styled from 'styled-components'
import { useEffect, useState } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import ManagerWrappers from '../../components/elements/ManagerWrappers';
import SideBar from '../../common/manager/SideBar';
import ManagerContentWrappers from '../../components/elements/ManagerContentWrappers';
import axios from 'axios';
import Breadcrumb from '../../common/manager/Breadcrumb';
import { AiFillFileImage } from 'react-icons/ai'
import ButtonContainer from '../../components/elements/button/ButtonContainer';
import AddButton from '../../components/elements/button/AddButton';
import CancelButton from '../../components/elements/button/CancelButton';
import $ from 'jquery';
import { addItem, updateItem } from '../../functions/utils';
import { Card, Title, Input, Select, Row, Col, ImageContainer } from '../../components/elements/ManagerTemplete';
import { backUrl } from '../../data/Data';
import theme from '../../styles/theme';

const MChannelEdit = () => {
    const params = useParams();
    const navigate = useNavigate();
    const [myNick, setMyNick] = useState("")
    const [url, setUrl] = useState('')
    const [content, setContent] = useState(undefined)
    const [formData] = useState(new FormData())
    useEffect(() => {
        async function fetchPost() {
            if (params.pk > 0) {
                const { data: response } = await axios.get(`/api/item?table=user&pk=${params.pk}`)
                $('.nickname').val(response.data.nickname)
                setUrl(backUrl + response.data.channel_img)
            }
        }
        fetchPost();
    }, [])
    const editChannel = async () => {
        if (( !$(`.nickname`).val() || !content ) && params.pk == 0) {
            alert('필요값이 비어있습니다.');
        } else {
            let time = new Date().getTime();
            formData.append("id", time+'id');
            formData.append("pw", time+'pw');
            formData.append("name", time+'name');
            formData.append("nickname", $(`.nickname`).val());
            formData.append("user_level", 25);
            formData.append("channel", content);
            if (params.pk > 0) formData.append("pk", params.pk)
            if (window.confirm(`${params.pk == 0 ? '추가하시겠습니까?' : '수정하시겠습니까?'}`)) {
                if (params.pk <= 0) {
                    const { data: response } = await axios.post('/api/addchannel', formData);
                    alert(response.message);
                    if (response.result > 0) {
                        navigate('/manager/list/channel');
                    }

                } else {
                    const { data: response } = await axios.post('/api/updatechannel', formData);
                    alert(response.message);
                    if (response.result > 0) {
                        navigate('/manager/list/channel');
                    }
                }
            }
        }


    }
    const addFile = (e) => {
        if (e.target.files[0]) {
            setContent(e.target.files[0]);
            setUrl(URL.createObjectURL(e.target.files[0]))
        }
    };
    
    return (
        <>
           
                    <Breadcrumb title={params.pk == 0 ? '채널 추가' : '채널 수정'} nickname={myNick} />
                    <Card>

                        <Row>

                            <Col>
                                <Title>채널명</Title>
                                <Input className='nickname' />
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Title>채널 이미지</Title>
                                <ImageContainer for="file1">

                                    {url ?
                                        <>
                                            <img src={url} alt="#"
                                                style={{
                                                    width: '200px', height: '150px',
                                                    margin: '24px'
                                                }} />
                                        </>
                                        :
                                        <>
                                            <AiFillFileImage style={{ margin: '4rem', fontSize: '4rem', color: `${theme.color.manager.font3}` }} />
                                        </>}
                                </ImageContainer>
                                <div>
                                    <input type="file" id="file1" onChange={addFile} style={{ display: 'none' }} />
                                </div>
                            </Col>

                        </Row>

                    </Card>
                    <ButtonContainer>
                        <CancelButton onClick={() => navigate(-1)}>x 취소</CancelButton>
                        <AddButton onClick={editChannel}>{params.pk == 0 ? '+ 추가' : '수정'}</AddButton>
                    </ButtonContainer>
               
        </>
    )
}
export default MChannelEdit;