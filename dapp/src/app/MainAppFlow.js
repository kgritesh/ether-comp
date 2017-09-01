import React from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import glamorous, { ThemeProvider } from 'glamorous';


import { AppRoutes } from '../constants/routes';
import Home from './Home';
import Accounts from './Accounts';

import { Container } from '../common/components/index';
import NavHeader from '../app/NavHeader';
import Sidebar from '../app/Sidebar';
import * as actions from './actions';
import * as themes from '../common/theme';


const Content = glamorous.div({
  margin: '90px 15px 15px 15px',
  padding: 10,
  backgroundColor: 'white',
  borderRadius: '1px',
  display: 'flex',
  flex: 1,
  flexDirection: 'column'
}, (props) => ({
  marginLeft: props.sidebarOpened ? '270px' : '15px'
}));

function _MainAppFlow({ toggleSidebar, sidebarOpened }) {
  return (
    <ThemeProvider theme={themes.mainAppTheme}>
      <Container >
        <NavHeader toggleSidebar={toggleSidebar} />
        <Sidebar sidebarOpened={sidebarOpened} />
        <Content sidebarOpened={sidebarOpened}>
          <Route path={AppRoutes.home} exact component={Home} />
          <Route path={AppRoutes.emailAccounts} exact component={Accounts} />
        </Content>
      </Container>
    </ThemeProvider>
  );
}

_MainAppFlow.propTypes = {
  toggleSidebar: PropTypes.func.isRequired,
  sidebarOpened: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  sidebarOpened: state.layout.get('sidebarOpened')
});

const mapDispatchToProps = dispatch => ({
  toggleSidebar: () => dispatch(actions.toggleSidebar())
});

const MainAppFlow = connect(mapStateToProps, mapDispatchToProps)(_MainAppFlow);
export default MainAppFlow;
