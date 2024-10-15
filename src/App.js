import React, { useState, useEffect } from 'react';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faSave, faPlus } from '@fortawesome/free-solid-svg-icons';
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
import logo from './logo.png'; // Update to your logo path
import data from './Data.json'; // Ensure this is the correct path

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

function App() {
  const [employees, setEmployees] = useState(data);
  const [editIndex, setEditIndex] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [newEmployee, setNewEmployee] = useState({});
  const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false);
  
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const uniqueDepartments = [...new Set(employees.map(employee => employee.Department).filter(Boolean))];
    const uniqueCourses = [...new Set(employees.map(employee => employee.Course).filter(Boolean))];
    setDepartments(uniqueDepartments);
    setCourses(uniqueCourses);
  }, [employees]);

  const toggleEdit = (index) => {
    setEditIndex(index === editIndex ? null : index);
  };

  const handleInputChange = (e, field, index) => {
    const updatedEmployees = [...employees];
    updatedEmployees[index][field] = e.target.value;
    setEmployees(updatedEmployees);
  };

  const handleNewEmployeeInput = (e) => {
    const { name, value } = e.target;
    setNewEmployee(prevState => ({ ...prevState, [name]: value }));
  };

  const addEmployee = (e) => {
    e.preventDefault();
    setEmployees([...employees, newEmployee]);
    setNewEmployee({});
    setShowAddEmployeeModal(false);
  };

  const filteredEmployees = employees.filter((employee) => {
    return (
      (selectedDepartment === '' || employee.Department === selectedDepartment) &&
      (selectedCourse === '' || employee.Course === selectedCourse)
    );
  });

  const totalBudget = filteredEmployees.reduce((sum, employee) => sum + (parseFloat(employee["Cost(AED)"]) || 0), 0);
  const totalBudgetRealized = filteredEmployees.reduce((sum, employee) => sum + (parseFloat(employee.BudgetRealized) || 0), 0);
  const completedTasks = filteredEmployees.filter(employee => employee.Status === "Completed").length;
  const inProgressTasks = filteredEmployees.filter(employee => employee.Status === "In Progress").length;
  const notStartedTasks = filteredEmployees.filter(employee => employee.Status === "Not Started").length;

  // Calculate total participants and participation rate
  const totalParticipants = employees.length;
  const participatedCount = employees.filter(emp => emp.ParticipationRate === "Participated").length;
  const participationRate = totalParticipants > 0 ? ((participatedCount / totalParticipants) * 100).toFixed(2) : 0;

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

  // Participation Rate Chart Data
  const participationRateChartData = {
    labels: ['Participated', 'Not Participated'],
    datasets: [
      {
        label: 'Participation Rate',
        data: [participatedCount, totalParticipants - participatedCount],
        backgroundColor: ['#4caf50', '#ff9800'],
      },
    ],
  };

  // Relevance Chart Data
  const relevanceData = {
    labels: ['Relevant', 'Not Relevant', 'Highly Relevant'],
    datasets: [
      {
        label: 'Relevance',
        data: [
          employees.filter(emp => emp.Relevance === 'Relevant').length,
          employees.filter(emp => emp.Relevance === 'Not Relevant').length,
          employees.filter(emp => emp.Relevance === 'Highly Relevant').length,
        ],
        backgroundColor: ['#2196f3', '#f44336', '#8bc34a'],
      },
    ],
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} alt="Company Logo" className="logo" />
        <h1>Training Calendar & Tracking Dashboard</h1>
        <p>{new Date().toLocaleDateString()}</p>
      </header>

      {/* Overall Progress Section */}
      <h2 className="overall-progress-title">Overall Progress</h2>
      <div className="summary overall-progress">
        <div>
          <h3>Total Participants</h3>
          <p>{totalParticipants}</p>
        </div>
        <div>
          <h3>Participation Rate</h3>
          <p>{participationRate}%</p>
        </div>
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

      {/* Graphs Section */}
      <div className="graphs">
        <div className="chart">
          <h3>Budget Tracking</h3>
          <Bar data={budgetChartData} options={{ responsive: true, maintainAspectRatio: false }} />
        </div>
        <div className="chart">
          <h3>Task Status</h3>
          <Pie data={taskChartData} options={{ responsive: true, maintainAspectRatio: false }} />
        </div>
        <div className="chart">
          <h3>Participation Rate</h3>
          <Pie data={participationRateChartData} options={{ responsive: true, maintainAspectRatio: false }} />
        </div>
        <div className="chart">
          <h3>Relevance</h3>
          <Pie data={relevanceData} options={{ responsive: true, maintainAspectRatio: false }} />
        </div>
      </div>

      {/* Dropdown Filters */}
      <div className="filters">
        <label>
          Select Department:
          <select value={selectedDepartment} onChange={(e) => setSelectedDepartment(e.target.value)}>
            <option value="">All</option>
            {departments.map((dept, index) => (
              <option key={index} value={dept}>{dept}</option>
            ))}
          </select>
        </label>
        <label>
          Select Course:
          <select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)}>
            <option value="">All</option>
            {courses.map((course, index) => (
              <option key={index} value={course}>{course}</option>
            ))}
          </select>
        </label>
      </div>

      {/* Add Employee Button */}
      <div className="add-employee">
        <button onClick={() => setShowAddEmployeeModal(true)}>
          <FontAwesomeIcon icon={faPlus} /> Add New Employee
        </button>
      </div>

      {/* Add Employee Modal */}
      {showAddEmployeeModal && (
        <div className="modal">
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
              type="text"
              name="Satisfaction"
              placeholder="Satisfaction Rate (Satisfied, Highly Satisfied, Not Satisfied)"
              value={newEmployee.Satisfaction || ''}
              onChange={handleNewEmployeeInput}
              required
            />
            <input
              type="text"
              name="Relevance"
              placeholder="Relevance (Relevant, Highly Relevant, Not Relevant)"
              value={newEmployee.Relevance || ''}
              onChange={handleNewEmployeeInput}
              required
            />
            <input
              type="text"
              name="ParticipationRate"
              placeholder="Participation Rate (Participated, Not Participated)"
              value={newEmployee.ParticipationRate || ''}
              onChange={handleNewEmployeeInput}
              required
            />
            <button type="submit">Add Employee</button>
            <button type="button" onClick={() => setShowAddEmployeeModal(false)}>Cancel</button>
          </form>
        </div>
      )}

      <table>
        <thead>
          <tr>
            <th>Sr.</th>
            <th>Employee Name</th>
            <th>Designation</th>
            <th>Department</th>
            <th>Course</th>
            <th>Institute</th>
            <th>Cost (AED)</th>
            <th>Budget Realized</th>
            <th>Training Hours</th> {/* Updated Column Header */}
            <th>Satisfaction Rate</th> {/* Updated Column Header */}
            <th>Relevance</th>
            <th>Participation Rate</th>
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
                  <td><input value={employee.EmployeeName} onChange={(e) => handleInputChange(e, 'EmployeeName', index)} /></td>
                  <td><input value={employee.Designation} onChange={(e) => handleInputChange(e, 'Designation', index)} /></td>
                  <td><input value={employee.Department} onChange={(e) => handleInputChange(e, 'Department', index)} /></td>
                  <td><input value={employee.Course} onChange={(e) => handleInputChange(e, 'Course', index)} /></td>
                  <td><input value={employee.Institute} onChange={(e) => handleInputChange(e, 'Institute', index)} /></td>
                  <td><input value={employee["Cost(AED)"]} onChange={(e) => handleInputChange(e, 'Cost(AED)', index)} /></td>
                  <td><input value={employee.BudgetRealized} onChange={(e) => handleInputChange(e, 'BudgetRealized', index)} /></td>
                  <td><input value={employee.HoursSpent} onChange={(e) => handleInputChange(e, 'HoursSpent', index)} /></td> {/* Training Hours */}
                  <td><input value={employee.Satisfaction} onChange={(e) => handleInputChange(e, 'Satisfaction', index)} /></td> {/* Satisfaction Rate */}
                  <td><input value={employee.Relevance} onChange={(e) => handleInputChange(e, 'Relevance', index)} /></td>
                  <td><input value={employee.ParticipationRate} onChange={(e) => handleInputChange(e, 'ParticipationRate', index)} /></td>
                  <td><input value={employee.Startdate} onChange={(e) => handleInputChange(e, 'Startdate', index)} /></td>
                  <td><input value={employee.EndDate} onChange={(e) => handleInputChange(e, 'EndDate', index)} /></td>
                  <td><input value={employee.Status} onChange={(e) => handleInputChange(e, 'Status', index)} /></td>
                </>
              ) : (
                <>
                  <td>{employee.EmployeeName}</td>
                  <td>{employee.Designation}</td>
                  <td>{employee.Department}</td>
                  <td>{employee.Course}</td>
                  <td>{employee.Institute || 'N/A'}</td>
                  <td>{employee["Cost(AED)"] || 'N/A'}</td>
                  <td>{employee.BudgetRealized || 'N/A'}</td>
                  <td>{employee.HoursSpent || 'N/A'}</td> {/* Training Hours */}
                  <td>{employee.Satisfaction || 'N/A'}</td> {/* Satisfaction Rate */}
                  <td>{employee.Relevance || 'N/A'}</td>
                  <td>{employee.ParticipationRate || 'N/A'}</td>
                  <td>{employee.Startdate || 'N/A'}</td>
                  <td>{employee.EndDate || 'N/A'}</td>
                  <td>{employee.Status || 'N/A'}</td>
                </>
              )}
              <td>
                <button onClick={() => toggleEdit(index)}>
                  {editIndex === index ? (
                    <FontAwesomeIcon icon={faSave} />
                  ) : (
                    <FontAwesomeIcon icon={faPencilAlt} />
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
