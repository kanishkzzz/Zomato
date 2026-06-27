import React, { useState } from "react";
import "../../styles/createFood.css";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";

const CreateFood = () => {
  const [video, setVideo] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!video || !name.trim() || !description.trim()) {
      alert("All fields are required");
      return;
    }

    const formData = new FormData();
    formData.append("video", video);
    formData.append("name", name);
    formData.append("description", description);

    try {
      await axios.post("http://localhost:4000/api/food", formData, {
        withCredentials: true,
      });
      // alert("Food item created successfully!");
      setName("");
      setDescription("");
      setVideo(null);
      navigate("/food-partner/profile");
    } catch (err) {
      console.error("Error creating food item:", err);
      const errorMessage =
        err.response?.data?.message || "Failed to create food item.";
      alert(errorMessage);  
    }
  };

  return (
    <div className="create-food-container">
      <div className="create-food-card">

        <h1 className="create-food-title">Create Food Item</h1>
        <p className="create-food-subtitle">Upload video and add details</p>

        <form className="create-food-form" onSubmit={handleSubmit}>

          {/* VIDEO INPUT */}
          <div className="form-group">
            <label className="form-label">Food Video</label>
            <input
              type="file"
              accept="video/*"
              className="form-input"
              onChange={(e) => setVideo(e.target.files[0])}
            />
          </div>

          {/* NAME INPUT */}
          <div className="form-group">
            <label className="form-label">Food Name</label>
            <input
              type="text"
              className="form-input"
              placeholder="Ex: Paneer Butter Masala"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* DESCRIPTION INPUT */}
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-input textarea"
              placeholder="Write description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          {/* SUBMIT BUTTON */}
          <button className="form-button" type="submit">
            Create Food
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateFood;
