import React from 'react'
import styled from 'styled-components'
import { useEffect, useState, useRef } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import ManagerWrappers from '../../components/elements/ManagerWrappers';
import SideBar from '../../common/manager/SideBar';
import ManagerContentWrappers from '../../components/elements/ManagerContentWrappers';
import axios from 'axios';
import Breadcrumb from '../../common/manager/Breadcrumb';
import ButtonContainer from '../../components/elements/button/ButtonContainer';
import AddButton from '../../components/elements/button/AddButton';
import CancelButton from '../../components/elements/button/CancelButton';
import $ from 'jquery';
import { addItem, updateItem } from '../../functions/utils';
import { Card, Title, Input, Row, Col, ImageContainer, Select } from '../../components/elements/ManagerTemplete';
import { Editor } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';
import colorSyntax from '@toast-ui/editor-plugin-color-syntax';
import 'tui-color-picker/dist/tui-color-picker.css';
import '@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css';
import '@toast-ui/editor/dist/i18n/ko-kr';
import Picker from 'emoji-picker-react';
import fontSize from "tui-editor-plugin-font-size";
import "tui-editor-plugin-font-size/dist/tui-editor-plugin-font-size.css";
import { backUrl } from '../../data/Data';
import ContentTable from '../../components/ContentTable';

