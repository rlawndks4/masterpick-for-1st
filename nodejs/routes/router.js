const express = require('express');
const router = express.Router();
const { upload } = require('../config/multerConfig')
const {
    onLoginById, getUserToken, onLogout, checkExistId, checkExistNickname, sendSms, kakaoCallBack, editMyInfo, uploadProfile, onLoginBySns,//auth
    getUsers, getItems, getItem, getSetting,getChannelList, getVideo, findIdByPhone, findAuthByIdAndPhone, getMasterContents, getMainContent, getUserContent, getMasterContent,//select
    addMaster, onSignUp, addItem, addNoteImage, addNotice, addSubscribeContent, addSubscribe, addMustRead, addAlarm, //insert 
    updateUser, updateItem, updateMaster, updateSetting, updateStatus, updateNotice, onTheTopItem, changeItemSequence, changePassword, updateMasterContent, updateSubscribeContent, editMainContent, updateMustRead, updateAlarm,//update
    deleteItem, onResign
} = require('./api')

router.post('/editmyinfo', editMyInfo);
router.post('/uploadprofile', upload.single('profile'), uploadProfile)
router.post('/kakao/callback', kakaoCallBack);
router.post('/sendsms', sendSms);
router.post('/findidbyphone', findIdByPhone);
router.post('/findauthbyidandphone', findAuthByIdAndPhone);
router.post('/checkexistid', checkExistId);
router.post('/checkexistnickname', checkExistNickname);
router.post('/changepassword', changePassword);
router.post('/adduser', onSignUp);
router.get('/getusercontent', getUserContent);
router.post('/addsubscribe', addSubscribe);

router.post('/addmaster', upload.single('master'), addMaster);
router.post('/updatemaster', upload.single('master'), updateMaster);
router.get('/getchannel', getChannelList);
router.post('/loginbyid', onLoginById);
router.post('/loginbysns', onLoginBySns);
router.post('/logout', onLogout);
router.get('/auth', getUserToken);
router.get('/users', getUsers);
router.post('/additem', upload.single('content'), addItem);
router.post('/updateitem', upload.single('content'), updateItem);
router.post('/addnotice', addNotice);
router.post('/updatenotice', updateNotice);
router.post('/addalarm', addAlarm);
router.post('/updatealarm', updateAlarm);
router.post('/addmustread', addMustRead);
router.post('/updatemustread', updateMustRead);
router.post('/addimage', upload.single('note'), addNoteImage);
router.post('/deleteitem', deleteItem);
router.post('/resign', onResign);
router.post('/updateuser', updateUser);
router.post('/getmastercontents', getMasterContents);
router.get('/getmastercontent', getMasterContent);
router.post('/updatemastercontent', upload.single('master'), updateMasterContent);
router.post('/addsubscribecontent', upload.fields([{ name: 'major_bussiness_img' }, { name: 'capital_change_img' }, { name: 'investment_indicator_img' }]), addSubscribeContent);
router.post('/updatesubscribecontent', upload.fields([{ name: 'major_bussiness_img' }, { name: 'capital_change_img' }, { name: 'investment_indicator_img' }]), updateSubscribeContent);
router.get('/items', getItems);
router.get('/item', getItem);
router.post('/updatesetting', upload.single('master'), updateSetting);
router.post('/editmaincontent', upload.fields([{ name: 'main' }, { name: 'recommendation_banner' }, { name: 'banner' }, { name: 'yield_banner' }]), editMainContent);
router.get('/getmaincontent', getMainContent);
router.get('/setting', getSetting);
router.post('/updatestatus', updateStatus);
router.get('/video/:pk', getVideo);
router.post('/onthetopitem', onTheTopItem);
router.post('/changeitemsequence', changeItemSequence);

module.exports = router;