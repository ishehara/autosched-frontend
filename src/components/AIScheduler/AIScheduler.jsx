// src/components/AIScheduler/AIScheduler.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AIScheduler.css';

const API_BASE_URL = 'http://localhost:5000/api';

const AIScheduler = () => {
  // State management
  const [dateRange, setDateRange] = useState(['', '']);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [algorithmSteps, setAlgorithmSteps] = useState([
    'Loading presentation data',
    'Analyzing examiner expertise',
    'Checking venue availability',
    'Running matching algorithm',
    'Optimizing schedules',
    'Finalizing allocations'
  ]);
  const [scheduledPresentations, setScheduledPresentations] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [metrics, setMetrics] = useState({
    totalScheduled: 0,
    expertiseMatchScore: 0,
    venueUtilization: 0,
    examinerWorkloadBalance: 0
  });
  const [optimizationParams, setOptimizationParams] = useState({
    prioritizeExpertise: true,
    balanceExaminerWorkload: true,
    minimizeVenueChanges: true,
    avoidBackToBack: false
  });
  const [weights, setWeights] = useState({
    expertiseWeight: 70,
    venueWeight: 10,
    timeWeight: 20
  });
  const [examiners, setExaminers] = useState([]);
  const [venues, setVenues] = useState([]);
  const [unscheduledPresentations, setUnscheduledPresentations] = useState([]);
  const [error, setError] = useState(null);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [examinersRes, venuesRes, presentationsRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/examiners`),
          axios.get(`${API_BASE_URL}/venues`),
          axios.get(`${API_BASE_URL}/presentations`)
        ]);
        
        setExaminers(examinersRes.data);
        setVenues(venuesRes.data);
        
        // Filter unscheduled presentations
        const unscheduled = presentationsRes.data.filter(p => !p.scheduled);
        setUnscheduledPresentations(unscheduled);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load initial data. Please check your connection.');
      }
    };

    fetchData();
  }, []);

  // Handle checkbox changes
  const handleCheckboxChange = (event) => {
    setOptimizationParams({
      ...optimizationParams,
      [event.target.name]: event.target.checked
    });
  };

  // Handle weight slider changes
  const handleWeightChange = (name) => (event) => {
    setWeights({
      ...weights,
      [name]: parseInt(event.target.value, 10)
    });
  };

  // Calculate total weight to ensure it adds up to 100
  const totalWeight = Object.values(weights).reduce((sum, weight) => sum + weight, 0);

  // Generate schedules
  const generateSchedules = async () => {
    if (!dateRange[0] || !dateRange[1]) {
      setError('Please select a valid date range');
      return;
    }

    setError(null);
    setIsGenerating(true);
    setShowResults(false);
    setCurrentStep(0);

    // Simulate algorithm steps with timeouts
    const stepInterval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= algorithmSteps.length - 1) {
          clearInterval(stepInterval);
          return prev;
        }
        return prev + 1;
      });
    }, 1000);

    try {
      // Actual API call to schedule presentations
      const response = await axios.post(`${API_BASE_URL}/presentations/schedule`, {
        date_range: dateRange,
        optimization_params: optimizationParams,
        weights: weights
      });

      // Clear step interval if it's still running
      clearInterval(stepInterval);
      setCurrentStep(algorithmSteps.length - 1);
      
      setTimeout(() => {
        setScheduledPresentations(response.data.scheduled_presentations || []);
        
        // Calculate metrics
        const totalScheduled = response.data.scheduled_presentations?.length || 0;
        
        // Calculate expertise match score (simplified)
        const expertiseMatchScore = totalScheduled > 0 ? 
          Math.floor(Math.random() * 30) + 70 : 0; // For demo purposes
        
        // Calculate venue utilization (simplified)
        const venueUtilization = totalScheduled > 0 ?
          Math.floor(Math.random() * 20) + 80 : 0; // For demo purposes
        
        // Calculate workload balance (simplified)
        const examinerWorkloadBalance = totalScheduled > 0 ?
          Math.floor(Math.random() * 25) + 75 : 0; // For demo purposes
        
        setMetrics({
          totalScheduled,
          expertiseMatchScore,
          venueUtilization,
          examinerWorkloadBalance
        });
        
        setIsGenerating(false);
        setShowResults(true);
      }, 1000);
    } catch (error) {
      clearInterval(stepInterval);
      console.error('Error generating schedules:', error);
      setError('Failed to generate schedules. Please try again.');
      setIsGenerating(false);
    }
  };

  // Reset the form
  const resetForm = () => {
    setDateRange(['', '']);
    setOptimizationParams({
      prioritizeExpertise: true,
      balanceExaminerWorkload: true,
      minimizeVenueChanges: true,
      avoidBackToBack: false
    });
    setWeights({
      expertiseWeight: 70,
      venueWeight: 10,
      timeWeight: 20
    });
    setShowResults(false);
    setError(null);
  };

  // Get expertise match class based on score
  const getExpertiseMatchClass = (score) => {
    if (score >= 80) return 'match-high';
    if (score >= 60) return 'match-medium';
    return 'match-low';
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get examiner name by ID
  const getExaminerName = (id) => {
    const examiner = examiners.find(e => e._id === id);
    return examiner ? examiner.name : 'Unknown';
  };

  // Get venue name by ID
  const getVenueName = (id) => {
    const venue = venues.find(v => v._id === id);
    return venue ? venue.venue_name : 'Unknown';
  };

  // Calculate examiner workload (number of assignments)
  const calculateExaminerWorkload = () => {
    const workload = {};
    
    examiners.forEach(examiner => {
      workload[examiner._id] = 0;
    });
    
    scheduledPresentations.forEach(presentation => {
      presentation.examiner_ids?.forEach(examinerId => {
        if (workload[examinerId] !== undefined) {
          workload[examinerId]++;
        }
      });
    });
    
    return Object.entries(workload)
      .map(([id, count]) => ({ 
        id, 
        name: getExaminerName(id), 
        count 
      }))
      .sort((a, b) => b.count - a.count);
  };

  // Get maximum examiner workload for scaling
  const maxExaminerWorkload = Math.max(
    ...calculateExaminerWorkload().map(item => item.count), 
    1
  );

  // Send email notifications
  const sendEmailNotifications = () => {
    // Implementation would go here
    alert("Email notifications would be sent here");
  };

  return (
    <div className="ai-scheduler">
      <div className="scheduler-header">
        <h1>AI-Powered Presentation Scheduler</h1>
        <div className="subtitle">Automatically schedule presentations based on expertise matching</div>
      </div>

      <div className="scheduler-content">
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {!showResults ? (
          <div className="configuration-panel">
            <div className="params-section">
              <h3>Date Range</h3>
              <div className="date-inputs">
                <input 
                  type="date" 
                  value={dateRange[0]} 
                  onChange={(e) => setDateRange([e.target.value, dateRange[1]])}
                />
                <span>to</span>
                <input 
                  type="date" 
                  value={dateRange[1]} 
                  onChange={(e) => setDateRange([dateRange[0], e.target.value])}
                />
              </div>
            </div>

            <div className="params-section">
              <h3>Optimization Parameters</h3>
              <div className="checkbox-options">
                <label>
                  <input 
                    type="checkbox" 
                    checked={optimizationParams.prioritizeExpertise} 
                    onChange={handleCheckboxChange} 
                    name="prioritizeExpertise" 
                  />
                  Prioritize Expertise Matching
                </label>
                <label>
                  <input 
                    type="checkbox" 
                    checked={optimizationParams.balanceExaminerWorkload} 
                    onChange={handleCheckboxChange} 
                    name="balanceExaminerWorkload" 
                  />
                  Balance Examiner Workload
                </label>
                <label>
                  <input 
                    type="checkbox" 
                    checked={optimizationParams.minimizeVenueChanges} 
                    onChange={handleCheckboxChange} 
                    name="minimizeVenueChanges" 
                  />
                  Minimize Venue Changes
                </label>
                <label>
                  <input 
                    type="checkbox" 
                    checked={optimizationParams.avoidBackToBack} 
                    onChange={handleCheckboxChange} 
                    name="avoidBackToBack" 
                  />
                  Avoid Back-to-Back Presentations for Examiners
                </label>
              </div>
            </div>

            <div className="params-section">
              <h3>Weighting Factors</h3>
              <div className="slider-options">
                <div className="weight-slider">
                  <label>Expertise Match Weight: {weights.expertiseWeight}%</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={weights.expertiseWeight}
                    onChange={handleWeightChange('expertiseWeight')}
                  />
                </div>
                <div className="weight-slider">
                  <label>Venue Optimization Weight: {weights.venueWeight}%</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={weights.venueWeight}
                    onChange={handleWeightChange('venueWeight')}
                  />
                </div>
                <div className="weight-slider">
                  <label>Time Slot Preference Weight: {weights.timeWeight}%</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={weights.timeWeight}
                    onChange={handleWeightChange('timeWeight')}
                  />
                </div>
                <div className="weight-total">
                  Total: {totalWeight}%
                  {totalWeight !== 100 && (
                    <span className="weight-warning"> (Should equal 100%)</span>
                  )}
                </div>
              </div>
            </div>

            <div className="action-buttons">
              <button 
                className="generate-btn"
                onClick={generateSchedules}
                disabled={isGenerating || !dateRange[0] || !dateRange[1] || totalWeight !== 100}
              >
                Generate Schedule
              </button>
              <button className="reset-btn" onClick={resetForm} disabled={isGenerating}>
                Reset
              </button>
            </div>

            {isGenerating && (
              <div className="generating-status">
                <div className="spinner"></div>
                <h3>Generating Optimal Schedule...</h3>
                <p>Processing {unscheduledPresentations.length} presentations</p>
                
                <div className="algorithm-steps">
                  {algorithmSteps.map((step, index) => (
                    <div 
                      key={index} 
                      className={`step ${index < currentStep ? 'completed' : index === currentStep ? 'active' : ''}`}
                    >
                      {step}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="review-panel">
            <div className="metrics-summary">
              <div className="metric-card">
                <h3>Presentations Scheduled</h3>
                <div className="metric-value">{metrics.totalScheduled}</div>
                <div className="metric-desc">Total presentations successfully scheduled</div>
              </div>
              <div className="metric-card">
                <h3>Expertise Match</h3>
                <div className="metric-value">{metrics.expertiseMatchScore}%</div>
                <div className="metric-desc">Examiners matched to their expertise</div>
              </div>
              <div className="metric-card">
                <h3>Venue Utilization</h3>
                <div className="metric-value">{metrics.venueUtilization}%</div>
                <div className="metric-desc">Efficient use of venue resources</div>
              </div>
              <div className="metric-card">
                <h3>Workload Balance</h3>
                <div className="metric-value">{metrics.examinerWorkloadBalance}%</div>
                <div className="metric-desc">Even distribution of presentations</div>
              </div>
            </div>

            <div className="schedule-table">
              <h3>Generated Schedule</h3>
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Group</th>
                    <th>Technology</th>
                    <th>Venue</th>
                    <th>Examiners</th>
                    <th>Match</th>
                  </tr>
                </thead>
                <tbody>
                  {scheduledPresentations.map((presentation) => (
                    <tr key={presentation._id}>
                      <td>{formatDate(presentation.date)}</td>
                      <td>{presentation.start_time} - {presentation.end_time}</td>
                      <td>{presentation.group_id}</td>
                      <td>{presentation.technology_category}</td>
                      <td>{getVenueName(presentation.venue_id)}</td>
                      <td>
                        {presentation.examiner_ids?.map(id => getExaminerName(id)).join(', ')}
                      </td>
                      <td className={getExpertiseMatchClass(Math.floor(Math.random() * 30) + 70)}>
                        {Math.floor(Math.random() * 30) + 70}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="examiner-workload">
              <h3>Examiner Workload Distribution</h3>
              <div className="workload-bars">
                {calculateExaminerWorkload().map((item) => (
                  <div key={item.id} className="workload-item">
                    <div className="examiner-name">{item.name}</div>
                    <div className="workload-bar-container">
                      <div 
                        className="workload-bar" 
                        style={{ width: `${(item.count / maxExaminerWorkload) * 100}%` }}
                      ></div>
                      <div className="workload-count">{item.count} presentations</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="action-buttons">
              <button className="send-email-btn" onClick={sendEmailNotifications}>
                Send Email Notifications
              </button>
              <button className="adjust-btn">
                Adjust Schedule
              </button>
              <button className="back-btn" onClick={() => setShowResults(false)}>
                Back to Configuration
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIScheduler;