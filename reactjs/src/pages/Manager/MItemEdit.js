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
import $ from 'jquery';
import { Card, Title, Input, Row, Col, ImageContainer, Select } from '../../components/elements/ManagerTemplete';
import { AiFillFileImage } from 'react-icons/ai'
import theme from '../../styles/theme';
import fontSize from "tui-editor-plugin-font-size";
import "tui-editor-plugin-font-size/dist/tui-editor-plugin-font-size.css";
import { Editor } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';
import colorSyntax from '@toast-ui/editor-plugin-color-syntax';
import 'tui-color-picker/dist/tui-color-picker.css';
import '@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css';
import '@toast-ui/editor/dist/i18n/ko-kr';
import Picker from 'emoji-picker-react';
import { backUrl } from '../../data/Data';
import { objManagerListContent, cardDefaultColor } from '../../data/Data';
import Loading from '../../components/Loading';

const MItemEdit = () => {
    const { pathname } = useLocation();
    const params = useParams();
    const navigate = useNavigate();

    const editorRef = useRef();

    const [myNick, setMyNick] = useState("")
    const [url, setUrl] = useState('')
    const [content, setContent] = useState(undefined)
    const [formData] = useState(new FormData())

    const [noteFormData] = useState(new FormData());
    const [item, setItem] = useState({})
    const [loading, setLoading] = useState(false)
    const [zCategory, setZCategory] = useState([])
    const [auth, setAuth] = useState({});
    const [fontColor, setFontColor] = useState(cardDefaultColor.font);
    const [backgroundColor, setBackgroundColor] = useState(cardDefaultColor.background)
    const [channelList, setChannelList] = useState([]);
    useEffect(() => {
        async function fetchPost() {
            let authObj = JSON.parse(localStorage.getItem('auth'));
            setAuth(authObj);
            if (authObj?.user_level >= 40 && params.table == 'strategy') {
                const { data: channelResponse } = await axios.get(`/api/getchannel`)
                setChannelList(channelResponse.data);
            }

            if (params.table == 'issue' || params.table == 'feature') {
                const { data: response } = await axios.get(`/api/items?table=${params.table}_category`);
                setZCategory(response.data)
            }

            if (params.pk > 0) {
                const { data: response } = await axios.get(`/api/item?table=${params.table}&pk=${params.pk}`);
                $(`.title`).val(response.data.title);
                $(`.hash`).val(response.data.hash);
                $(`.channel`).val(response.data.user_pk);
                $(`.suggest-title`).val(response.data.suggest_title);
                $('.font-color').val(response.data.font_color)
                $('.background-color').val(response.data.background_color)
                if (params.table == 'issue' || params.table == 'feature') {
                    $(`.category`).val(response.data.category_pk);
                }
                editorRef.current.getInstance().setHTML(response.data.note.replaceAll('http://localhost:8001', backUrl));
                setUrl(backUrl + response.data.main_img);
                setItem(response.data);
            } else {

                $('.font-color').val(cardDefaultColor.font)
                $('.background-color').val(cardDefaultColor.background)

            }

        }
        fetchPost();
    }, [pathname])
    const editItem = async () => {
        if ((!content && !url) || !$(`.hash`).val() || !$(`.title`).val() || !$(`.suggest-title`).val()) {
            alert('필요값이 비어있습니다.');
        } else {
            let auth = JSON.parse(localStorage.getItem('auth'))
            formData.append('table', params.table);
            formData.append('content', content);
            formData.append('url', item.main_img)
            formData.append('title', $(`.title`).val())
            formData.append('hash', $(`.hash`).val())
            formData.append('suggest_title', $(`.suggest-title`).val())
            if (params.table == 'issue' || params.table == 'feature') {
                formData.append('category', $(`.category`).val());
            }
            formData.append('user_pk', auth.user_level >= 40 && params.table == 'strategy' ? $('.channel').val() : auth.pk)
            formData.append('note', editorRef.current.getInstance().getHTML());
            if (params.table == 'issue' || params.table == 'feature') formData.append('category_pk', $('.category').val())
            if (params.pk > 0) formData.append('pk', params.pk);
            if (window.confirm(`저장하시겠습니까?`)) {

                formData.append('font_color', $('.font-color').val());
                formData.append('background_color', $('.background-color').val())
                if (params.pk > 0) {
                    const { data: response } = await axios.post(`/api/updateitem`, formData)
                    if (response.result > 0) {
                        alert('성공적으로 저장되었습니다.')
                        navigate(-1);
                    }
                } else {
                    const { data: response } = await axios.post(`/api/additem`, formData)
                    if (response.result > 0) {
                        alert('성공적으로 추가 되었습니다.');
                        navigate(-1);
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
    const onChangeEditor = (e) => {
        const data = editorRef.current.getInstance().getHTML();
    }
    const [chosenEmoji, setChosenEmoji] = useState(null);

    const onEmojiClick = (event, emojiObject) => {
        setChosenEmoji(emojiObject);
    };
    return (
        <>
            
                    <Breadcrumb title={objManagerListContent[`${params.table}`].breadcrumb} nickname={myNick} />
                    <Card>

                        <Row>
                            <Col>
                                <Title>프로필 이미지</Title>
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
                                <Title>추천 게시물 제목</Title>
                                <Input className='suggest-title' placeholder='[주식용어] 유상증자' />
                            </Col>
                            {params.table == 'issue' || params.table == 'feature' ?
                                <>
                                    <Col>
                                        <Title>카테고리</Title>
                                        <Select className='category'>
                                            {zCategory && zCategory.map((item, idx) => (
                                                <>
                                                    <option value={item.pk}>{item.title}</option>
                                                </>
                                            ))}
                                        </Select>
                                    </Col>
                                </>
                                :
                                <>
                                </>
                            }
                        </Row>
                        <Row>
                            <Col>
                                <Title>제목</Title>
                                <Input className='title' placeholder='[주식용어] 유상증자' />
                            </Col>
                            <Col>
                                <Title>해시태그</Title>
                                <Input className='hash' placeholder='#사과 #수박' />
                            </Col>
                            {auth.user_level >= 40 && params.table == 'strategy' ?
                                <>
                                    <Col>
                                        <Title>채널명</Title>
                                        <Select className='channel'>
                                            {channelList.map((item, idx) => (
                                                <>
                                                    <option value={item.pk} key={idx}>{item.nickname}{item?.user_level >= 30 ? ' ' + item.name + '(전문가)' : ''}</option>
                                                </>
                                            ))}
                                        </Select>
                                    </Col>
                                </>
                                :
                                <>
                                </>
                            }

                        </Row>
                        {params.table != 'oneword' && params.table != 'oneevent' ?
                            <>
                                <Row>
                                    <Col>
                                        <Title>카드 글자색</Title>
                                        <Input type={'color'} className='font-color' style={{ background: '#fff', height: '36px', width: '220px' }} />
                                    </Col>
                                    <Col>
                                        <Title>카드 배경색</Title>
                                        <Input type={'color'} className='background-color' style={{ background: '#fff', height: '36px', width: '220px' }} />
                                    </Col>
                                </Row>
                            </>
                            :
                            <>
                            </>
                        }

                        <Row>
                            <Col>
                                <Title>내용</Title>
                                <div id="editor">
                                    {/* <Picker onEmojiClick={onEmojiClick} /> */}
                                    <Editor
                                        placeholder="내용을 입력해주세요."
                                        previewStyle="vertical"
                                        height="600px"
                                        initialEditType="wysiwyg"
                                        useCommandShortcut={false}
                                        useTuiEditorEmoji={true}
                                        hideModeSwitch={false}
                                        plugins={[colorSyntax]}
                                        language="ko-KR"
                                        ref={editorRef}
                                        onChange={onChangeEditor}
                                        hooks={{
                                            addImageBlobHook: async (blob, callback) => {

                                                noteFormData.append('note', blob);
                                                const { data: response } = await axios.post('/api/addimage', noteFormData);
                                                if (response.result > 0) {
                                                    callback(backUrl + response.data.filename)
                                                    noteFormData.delete('note');
                                                } else {
                                                    noteFormData.delete('note');
                                                    return;
                                                }
                                            }
                                        }}
                                        customHTMLRenderer={{
                                            htmlBlock: {
                                                iframe(node) {
                                                    console.log(node)
                                                    return [
                                                        {
                                                            type: 'openTag',
                                                            tagName: 'iframe',
                                                            outerNewLine: true,
                                                            attributes: node.attrs
                                                        },
                                                        { type: 'html', content: node.childrenHTML },
                                                        { type: 'closeTag', tagName: 'iframe', outerNewLine: true }
                                                    ];
                                                }
                                            }
                                        }}
                                    />
                                </div>
                            </Col>
                        </Row>

                    </Card>
                    <ButtonContainer>
                        <AddButton onClick={editItem}>{'저장'}</AddButton>
                    </ButtonContainer>
          
        </>
    )
}
export default MItemEdit;