import React, {Component} from 'react'
import './DashBoard.css'

class DashBoard extends Component {

    constructor(props){
        super(props);
        this.state={
            isExpended : true,

        };

        this.onClickExpend = this.onClickExpend.bind(this);
        this.onClickCollapse = this.onClickCollapse.bind(this);
    }

    onClickCollapse(){
       this.setState({isExpended:false});
    }

    onClickExpend(){
        this.setState({isExpended:true});
    }

    render(){

        let button;
        if(this.state.isExpended){
            button = (
                <th id ="dashboard_header_btn_th" className="col-1 ">
                    <button className="btn btn-info btn-block container-fluid" onClick={this.onClickCollapse}>
                        <label className="dashboard_icon">&#x2212;</label></button>
                </th>
            );
        }else {
            button = (
                <th id ="dashboard_header_btn_th" className="col-1 ">
                    <button className="btn btn-info btn-block container-fluid" onClick={this.onClickExpend}>
                        <label className="dashboard_icon">&#x2b;</label></button>
                </th>
            );
        }





        const _dashboard = (
            <div className="dashboard">
                <table className="container shadow-sm bg-white table ">
                    <tbody>
                    <tr className="row badge-info shadow-sm">
                        {button}
                        <th className="col-10">
                            {this.props.name}
                        </th>
                        <th className="col-1">

                        </th>
                    </tr>
                    <tr>
                        <td id= {this.props.name} style={{display:  this.state.isExpended ? 'block' : 'none' }}>
                            {this.props.children}
                        </td>
                    </tr>
                    </tbody>
                </table>

            </div>
        );

        return _dashboard;
    }





}

export default DashBoard;