import { useNavigate } from "react-router-dom";
import { commarNumber } from "../functions/utils";
import { RiDeleteBinLine } from 'react-icons/ri'
import axios from "axios";
import { backUrl } from "../data/Data";
import AddButton from "./elements/button/AddButton";
import theme from "../styles/theme";
import { Table, Tr, Td } from "./elements/UserContentTemplete";
import { useEffect } from "react";

const ContentTable = (props) => {
    const navigate = useNavigate();
    const { columns, data, click, schema, isPointer, addSubscribeMaster, columnsBold, marginBottom, fontSize } = props;
    const onClickEvent = (str) => {
        if (str) {
            navigate(str)
        }
    }
    useEffect(()=>{

    },[data])
    const deleteItem = async (pk, schema, cha) => {
        if (window.confirm(`정말로 ${cha ?? '삭제'}하시겠습니까?`)) {
            let obj = {
                pk: pk,
                table: schema
            }
            const { data: response } = await axios.post(`/api/deleteitem`, obj)

            if (response.result > 0) {
                alert('has been deleted');
                window.location.reload();
            } else {
                alert('error')
            }
        }
    }
    const getStarBynum = (num) => {
        let str = '';
        for (var i = 0; i < num; i++) {
            str += '★';
        }
        return str;
    }
    const getExistingPossessionByNumber = (num) => {
        if (num == 0) {
            return "신규";
        } else if (num == 1) {
            return "보유중";
        } else if (num == 2) {
            return "매도";
        } else {
            return "---";
        }
    }
    return (
        <>
            <div className='subtype-container' style={{ overflowX: 'auto', display: 'flex', width: '90%', margin: '0 auto', marginBottom: marginBottom }} >
                <Table style={{ fontSize: `${fontSize ? fontSize : ''}` }}>
                    <Tr style={{ fontWeight: `${columnsBold ? 'bold' : ''}`, fontWeight: `${schema == 'master_subscribe' ? 'bold' : ''}` }}>
                        {columns.map((item, idx) => (
                            <>
                                <Td style={{ width: item.width }}>{item.name}</Td>
                            </>
                        ))}
                    </Tr>
                    {data.map((item, idx) => (
                        <Tr onClick={() => { click ? onClickEvent(`${click + '/' + item.pk}`) : onClickEvent(``) }}>
                            {columns.map((column, idx) => (
                                <>
                                    <Td style={{ width: column.width, color: `${column.color ? column.color : ''}`, cursor: `${isPointer ? 'pointer' : ''}`, fontWeight: `${column.bold ? 'bold' : ''}` }}>
                                        {column.type == 'img' ?
                                            <img src={backUrl + item[column.column]} alt="#" style={{ height: '36px' }} /> ?? "---"
                                            :
                                            null}
                                        {column.type == 'is_subscribe' ?
                                            <AddButton style={{ width: '84px', background: `${item[column.column] ? theme.color.background1 : '#fff'}`, color: `${item[column.column] ? '#fff' : theme.color.font1}`, border: `1px solid ${theme.color.background1}` }}
                                                onClick={() => (item[column.column] ? null : addSubscribeMaster(item.pk))}>
                                                {item[column.column] ? '구독완료' : '구독'}
                                            </AddButton> ?? "---"
                                            :
                                            null}
                                        {column.type == 'text' ?
                                            item[column.column] ?? "---"
                                            :
                                            null}
                                        {column.type == 'star' ?
                                            getStarBynum(parseInt(item[column.column])) ?? "---"
                                            :
                                            null}
                                        {column.type == 'number' ?
                                            commarNumber(item[column.column]) ?? "---"
                                            :
                                            null}
                                        {column.type == 'month' ?
                                            commarNumber(item[column.column]) + '月'
                                            :
                                            null}
                                        {column.type == 'subscribe_date' ?
                                            item[column.column] ? item[column.column].substring(5, 10).replaceAll("-", ".") : "---"
                                            :
                                            null}
                                        {column.type == 'existing_possession' ?
                                            getExistingPossessionByNumber(item[column.column])
                                            :
                                            null}
                                        {column.type == 'day' ?
                                            commarNumber(item[column.column]) + '일'
                                            :
                                            null}
                                        {column.type == 'percent' ?
                                            `${item[column.column] >= 0 ? '+' : '-'}` + commarNumber(item[column.column]) + '%'
                                            :
                                            null}
                                        {column.type == 'delete' ?
                                            <RiDeleteBinLine style={{ cursor: 'pointer' }} onClick={() => deleteItem(item.pk, schema, column.name)} />
                                            :
                                            null}
                                    </Td>
                                </>
                            ))}
                        </Tr>
                    ))}

                </Table>
            </div>
        </>
    )
}
export default ContentTable;