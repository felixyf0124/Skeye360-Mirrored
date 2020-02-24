import React from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import DirectionsWalkIcon from '@material-ui/icons/DirectionsWalk';
import TrackChangesIcon from '@material-ui/icons/TrackChanges';
import Button from '@material-ui/core/Button';
import ReportIcon from '@material-ui/icons/Report';
import {
  SKEYE_WHITE, SKEYE_GREY, SKEYE_LIGHT_DARK_GREY, SKEYE_RED, SKEYE_LIGHT_BLACK, SKEYE_GREEN,
} from '../../css/custom';

interface SimProps {
  tlMode: number;
  onChangeTLMode: any;
  onClickTLStop: any;
  tlCombStates: Array<{
    direction: string;
    state: string;
    state2: string;
    countDown: string;
    countDown2: string;
    totalTime: string; // G+Y
    totalTime2: string; // G+Y
  }>;

}

const width = 10;

// Create styles for the sidebar
const useStyles = makeStyles(() => createStyles({
  root: {
    '&$selected': {
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
    marginBottom: -8,
  },
  selected: {
  },

  tlTable: {
    marginTop: 0,
    marginBottom: 0,
    // width: `100%`,
    display: 'block',
  },

  tlTRow: {
    margin: 'auto',
    // width: `100%`,
    display: 'table-row',
  },

}));

// Personalized styles based on our UI
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
  },

};

// Creates and returns a component for the sidebar that will be used in the simulator
const SidebarComponent = (props: SimProps | any): JSX.Element => {
  const {
    tlMode, onChangeTLMode, onClickTLStop, tlCombStates,
  } = props;
  const classes = useStyles();
  const [selectedIndex, setSelectedIndex] = React.useState(tlMode);

  // OnClick it will the variable to the selected item (Arima, Pedestrians or Real-Time)
  const onClickListItem = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number,
  ): void => {
    setSelectedIndex(index);
    onChangeTLMode(index);
  };

  const tlDiv = tlCombStates.map((
    tlCombState:
    {
      direction: string;
      state: string;
      state2: string;
      countDown: string;
      countDown2: string;
      totalTime: string; // G+Y
      totalTime2: string; // G+Y
    },
  ) => {
    const tlData = {
      color: SKEYE_WHITE,
      fontSize: '0.8em',
      margin: 'auto',
      display: 'table-cell',
    };
    const tlDataCol = {
      color: SKEYE_WHITE,
      fontSize: '0.8em',
      margin: 'auto',
      display: 'table-cell',
    };
    const tlDataCol2 = {
      color: SKEYE_WHITE,
      fontSize: '0.8em',
      margin: 'auto',
      display: 'table-cell',
    };

    if (tlCombState.state === 'red') {
      tlDataCol.color = '#FF0000';
    } else if (tlCombState.state === 'green') {
      tlDataCol.color = '#00FF00';
    } else if (tlCombState.state === 'yellow') {
      tlDataCol.color = '#f5c842';
    }

    if (tlCombState.state2 === 'red') {
      tlDataCol2.color = '#FF0000';
    } else if (tlCombState.state2 === 'green') {
      tlDataCol2.color = '#00FF00';
    } else if (tlCombState.state2 === 'yellow') {
      tlDataCol2.color = '#f5c842';
    }
    return (
      <div key={tlCombState.direction} style={{ display: 'table-row-group' }}>
        <tr className={classes.tlTRow}>
          <td style={tlData}>Direction</td>
          <td style={tlData} colSpan={3}>{tlCombState.direction}</td>
        </tr>
        <tr className={classes.tlTRow} style={{ textAlign: 'center' }}>
          <td style={tlData}>Type</td>
          <td style={tlData}>{' State '}</td>
          <td style={tlData}>{' CD '}</td>
          <td style={tlData}>t(G+Y)</td>
        </tr>
        <tr className={classes.tlTRow} style={{ textAlign: 'center' }}>
          <td style={tlData}>non-smart</td>
          <td style={tlDataCol}>{tlCombState.state}</td>
          <td style={tlDataCol}>{tlCombState.countDown}</td>
          <td style={tlData}>{tlCombState.totalTime}</td>
        </tr>
        <tr className={classes.tlTRow} style={{ textAlign: 'center' }}>
          <td style={tlData}>smart</td>
          <td style={tlDataCol2}>{tlCombState.state2}</td>
          <td style={tlDataCol2}>{tlCombState.countDown2}</td>
          <td style={tlData}>{tlCombState.totalTime2}</td>
        </tr>

      </div>
    );
  });

  // Returns the UI for the sidebar
  return (
    <div className={classes.sidebar}>
      <div className={classes.content}>
        <div className={classes.titleBox}>
          <text style={skeyeStyles.Title}> Options for Simulator</text>
        </div>
        <text style={skeyeStyles.Header}> Modes </text>
        <Divider classes={{ root: classes.dividerGrey }} />
        <List>
          <ListItem
            button
            selected={selectedIndex === 0}
            classes={{ root: classes.root, selected: classes.selected }}
            onClick={(event): void => onClickListItem(event, 0)}
          >
            <ListItemIcon style={skeyeStyles.IconStyle}>
              <TrendingUpIcon />
            </ListItemIcon>
            <ListItemText style={skeyeStyles.ListItemStyle}>
              Arima
            </ListItemText>
          </ListItem>

          <ListItem
            button
            selected={selectedIndex === 1}
            classes={{ root: classes.root, selected: classes.selected }}
            onClick={(event): void => onClickListItem(event, 1)}
          >
            <ListItemIcon style={skeyeStyles.IconStyle}>
              <DirectionsWalkIcon />
            </ListItemIcon>
            <ListItemText style={skeyeStyles.ListItemStyle}>
              Pedestrians
            </ListItemText>
          </ListItem>

          <ListItem
            button
            selected={selectedIndex === 2}
            classes={{ root: classes.root, selected: classes.selected }}
            onClick={(event): void => onClickListItem(event, 2)}
          >
            <ListItemIcon style={skeyeStyles.IconStyle}>
              <TrackChangesIcon />
            </ListItemIcon>
            <ListItemText style={skeyeStyles.ListItemStyle}>
              Real-Time
            </ListItemText>
          </ListItem>
        </List>
        <Divider classes={{ root: classes.dividerWhite }} />
        <text style={skeyeStyles.Header}> Traffic Light Comparison </text>
        <Divider classes={{ root: classes.dividerGrey }} />

        <br />
        {/* TO DO ADD TRAFFIC LIGHT DATA HERE */}
        <table style={{ display: 'block' }}>
          <tbody className={classes.tlTable}>
            {tlDiv}
          </tbody>
        </table>

        <br />

        <Divider classes={{ root: classes.dividerWhite }} />
        <text style={skeyeStyles.Header}> Simulator </text>
        <Divider classes={{ root: classes.dividerGrey }} />

        <Button variant="contained" style={skeyeStyles.OfflineButton}>ON</Button>

        <Divider classes={{ root: classes.dividerWhite }} />
        <text style={skeyeStyles.Header}> Stop all traffic lights </text>
        <Divider classes={{ root: classes.dividerGrey }} />

        <Button
          variant="contained"
          style={skeyeStyles.EmergencyButton}
          onClick={onClickTLStop}
        >
          {' '}
          <ReportIcon style={skeyeStyles.StopIcon} />
          {' '}
          STOP
        </Button>
      </div>
    </div>
  );
};

export default SidebarComponent;
