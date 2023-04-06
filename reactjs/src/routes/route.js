import Home from '../pages/User/Home';
import HowToUse from '../pages/User/HowToUse';
import MasterList from '../pages/User/MasterList';
import MasterEvent from '../pages/User/MasterEvent';
import Yield from '../pages/User/Yield';
import SubscriptionOnly from '../pages/User/SubscriptionOnly';

import Search from '../pages/User/Search';
import SelectIssueCategory from '../pages/User/SelectIssueCategory';
import SelectFeatureCategory from '../pages/User/SelectFeatureCategory';
import ThemeList from '../pages/User/ThemeList';
import VideoList from '../pages/User/VideoList';

import Login from '../pages/User/Auth/Login';
import MyPage from '../pages/User/Auth/MyPage';
import EditMyInfo from '../pages/User/Auth/EditMyInfo';
import FindMyInfo from '../pages/User/Auth/FindMyInfo';
import SignUp from '../pages/User/Auth/SignUp';
import Resign from '../pages/User/Auth/Resign';
import KakaoRedirectHandler from '../pages/User/Auth/KakaoRedirectHandler';

import OneEventList from '../pages/User/OneEvent/OneEventList';
import OneWordList from '../pages/User/OneWord/OneWordList';
import NoticeList from '../pages/User/Notice/NoticeList';
import IssueList from '../pages/User/Issues/IssueList';
import FeatureList from '../pages/User/Feature/FeatureList';
import Master from '../pages/User/Master/Master';

import Post from '../pages/User/Posts/Post';
import Video from '../pages/User/Posts/Video';
import AppSetting from '../pages/User/AppSetting';

import Policy from '../pages/User/Policy/Policy';

import MLogin from '../pages/Manager/MLogin';
import MUserEdit from '../pages/Manager/MUserEdit';
import MMasterEdit from '../pages/Manager/MMasterEdit';
import MMasterEventEdit from '../pages/Manager/MMasterEventEdit';
import MMasterSubscribeEdit from '../pages/Manager/MMasterSubscribeEdit';
import MMasterYieldEdit from '../pages/Manager/MMasterYieldEdit';
import MIssueCategoryEdit from '../pages/Manager/MIssueCategoryEdit';
import MFeatureCategoryEdit from '../pages/Manager/MFeatureCategoryEdit';
import MVideoEdit from '../pages/Manager/MVideoEdit';
import MNoticeEdit from '../pages/Manager/MNoticeEdit';
import MMustReadEdit from '../pages/Manager/MMustReadEdit';
import MSettingEdit from '../pages/Manager/MSettingEdit';

import MItemEdit from '../pages/Manager/MItemEdit';
import MItemList from '../pages/Manager/MItemList';
import MChannelEdit from '../pages/Manager/MChannelEdit';
import Notice from '../pages/User/Notice/Notice';
import MMainEdit from '../pages/Manager/MMainEdit';
import MUserStatistic from '../pages/Manager/MUserStatistic';
import MAlarmEdit from '../pages/Manager/MAlarmEdit';

const zUserRoute = [
    { link: '/', element: <Home />, title: "홈" },
    { link: '/home', element: <Home />, title: "홈" },
    { link: '/howtouse', element: <HowToUse />, title: "필독!활용법" },
    { link: '/masterevent', element: <MasterEvent />, title: "대가종목" },
    { link: '/yield', element: <Yield />, title: "수익률" },
    { link: '/subscriptiononly', element: <SubscriptionOnly />, title: "구독전용" },
    //{ link: '/search', element: <Search />, title: "검색" },
    //{ link: '/selectissuecategory', element: <SelectIssueCategory />, title:"" },
    //{ link: '/selectfeaturecategory', element: <SelectFeatureCategory/>, title:"" },
    { link: '/masterlist', element: <MasterList />, title: "대가프로필" },
    //{ link: '/themelist', element: <ThemeList />, title:"" },
    //{ link: '/videolist', element: <VideoList />, title:"" },
    //{ link: '/issuelist/:pk', element: <IssueList />, title:"" },
    //{ link: '/featurelist/:pk', element: <FeatureList />, title:"" },
    // { link: '/onewordlist', element: <OneWordList />, title:"" },
    // { link: '/oneeventlist', element: <OneEventList />, title:"" },
    { link: '/noticelist', element: <NoticeList />, title: "공지사항" },
    { link: '/master/:pk', element: <Master />, title: "" },
    { link: '/appsetting', element: <AppSetting />, title: "앱 세팅" },

    { link: '/policy/:pk', element: <Policy />, title: "" },

    { link: '/login', element: <Login />, title: "로그인" },
    { link: '/mypage', element: <MyPage />, title: "마이페이지" },
    { link: '/editmyinfo', element: <EditMyInfo />, title: "회원정보수정" },
    { link: '/findmyinfo', element: <FindMyInfo />, title: "아이디/비밀번호 찾기" },
    { link: '/signup', element: <SignUp />, title: "회원가입" },
    { link: '/resign', element: <Resign />, title: "회원탈퇴" },
    { link: '/oauth/callback/kakao', element: <KakaoRedirectHandler />, title: "" },

    { link: '/post/notice/:pk', element: <Notice />, title: "" },
    { link: '/post/:table/:pk', element: <Post />, title: "" },
]
const zManagerRoute = [
    { link: '/manager/edit/user/:pk', element: <MUserEdit />, title: "회원관리" },
    { link: '/manager/edit/master/:pk', element: <MMasterEdit />, title: "거장관리" },
    { link: '/manager/eventedit/master/:pk', element: <MMasterEventEdit />, title: "거장관리 / 대가종목관리" },
    { link: '/manager/edit/master_subscribe/:pk', element: <MMasterSubscribeEdit />, title: "거장관리 / 구독전용관리" },
    { link: '/manager/yieldedit/master/:pk', element: <MMasterYieldEdit />, title: "수익률관리" },
    { link: '/manager/statistic/user', element: <MUserStatistic />, title: "회원통계" },

    // { link: '/manager/edit/channel/:pk', element: <MChannelEdit />, title:"" },
    // { link: '/manager/setting', element: <MSetting />, title:"" },
    //{ link: '/manager/edit/video/:pk', element: <MVideoEdit />, title:"" },
    { link: '/manager/edit/notice/:pk', element: <MNoticeEdit />, title: "공지사항" },
    { link: '/manager/edit/alarm/:pk', element: <MAlarmEdit />, title: "알람" },
    { link: '/manager/edit/must_read/:pk', element: <MMustReadEdit />, title: "필독사항" },
    //{ link: '/manager/edit/issue_category/:pk', element: <MIssueCategoryEdit />, title:"" },
    // { link: '/manager/edit/feature_category/:pk', element: <MFeatureCategoryEdit />, title:"" },
    { link: '/manager/edit/setting/:category', element: <MSettingEdit />, title: "환경설정" },
    { link: '/manager/edit/main/:category', element: <MMainEdit />, title: "메인관리" },
    { link: '/manager/edit/:table/:pk', element: <MItemEdit />, title: "관리자" },
    { link: '/manager/list/:table/:pk', element: <MItemList />, title: "관리자" },
    { link: '/manager/list/:table', element: <MItemList />, title: "관리자" },
]
export { zUserRoute, zManagerRoute };