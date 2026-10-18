import React, { useState, useEffect } from "react";

// Subcomponent: Stats Overview (demonstrates props)
function StatsHeader({ employees }) {
  const total = employees.length;
  const avgSalary =
    total > 0
      ? Math.round(employees.reduce((acc, emp) => acc + (Number(emp.salary) || 0), 0) / total)
      : 0;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <p className="text-xs text-gray-500 font-semibold uppercase">Total Staff</p>
        <p className="text-2xl font-bold text-blue-600">{total}</p>
      </div>
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <p className="text-xs text-gray-500 font-semibold uppercase">Average Salary</p>
        <p className="text-2xl font-bold text-green-600">₹{avgSalary.toLocaleString()}</p>
      </div>
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 col-span-2 md:col-span-1">
        <p className="text-xs text-gray-500 font-semibold uppercase">Departments</p>
        <p className="text-2xl font-bold text-purple-600">4 Active</p>
      </div>
    </div>
  );
}

// Subcomponent: Employee Form Modal (Handles Create & Update)
function EmployeeModal({ isOpen, onClose, onSave, employeeToEdit }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "Engineering",
    role: "",
    salary: "",
  });

  useEffect(() => {
    if (employeeToEdit) {
      setFormData(employeeToEdit);
    } else {
      setFormData({
        name: "",
        email: "",
        department: "Engineering",
        role: "",
        salary: "",
      });
    }
  }, [employeeToEdit, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.salary) {
      alert("Please fill all required fields.");
      return;
    }
    onSave({
      ...formData,
      id: employeeToEdit ? employeeToEdit.id : Date.now(),
      salary: Number(formData.salary),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-4 border-b pb-3">
          <h3 className="text-xl font-bold text-gray-800">
            {employeeToEdit ? "✏️ Edit Employee" : "➕ Add New Employee"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl font-bold"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Diya Sharma"
              className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:border-blue-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="e.g. diya@company.com"
              className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:border-blue-500 focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Department
              </label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2 text-sm bg-white focus:border-blue-500 focus:outline-none"
              >
                <option value="Engineering">Engineering</option>
                <option value="Design">Design</option>
                <option value="Marketing">Marketing</option>
                <option value="Human Resources">Human Resources</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Role *
              </label>
              <input
                type="text"
                name="role"
                value={formData.role}
                onChange={handleChange}
                placeholder="e.g. Frontend Dev"
                className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:border-blue-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Monthly Salary (₹) *
            </label>
            <input
              type="number"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              placeholder="e.g. 65000"
              className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:border-blue-500 focus:outline-none"
              required
            />
          </div>

          <div className="flex gap-2 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg text-sm font-semibold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-semibold transition"
            >
              {employeeToEdit ? "Save Changes" : "Create Record"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function App() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("All");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);

  // API Integration: Fetch dummy employees on mount
  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((res) => res.json())
      .then((data) => {
        // Map dummy API users into employee structure
        const mapped = data.slice(0, 5).map((user, idx) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          department: idx % 2 === 0 ? "Engineering" : idx % 3 === 0 ? "Design" : "Marketing",
          role: idx % 2 === 0 ? "Senior Developer" : "Product Specialist",
          salary: 50000 + idx * 8500,
        }));
        setEmployees(mapped);
        setLoading(false);
      })
      .catch((err) => {
        console.error("API error:", err);
        setLoading(false);
      });
  }, []);

  // Create or Update handler
  const handleSaveEmployee = (emp) => {
    if (editingEmployee) {
      // Update
      setEmployees((prev) => prev.map((item) => (item.id === emp.id ? emp : item)));
    } else {
      // Create
      setEmployees((prev) => [emp, ...prev]);
    }
  };

  // Delete handler
  const handleDelete = (id, name) => {
    if (window.confirm(`Delete employee record for ${name}?`)) {
      setEmployees((prev) => prev.filter((item) => item.id !== id));
    }
  };

  // Filtered employees list
  const filtered = employees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(search.toLowerCase()) ||
      emp.email.toLowerCase().includes(search.toLowerCase()) ||
      emp.role.toLowerCase().includes(search.toLowerCase());
    const matchesDept = deptFilter === "All" || emp.department === deptFilter;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="min-h-screen bg-gray-100 p-6 text-gray-800">
      <div className="max-w-5xl mx-auto">
        <header className="bg-white p-6 rounded-2xl shadow-md mb-6 flex flex-wrap justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Practical 20: Employee Management System (CRUD)
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Complete React CRUD demonstration: Create, Read, Update, Delete with API integration, components, props, and state.
            </p>
          </div>
          <button
            onClick={() => {
              setEditingEmployee(null);
              setIsModalOpen(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow transition flex items-center gap-2"
          >
            <span>➕</span> Add Employee
          </button>
        </header>

        {/* Stats component */}
        <StatsHeader employees={employees} />

        {/* Search & Filter Bar */}
        <div className="bg-white p-4 rounded-xl shadow-sm mb-6 flex flex-wrap gap-4 items-center justify-between">
          <input
            type="text"
            placeholder="🔍 Search by name, role or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full md:w-80 focus:border-blue-500 focus:outline-none"
          />

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-500 uppercase">Department:</span>
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm bg-white focus:border-blue-500 focus:outline-none"
            >
              <option value="All">All Departments</option>
              <option value="Engineering">Engineering</option>
              <option value="Design">Design</option>
              <option value="Marketing">Marketing</option>
              <option value="Human Resources">Human Resources</option>
            </select>
          </div>
        </div>

        {/* Loading Indicator */}
        {loading && (
          <div className="bg-white p-12 rounded-xl text-center shadow-md">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent mb-2"></div>
            <p className="text-gray-500 text-sm font-medium">Loading employee records from API...</p>
          </div>
        )}

        {/* Employee Table */}
        {!loading && (
          <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-600 font-semibold border-b">
                  <tr>
                    <th className="p-4">Name</th>
                    <th className="p-4">Department</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Salary</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="p-8 text-center text-gray-400">
                        No employee records found.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((emp) => (
                      <tr key={emp.id} className="hover:bg-gray-50 transition">
                        <td className="p-4">
                          <p className="font-bold text-gray-800">{emp.name}</p>
                          <p className="text-xs text-gray-500">{emp.email}</p>
                        </td>
                        <td className="p-4">
                          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                            {emp.department}
                          </span>
                        </td>
                        <td className="p-4 text-gray-700 font-medium">{emp.role}</td>
                        <td className="p-4 font-bold text-green-700">
                          ₹{emp.salary.toLocaleString()}
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => {
                              setEditingEmployee(emp);
                              setIsModalOpen(true);
                            }}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg text-xs font-semibold transition"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(emp.id, emp.name)}
                            className="bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded-lg text-xs font-semibold transition"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal */}
        <EmployeeModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveEmployee}
          employeeToEdit={editingEmployee}
        />
      </div>
    </div>
  );
}

export default App;
