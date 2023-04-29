import React from 'react'


const ReadRow = ({task , doEdit, doDelete, handleCheckbox, isChecked}) => {
    return(
        <tr>
            <td>{task.name}</td>
            <td>{task.points}</td>
            <td>{task.time}</td>
            <td><input className="form-check-input" type="checkbox" value={isChecked} id="checkbox" onChange={(e) =>handleCheckbox(e, task)}/></td>
            <td>
                <button className="btn btn-primary" onClick={(e)=> doEdit(e, task, task._id)}>Edit</button>
                <button className="btn btn-danger" type="submit" onClick={(e) => doDelete(task._id, task.date, e)}>Delete</button>
            </td>
        </tr>
    );
};

export default ReadRow;
