import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';


const PresentationView = () => {
  const navigate = useNavigate();

  const [presentations, setPresentations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterModule, setFilterModule] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

  useEffect(() => {
    fetch('http://localhost:5000/api/presentations')
      .then(response => {
        if (!response.ok) throw new Error("Network response failed");
        return response.json();
      })
      .then(data => {
        setPresentations(data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching presentations:", error);
        setLoading(false);
      });
  }, []);

  // Get unique modules for filter dropdown
  const modules = [...new Set(presentations.map(pres => pres.module))];

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle module filter change
  const handleModuleFilterChange = (e) => {
    setFilterModule(e.target.value);
  };

  // Sorting function
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Apply sorting and filtering
  const getSortedAndFilteredPresentations = () => {
    let filteredData = [...presentations];

    // Apply module filter
    if (filterModule) {
      filteredData = filteredData.filter(pres => 
        pres.module === filterModule
      );
    }

    // Apply search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filteredData = filteredData.filter(pres => 
        (pres.group_id && pres.group_id.toString().toLowerCase().includes(searchLower)) ||
        (pres.module && pres.module.toLowerCase().includes(searchLower)) ||
        (pres.technology_category && pres.technology_category.toLowerCase().includes(searchLower))
      );
    }

    // Apply sorting
    if (sortConfig.key) {
      filteredData.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }

    return filteredData;
  };

  // Get status badge style
  const getStatusBadge = (scheduled) => {
    return scheduled ? 
      "bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium" : 
      "bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium";
  };

  // Format date for better readability
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    } catch (e) {
      return dateString;
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this presentation?")) {
      try {
        const response = await fetch(`http://localhost:5000/api/presentations/${id}`, {
          method: 'DELETE',
        });
  
        if (response.ok) {
          setPresentations(prev => prev.filter(p => p._id !== id));
        } else {
          console.error('Failed to delete presentation');
        }
      } catch (error) {
        console.error('Error deleting presentation:', error);
      }
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading presentation schedule...</p>
        </div>
      </div>
    );
  }

  const sortedAndFilteredPresentations = getSortedAndFilteredPresentations();

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="bg-white rounded-lg shadow-lg p-6">


        <h1 className="text-2xl font-bold text-gray-800 mb-6">Presentation Schedule</h1>

        <div className="flex justify-end mb-4">
        <button
          onClick={() => window.location.href = '/PresentationsForm'}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded shadow"
        >
        ➕ Add Presentation
        </button>
        </div>
        
        {/* Search and filters */}
        <div className="mb-6 space-y-4 md:space-y-0 md:flex md:gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500">🔍</span>
            </div>
            <input
              type="text"
              placeholder="Search presentations..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          
          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500">⚙️</span>
            </div>
            <select
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
              value={filterModule}
              onChange={handleModuleFilterChange}
            >
              <option value="">All Modules</option>
              {modules.map(module => (
                <option key={module} value={module}>{module}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Results summary */}
        <div className="mb-4 text-sm text-gray-600">
          Showing {sortedAndFilteredPresentations.length} of {presentations.length} presentations
        </div>

        {/* Table view */}
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => requestSort('group_id')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Group ID</span>
                    {sortConfig.key === 'group_id' && (
                      <span>{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => requestSort('module')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Module</span>
                    {sortConfig.key === 'module' && (
                      <span>{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => requestSort('technology_category')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Technology</span>
                    {sortConfig.key === 'technology_category' && (
                      <span>{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => requestSort('date')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Date</span>
                    {sortConfig.key === 'date' && (
                      <span>{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => requestSort('start_time')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Time</span>
                    {sortConfig.key === 'start_time' && (
                      <span>{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Attendees
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedAndFilteredPresentations.length > 0 ? (
                sortedAndFilteredPresentations.map((pres) => (
                  <tr key={pres._id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap font-medium text-gray-900">
                      {pres.group_id || "N/A"}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-gray-700">
                      {pres.module || "N/A"}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-gray-700">
                      {pres.technology_category || "N/A"}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-gray-700">
                      <div className="flex items-center">
                        <span className="mr-1">📅</span> {formatDate(pres.date)}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-gray-700">
                      <div className="flex items-center">
                        <span className="mr-1">⏰</span> {pres.start_time || "TBD"} - {pres.end_time || "TBD"}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-gray-900">👥 {pres.num_attendees || 0} attendees</div>
                        <div className="text-gray-500 text-sm">👨‍⚖️ {pres.required_examiners || 0} examiners</div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={getStatusBadge(pres.scheduled)}>
                        {pres.scheduled ? "Scheduled" : "Pending"}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                    <button
                    onClick={() => navigate(`/presentationsedit/${pres._id}`)}
                    className="bg-yellow-400 hover:bg-yellow-500 text-white py-1 px-3 rounded text-sm"
                    >
                      Edit
                    </button>
                      <button
                      onClick={() => handleDelete(pres._id)}
                      className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded text-sm"
                      >
                        Delete
                      </button>
                    </td>
                    

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-4 py-8 text-center text-gray-500">
                    No presentations match your search criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
      </div>
    </div>
  );
};

export default PresentationView;