import React, { useState, useEffect } from 'react';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faSave } from '@fortawesome/free-solid-svg-icons';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import logo from './logo.png'; // Assuming your logo is in the src folder
import data from './Data.json'; // Assuming Data.json is in the src folder

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

function App() {
  const [employees, setEmployees] = useState(data); // Load employee data from JSON
  const [editIndex, setEditIndex] = useState(null); // Track the row being edited
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [newEmployee, setNewEmployee] = useState({});  // Track new employee data
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const uniqueDepartments = [...new Set(employees.map(employee => employee.Department).filter(Boolean))];
    const uniqueCourses = [...new Set(employees.map(employee => employee.Course).filter(Boolean))];
    setDepartments(uniqueDepartments);
    setCourses(uniqueCourses);
  }, [employees]);

  const handleDepartmentChange = (e) => {
    setSelectedDepartment(e.target.value);
  };

  const handleCourseChange = (e) => {
    setSelectedCourse(e.target.value);
  };

  // Toggle edit mode for the selected row
  const toggleEdit = (index) => {
    setEditIndex(index === editIndex ? null : index); // Toggle editing for the row
  };

  // Handle input changes for each field
  const handleInputChange = (e, field, index) => {
    const updatedEmployees = [...employees];
    updatedEmployees[index][field] = e.target.value;
    setEmployees(updatedEmployees);
  };

  // Handle new employee form input
  const handleNewEmployeeInput = (e) => {
    const { name, value } = e.target;
    setNewEmployee(prevState => ({ ...prevState, [name]: value }));
  };

  // Add new employee to the list
  const addEmployee = (e) => {
    e.preventDefault();
    setEmployees([...employees, newEmployee]);
    setNewEmployee({}); // Clear the form after adding
  };

  // Filter employees based on the selected department and course
  const filteredEmployees = employees.filter((employee) => {
    return (
      (selectedDepartment === '' || employee.Department === selectedDepartment) &&
      (selectedCourse === '' || employee.Course === selectedCourse)
    );
  });

  // Calculate Budget and Task Stats
  const totalBudget = filteredEmployees.reduce((sum, employee) => sum + (parseFloat(employee["Cost(AED)"]) || 0), 0);
  const totalBudgetRealized = filteredEmployees.reduce((sum, employee) => sum + (parseFloat(employee.BudgetRealized) || 0), 0);
  const completedTasks = filteredEmployees.filter(employee => employee.Status === "Completed").length;
  const inProgressTasks = filteredEmployees.filter(employee => employee.Status === "In Progress").length;
  const notStartedTasks = filteredEmployees.filter(employee => employee.Status === "Not Started").length;

  // Bar chart for budget tracking
  const budgetChartData = {
    labels: ['Estimated Budget', 'Budget Realized'],
    datasets: [
      {
        label: 'Budget (AED)',
        data: [totalBudget, totalBudgetRealized],
        backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(153, 102, 255, 0.6)'],
      },
    ],
  };

  // Pie chart for task status
  const taskChartData = {
    labels: ['Completed', 'In Progress', 'Not Started'],
    datasets: [
      {
        label: 'Task Status',
        data: [completedTasks, inProgressTasks, notStartedTasks],
        backgroundColor: ['#36a2eb', '#ffcd56', '#ff6384'],
      },
    ],
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} alt="Company Logo" className="logo" />
        <h1>L&D Training and Tracking Dashboard</h1>
        <p>{new Date().toLocaleDateString()}</p>
      </header>

      {/* Summary Boxes */}
      <div className="summary">
        <div>
          <h3>Estimated Budget</h3>
          <p>{totalBudget} AED</p>
        </div>
        <div>
          <h3>Budget Realized</h3>
          <p>{totalBudgetRealized} AED</p>
        </div>
        <div>
          <h3>Task Status</h3>
          <p>Completed: {completedTasks}</p>
          <p>In Progress: {inProgressTasks}</p>
          <p>Not Started: {notStartedTasks}</p>
        </div>
      </div>

      {/* Charts and Add Employee Form */}
      <div className="layout">
        <div className="graphs">
          <div className="charts-left">
            <h3>Budget Tracking</h3>
            <Bar data={budgetChartData} />
          </div>
          <div className="charts-right">
            <h3>Task Status</h3>
            <Pie data={taskChartData} />
          </div>
        </div>

        {/* Form to Add a New Employee */}
        <form onSubmit={addEmployee}>
          <h3>Add New Employee</h3>
          <input
            type="text"
            name="EmployeeName"
            placeholder="Employee Name"
            value={newEmployee.EmployeeName || ''}
            onChange={handleNewEmployeeInput}
            required
          />
          <input
            type="text"
            name="Designation"
            placeholder="Designation"
            value={newEmployee.Designation || ''}
            onChange={handleNewEmployeeInput}
            required
          />
          <input
            type="text"
            name="Department"
            placeholder="Department"
            value={newEmployee.Department || ''}
            onChange={handleNewEmployeeInput}
            required
          />
          <input
            type="text"
            name="Course"
            placeholder="Course"
            value={newEmployee.Course || ''}
            onChange={handleNewEmployeeInput}
            required
          />
          <input
            type="text"
            name="Institute"
            placeholder="Institute"
            value={newEmployee.Institute || ''}
            onChange={handleNewEmployeeInput}
          />
          <input
            type="number"
            name="Cost(AED)"
            placeholder="Cost (AED)"
            value={newEmployee["Cost(AED)"] || ''}
            onChange={handleNewEmployeeInput}
          />
          <input
            type="date"
            name="Startdate"
            placeholder="Start Date"
            value={newEmployee.Startdate || ''}
            onChange={handleNewEmployeeInput}
          />
          <input
            type="date"
            name="EndDate"
            placeholder="End Date"
            value={newEmployee.EndDate || ''}
            onChange={handleNewEmployeeInput}
          />
          <input
            type="text"
            name="Status"
            placeholder="Status"
            value={newEmployee.Status || ''}
            onChange={handleNewEmployeeInput}
          />
          <input
            type="number"
            name="Satisfaction"
            placeholder="Employee Satisfaction"
            value={newEmployee.Satisfaction || ''}
            onChange={handleNewEmployeeInput}
          />
          <button type="submit">Add Employee</button>
        </form>
      </div>

      <table>
        <thead>
          <tr>
            <th>Sr.</th>
            <th>Course</th>
            <th>Employee Name</th>
            <th>Designation</th>
            <th>Department</th>
            <th>Institute</th>
            <th>Cost (AED)</th>
            <th>Budget Realized</th>
            <th>Hours Spent</th>
            <th>Employee Satisfaction</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Status</th>
            <th>Edit</th>
          </tr>
        </thead>
        <tbody>
          {filteredEmployees.map((employee, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              {editIndex === index ? (
                <>
                  <td><input value={employee.Course} onChange={(e) => handleInputChange(e, 'Course', index)} /></td>
                  <td><input value={employee.EmployeeName} onChange={(e) => handleInputChange(e, 'EmployeeName', index)} /></td>
                  <td><input value={employee.Designation} onChange={(e) => handleInputChange(e, 'Designation', index)} /></td>
                  <td><input value={employee.Department} onChange={(e) => handleInputChange(e, 'Department', index)} /></td>
                  <td><input value={employee.Institute} onChange={(e) => handleInputChange(e, 'Institute', index)} /></td>
                  <td><input value={employee["Cost(AED)"]} onChange={(e) => handleInputChange(e, 'Cost(AED)', index)} /></td>
                  <td><input value={employee.BudgetRealized} onChange={(e) => handleInputChange(e, 'BudgetRealized', index)} /></td>
                  <td><input value={employee.HoursSpent} onChange={(e) => handleInputChange(e, 'HoursSpent', index)} /></td>
                  <td><input value={employee.Satisfaction} onChange={(e) => handleInputChange(e, 'Satisfaction', index)} /></td>
                  <td><input value={employee.Startdate} onChange={(e) => handleInputChange(e, 'Startdate', index)} /></td>
                  <td><input value={employee.EndDate} onChange={(e) => handleInputChange(e, 'EndDate', index)} /></td>
                  <td><input value={employee.Status} onChange={(e) => handleInputChange(e, 'Status', index)} /></td>
                </>
              ) : (
                <>
                  <td>{employee.Course}</td>
                  <td>{employee.EmployeeName}</td>
                  <td>{employee.Designation}</td>
                  <td>{employee.Department}</td>
                  <td>{employee.Institute || 'N/A'}</td>
                  <td>{employee["Cost(AED)"] || 'N/A'}</td>
                  <td>{employee.BudgetRealized || 'N/A'}</td>
                  <td>{employee.HoursSpent || 'N/A'}</td>
                  <td>{employee.Satisfaction || 'N/A'}</td>
                  <td>{employee.Startdate || 'N/A'}</td>
                  <td>{employee.EndDate || 'N/A'}</td>
                  <td>{employee.Status || 'N/A'}</td>
                </>
              )}
              <td>
                <button onClick={() => toggleEdit(index)}>
                  {editIndex === index ? (
                    <FontAwesomeIcon icon={faSave} /> // Save icon when in edit mode
                  ) : (
                    <FontAwesomeIcon icon={faPencilAlt} /> // Pencil icon when not in edit mode
                  )}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}  

export default App;
