import React from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import DirectionsWalkIcon from '@material-ui/icons/DirectionsWalk';
import TrackChangesIcon from '@material-ui/icons/TrackChanges';
import { SKEYE_WHITE, SKEYE_GREY, SKEYE_LIGHT_DARK_GREY, SKEYE_RED, SKEYE_LIGHT_BLACK } from '../../css/custom';
import Button from '@material-ui/core/Button';

const width = 10;
const height = 50



const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      "&$selected": {
        backgroundColor: SKEYE_LIGHT_DARK_GREY,
      },
    },
    sidebar: {
      backgroundColor: SKEYE_LIGHT_BLACK,
      width: `${width}vw`,
    },
    content: {
      textAlign: 'left',
      marginLeft: 10,
      marginTop: 10,
      paddingTop: 8,
    },
    titleBox: {
      backgroundColor: SKEYE_GREY,
      marginRight: 10, 
      marginTop: 10,
      marginBottom: 10,
      paddingTop: 2,
      paddingBottom: 2,
    },
    dividerWhite: {
      backgroundColor: SKEYE_WHITE,
      marginRight: 10,
      marginTop: 10,
      marginBottom: 10,
    },
    dividerGrey: {
      backgroundColor: SKEYE_GREY,
      marginRight: 10,
      marginTop: 8,
      marginBottom: 8,
    },
    listItem: {
      marginTop: -8,
      marginBottom: -8
    },
    selected: {
    },

  }),
);

const skeyeStyles = {
    listItemStyle: {
      color: SKEYE_WHITE,
      fontSize: '0.1em',
    },
    iconStyle: {
      color: SKEYE_WHITE,
    },
    title: {
      color: SKEYE_WHITE,
      fontSize: 16,
      marginLeft: 4,
    },
    header: {
      color: SKEYE_GREY,
      fontSize: 15,
    },
    offlineButton: {
      backgroundColor: SKEYE_LIGHT_DARK_GREY,
      color: SKEYE_WHITE,
      marginTop: 8,
      marginBottom: 8,
      marginLeft: 8,
      marginRight: 8,
      width: `${width - 2}vw`,
    },
    emergencyButton: {
      backgroundColor: SKEYE_LIGHT_DARK_GREY,
      color: SKEYE_RED,
      marginTop: 8,
      marginBottom: 8,
      marginLeft: 8,
      marginRight: 8,
      width: `${width - 2}vw`,
    }
}

export default function SidebarComponent() {
  const classes = useStyles();
  const [selectedIndex, setSelectedIndex] = React.useState(1);

  const onClickListItem = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number,
  ) => {
    setSelectedIndex(index);
  };

  return (
    <div className={classes.sidebar}>
      <div className={classes.content}>
        <div className={classes.titleBox}>
          <text style={ skeyeStyles.title }> Options for Simulator</text>
        </div>
        <text style={ skeyeStyles.header }> Modes </text>
        <Divider classes={{root: classes.dividerGrey}} />
        <List>
          {/* {['Arima', 'Pedestrians', 'Real-Time'].map((text, index) => (
            <ListItem button key={text} classes={{ root: classes.listItem }}> //selected={selectedIndex === 0} onClick={event => onClickListItem(event, 0)}>
              <ListItemIcon style={ skeyeStyles.iconStyle } >{index === 0 ? <TrendingUpIcon /> : index === 1 ? <DirectionsWalkIcon /> : <TrackChangesIcon/>}</ListItemIcon>
              <ListItemText primary={text} style={ skeyeStyles.listItemStyle } />
            </ListItem>
          ))} */}
          <ListItem button selected={selectedIndex === 0} classes={{ root: classes.root, selected: classes.selected }} onClick={event => onClickListItem(event, 0)}>
            <ListItemIcon style={ skeyeStyles.iconStyle }>
              <TrendingUpIcon />
            </ListItemIcon>
            <ListItemText style={ skeyeStyles.listItemStyle } >
              Arima
            </ListItemText>
          </ListItem>

          <ListItem button selected={selectedIndex === 1} classes={{ root: classes.root, selected: classes.selected }} onClick={event => onClickListItem(event, 1)}>
            <ListItemIcon style={ skeyeStyles.iconStyle }>
              <DirectionsWalkIcon />
            </ListItemIcon>
            <ListItemText style={ skeyeStyles.listItemStyle } >
              Pedestrians
            </ListItemText>
          </ListItem>

          <ListItem button selected={selectedIndex === 2} classes={{ root: classes.root, selected: classes.selected }} onClick={event => onClickListItem(event, 2)}>
            <ListItemIcon style={ skeyeStyles.iconStyle }>
              <TrackChangesIcon />
            </ListItemIcon>
            <ListItemText style={ skeyeStyles.listItemStyle } >
              Real-Time
            </ListItemText>
          </ListItem>
        </List>
        <Divider classes={{root: classes.dividerWhite}} />
        <text style={ skeyeStyles.header }> Traffic Light Comparison </text>
        <Divider classes={{root: classes.dividerGrey}} />

        <br />
        {/* TO DO ADD TRAFFIC LIGHT DATA HERE */}
        <br />

        <Divider classes={{root: classes.dividerWhite}} />
        <text style={ skeyeStyles.header }> Offline mode </text>
        <Divider classes={{root: classes.dividerGrey}} />

        <Button variant="contained" style={ skeyeStyles.offlineButton }>OFF</Button>

        <Divider classes={{root: classes.dividerWhite}} />
        <text style={ skeyeStyles.header }> Emergency Stop </text>
        <Divider classes={{root: classes.dividerGrey}} />
        
        <Button variant="contained" style={ skeyeStyles.emergencyButton }>STOP</Button>
      </div>
    </div>
  );
}
