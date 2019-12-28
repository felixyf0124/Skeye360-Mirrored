import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import CallMadeIcon from '@material-ui/icons/CallMade';
import { Link } from 'react-router-dom';



const useStyles = makeStyles(theme => ({
    addButton: {
        backgroundColor: '#04A777',
        marginTop: '1rem',
    },
    plusIcon: {
        color: '#FFFFFF'
    },
    content: {
        alignItems: 'flex-end',
        display: 'flex',
        flexDirection: 'column',
        paddingLeft: '1rem',
        paddingTop: '5rem',
    }, 
    table: {
        minWidth: 650,
    },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: theme.spacing(0,1),
        ...theme.mixins.toolbar,
    }
}));

function createData(intersectionName: any, district: any, trafficIntensity: any, simulatorLink: any, editIntersection: any, deleteIntersection: any){
    return {intersectionName, district, trafficIntensity, simulatorLink, editIntersection, deleteIntersection};
}

//TODO: Insert the ACTUAL data!
const rows = [ 
    createData('St-Cath/Guy', 'downtown', 'high', 'simulator link', 'edit', 'delete')
]

export default function IntersectionList() {
    const classes = useStyles();

    return (
        <main className={classes.content}>
            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="intersection table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Intersection Name</TableCell>
                            <TableCell>District</TableCell>
                            <TableCell>Traffic Intensity</TableCell>
                            <TableCell>Simulator Link</TableCell>
                            <TableCell>Edit</TableCell>
                            <TableCell>Delete</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map(row =>(
                            <TableRow key={row.intersectionName}>
                                <TableCell component="th" scope="row">
                                    {row.intersectionName}
                                </TableCell>
                                <TableCell>
                                    {row.district}
                                </TableCell>
                                <TableCell>
                                    {row.trafficIntensity}
                                </TableCell>
                                <TableCell>
                                    <CallMadeIcon />
                                </TableCell>
                                <TableCell>
                                    <EditIcon />
                                </TableCell>
                                <TableCell>
                                   <DeleteIcon />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Link to="/intersection/add">
                <Fab className={classes.addButton} aria-label="add">
                    <AddIcon className={classes.plusIcon} />
                </Fab>
            </Link>
        </main>
    )
}