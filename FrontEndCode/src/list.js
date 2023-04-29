import React, { useState, Fragment, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./login.css";
import Modal from "./conponents/dateModal";
import ReadRow from "./conponents/readRow";
import EditRow from "./conponents/editRow";
import Cookies from 'js-cookie';

export const List = () => {
    const url = 'http://localhost:3001';
    // useState hooks to get value of inputs 
    const [name, setName] = useState('');
    const [points, setPoints] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [month, setMonth] = useState('');
    const [day, setDay] = useState('');
    const [year, setYear] = useState('');
    const [task, setTask] = useState([]);
    const [_id, setTaskid] = useState('');
    const [editTaskId, setEditTaskId] = useState(null);
    // stats varibles
    const [avgAtt, setAvgAtt] = useState('');
    const [avgComp, setAvgComp] = useState('');
    const [rate, setRate] = useState('');
    const [month1, setMonth1] = useState('');
    const [day1, setDay1] = useState('');
    const [year1, setYear1] = useState('');
 
    // _id to _id
    // api end-points 
    // replace axios occurrences with api, example: api.post('/endpoint', {data})
    const api = axios.create({
        baseURL: 'http://localhost:3001'
    })

    // get cookie
    const userid = Cookies.get('userid');

    // navigate to signup page, route path is in App.js
    let navigate = useNavigate();
    // check if checkbox is checked
    const [isChecked, setCheck] = useState(false);

    const handleCheckbox = async (e , task) => {
        e.preventDefault();
        console.log(task);
        console.log(isChecked);
        if (isChecked == "true") {
            setCheck("false");
        } else {
            setCheck("true");
        }
        try {
            const data = await axios.put('http://localHost:3001/tasks/update', {
                        userID: userid,
                        _id: task._id,
                        name: task.name,
                        points: task.points,
                        isChecked: isChecked,
                        time: task.time,
                        date: date
                    });
                    console.log(await data.data);
        } catch (error) {
            console.log(error);
        }

        //console.log("Hello World");
    };

    /*
    const tempData = [
        {'name': 'Homework', 'points': '2', 'time': '2:00PM', '_id': '1'},
        {'name': 'Project', 'points': '5', 'time': '4:00PM', '_id': '2'}
    ]
    const [task, setTask] = useState(tempData);
    */
    // delete task
    const doDelete = async (id, date, e) => {
        e.preventDefault();

        //console.log(task);
        const taskDelete = [...task];
        const deleteIndex = task.findIndex((task)=> task._id === id);
        taskDelete.splice(deleteIndex, 1);
        setTask(taskDelete);
        console.log(id);
        console.log(userid);

        try {
                const data = await axios.delete('http://localHost:3001/tasks/delete', {
                    data: {
                        userID: userid,
                        date: date,
                        _id: id
                    }
                });
            console.log(data.data);
        } catch (error) {
            console.log(error);
        }


        // const taskDelete = [...task];
        // const deleteIndex = task.findIndex((task)=> task._id === id);

        // taskDelete.splice(deleteIndex, 1);
        // setTask(taskDelete);
        // // send to api
        // axios.post('http://localhost:3001/task/delete', {
        //         userID: userid,
        //         date: date,
        //         _id: editTaskId
        //     }).then(() => {console.log("successfully deleted task");
        //     });
    };
    // edit row click
    const doEdit = (e, task, id) =>{
        e.preventDefault();
       // console.log(id);
        // set edit id to task id, to fulfill fragment if
        setEditTaskId(task._id);
        console.log(editTaskId);
        //console.log("edit id after set task:" + editTaskId);
       console.log(task._id);
        const formValues = {
            _id: task._id,
            name: task.name,
            points: task.points,
            time: task.time,
            isChecked: isChecked
        }

        setEditFormData(formValues);
    };
    const[editFormData, setEditFormData] = useState({
        _id: "",
        name: "",
        points: "",
        time: "",
        isChecked: ""
    });
    // save the nwe edit fields
    const saveEdit = (e) => {
        e.preventDefault();
        const fieldName = e.target.getAttribute("name");
        const fieldValue = e.target.value;

        const newFormData = {...editFormData};
        newFormData[fieldName] = fieldValue; 
        
        setEditFormData(newFormData);
    };
    // save click
    const handleSave = async (e, taskData) =>{ 
        e.preventDefault();

        console.log(editFormData);

        const editedTask = {
            _id: editFormData._id,
            name: editFormData.name,
            points: editFormData.points,
            time: editFormData.time,
            isChecked: editFormData.isChecked
        }

        
        const newTask = [...task];
        const index = task.findIndex((task) => task._id === editTaskId);
        console.log(editedTask);
        console.log(editFormData._id);
        newTask[index] = editedTask;

        console.log(date);
        if (taskData.name !== editedTask.name || taskData.time !== editedTask.time || editedTask.isChecked != taskData.isChecked) {

            if (editedTask.isChecked != taskData.isChecked) {
                if (editedTask.isChecked == true) {
                    setCheck(false);
                } else {
                    setCheck(true);
                }
            } 
            console.log(editedTask._id);
            try {
                const data = await axios.put('http://localHost:3001/tasks/update', {
                            userID: userid,
                            _id: editedTask._id,
                            name: editedTask.name,
                            points: taskData.points,
                            isChecked: editedTask.isChecked,
                            time: editedTask.time,
                            date: date
                        });
                        console.log(await data.data);
            } catch (error) {
                console.log(error);
            }
            setTask(newTask);
            setEditTaskId(null);
        }

        console.log("Hello World");

        // // check if edit changed
        // if(taskData.name !== editedTask.name | taskData.time !== editedTask.time){
        //     axios.post('http://localhost:3001/tasks/update', {
        //         userID: userid,
        //         _id: editedTask._id,
        //         name: editedTask.name,
        //         points: taskData.points,
        //         time: editedTask.time
        //     }).then(() => {console.log("successfully edited task");
        //     });
        // }
        // else{
        //     console.log("No changes in task");
        // }
        // setTask(newTask);
        // setEditTaskId(null);
    };

    // cancel click
    const handleEditCancel = () =>{   
        // set edit task id to null to get rid of the fragment if
        setEditTaskId(null);
    };
    
    // modal open and close functions
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    // modal 2
    const [open2, setOpen2] = useState(false);
    const handleOpen2 = async (e) => {
        e.preventDefault();
        
        setOpen2(true);

        try {

            let res = await axios.post('http://localhost:3001/statistics/results', {
            userID: userid
            });

        

            setAvgAtt(await res.data.averagePointsAttemptedPerDay);
            setAvgComp(await res.data.averagePointsCompletedPerDay);
            setRate(await res.data.successRate);
            
        } catch(error) {

            console.log(error);

        }

    }
    const handleClose2 = () => setOpen2(false);
    // submit current date to api
    const submitDate = async () => {
        let date = month + '/' + day + '/' + year;
        let response = await axios.post('http://localhost:3001/task/task-list', {
            userID: userid,
            currentDate: date});
        setOpen(false)

        console.log(response)
    };
    
    const signout = () =>{
        Cookies.remove('userid');
    }

    // fetch data from api
    const fetchData = async () =>{

        const date = new Date();

        day1 = date.getDate();
        month1 = date.getMonth() + 1;
        year1 = date.getFullYear();

        // This arrangement can be altered based on how we want the date's format to appear.
        let currentDate = month1 + '/' + day1 + '/' + year1;



        const response = await axios.post('http://localhost:3001/tasks/task-list', {
            userID: userid,
            currentDate: currentDate
        }).then(res =>{
            console.log(res.data)
        setTask(response.data)
        })

    };

    const handleListRequest = async (e) => {
        e.preventDefault();
        let currentDate = month + '/' + day + '/' + year;
        setDate(currentDate)
        try {
            const data = await axios.post('http://localhost:3001/tasks/task-list', {
                userID: userid,
                currentDate: currentDate
            });
            console.log(await data.data);
            setTask(await data.data)
            setOpen(false);
        } catch (error) {
            console.log(error.response.status);
            alert("Create tasks under this date, there are currently no task created");
        }
    }
    

    return(
        <>
            <div className="heading">
                <nav className="navbar">
                    <Link className="btn3 btn-link" to="/" onClick={signout}>Logoff</Link>
                    <h1 className="listheading">Productivity Manager</h1>
                    <Link className="btn4 btn-primary" to="/addTask">New Task</Link>
                </nav>
            </div>
            <button className="btn btn-secondary" onClick={handleOpen}>{month + '/' + day + '/' + year}</button>
                <Modal open={open} onClose={handleClose}>
                    <div className="container2">
                        <form onSubmit={handleListRequest}>
                            <h1>Date</h1>
                            <div class="form-group">
                                <label htmlFor="monthLabel">Month</label>
                                <input type="number" className="form-control" id="month" value={month} onChange={(e) => setMonth(e.target.value)} placeholder="Month" />
                            </div>
                            <div class="form-group">
                                <label htmlFor="dayLabel">Day</label>
                                <input type="number" className="form-control" id="day" value={day} onChange={(e) => setDay(e.target.value)} placeholder="Day" />
                            </div>
                            <div class="form-group">
                                <label htmlFor="yearLabel">Year</label>
                                <input type="number" className="form-control" id="year" value={year} onChange={(e) => setYear(e.target.value)} placeholder="Year" />
                            </div>
                            <div class="buttons">
                                <button class="btn btn-primary" id="submitDate" type="submit">Submit</button>
                                <button class="btn btn-danger" id="Cancel" onClick={handleClose} type="cancel">Cancel</button>
                            </div>
                        </form>
                    </div>
                </Modal>
            <div className="container3">
                <form>
                <table className="Table table table-striped bg-light" id="Table">
                    <thead>
                        <tr>
                            <th>Task Name</th>
                            <th>Points</th>
                            <th>Time</th>
                            <th>Checkbox</th>
                            <th>Edit/Delete</th>
                        </tr>
                    </thead>
                    <tbody id="myTable">
                    {task.map((col) =>(
                <Fragment>
                {editTaskId === col._id ? (<EditRow task={col} editFormData={editFormData} saveEdit={saveEdit} handleEditCancel={handleEditCancel} handleSave={handleSave} isChecked={col.isChecked} handleCheckbox={handleCheckbox}/>
                ) : (
                <ReadRow task={col} doEdit={doEdit} doDelete={doDelete} handleCheckbox={handleCheckbox} type="submit" isChecked={col.isChecked}/>)}
            </Fragment>))}
                    </tbody>
                </table>
                </form>
            </div>
            <button className="btn btn-primary" type="submit" onClick={(e) => handleOpen2(e)}>Stats</button>
            <Modal open={open2} onClose={handleClose2}>
                    <div className="container2">
                        <div class="form-group">
                            <label htmlFor="monthLabel">Average Points Attemted:</label>
                            <div>{avgAtt}</div>
                        </div>
                        <div class="form-group">
                            <label htmlFor="dayLabel">Average Points Completed:</label>
                            <div>{avgComp}</div>
                        </div>
                        <div class="form-group">
                            <label htmlFor="yearLabel">Success Rate:</label>
                            <div>{rate}</div>
                        </div>
                        <div class="buttons">
                            <button type="button" class="btn btn-danger" id="Cancel" onClick={handleClose2}>Cancel</button>
                        </div>
                    </div>
                </Modal>
        </>
    );
}