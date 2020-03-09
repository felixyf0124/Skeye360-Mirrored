/* eslint-disable @typescript-eslint/camelcase */
import AppBar from '@material-ui/core/AppBar';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import clsx from 'clsx';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import HomeIcon from '@material-ui/icons/Home';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MapIcon from '@material-ui/icons/Map';
import MenuIcon from '@material-ui/icons/Menu';
import PersonIcon from '@material-ui/icons/Person';
import React from 'react';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import styled from 'styled-components';
import { RootState } from '../reducers/rootReducer';
import { logout, authenticated } from '../contexts/authentication';
import { logClick } from '../contexts/LogClicks';
import Weather from './Weather';

/*
  Template for Material-UI Drawer found at:
  https://material-ui.com/components/drawers/
*/
interface StateProps {
  authenticated: boolean;
  user_id: number;
  username: string;
  log_message: string;
}

interface HeaderProps {
  headerTitle: string;
}
interface DispatchProps {
  logout: () => any;
  handleMapButton: () => void;
  logClick: (log_message: string, user_id: number) => any;
}

const handleMapButton = (): JSX.Element => <Redirect push to="/" />;

const drawerWidth = 185;

const date = new Date().toLocaleDateString();
// CSS for the drawer and header
// Uses useStyles and makeStyles which is integrated in material-UI
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    backgroundColor: '#04A777',
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  hide: {
    display: 'none',
  },
  drawer: {
    flexShrink: 0,
    whiteSpace: 'nowrap',
    width: drawerWidth,
  },
  drawerOpen: {
    backgroundColor: '#212121',
    color: '#FFFFFF',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    backgroundColor: '#212121',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) + 1,
    },
  },
  toolbar: {
    ...theme.mixins.toolbar,
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  listItem: {
    color: '#FFFFFF',
    textDecoration: 'none!important',
  },
  iconStyle: {
    color: '#FFFFFF',
  },
  smallIcon: {
    height: '1.2rem',
    width: '1.2rem',
    color: '#FFFFFF',
    paddingBottom: '0.2rem'
  },
  whiteStyle: {
    position: 'absolute',
    color: '#FFFFFF',
  },
}));

const Logo = styled.img`
  height: 5rem;
  width: 5rem;
  position: relative;
`;

const SideDrawer = (props: StateProps & DispatchProps & HeaderProps): JSX.Element => {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = (): any => {
    setOpen(true);
  };

  const handleDrawerClose = (): any => {
    setOpen(false);
  };

  const {
    user_id, logout, headerTitle, username,
  } = props;

  const handleLogout = (): void => {
    const { logClick } = props;
    logClick('Logged out', user_id);
    logout();
  };

  return (
    <div>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, {
              [classes.hide]: open,
            })}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            {headerTitle}
          </Typography>
          <Weather />
          <p className={classes.whiteStyle} style={{ right: 225 }}>
            Hi,
            {username}
            !
          </p>
          <a className={classes.whiteStyle} style={{ right: 145, paddingTop: 1.3 }} href="/">
            <PersonIcon className={classes.smallIcon} />
            Profile
          </a>
          <a className={classes.whiteStyle} style={{ right: 85 }} href="/" onClick={handleLogout}>Logout</a>
          <p className={classes.whiteStyle} style={{ right: 10 }}>
            {' '}
            {date}
            {' '}
          </p>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          }),
        }}
      >
        <div className={classes.toolbar} style={{ justifyContent: 'space-between' }}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? (
              <ChevronRightIcon className={classes.iconStyle} />
            ) : (
              <ChevronLeftIcon className={classes.iconStyle} />
            )}
          </IconButton>
        </div>
        <Divider />

        <List>
          <Link to="/">
            <ListItem button key="Home">
              <ListItemIcon>
                <HomeIcon className={classes.iconStyle} />
              </ListItemIcon>
              <ListItemText className={classes.listItem} primary="Home" />
            </ListItem>
          </Link>
          <Link to="/map">
            <ListItem button key="View Map">
              <ListItemIcon>
                <MapIcon className={classes.iconStyle} />
              </ListItemIcon>
              <ListItemText className={classes.listItem} primary="View Map" />
            </ListItem>
          </Link>
        </List>
        <Divider />
      </Drawer>
    </div>
  );
};

const mapStateToProps = (state: RootState): StateProps => ({
  ...state,
  authenticated: authenticated(state),
  user_id: state.authentication.user_id,
  username: state.authentication.username,
  log_message: '',
});

const mapDispatchToProps: DispatchProps = {
  logout,
  handleMapButton: () => handleMapButton(),
  logClick,
};

export default connect(mapStateToProps, mapDispatchToProps)(SideDrawer);