const MUserEdit = () => {
    const params = useParams();
    const navigate = useNavigate();

    const editorRef = useRef();

    const [myNick, setMyNick] = useState("")
    const [url, setUrl] = useState('')
    const [content, setContent] = useState(undefined)
    const [formData] = useState(new FormData())
    const [noteFormData] = useState(new FormData());
    const [subscribeList, setSubscribeList] = useState([])
    const [masterList, setMasterList] = useState([])
    useEffect(() => {

        async function fetchPost() {
            if (params.pk > 0) {
                const { data: masterResponse } = await axios.get('/api/items?table=master');
                let master_list = masterResponse.data;
                const { data: response } = await axios.get(`/api/getusercontent?pk=${params.pk}`)
                let subscribe_list = response?.data?.subscribes;
                setSubscribeList(subscribe_list);
                let subscribe_master_pk_list = subscribe_list.map(a => a.master_pk);
                for (var i = 0; i < master_list.length; i++) {
                    if (subscribe_master_pk_list.includes(master_list[i].pk)) {
                        master_list[i].is_subscribe = true;
                    } else {
                        master_list[i].is_subscribe = false;
                    }
                }
                $('.id').val(response.data.user.id)
                $('.pw').val("")
                $('.name').val(response.data.user.name)
                $('.nickname').val(response.data.user.nickname)
                $('.phone').val(response.data.user.phone)
                $('.level').val(response.data.user.user_level)
                editorRef.current.getInstance().setHTML(response.data.user.consulting_note.replaceAll('http://localhost:8001', backUrl));
            }
        }
        $('div.toastui-editor-defaultUI-toolbar > div:nth-child(4)').append(`<button type="button" class='emoji' aria-label='이모티콘' style='font-size:18px;'>🙂</button>`);
        fetchPost();
    }, [])
    useEffect(() => {
        $('html').on('click', function (e) {
            if ($(e.target).parents('.emoji-picker-react').length < 1 && $('.emoji-picker-react').css('display') == 'flex' && $(e.target).attr('class') != 'emoji') {
                $('.emoji-picker-react').attr('style', 'display: none !important')
            }
        });
        $('button.emoji').on('click', function () {
            if ($('.emoji-picker-react').css('display') == 'none') {
                $('.emoji-picker-react').attr('style', 'display: flex !important')
            } else {
                $('.emoji-picker-react').attr('style', 'display: none !important')
            }
        })
        $('.toastui-editor-toolbar-icons').on('click', function () {
            $('.emoji-picker-react').attr('style', 'display: none !important')
        })

    }, [])
    const editUser = () => {
        if (!$(`.id`).val() || !$(`.name`).val() || !$(`.nickname`).val() || !$(`.phone`).val() || (!$(`.pw`).val() && params.pk == 0)) {
            alert('필요값이 비어있습니다.');
        } else {
            let obj = {
                id: $(`.id`).val(),

            }
            if (window.confirm(`${params.pk == 0 ? '추가하시겠습니까?' : '수정하시겠습니까?'}`)) {
                params.pk == 0 ?
                    addItem('user', { id: $(`.id`).val(), pw: $(`.pw`).val(), name: $(`.name`).val(), nickname: $(`.nickname`).val(), phone: $(`.phone`).val(), user_level: $(`.level`).val(), consulting_note: editorRef.current.getInstance().getHTML() }) :
                    updateItem('user', {
                        id: $(`.id`).val(), pw: $(`.pw`).val(), name: $(`.name`).val(), nickname: $(`.nickname`).val(), phone: $(`.phone`).val(), user_level: $(`.level`).val(), consulting_note: editorRef.current.getInstance().getHTML(), pk: params.pk
                    })
            }
        }


    }
    const onChangeEditor = (e) => {
        const data = editorRef.current.getInstance().getHTML();
    }
    const [chosenEmoji, setChosenEmoji] = useState(null);

    const onEmojiClick = (event, emojiObject) => {
        setChosenEmoji(emojiObject);
        editorRef.current.getInstance().insertText(emojiObject.emoji)
    };
    const addSubscribeMaster = async (num) => {
        if (localStorage.getItem('auth')) {
            if (window.confirm('구독 하시겠습니까?')) {
                const { data: response } = await axios.post('/api/addsubscribe', {
                    user_pk: params.pk,
                    master_pk: num
                })
                if (response.result > 0) {
                    alert("구독을 완료하였습니다.")
                    window.location.reload();
                } else {
                    alert(response.message);
                }
            }
        } else {
            alert('로그인을 해주세요.');
            navigate('/login');
            return;
        }
    }
    return (
        <>
         
                    <Breadcrumb title={params.pk == 0 ? '회원 추가' : '회원 수정'} nickname={myNick} />
                    <Card>
                        <Row>
                            <Col>
                                <Title style={{ margintop: '32px' }}>아이디</Title>
                                <Input className='id' />
                            </Col>
                            <Col>
                                <Title style={{ margintop: '32px' }}>비밀번호</Title>
                                <Input className='pw' type={'password'} placeholder='****' />
                            </Col>
                            <Col>
                                <Title style={{ margintop: '32px' }}>이름</Title>
                                <Input className='name' />
                            </Col>
                        </Row>

                        <Row>
                            <Col>
                                <Title style={{ margintop: '32px' }}>닉네임</Title>
                                <Input className='nickname' />
                            </Col>
                            <Col>
                                <Title style={{ margintop: '32px' }}>폰번호</Title>
                                <Input className='phone' />
                            </Col>
                            <Col>
                                <Title style={{ margintop: '32px' }}>유저레벨</Title>
                                <Select className='level'>
                                    <option value={0}>일반유저</option>
                                    <option value={40}>관리자</option>
                                    {JSON.parse(localStorage.getItem('auth')).user_level >= 50 ?
                                        <>
                                            <option value={50}>개발자</option>
                                        </>
                                        :
                                        <>
                                        </>}

                                </Select>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Title>상담내용</Title>
                                <div id="editor">
                                    <Picker onEmojiClick={onEmojiClick} />
                                    <Editor
                                        placeholder="내용을 입력해주세요."
                                        previewStyle="vertical"
                                        height="600px"
                                        initialEditType="wysiwyg"
                                        useCommandShortcut={false}
                                        useTuiEditorEmoji={true}
                                        hideModeSwitch={false}
                                        plugins={[colorSyntax,fontSize]}
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
                        <Title>구독상품</Title>
                        <ContentTable columns={[
                            { name: "대가명", column: "master_name", width: 25, type: 'text' },
                            { name: "구매일자", column: "date", width: 25, type: 'text' },
                            { name: "금액", column: "yield", width: 25, type: 'text' },
                            { name: "취소", column: "", width: 25, type: 'delete' },
                        ]}
                            data={subscribeList}
                            schema={'user_master_connect'} />
                        <Title>거장목록</Title>
                        <ContentTable columns={[
                            { name: "프로필이미지", column: "profile_img", width: 25, type: 'img' },
                            { name: "이름", column: "name", width: 25, type: 'text' },
                            { name: "구독여부", column: "is_subscribe", width: 25, type: 'is_subscribe' }
                        ]}
                            data={masterList}
                            schema={'master'}
                            addSubscribeMaster={addSubscribeMaster} />
                    </Card>
                    <ButtonContainer>
                        <CancelButton onClick={() => navigate(-1)}>x 취소</CancelButton>
                        <AddButton onClick={editUser}>{params.pk == 0 ? '+ 추가' : '수정'}</AddButton>
                    </ButtonContainer>
        </>
    )
}
export default MUserEdit;