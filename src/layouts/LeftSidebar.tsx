import { useEffect, useRef, useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

// helpers
import { getMenuItems } from '../helpers/menu';

// components
import Scrollbar from '../components/Scrollbar';

import AppMenu from './Menu';

// images
import profileImg from '../assets/images/users/user-1.jpg';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store'; // Adjust path based on your structure
import RegisterAdminUserModal from '../pages/SubAdminUsers/RegisterAdminUserModal';

/* user box */
const UserBox = () => {
    // Inside UserBox component
    // const user = useSelector((state) => state.Auth?.user);
    const user = useSelector((state: RootState) => state.Auth?.user);
    // get the profilemenu
    const ProfileMenus = [
        {
            label: 'My Account',
            icon: 'fe-user',
            redirectTo: '/apps/contacts/profile',
        },
        {
            label: 'Settings',
            icon: 'fe-settings',
            redirectTo: '#',
        },
        {
            label: 'Lock Screen',
            icon: 'fe-lock',
            redirectTo: '/auth/lock-screen',
        },
        {
            label: 'Logout',
            icon: 'fe-log-out',
            redirectTo: '/auth/logout',
        },
    ];

    const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);

    /*
     * toggle dropdown
     */
    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    return (
        <div className="user-box text-center">
            <img src={profileImg} alt="" title="Mat Helme" className="rounded-circle img-thumbnail avatar-md" />
            <Dropdown show={dropdownOpen} onToggle={toggleDropdown}>
                <Dropdown.Toggle
                    id="dropdown-notification"
                    to="#"
                    as={Link}
                    onClick={toggleDropdown}
                    className="user-name h5 mt-2 mb-1 d-block">
                    {`${user?.first_name || ''} ${user?.last_name || ''}`.trim() || 'John Wick'}
                </Dropdown.Toggle>
                <Dropdown.Menu className="user-pro-dropdown">
                    <div onClick={toggleDropdown}>
                        {(ProfileMenus || []).map((item, index) => {
                            return (
                                <Link
                                    to={item.redirectTo}
                                    className="dropdown-item notify-item"
                                    key={index + '-profile-menu'}>
                                    <i className={classNames(item.icon, 'me-1')}></i>
                                    <span>{item.label}</span>
                                </Link>
                            );
                        })}
                    </div>
                </Dropdown.Menu>
            </Dropdown>
            <p className="text-muted left-user-info">Admin Head</p>

            <ul className="list-inline">
                <li className="list-inline-item">
                    <Link to="#" className="text-muted left-user-info">
                        {/* <i className="mdi mdi-cog"></i> */}
                    </Link>
                </li>

                <li className="list-inline-item">
                    <Link to="#">{/* <i className="mdi mdi-power"></i> */}</Link>
                </li>
            </ul>
        </div>
    );
};

const SideBarContent = () => {
    const permissionsObj = useSelector((state: RootState) => state.Auth?.user?.data?.permissions || {});
    console.log('permissionsObj>>>>', permissionsObj); // ✅ Should log { Interest: ["read", ...] }
    const permissionsObjValid = useSelector((state: RootState) => state.Auth || {});
    console.log('permissionsObjValid>>>>>>', permissionsObjValid);

    const moduleNames = Object.keys(permissionsObj);
    const isPermissionsLoaded = moduleNames.length > 0;

    const allMenuItems = getMenuItems();
    const filteredMenuItems = allMenuItems.filter((item) => {
        if (!item.moduleName) return true;
        return moduleNames.includes(item.moduleName);
    });

    if (!isPermissionsLoaded) return null;

    return (
        <>
            <UserBox />
            <div id="sidebar-menu">
                <AppMenu menuItems={filteredMenuItems} />
            </div>
            <div className="clearfix" />
        </>
    );
};

type LeftSidebarProps = {
    isCondensed: boolean;
};

const LeftSidebar = ({ isCondensed }: LeftSidebarProps) => {
    const menuNodeRef: any = useRef(null);

    /**
     * Handle the click anywhere in doc
     */
    const handleOtherClick = (e: any) => {
        if (menuNodeRef && menuNodeRef.current && menuNodeRef.current.contains(e.target)) return;
        // else hide the menubar
        if (document.body) {
            document.body.classList.remove('sidebar-enable');
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleOtherClick, false);

        return () => {
            document.removeEventListener('mousedown', handleOtherClick, false);
        };
    }, []);

    return (
        <div className="left-side-menu" ref={menuNodeRef}>
            {!isCondensed && (
                <Scrollbar style={{ maxHeight: '100%' }}>
                    <SideBarContent />
                </Scrollbar>
            )}
            {isCondensed && <SideBarContent />}
        </div>
    );
};

LeftSidebar.defaultProps = {
    isCondensed: false,
};

export default LeftSidebar;
