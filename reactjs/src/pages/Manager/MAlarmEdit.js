import React from 'react'
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
import { Card, Title, Input, Row, Col, ImageContainer, Textarea } from '../../components/elements/ManagerTemplete';
import { objManagerListContent } from '../../data/Data';
import theme from '../../styles/theme';
const MAlarmEdit = () => {
    const { pathname } = useLocation();
    const params = useParams();
    const [url, setUrl] = useState('')
    const [content, setContent] = useState(undefined)
    const editorRef = useRef();
    const [comments, setComments] = useState([]);
    const [myNick, setMyNick] = useState("")
    const [auth, setAuth] = useState({});
    const [noteFormData] = useState(new FormData());
    const [typeNum, setTypeNum] = useState(0);
    const [selectDaysList, setSelectDaysList] = useState([]);
    const zDays = [
        { name: '일', val: 0 },
        { name: '월', val: 1 },
        { name: '화', val: 2 },
        { name: '수', val: 3 },
        { name: '목', val: 4 },
        { name: '금', val: 5 },
        { name: '토', val: 6 }
    ]
    useEffect(() => {
        let authObj = JSON.parse(localStorage.getItem('auth'));
        setAuth(authObj);
        async function fetchPost() {
            if (params.pk > 0) {
                const { data: response } = await axios.get(`/api/item?table=alarm&pk=${params.pk}`);
                $(`.title`).val(response.data.title);
                $(`.note`).val(response.data.note);
                setTypeNum(response.data.type)
                setSelectDaysList(JSON.parse(response.data.days));
                await new Promise((r) => setTimeout(r, 100));
                $(`.start-date`).val(response.data.start_date);
                $(`.time`).val(response.data.time);

            }
        }
        $('div.toastui-editor-defaultUI-toolbar > div:nth-child(4)').append(`<button type="button" class='emoji' aria-label='이모티콘' style='font-size:18px;'>🙂</button>`);
        fetchPost();
    }, [pathname])
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
    const [chosenEmoji, setChosenEmoji] = useState(null);

    const onEmojiClick = (event, emojiObject) => {
        setChosenEmoji(emojiObject);
        editorRef.current.getInstance().insertText(emojiObject.emoji)
    };

    const editItem = async () => {
        if (!$(`.title`).val() || !$(`.note`).val() || (typeNum == 1 && (!$(`.start-date`).val() || selectDaysList.length == 0 || !$(`.time`).val()))) {
            alert('필요값이 비어있습니다.');
        } else {
            let obj = {
                title: $('.title').val(),//제목
                url: $('.url').val(),//url
                note: $(`.note`).val(),//내용
                type: typeNum,//0-즉시, 1-
                start_date: $(`.start-date`).val(),
                days: JSON.stringify(selectDaysList),
                time: $('.time').val()
            }
            if (params.pk > 0) obj.pk = params.pk;

            if (window.confirm(`저장하시겠습니까?`)) {
                if (params.pk > 0) {
                    updateItem('alarm', obj);
                } else {
                    addItem('alarm', obj);
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
    const handleClickType = (e) => {
        setTypeNum(e.target.value)
    }
    return (
        <>
          
                    <Breadcrumb title={objManagerListContent[`alarm`].breadcrumb} nickname={myNick} />
                    <Card>
                        <Row>
                            <Col>
                                <Title>제목</Title>
                                <Input className='title' placeholder='제목을 입력해 주세요.' />
                            </Col>
                            <Col>
                                <Title>url</Title>
                                <Input className='url' placeholder='ex) /masterlist' />
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Title>내용</Title>
                                <Textarea className='note' />
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Title>알람타입</Title>
                                <Row style={{ margin: '12px auto 6px 24px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', margin: '0 8px 8px 0' }}>
                                        <input type={'radio'} name='alarm-type' id='alarm-0' value={0} checked={typeNum == 0} onChange={handleClickType} />
                                        <label for='alarm-0'>바로실행</label>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', margin: '0 8px 8px 0' }}>
                                        <input type={'radio'} name='alarm-type' id='alarm-1' value={1} checked={typeNum == 1} onChange={handleClickType} />
                                        <label for='alarm-1'>스케줄링</label>
                                    </div>
                                </Row>
                            </Col>
                        </Row>
                        {typeNum == 1 ?
                            <>
                                <Row>
                                    <Col>
                                        <Title>스케줄링 타입</Title>
                                        <Title>시작할 날짜</Title>
                                        <Input type={'date'} className='start-date' />
                                        <Title>실행할 요일</Title>
                                        <div style={{ margin: '12px auto 6px 24px', display: 'flex' }}>
                                            {zDays.map((item, idx) => (
                                                <>
                                                    <div style={{
                                                        background: `${selectDaysList.includes(idx) ? theme.color.background1 : theme.color.font3}`,
                                                        color: `${selectDaysList.includes(idx) ? '#fff' : theme.color.font1}`, fontSize: theme.size.font4, padding: '8px',
                                                        borderRadius: '4px', marginRight: '4px', cursor: 'pointer'
                                                    }}
                                                        onClick={() => {
                                                            let list = [...selectDaysList];
                                                            for (var i = 0; i < list.length; i++) {
                                                                if (list[i] == idx) {
                                                                    break;
                                                                }
                                                            }
                                                            if (i == list.length) {
                                                                list.push(idx);
                                                            } else {
                                                                list.splice(i, 1);
                                                            }
                                                            setSelectDaysList(list);
                                                        }}>{item.name}</div>
                                                </>
                                            ))}
                                        </div>
                                        <Title>실행할 시간 (5분 단위 추천)</Title>
                                        <Input type={'time'} className='time' />
                                    </Col>
                                </Row>
                            </>
                            :
                            <>
                            </>
                        }
                    </Card>
                    <ButtonContainer>
                        <AddButton onClick={editItem}>{'저장'}</AddButton>
                    </ButtonContainer>

        </>
    )
}
export default MAlarmEdit;