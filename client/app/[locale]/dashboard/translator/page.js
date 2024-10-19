'use client';
import React, { useContext } from 'react';
import styles from './Translator.module.css';
import SideMenu from '@/components/SideMenu/SideMenu';
import { sideMenuContext } from '@/context/SideMenuContext';
import TranslatorPanel from '@/components/Panels/TranslatorPanel/TranslatorPanel';
import WindowIcon from '@mui/icons-material/Window';
import PostsManagement from '@/components/BlogsManagement/PostsManagement';
import TranslateIcon from '@mui/icons-material/Translate';
import ArticleIcon from '@mui/icons-material/Article';
import BottomSpeedDial from '@/components/SpeedDial/SpeedDial';
import UnTranslatedPosts from '@/components/UnTranslatedPosts/UnTranslatedPosts';
import AutoFixHighSharpIcon from '@mui/icons-material/AutoFixHighSharp';
import TranslateEditor from '@/components/TranslateEditor/TranslateEditor';
import MyTranslations from '@/components/MyTranslations/MyTranslations';

const Page = () => {
    const { isSelected } = useContext(sideMenuContext);

    const renderSelectedPanel = () => {
        switch (isSelected) {
            case 0:
                return <TranslatorPanel />;
            case 1:
                return <MyTranslations heading={'My Translations'} />;
            case 2:
                return <UnTranslatedPosts heading={'Untranslated posts'} />;
            case 3:
                return <TranslateEditor />;
            default:
                return null;
        }
    };

    const actions = [
        { icon: <TranslateIcon />, name: 'New Translation' },
    ];

    const menuList = [
        { text: "Panel", icon: <WindowIcon />, code: 0 },
        { text: "My Translations", icon: <TranslateIcon />, code: 1 },
        { text: "Untranslated Posts", icon: <ArticleIcon />, code: 2 },
        { text: "Translate", icon: <AutoFixHighSharpIcon />, code: 3 },
    ];

    return (
        <main>
            <SideMenu heading={`Management - Welcome`} menuList={menuList}>
                {renderSelectedPanel()}
                <BottomSpeedDial actions={actions} />
            </SideMenu>
        </main>
    );
};

export default Page;
