import React from 'react'
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
import { useCallback } from 'react';
import ExcelComponent from '../../components/ExcelComponent';
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import readXlsxFile from 'read-excel-file'
const MMasterEventEdit = () => {
    const params = useParams();
    const navigate = useNavigate();
    const [myNick, setMyNick] = useState("")
    const [sectorList, setSectorList] = useState([])

    useEffect(() => {
        async function fetchPost() {
            if (params.pk > 0) {
                const { data: response } = await axios.post(`/api/getmastercontents`,{
                    table:'master_event',
                    pk:params.pk
                });
                let sector_list = response?.data?.data;
                setSectorList(sector_list);
                await new Promise((r) => setTimeout(r, 100));
                for (var i = 0; i < sector_list.length; i++) {
                    $(`.sector-td-1-${i}`).val(sector_list[i]?.name);
                    $(`.sector-td-2-${i}`).val(sector_list[i]?.level);
                }
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
                        [$(`.sector-td-1-${i}`).val(), $(`.sector-td-2-${i}`).val(), params.pk]
                    )
                }
            }
            let obj = {
                list: sector_list,
                columns: ['name', 'level', 'master_pk'],
                table: 'master_event',
                master_pk: params.pk
            }

            const { data: response } = await axios.post('/api/updatemastercontent', obj);
            alert(response.message);
            if (response.result > 0) {
                navigate('/manager/list/master');
            }
        }

    }

    const uploadExcel = (e) => {
        if (e.target.files[0]) {
            readXlsxFile(e.target.files[0]).then((rows) => {
                rows.shift();
                setSectorList(rows)
                for(var i = 0;i<1000;i++){
                    if(i==rows.length){
                        break;

                    }else{
                        $(`.sector-tr-${i}`).css('display','flex');
                        $(`.sector-td-1-${i}`).val(rows[i][0])
                        $(`.sector-td-2-${i}`).val(rows[i][1])
                    }
                }
            })
        }
    }
    const excelFileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const excelFileExtension = '.xlsx';
    const excelFileName = '거장종목';
    const extractExcel = async () => {
        let sector_list = [];
        for (var i = 0; i < sectorList.length; i++) {
            if ($(`.sector-tr-${i}`).css('display') != 'none') {
                sector_list.push(
                    { name: $(`.sector-td-1-${i}`).val(), level: $(`.sector-td-2-${i}`).val() }
                )
            }
        }

        const ws = XLSX.utils.aoa_to_sheet([
            ['종목명', '등급 (숫자: 별점)']
        ]);
        sector_list.map((data) => {
            XLSX.utils.sheet_add_aoa(
                ws,
                [
                    [
                        data['name'],
                        data['level']
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

    return (
        <>
          
                    <Breadcrumb title={params.pk == 0 ? '거장종목추가' : '거장종목수정'} nickname={myNick} />
                    <Card>
                        <Row>
                            <Col>
                                <Title>종목</Title>
                                <ExcelComponent uploadExcel={uploadExcel} extractExcel={extractExcel} />
                                <Container>
                                    <Table>
                                        <Tr>
                                            <Td>종목명</Td>
                                            <Td>등급 (숫자: 별점)</Td>
                                            <Td style={{ width: '20%' }}>삭제</Td>
                                        </Tr>
                                        {sectorList && sectorList.map((item, idx) => (
                                            <>
                                                <Tr className={`sector-tr-${idx}`}>
                                                    <Td ><SectorInput className={`sector-td-1-${idx}`} /></Td>
                                                    <Td ><SectorInput className={`sector-td-2-${idx}`} placeholder={`only number${idx}`} /> </Td>
                                                    <Td style={{ width: '20%' }}><RiDeleteBinLine style={{ cursor: 'pointer' }} onClick={() => { $(`.sector-tr-${idx}`).css('display', 'none') }} /></Td>
                                                </Tr>
                                            </>
                                        ))}
                                    </Table>
                                    <SectorAddButton onClick={() => { setSectorList([...sectorList, ...[{}]]) }}>+추가</SectorAddButton>
                                </Container>
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
export default MMasterEventEdit;