import { useEffect, useState } from "react";
import { Title, Wrappers } from "../../../components/elements/UserContentTemplete";
import styled from "styled-components";
import theme from "../../../styles/theme";
import FindMyInfoCard from "../../../components/FindMyInfoCard";

const FindMyInfo = () =>{
    
    return (
        <>
        <Wrappers>
            <FindMyInfoCard/>
        </Wrappers>
        </>
    )
}
export default FindMyInfo