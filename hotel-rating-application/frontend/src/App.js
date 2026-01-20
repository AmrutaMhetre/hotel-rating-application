import { useEffect, useState } from "react";

function App() {
  const [hotels, setHotels] = useState([]);
  const [form, setForm] = useState({
    name: "",
    location: "",
    rating: "",
    category: "",
    peakPeriod: ""
  });

  const [editId, setEditId] = useState(null);
  const [highest, setHighest] = useState(null);
  const [apiLoaded, setApiLoaded] = useState(false);

  // Use backend URL from .env
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    fetch(`${backendUrl}/hotels`)
      .then(res => {
        if (!res.ok) {
          throw new Error("Failed to fetch hotels");
        }
        return res.json();
      })
      .then(data => setHotels(data))
      .catch(() => {
        alert("Unable to load hotels from server");
      });
  }, [backendUrl]);

  const getHighest = () => {
    fetch(`${backendUrl}/hotels/highest-rating`)
      .then(res => {
        if (!res.ok) {
          throw new Error("Failed to fetch highest rated hotel");
        }
        return res.json();
      })
      .then(data => setHighest(data))
      .catch(() => {
        alert("Unable to fetch highest rated hotel");
      });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addHotel = () => {
    fetch(`${backendUrl}/hotels`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        rating: parseFloat(form.rating)
      })
    })
      .then(res => {
        if (!res.ok) {
          throw new Error("Failed to add hotel");
        }
        return res.json();
      })
      .then(newHotel => {
        setHotels([...hotels, newHotel]);
        setForm({ name: "", location: "", rating: "", category: "", peakPeriod: "" });
      })
      .catch(() => {
        alert("Unable to add hotel. Please check inputs.");
      });
  };

  const deleteHotel = (id) => {
    fetch(`${backendUrl}/hotels/${id}`, {
      method: "DELETE"
    })
      .then(() => {
        setHotels(hotels.filter(h => h.id !== id));
      });
  };

  const editHotel = (hotel) => {
    setForm({
      name: hotel.name,
      location: hotel.location,
      rating: hotel.rating,
      category: hotel.category,
      peakPeriod: hotel.peakPeriod
    });
    setEditId(hotel.id);
  };

  const updateHotel = () => {
    fetch(`${backendUrl}/hotels/${editId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        rating: parseFloat(form.rating)
      })
    })
      .then(res => res.json())
      .then(updatedHotel => {
        setHotels(hotels.map(h => (h.id === editId ? updatedHotel : h)));
        setEditId(null);
        setForm({ name: "", location: "", rating: "", category: "", peakPeriod: "" });
      });
  };

  const loadFromApi = () => {
    fetch(`${backendUrl}/hotels/from-api`)
      .then(res => {
        if (!res.ok) throw new Error("External API error");
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setHotels(data);
          setApiLoaded(true);
        }
      })
      .catch(() => {
        alert("Failed to load hotels from external API");
      });
  };

  return (
    <div>
      <h2>Hotel List</h2>
      <h3>Add Hotel</h3>

      <input name="name" placeholder="Hotel Name" value={form.name} onChange={handleChange} />
      <input name="location" placeholder="Location" value={form.location} onChange={handleChange} />
      <input name="rating" placeholder="Rating" value={form.rating} onChange={handleChange} />
      <input name="category" placeholder="Category" value={form.category} onChange={handleChange} />
      <input name="peakPeriod" placeholder="Peak Period" value={form.peakPeriod} onChange={handleChange} />

      <br /><br />
      {editId ? 
        (<button onClick={updateHotel}>Update Hotel</button>) 
        : 
        (<button onClick={addHotel}>Add Hotel</button>)
      }

      <hr />

      <button onClick={loadFromApi}>
          Load Hotels From API
      </button>

      <table border="1">
        <tr>
          <th>Name</th>
          <th>Location</th>
          <th>Rating</th>
          <th>Category</th>
          <th>Peak Period</th>
          <th>Action</th>
        </tr>
        {hotels.map(h => (
          <tr key={h.id}>
            <td>{h.name}</td>
            <td>{h.location}</td>
            <td>{h.rating}</td>
            <td>{h.category}</td>
            <td>{h.peakPeriod}</td>
            <td>
              <button onClick={() => editHotel(h)}>Edit</button>
              <button onClick={() => deleteHotel(h.id)}>Delete</button>
            </td>
          </tr>
        ))}
      </table>

      <br />

      <button onClick={getHighest}>Get Highest Rating</button>

      {highest && (
        <p>
          Highest Rated Hotel: <b>{highest.name}</b> ({highest.rating})
        </p>
      )}
    </div>
  );
}

export default App;
