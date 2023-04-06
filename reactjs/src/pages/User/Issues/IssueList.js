import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { Title, Wrappers } from "../../../components/elements/UserContentTemplete";
import ThemeCard from "../../../components/ThemeCard";


const IssueList = () => {
    const navigate = useNavigate();
    const params = useParams();
    const {state} = useLocation();
    const [posts, setPosts] = useState([]);

    useEffect(() => {

        async function fetchPosts() {
            const { data: response } = await axios.get(`/api/items?table=issue&category_pk=${params.pk}&status=1`);
            setPosts(response.data);
        }
        fetchPosts();
    }, [])
    return (
        <>
            <Wrappers>
                <Title>{state}</Title>
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                {posts.map((item, idx) => (
                    <>
                        <ThemeCard item={item} category={'issue'} />
                    </>
                ))}
                </div>
            </Wrappers>
        </>
    )
}
export default IssueList;