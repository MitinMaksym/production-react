import { FC, memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { selectIsUserAdmin, selectIsUserManager, selectUserAuthData, userActions } from '@/entities/User';
import { ARTICLES_FILTERS, USER_DATA_KEY } from '@/shared/const/localstorage';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch/useAppDispatch';
import { RoutePath } from '@/shared/const/router';
import { PopupDirection } from '@/shared/ui/popups/styles/popup';
import { Menu } from '@/shared/ui/popups';
import { Avatar } from '@/shared/ui/Avatar';

interface AvatarDropdownProps {
   className?: string;
   direction?: PopupDirection
   disabled?: boolean
}

export const AvatarDropdown: FC<AvatarDropdownProps> = memo((props) => {
    const { className, direction, disabled } = props;
    const dispatch = useAppDispatch();
    const { t } = useTranslation();
    const isAdmin = useSelector(selectIsUserAdmin);
    const isManager = useSelector(selectIsUserManager);
    const adminPanelAvailable = isAdmin || isManager;
    const userData = useSelector(selectUserAuthData);


    const handleLogout = useCallback(() => {
        dispatch(userActions.logout());
        localStorage.removeItem(USER_DATA_KEY);
        localStorage.removeItem(ARTICLES_FILTERS);
    }, [dispatch]);

    if(!userData) return null;

    return (
        <Menu
            trigger={<Avatar src={userData?.avatar} size={30} />}
            className={className}
            direction={direction}
            inactive={disabled}
            items={[
                ...[
                    ...(adminPanelAvailable
                        ? [
                            {
                                content: t('admin-panel'),
                                href: RoutePath.admin,
                            },
                        ]
                        : []),
                ],
                {
                    content: t('create-article'),
                    href: RoutePath.article_create,
                },
                {
                    content: t('logout'),
                    onClick: handleLogout,
                },
            ]}
        />
    );
});