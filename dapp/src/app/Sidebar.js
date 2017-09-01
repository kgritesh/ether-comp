import React from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import * as glamor from 'glamor';
import { NavLink } from 'react-router-dom';

import { AppRoutes } from '../constants/routes';

const SidebarContainer = glamorous.div({
  display: 'flex',
  flexDirection: 'column',
  color: '#89949B',
  backgroundColor: 'white',
  width: '250px',
  position: 'fixed',
  top: 0,
  bottom: 0,
  left: 0,
  overflow: 'hidden'
});

const SidebarTitle = glamorous.div({
  fontSize: 15,
  color: '#919da8',
  letterSpacing: '.035em',
  pointerEvents: 'none',
  cursor: 'default',
  marginLeft: 12
});

const SidebarItem = glamorous(NavLink)({
  color: '#89949B',
  padding: 10,
  margin: 20,
  display: 'block',
  ':hover': {
    textDecoration: 'none',
    color: 'white',
    background: '#273135'
  }
});

const activeItem = glamor.css({
  color: 'white',
  background: '#293135'
});

const sidebarItems = [
  {
    title: 'User Profile',
    path: AppRoutes.userProfile,
    icon: null
  },
  {
    title: 'Email Accounts',
    path: AppRoutes.emailAccounts,
    icon: null
  }
];

export default function Sidebar({ sidebarOpened, ...props }) {
  return (
    <div>
      {sidebarOpened ?
        <SidebarContainer {...props}>
          <div style={{ marginTop: 100 }}>
            <SidebarTitle>
              Main Navigatition
            </SidebarTitle>
            <div>
                {sidebarItems.map(item => (
                  <SidebarItem
                    key={item.path}
                    to={item.path}
                    activeClassName={activeItem}
                    exact
                  >
                    {item.title}
                  </SidebarItem>
                 ))
                }
            </div>
          </div>
        </SidebarContainer>
        : null}
    </div>
  );
}

Sidebar.propTypes = {
  sidebarOpened: PropTypes.bool.isRequired
};
