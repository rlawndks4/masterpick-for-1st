import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Wrappers } from "../../components/elements/UserContentTemplete";
import { backUrl, logoSrc } from "../../data/Data";
import theme from "../../styles/theme";
import { MdNavigateNext } from 'react-icons/md'
const Card = styled.div`
width:100%;
background:${props => props.theme.color.background3};
text-align:center;
height:84px;
margin:6px 0;
color:${props => props.theme.color.font2};
font-weight:bold;
font-size:${props => props.theme.size.font2};
cursor:pointer;
`
const Img = styled.img`
width: 30px;
margin:0 1rem;
padding:8px;
border-radius:50%;
@media screen and (max-width:400px) {
    padding:4px;
    margin:0 0.5rem;
}
`
const Title = styled.div`
color: #1690FF;
font-size: ${theme.size.font3};
padding-top: 8px;
@media screen and (max-width:400px) {
font-size: ${theme.size.font4};
padding-top: 4px;
}
`
const SubTitle = styled.div`
color: #aaaaaa;
font-size: ${theme.size.font5};
@media screen and (max-width:400px) {
font-size: ${theme.size.font5};
}
`
const SelectFeatureCategory = () => {
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        async function fetchPosts() {
            const { data: response } = await axios.get('/api/items?table=feature_category&status=1');
            setPosts(response.data);
        }
        fetchPosts();
    }, [])
    return (
        <>
            <Wrappers>
                {posts.map((item, idx) => (
                    <>
                        <Card onClick={() => { navigate(`/featurelist/${item.pk}`, { state: item.title }) }} style={{ display: 'flex', alignItems: 'center' }}>
                            <Img src={item?.main_img?backUrl + item?.main_img:logoSrc} alt="#" />
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', margin: '0 auto 0 0' }}>
                                <SubTitle>{item?.sub_title??"---"}</SubTitle>
                                <Title>{item?.title??"---"}</Title>
                            </div>
                            <MdNavigateNext className="smaller-margin-right-content" />
                        </Card>
                    </>
                ))}
            </Wrappers>
        </>
    )
}
export default SelectFeatureCategory;