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
import { Card, Title, Input, Select, Row, Col, ImageContainer, Table, Tr, Td, SectorInput, SectorAddButton, Container } from '../../components/elements/ManagerTemplete';
import { RiDeleteBinLine } from 'react-icons/ri'
import ExcelComponent from '../../components/ExcelComponent';
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import readXlsxFile from 'read-excel-file'
import { AiFillFileImage } from 'react-icons/ai';
import theme from '../../styles/theme';
import { backUrl } from '../../data/Data';
const MMasterYieldEdit = () => {
    const params = useParams();
    const navigate = useNavigate();
    const [myNick, setMyNick] = useState("")
    const [sectorList, setSectorList] = useState([])
    const [url, setUrl] = useState('')
    const [content, setContent] = useState(undefined)
    const [formData] = useState(new FormData())
    useEffect(() => {
        async function fetchPost() {
            if (params.pk > 0) {
                const { data: response } = await axios.post(`/api/getmastercontents`, {
                    table: 'master_yield',
                    pk: params.pk
                });
                let sector_list = response?.data?.data;
                setSectorList(sector_list);
                await new Promise((r) => setTimeout(r, 100));
                for (var i = 0; i < sector_list.length; i++) {
                    $(`.sector-td-1-${i}`).val(sector_list[i]?.name);
                    $(`.sector-td-2-${i}`).val(sector_list[i]?.purchase_price);
                    $(`.sector-td-3-${i}`).val(sector_list[i]?.sell_price);
                    $(`.sector-td-4-${i}`).val(sector_list[i]?.yield);
                    $(`.sector-td-5-${i}`).val(sector_list[i]?.period);
                }
                setUrl(response?.data?.master?.yield_banner?(backUrl+response?.data?.master?.yield_banner):'');
            } else {
                navigate(-1);
            }
        }
        fetchPost();
    }, [])
    const editMaster = async () => {
        if (window.confirm("저장 하시겠습니까?")) {
            let sector_list = [];
            for (var i = 0; i < sectorList.length; i++) {
                if ($(`.sector-tr-${i}`).css('display') != 'none') {
                    sector_list.push(
                        [$(`.sector-td-1-${i}`).val(), $(`.sector-td-2-${i}`).val(), $(`.sector-td-3-${i}`).val(), $(`.sector-td-4-${i}`).val(), $(`.sector-td-5-${i}`).val(), params.pk]
                    )
                }
            }
            formData.append('master',content);
            formData.append('list',JSON.stringify(sector_list));
            formData.append('columns',JSON.stringify(['name', 'purchase_price', 'sell_price', 'yield', 'period', 'master_pk']));
            formData.append('table','master_yield');
            formData.append('master_pk',params.pk);

            const { data: response } = await axios.post('/api/updatemastercontent', formData);
            alert(response.message);
            if (response.result > 0) {
                navigate('/manager/list/master');
            }else{
                formData.delete('list');
                formData.delete('columns');
                formData.delete('table');
                formData.delete('master_pk');
            }
        }

    }
    const uploadExcel = (e) => {
        if (e.target.files[0]) {
            readXlsxFile(e.target.files[0]).then((rows) => {
                rows.shift();
                setSectorList(rows)
                for (var i = 0; i < 1000; i++) {
                    if (i == rows.length) {
                        break;

                    } else {
                        $(`.sector-tr-${i}`).css('display', 'flex');
                        $(`.sector-td-1-${i}`).val(rows[i][0])
                        $(`.sector-td-2-${i}`).val(rows[i][1])
                        $(`.sector-td-3-${i}`).val(rows[i][2])
                        $(`.sector-td-4-${i}`).val(rows[i][3])
                        $(`.sector-td-5-${i}`).val(rows[i][4])
                    }
                }
            })
        }
    }
    const excelFileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const excelFileExtension = '.xlsx';
    const excelFileName = '거장수익률';
    const extractExcel = async () => {
        let sector_list = [];
        for (var i = 0; i < sectorList.length; i++) {
            if ($(`.sector-tr-${i}`).css('display') != 'none') {
                sector_list.push(
                    { name: $(`.sector-td-1-${i}`).val(), purchase_price: $(`.sector-td-2-${i}`).val(), sell_price: $(`.sector-td-3-${i}`).val(), yield: $(`.sector-td-4-${i}`).val(), period: $(`.sector-td-5-${i}`).val() }
                )
            }
        }

        const ws = XLSX.utils.aoa_to_sheet([
            ['종목명', '매수가', '매도가', '수익률', '매수月']
        ]);
        sector_list.map((data) => {
            XLSX.utils.sheet_add_aoa(
                ws,
                [
                    [
                        data['name'],
                        data['purchase_price'],
                        data['sell_price'],
                        data['yield'],
                        data['period']
                    ]
                ],
                { origin: -1 }
            );
            ws['!cols'] = [
                { wpx: 200 },
                { wpx: 200 }
            ]
            return false;
        });
        const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
        const excelButter = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const excelFile = new Blob([excelButter], { type: excelFileType });
        FileSaver.saveAs(excelFile, excelFileName + excelFileExtension);
    }
    const addFile = (e) => {
        console.log(e.target.files[0])
        if (e.target.files[0]) {
            setContent(e.target.files[0]);
            setUrl(URL.createObjectURL(e.target.files[0]))
        }
    };
    return (
        <>
            <Breadcrumb title={params.pk == 0 ? '거장수익률수정' : '거장수익률수정'} nickname={myNick} />
            <Card>
                <Row>
                    <Col>
                        <Title>수익률</Title>
                        <ExcelComponent uploadExcel={uploadExcel} extractExcel={extractExcel} />
                        <Container>
                            <Table>
                                <Tr>
                                    <Td>종목명</Td>
                                    <Td>매수가</Td>
                                    <Td>매도가</Td>
                                    <Td>수익률</Td>
                                    <Td>매수月</Td>
                                    <Td style={{ width: '20%' }}>삭제</Td>
                                </Tr>
                                {sectorList && sectorList.map((item, idx) => (
                                    <>
                                        <Tr className={`sector-tr-${idx}`}>
                                            <Td ><SectorInput className={`sector-td-1-${idx}`} placeholder={'삼성전자'} /></Td>
                                            <Td ><SectorInput className={`sector-td-2-${idx}`} placeholder={'only number'} /> </Td>
                                            <Td ><SectorInput className={`sector-td-3-${idx}`} placeholder={'only number'} /> </Td>
                                            <Td ><SectorInput className={`sector-td-4-${idx}`} placeholder={'only number'} /> </Td>
                                            <Td ><SectorInput className={`sector-td-5-${idx}`} placeholder={'only number'} /> </Td>
                                            <Td style={{ width: '20%' }}><RiDeleteBinLine style={{ cursor: 'pointer' }} onClick={() => { $(`.sector-tr-${idx}`).css('display', 'none') }} /></Td>
                                        </Tr>
                                    </>
                                ))}
                            </Table>
                            <SectorAddButton onClick={() => { setSectorList([...sectorList, ...[{}]]) }}>+추가</SectorAddButton>
                        </Container>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Title>배너</Title>
                        <ImageContainer for="banner">

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
                            <input type="file" id="banner" onChange={addFile} style={{ display: 'none' }} />
                        </div>
                    </Col>

                </Row>
            </Card>
            <ButtonContainer>
                <CancelButton onClick={() => navigate(-1)}>x 취소</CancelButton>
                <AddButton onClick={editMaster}>{params.pk == 0 ? '+ 추가' : '저장'}</AddButton>
            </ButtonContainer>
        </>
    )
}
export default MMasterYieldEdit;