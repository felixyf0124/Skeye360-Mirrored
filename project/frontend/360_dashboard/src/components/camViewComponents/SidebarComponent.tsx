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
import ReportIcon from '@material-ui/icons/Report';

interface SimProps {
  tlMode:number;
  onChangeTLMode: any;
}

const width = 10;

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
    ListItemStyle: {
      color: SKEYE_WHITE,
      fontSize: '0.1em',
    },
    IconStyle: {
      color: SKEYE_WHITE,
    },
    Title: {
      color: SKEYE_WHITE,
      fontSize: 16,
      marginLeft: 4,
    },
    Header: {
      color: SKEYE_GREY,
      fontSize: 15,
    },
    OfflineButton: {
      backgroundColor: SKEYE_LIGHT_DARK_GREY,
      color: SKEYE_WHITE,
      marginTop: 8,
      marginBottom: 8,
      marginLeft: 8,
      marginRight: 8,
      width: `${width - 2}vw`,
    },
    EmergencyButton: {
      backgroundColor: SKEYE_LIGHT_DARK_GREY,
      color: SKEYE_RED,
      marginTop: 8,
      marginBottom: 8,
      marginLeft: 8,
      width: `${width - 2}vw`,
    },
    StopIcon: {
      marginRight: 10,
    }
}

const SidebarComponent = (props: SimProps | any): JSX.Element =>  {
  const {onChangeTLMode} = props;
  const classes = useStyles(); 
  const [selectedIndex, setSelectedIndex] = React.useState(props.tlMode);

  const onClickListItem = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number,
  ) => {
    setSelectedIndex(index);
    onChangeTLMode(index);
  };

  return (
    <div className={classes.sidebar}>
      <div className={classes.content}>
        <div className={classes.titleBox}>
          <text style={ skeyeStyles.Title }> Options for Simulator</text>
        </div>
  <text style={ skeyeStyles.Header }> Modes </text>
        <Divider classes={{root: classes.dividerGrey}} />
        <List>
          <ListItem button selected={selectedIndex === 0} classes={{ root: classes.root, selected: classes.selected }} onClick={event => onClickListItem(event, 0)}>
            <ListItemIcon style={ skeyeStyles.IconStyle }>
              <TrendingUpIcon />
            </ListItemIcon>
            <ListItemText style={ skeyeStyles.ListItemStyle } >
              Arima
            </ListItemText>
          </ListItem>

          <ListItem button selected={selectedIndex === 1} classes={{ root: classes.root, selected: classes.selected }} onClick={event => onClickListItem(event, 1)}>
            <ListItemIcon style={ skeyeStyles.IconStyle }>
              <DirectionsWalkIcon />
            </ListItemIcon>
            <ListItemText style={ skeyeStyles.ListItemStyle } >
              Pedestrians
            </ListItemText>
          </ListItem>

          <ListItem button selected={selectedIndex === 2} classes={{ root: classes.root, selected: classes.selected }} onClick={event => onClickListItem(event, 2)}>
            <ListItemIcon style={ skeyeStyles.IconStyle }>
              <TrackChangesIcon />
            </ListItemIcon>
            <ListItemText style={ skeyeStyles.ListItemStyle } >
              Real-Time
            </ListItemText>
          </ListItem>
        </List>
        <Divider classes={{root: classes.dividerWhite}} />
        <text style={ skeyeStyles.Header }> Traffic Light Comparison </text>
        <Divider classes={{root: classes.dividerGrey}} />

        <br />
        {/* TO DO ADD TRAFFIC LIGHT DATA HERE */}
        <br />

        <Divider classes={{root: classes.dividerWhite}} />
        <text style={ skeyeStyles.Header }> Simulator </text>
        <Divider classes={{root: classes.dividerGrey}} />

        <Button variant="contained" style={ skeyeStyles.OfflineButton }>ON</Button>

        <Divider classes={{root: classes.dividerWhite}} />
        <text style={ skeyeStyles.Header }> Stop all traffic lights </text>
        <Divider classes={{root: classes.dividerGrey}} />
        
        <Button variant="contained" style={ skeyeStyles.EmergencyButton }> <ReportIcon style={ skeyeStyles.StopIcon }/> STOP</Button>
      </div>
    </div>
  );
}

export default SidebarComponent;
