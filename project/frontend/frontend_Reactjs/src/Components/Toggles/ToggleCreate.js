import React, {Component} from 'react'
import './Toggle.css'

class ToggleCreate extends Component {

    render(){
        return (
            <div>
                <form className='new_toggle_form'>
                <table className='container'>
                    <tbody >
                           <tr className="container row w-auto m-auto text-center">
                               <th><label>Toggle Name</label></th>
                               <td><input type='text' size='20'/></td>
                               <td><input type="submit" className="btn btn-sm btn-info" value= "Add" /></td>
                           </tr>

                    </tbody>
                </table>
                </form>
            </div>
        );
    }
}

export default ToggleCreate;