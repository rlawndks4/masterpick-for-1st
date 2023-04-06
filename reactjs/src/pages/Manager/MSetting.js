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


const MSetting = () => {
    const params = useParams();
    const navigate = useNavigate();
    const [myNick, setMyNick] = useState("")
    const [url, setUrl] = useState('')
    const [content, setContent] = useState(undefined)
    const [formData] = useState(new FormData())
    useEffect(() => {
        async function fetchPost() {
            if (params.pk > 0) {
                const { data: response } = await axios.get(`/api/user/${params.pk}`)
                $('.id').val(response.data.id)
                $('.name').val(response.data.name)
                setUrl(response.data.profile_img)
            }
        }
        fetchPost();
    }, [])
    const editMaster = async () => {
        if ((!$(`.id`).val() || !$(`.name`).val() || !$(`.pw`).val() || !content) && params.pk == 0) {
            alert('필요값이 비어있습니다.');
        } else {

            formData.append("id", $(`.id`).val());
            formData.append("pw", $(`.pw`).val());
            formData.append("name", $(`.name`).val());
            formData.append("user_level", 30);
            formData.append("master", content);

            if (window.confirm(`${params.pk == 0 ? '추가하시겠습니까?' : '수정하시겠습니까?'}`)) {
                if (params.pk <= 0) {
                    const { data: response } = await axios.post('/api/addmaster', formData);
                    alert(response.message);
                    if (response.result > 0) {
                        navigate('/manager/masterlist');
                    }

                } else {
                    const { data: response } = await axios.post('/api/updatemaster', formData);
                    if (response.result > 0) {
                        navigate('/manager/masterlist');
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

            <Breadcrumb title={'환경설정'} nickname={myNick} />
            <Card>

            </Card>
            <ButtonContainer>
                <CancelButton onClick={() => navigate(-1)}>x 취소</CancelButton>
                <AddButton onClick={editMaster}>{params.pk == 0 ? '+ 추가' : '수정'}</AddButton>
            </ButtonContainer>
        </>
    )
}
export default MSetting;