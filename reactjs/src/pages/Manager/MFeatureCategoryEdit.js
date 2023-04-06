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
import { Card, Title, Input, Row, Col, ImageContainer, Select } from '../../components/elements/ManagerTemplete';
import theme from '../../styles/theme';
import { objManagerListContent } from '../../data/Data';
import { backUrl } from '../../data/Data';
const MFeatureCategoryEdit = () => {
    const params = useParams();
    const navigate = useNavigate();
    const [myNick, setMyNick] = useState("")
    const [url, setUrl] = useState('')
    const [content, setContent] = useState(undefined)
    const [formData] = useState(new FormData())
    useEffect(() => {

        async function fetchPost() {
            if (params.pk > 0) {
                const { data: response } = await axios.get(`/api/item?table=feature_category&pk=${params.pk}`)
                $('.title').val(response.data.title)
                $('.sub-title').val(response.data.sub_title)
                setUrl(backUrl + response.data.main_img);
            }
        }
        fetchPost();
    }, [])
    const editItem = async () => {
        if ((!content && !url) || !$(`.title`).val() || !$(`.sub-title`).val()) {
            alert('필요값이 비어있습니다.');
        } else {
            formData.append('title', $(`.title`).val())
            formData.append('sub_title', $(`.sub-title`).val())
            formData.append('content', content);
            if (params.pk > 0) formData.append('pk', params.pk)

            if (window.confirm(`${params.pk == 0 ? '추가하시겠습니까?' : '수정하시겠습니까?'}`)) {
                if (params.pk > 0) {
                    const { data: response } = await axios.post('/api/updatefeaturecategory', formData);
                    if (response.result > 0) {
                        alert('성공적으로 수정되었습니다.');
                        window.history.back();
                    }
                } else {
                    const { data: response } = await axios.post('/api/addfeaturecategory', formData);
                    if (response.result > 0) {
                        alert('성공적으로 추가되었습니다.');
                        window.history.back();

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
           
                    <Breadcrumb title={`특징주 카테고리 ${params.pk > 0 ? '수정' : '추가'}`} nickname={myNick} />
                    <Card>

                        <Row>
                            <Col>
                                <Title>아이콘 이미지</Title>
                                <ImageContainer for="file1">

                                    {url ?
                                        <>
                                            <img src={url} alt="#"
                                                style={{
                                                    width: '8rem', height: '8rem',
                                                    margin: '2rem'
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
                        <Row>
                            <Col>
                                <Title>제목</Title>
                                <Input className='title' placeholder='제목을 입력해 주세요.' />
                            </Col>
                            <Col>
                                <Title>부제목</Title>
                                <Input className='sub-title' placeholder='부제목을 입력해 주세요.' />
                            </Col>
                        </Row>



                    </Card>
                    <ButtonContainer>
                        <AddButton onClick={editItem}>{'저장'}</AddButton>
                    </ButtonContainer>
               
        </>
    )
}
export default MFeatureCategoryEdit;