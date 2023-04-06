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
import { addItem, updateItem } from '../../functions/utils';
import { Card, Title, Input, Row, Col, ImageContainer, Select } from '../../components/elements/ManagerTemplete';
import theme from '../../styles/theme';
import youtubeShare from '../../assets/images/test/youtube_share.PNG'
import relateExplain from '../../assets/images/test/relate_explain.png'
import { Editor } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';
import colorSyntax from '@toast-ui/editor-plugin-color-syntax';
import 'tui-color-picker/dist/tui-color-picker.css';
import '@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css';
import '@toast-ui/editor/dist/i18n/ko-kr';
import { backUrl, cardDefaultColor } from '../../data/Data';
import { objManagerListContent } from '../../data/Data';
import Picker from 'emoji-picker-react';
import fontSize from "tui-editor-plugin-font-size";
import "tui-editor-plugin-font-size/dist/tui-editor-plugin-font-size.css";
const MMustReadEdit = () => {
    const { pathname } = useLocation();
    const params = useParams();
    const navigate = useNavigate();

    const noteRef = useRef();

    const [myNick, setMyNick] = useState("")
    const [auth, setAuth] = useState({});
    const [noteFormData] = useState(new FormData());
    const [channelList, setChannelList] = useState([]);
    useEffect(() => {
        let authObj = JSON.parse(localStorage.getItem('auth'));
        setAuth(authObj);
        async function fetchPost() {
            if (params.pk > 0) {
                const { data: response } = await axios.get(`/api/item?table=must_read&pk=${params.pk}`);
                $(`.title`).val(response.data.title);
                noteRef.current.getInstance().setHTML(response.data.note.replaceAll('http://localhost:8001', backUrl));
            } 
        }
        $('div.toastui-editor-defaultUI-toolbar > div:nth-child(4)').append(`<button type="button" class='emoji' aria-label='이모티콘' style='font-size:18px;'>🙂</button>`);
        fetchPost();
    }, [pathname])
    useEffect(() => {
        $('button.emoji').on('click', function () {
            $('.emoji-picker-react').attr('style', 'display: flex !important')
        })
        $('.toastui-editor-toolbar-icons').on('click', function () {
            $('.emoji-picker-react').attr('style', 'display: none !important')
        })
    }, [params])
    const editItem = async () => {
        if (!$(`.title`).val()) {
            alert('필요값이 비어있습니다.');
        } else {
            let obj = {
                user_pk: auth.pk,
                title: $('.title').val(),
                note: noteRef.current.getInstance().getHTML()
            }
            if (params.pk > 0) obj.pk = params.pk;

            if (window.confirm(`저장하시겠습니까?`)) {

                if (params.pk > 0) {
                    updateItem('mustread', obj);
                } else {
                    addItem('mustread', obj);
                }



            }
        }
    }
    const onChangeEditor = (e) => {
        const data = noteRef.current.getInstance().getHTML();
    }
    const [chosenEmoji, setChosenEmoji] = useState(null);
    const onEmojiClick = (event, emojiObject) => {
        setChosenEmoji(emojiObject);
        noteRef.current.getInstance().insertText(emojiObject.emoji)
    };
    return (
        <>
           
                    <Breadcrumb title={objManagerListContent[`must_read`].breadcrumb} nickname={myNick} />
                    <Card>
                        <Row>
                            <Col>
                                <Title>제목</Title>
                                <Input className='title' placeholder='제목을 입력해 주세요.' />
                            </Col>
                        </Row>
                      
                        <Row>
                            <Col>
                                <Title>내용</Title>
                                <Picker onEmojiClick={onEmojiClick} />
                                <div id="editor">
                                    <Editor
                                        placeholder="내용을 입력해주세요."
                                        previewStyle="vertical"
                                        height="600px"
                                        initialEditType="wysiwyg"
                                        useCommandShortcut={false}
                                        hideModeSwitch={false}
                                        plugins={[colorSyntax,fontSize]}
                                        language="ko-KR"
                                        ref={noteRef}
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
export default MMustReadEdit;