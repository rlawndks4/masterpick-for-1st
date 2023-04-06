import React from 'react'
import styled from 'styled-components'
import { useEffect, useState, useRef } from 'react';
import { useNavigate, Link, useParams, useLocation } from 'react-router-dom';
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
import { Card, Title, Input, Select, Row, Col } from '../../components/elements/ManagerTemplete';
import { backUrl } from '../../data/Data';
import theme from '../../styles/theme';
import { Editor } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';
import colorSyntax from '@toast-ui/editor-plugin-color-syntax';
import 'tui-color-picker/dist/tui-color-picker.css';
import '@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css';
import '@toast-ui/editor/dist/i18n/ko-kr';
import Picker from 'emoji-picker-react';
import fontSize from "tui-editor-plugin-font-size";
import "tui-editor-plugin-font-size/dist/tui-editor-plugin-font-size.css";
const ImageContainer = styled.label`
border: 2px dashed ${props => props.theme.color.manager.font3};
margin:12px auto 6px 24px;
height:16rem;
border-radius:2rem;
text-align:center;
min-width:20rem;
@media screen and (max-width:700px) {
min-width:10rem;

    margin:16px 24px;
}
`
const Img = styled.img`
width: auto; 
height: 12rem;
margin: 24px;
@media screen and (max-width:700px) {
    width: 12rem; 
    height: 9rem;
}
`
const MSettingEdit = () => {
    const params = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const introduceRef = useRef();
    const howToUseRef = useRef();
    const [myNick, setMyNick] = useState("")
    const [url, setUrl] = useState('')
    const [setting, setSetting] = useState({});
    const [content, setContent] = useState(undefined)
    const [formData] = useState(new FormData())
    const [noteFormData] = useState(new FormData());
    useEffect(() => {
        formData.delete('master')
        formData.delete('introduce')
        formData.delete('howToUse')
        formData.delete('category')
        formData.delete('pk')
        async function fetchPost() {
            const { data: response } = await axios.get('/api/setting');
            setSetting(response.data ?? {});
            if (response.data) {
                setUrl(backUrl + response.data.main_img);
                if (params.category == 'introduce') introduceRef.current.getInstance().setHTML(response.data.introduce.replaceAll('http://localhost:8001', backUrl));
                if (params.category == 'how_to_use') howToUseRef.current.getInstance().setHTML(response.data.how_to_use.replaceAll('http://localhost:8001', backUrl));
            }
        }
        $('div.toastui-editor-defaultUI-toolbar > div:nth-child(4)').append(`<button type="button" class='emoji' aria-label='이모티콘' style='font-size:18px;'>🙂</button>`);
        fetchPost();
    }, [location])
    useEffect(() => {
        $('button.emoji').on('click', function () {
            $('.emoji-picker-react').attr('style', 'display: flex !important')
        })
        $('.toastui-editor-toolbar-icons').on('click', function () {
            $('.emoji-picker-react').attr('style', 'display: none !important')
        })
    }, [])
    const editSetting = async () => {

        if (window.confirm("정말 수정하시겠습니까?")) {
            if (params.category == 'main_img') formData.append('master', content);
            if (params.category == 'introduce') formData.append('introduce', introduceRef.current.getInstance().getHTML());
            if (params.category == 'how_to_use') formData.append('howToUse', howToUseRef.current.getInstance().getHTML());
            formData.append('category', params.category);
            formData.append('pk', setting?.pk);
            const { data: response } = await axios.post('/api/updatesetting', formData);
            if (response.result > 0) {
                alert("성공적으로 수정되었습니다.");
                window.location.reload();
            }
        }
    }
    const addFile = (e) => {
        if (e.target.files[0]) {
            setContent(e.target.files[0]);
            setUrl(URL.createObjectURL(e.target.files[0]))
        }
    };
    const [chosenEmoji, setChosenEmoji] = useState(null);
    const onEmojiClick = (event, emojiObject) => {
        setChosenEmoji(emojiObject);
        introduceRef.current.getInstance().insertText(emojiObject.emoji)
    };
    return (
        <>
           
                    <Breadcrumb title={'필독!활용법'} nickname={myNick} />
                    <Card>
                        {params.category == 'main_img' ?
                            <>
                                <Row>
                                    <Col>
                                        <Title>메인 배너</Title>
                                        <ImageContainer for="file1">

                                            {url ?
                                                <>
                                                    <Img src={url} alt="#"
                                                    />
                                                </>
                                                :
                                                <>
                                                    <AiFillFileImage style={{ margin: '6rem auto', fontSize: '4rem', color: `${theme.color.manager.font3}` }} />
                                                </>}
                                        </ImageContainer>
                                        <div>
                                            <input type="file" id="file1" onChange={addFile} style={{ display: 'none' }} />
                                        </div>
                                    </Col>
                                </Row>
                            </>
                            :
                            <>
                            </>}
                        {params.category == 'introduce' ?
                            <>
                                <Row>
                                    <Col>
                                        <Title>소개</Title>
                                        <div id="editor" className='editor1'>
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
                                                ref={introduceRef}
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
                            </>
                            :
                            <>
                            </>}
                        {params.category == 'how_to_use' ?
                            <>
                                <Row>
                                    <Col>
                                        <Title>활용법</Title>
                                        <div id="editor" className='editor2'>
                                            {/* <Picker onEmojiClick={onEmojiClick} /> */}
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
                                                ref={howToUseRef}
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
                            </>
                            :
                            <>
                            </>}
                    </Card>
                    <ButtonContainer>
                        <CancelButton onClick={() => navigate(-1)}>x 취소</CancelButton>
                        <AddButton onClick={editSetting}>{setting.main_img ? '수정' : '+ 추가'}</AddButton>
                    </ButtonContainer>
               
        </>
    )
}
export default MSettingEdit;