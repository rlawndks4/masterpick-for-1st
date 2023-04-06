import { useNavigate } from "react-router-dom"
import styled from "styled-components"
import { backUrl } from "../data/Data"
const Card = styled.div`
width:100%;
background:${props => props.theme.color.background3};
text-align:left;
height:150px;
margin:6px 0;
color:${props => props.theme.color.font1};
font-weight:bold;
font-size:${props => props.theme.size.font3};
cursor:pointer;
position:relative;

`
const TextContainer = styled.div`
width: 50%;
padding: 25px 20px 0 20px;
height:125px;
margin-left: auto;
text-align: center;
font-size:${props => props.theme.size.font1};
font-weight:bold;
display:flex;
flex-direction:column;
@media screen and (max-width:600px) {
    padding: 25px 10px 0 10px;
    height:125px;
    font-size:${props => props.theme.size.font2};
}
`
const MasterName = styled.div`
font-size:${props => props.theme.size.font1};
font-family:${props => props.theme.font.Cafe24Ssurround};
@media screen and (max-width:600px) {
    font-size:${props => props.theme.size.font2};
}
`
const Motto = styled.div`
margin:auto;
word-break:break-all;
width:50%;
font-size:${props => props.theme.size.font2};
font-family:${props => props.theme.font.Cafe24Ssurround};
@media screen and (max-width:600px) {
    width:100%;
    font-size:${props => props.theme.size.font3};
}
`
const MasterCard = (props) => {
    const navigate = useNavigate();
    const {item} = props;
    return (
        <>
            <Card style={{ background: item.background_color }} onClick={() => { navigate(`/master/${item.pk}`, { state: { name: item.name, nickname: item.nickname, img: item.profile_img } }) }}>
                <img style={{ position: 'absolute', bottom: '0', left: '5%', height: '90%' }} alt="#" src={backUrl + item.profile_img} />
                <TextContainer>
                    <MasterName>{item.name}</MasterName>
                    <Motto>"{item.motto}"</Motto>
                </TextContainer>
            </Card>
        </>
    )
}
export default MasterCard;