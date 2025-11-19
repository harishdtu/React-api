import React, { useState, useEffect } from 'react';
import './App.css'; // Custom CSS

function App() {
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState('first_name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [filter, setFilter] = useState('all');

  // Fetch users from API
 // Inside useEffect for fetching users
useEffect(() => {
  setLoading(true);
  fetch(`https://reqres.in/api/users?page=${page}`, {
    headers: {
      'x-api-key': 'reqres-free-v1'
    }
  })
    .then(res => res.json())
    .then(data => {
      setUsers(data.data);
      setTotalPages(data.total_pages);
      setLoading(false);
    })
    .catch(() => {
      setLoading(false);
    });
}, [page]);


  // Filter, Search, and Sort logic
  useEffect(() => {
    let result = [...users];

    // Basic filter (email domain)
    if (filter !== 'all') {
      result = result.filter(u => u.email.endsWith(filter));
    }

    // Search (name or email)
    if (search !== '') {
      result = result.filter(
        u =>
          u.first_name.toLowerCase().includes(search.toLowerCase()) ||
          u.last_name.toLowerCase().includes(search.toLowerCase()) ||
          u.email.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Sort
    result.sort((a, b) => {
      const x = a[sortKey].toLowerCase();
      const y = b[sortKey].toLowerCase();
      if (x < y) return sortOrder === 'asc' ? -1 : 1;
      if (x > y) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    setFiltered(result);
  }, [users, search, sortKey, sortOrder, filter]);

  // Render
  return (
    <div className="container">
      <h2>User Directory Table</h2>

      <div className="controls">
        <input
          className="search"
          type="text"
          placeholder="Search by name or email"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        <select className="filter" value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="all">All domains</option>
          <option value="@reqres.in">@reqres.in</option>
        </select>
      </div>

      {loading ? (
        <div className="spinner"></div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Avatar</th>
              <th onClick={() => setSortKey('first_name')}>First Name</th>
              <th onClick={() => setSortKey('last_name')}>Last Name</th>
              <th onClick={() => setSortKey('email')}>Email</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(user => (
              <tr key={user.id}>
                <td>
                  <img src={user.avatar} alt="avatar" className="avatar" />
                </td>
                <td>{user.first_name}</td>
                <td>{user.last_name}</td>
                <td>{user.email}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan="4">No users found.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      <div className="pagination">
        <button
          disabled={page === 1 || loading}
          onClick={() => setPage(page - 1)}
        >
          Prev
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          disabled={page === totalPages || loading}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
        <button
          className="sort-toggle"
          onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
        >
          Sort: {sortOrder === 'asc' ? 'A→Z' : 'Z→A'}
        </button>
      </div>
    </div>
  );
}

export default App;
