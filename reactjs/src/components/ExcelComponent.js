import { Row } from "./elements/ManagerTemplete";
import { SiMicrosoftexcel } from 'react-icons/si';
import styled from "styled-components";
const AddButton = styled.button`
background:${props => props.theme.color.background1};
color:#fff;
border:none;
border-radius:4px;
height:34px;
cursor:pointer;
box-shadow:0px 0px 8px #dddddd;
font-weight:bold;
margin-left: 24px; 
width: 96px;
align-items: center;
display: flex;
justify-content: space-around;
font-size:${props=>props.theme.size.font4};
font-family:Nanumgothic;
`
const AddLabel = styled.label`
background:${props => props.theme.color.background1};
color:#fff;
border:none;
border-radius:4px;
height:34px;
cursor:pointer;
box-shadow:0px 0px 8px #dddddd;
font-weight:bold;
margin-left: 24px; 
width: 96px;
align-items: center;
display: flex;
justify-content: space-around;
font-size:${props=>props.theme.size.font4};
`
const ExcelComponent = (props) => {
    const { uploadExcel, extractExcel } = props;
    return (
        <>
            <Row style={{ marginTop: '26px' }}>
                <AddButton onClick={extractExcel}>
                    <SiMicrosoftexcel />엑셀추출
                </AddButton>
                <div style={{ marginBottom: '6px' }} />
                <AddLabel for="file1">
                    <SiMicrosoftexcel />엑셀삽입
                </AddLabel>
                <div>
                    <input type="file" id="file1" onChange={uploadExcel} style={{ display: 'none' }} />
                </div>
            </Row>
        </>
    )
}
export default ExcelComponent;