import React from 'react'
import styled from 'styled-components'
import { useEffect, useState } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import theme from '../../styles/theme';
import axios from 'axios';
import { Wrappers, Content, Width90Component, ViewerContainer } from '../../components/elements/UserContentTemplete';
import Loading from '../../components/Loading';
import SelectTypeComponent from '../../components/SelectTypeComponent';
import { Viewer } from '@toast-ui/react-editor';
import { backUrl } from '../../data/Data';
import $ from 'jquery'
const Table = styled.div`
font-size:${props => props.theme.size.font4};
width:100%;
margin:0 auto;
border-collapse: collapse;
display:flex;
flex-direction:column;
`
const Tr = styled.div`
width:100%;
text-align:center;
height:36px;
display:flex;
cursor:pointer;
border-bottom:1px solid ${props => props.theme.color.font4};
border-top:1px solid ${props => props.theme.color.font4};
`
const Td = styled.div`
margin:auto 0;
`
const HowToUse = () => {
    const navigate = useNavigate();
    const [typeNum, setTypeNum] = useState(0)
    const [setting, setSetting] = useState({});
    const [loading, setLoading] = useState(false);
    const [mustReadList, setMustReadList] = useState([])

    const zMenu = [
        { title: '소개', column: 'introduce' },
        { title: '활용법', column: 'how_to_use' },
        { title: '필독사항', column: 'must_read' },
    ]
    const settings = {
        infinite: true,
        speed: 500,
        autoplay: false,
        autoplaySpeed: 2500,
        slidesToShow: 1,
        slidesToScroll: 1,
    };

    useEffect(() => {
        async function fetchPost() {
            setLoading(true)
            const { data: response } = await axios.get('/api/setting')
            setSetting(response.data);
            setLoading(false)
            if (localStorage.getItem('dark_mode')) {
                await new Promise((r) => setTimeout(r, 100));
                $('.toastui-editor-contents p').attr('style', 'color:#fff !important');
            }
        }
        fetchPost();
    }, [])
    const selectTypeNum = async (num) => {
        setTypeNum(num);
        if (num == 2) {
            const { data: response } = await axios.get('/api/items?table=must_read')
            let list = response.data ?? [];
            for (var i = 0; i < list.length; i++) {
                list[i].display = 'none';
            }
            setMustReadList(list)
        }
        if (localStorage.getItem('dark_mode')) {
            await new Promise((r) => setTimeout(r, 100));
            $('.toastui-editor-contents p').attr('style', 'color:#fff !important');
        }
    }
    const displayMustRead = async (idx) => {
        let list = [...mustReadList];
        for (var i = 0; i < list.length; i++) {
            if (i == idx) {
                if (list[i].display == 'none') {
                    list[i].display = 'flex';
                } else {
                    list[i].display = 'none';
                }
            }
        }
        setMustReadList(list);
        if (localStorage.getItem('dark_mode')) {
            await new Promise((r) => setTimeout(r, 100));
            $('.toastui-editor-contents p').attr('style', 'color:#fff !important');
        }
    }
    return (
        <>
            <Wrappers className='wrappers'>
                {loading ?
                    <>
                        <Loading />
                    </>
                    :
                    <>
                        <Content>
                            <img src={backUrl + setting?.main_img} alt="#" style={{ width: '100%', maxWidth: '500px', margin: '0 auto' }} />
                        </Content>
                        <Width90Component>
                            <SelectTypeComponent posts={zMenu} num={typeNum} selectTypeNum={selectTypeNum} />
                        </Width90Component>
                        <Width90Component style={{ background: `${localStorage.getItem('dark_mode') ? '#222' : theme.color.background3}` }}>
                            {typeNum == 0 ?
                                <>
                                    <ViewerContainer style={{ width: '90%' }}>
                                        <Viewer initialValue={setting?.introduce ?? `<body></body>`} />
                                    </ViewerContainer>
                                </>
                                :
                                <>
                                </>
                            }
                            {typeNum == 1 ?
                                <>
                                    <ViewerContainer style={{ width: '90%' }}>
                                        <Viewer initialValue={setting?.how_to_use ?? `<body></body>`} />
                                    </ViewerContainer>
                                </>
                                :
                                <>
                                </>
                            }
                            {typeNum == 2 ?
                                <>
                                    <Table>
                                        <Tr style={{ background: `${localStorage.getItem('dark_mode') ? '#ccc' : '#f7f9fc'}` }}>
                                            <Td style={{ width: '65%' }}>제목</Td>
                                            <Td style={{ width: '35%' }}>등록일</Td>
                                        </Tr>
                                        {mustReadList && mustReadList.map((item, idx) => (
                                            <>
                                                <Tr onClick={() => { displayMustRead(idx) }} style={{ background: `${localStorage.getItem('dark_mode') ? '#222' : '#fff'}` }}>
                                                    <Td style={{ width: '65%', textAlign: 'left',paddingLeft:'8px' }}>{item.title}</Td>
                                                    <Td style={{ width: '35%' }}>{item.date.substring(0, 10)}</Td>
                                                </Tr>
                                                <ViewerContainer style={{ width: '90%', maxWidth: '900px', display: item.display, background: `${localStorage.getItem('dark_mode') ? '#222' : theme.color.background3}` }}>
                                                    <Viewer initialValue={item?.note ?? `<body></body>`} />
                                                </ViewerContainer>
                                            </>
                                        ))}
                                    </Table>
                                </>
                                :
                                <>

                                </>
                            }

                        </Width90Component>
                    </>
                }


            </Wrappers>
        </>
    )
}
export default HowToUse;