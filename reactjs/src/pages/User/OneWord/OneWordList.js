import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Title, Wrappers,Content } from "../../../components/elements/UserContentTemplete";
import theme from "../../../styles/theme";


const OneWordList = () => {
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        async function fetchPosts() {
            const { data: response } = await axios.get('/api/items?table=oneword&status=1');
            setPosts(response.data);
        }
        fetchPosts();
    }, [])
    return (
        <>
            <Wrappers>
                <Title>하루 1단어</Title>
                {posts.map((item, idx) => (
                    <Content onClick={() => { navigate(`/post/oneword/${item?.pk}`) }} style={{borderBottom:'1px solid #cccccc',paddingBottom:'16px'}}>
                        <div >{item?.title ?? ""}</div>
                        {/* <div style={{ fontSize: `${theme.size.font4}`, padding: '6px 0 0 0' }}>{item?.hash ?? ""}</div> */}
                    </Content>
                ))}
            </Wrappers>
        </>
    )
}
export default OneWordList;