import React from 'react'

const EditRow = ({task, editFormData, saveEdit, handleEditCancel, handleSave, handleCheckbox, isChecked}) =>{
    return(
            <tr> 
                <td>
                    <input type="text" name="name" placeholder="Name" onChange={saveEdit} value={editFormData.name}/>
                </td>
                <td>
                    <input type="text" name="points" placeholder="Points" onChange={saveEdit} value={editFormData.points}/>
                </td>
                <td>
                    <input type="text" name="time" placeholder="Time" onChange={saveEdit} value={editFormData.time}/>
                </td>
                <td><input className="form-check-input" type="checkbox" value={isChecked} id="checkbox" onChange={handleCheckbox}/></td>
                <td>
                    <button className="btn btn-primary" type="submit" onClick={(e) => handleSave(e, task)}>Save</button>
                    <button className="btn btn-danger" onClick={handleEditCancel} type="cancel">Cancel</button>
                </td>
            </tr>
    );
};

export default EditRow;