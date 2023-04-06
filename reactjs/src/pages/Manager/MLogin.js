import React from 'react'
import styled from 'styled-components'
import { useEffect, useState } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { Wrappers } from '../../components/elements/Wrappers';
import MLoginCard from '../../components/MLoginCard';
import theme from '../../styles/theme';
const MLogin = () =>{

    return (
        <>
        <Wrappers style={{background:`${theme.color.manager.background2}`, margin:'0',maxWidth:'100%',minHeight:'100vh'}}>
            <MLoginCard/>
        </Wrappers>
        </>
    )
}
export default MLogin;