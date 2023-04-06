import { useEffect } from "react";
import { useState } from "react";
import styled from "styled-components";
import { RiDeleteBinLine } from 'react-icons/ri'
import $ from 'jquery'
const Container = styled.div`
margin:12px auto 6px 24px;
width:90%;
color:${props => props.theme.color.manager.font2};
font-weight:bold;
margin-top:32px;
`
const Input = styled.input`
width:90%;
outline:none;
border:none;
`
const Table = styled.table`
width:260px;
text-align:center;
border-spacing: 0px;
border-style: none;
padding: 0px;
background:#fff;
`
const Tr = styled.tr`
display:flex;
`
const Td = styled.td`
border:1px solid ${props => props.theme.color.font4};
width:40%;
`
const AddButton = styled.button`
width:260px;
border:1px solid ${props => props.theme.color.font4};
background:#fff;
cursor:pointer;
height:36px;
`
const SectorList = (props) => {
    const [zSector, setZSector] = useState([])
    useEffect(() => {
        setZSector(props.list);
    }, [])
    return (
        <>
            <Container>
                <Table>
                    <Tr>
                        <Td>종류</Td>
                        <Td>퍼센트</Td>
                        <Td style={{ width: '20%' }}>삭제</Td>
                    </Tr>
                    {zSector.map((item, idx) => (
                        <>
                            <Tr className={`sector-tr-${idx}`}>
                                <Td className={`sector-td-1-${idx}`}><Input /></Td>
                                <Td className={`sector-td-2-${idx}`}><Input /> </Td>
                                <Td style={{ width: '20%' }}><RiDeleteBinLine style={{cursor:'pointer'}} onClick={() => {$(`.sector-tr-${idx}`).css('display','none')}} /></Td>
                            </Tr>
                        </>
                    ))}
                </Table>
                <AddButton onClick={() => {setZSector([...zSector,...[{}]])}}>+추가</AddButton>
            </Container>
        </>
    )
}
export default SectorList;