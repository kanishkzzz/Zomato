import { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/profile.css";
import { useParams } from "react-router-dom";

export default function Profile() {
  const { id } = useParams();
  const [ profile, setProfile ] = useState({});
  const [foodItems, setFoodItems] = useState([]);
  const videos = Array.from({ length: 9 }, (_, i) => ({ id: i + 1} ));

  useEffect(() => {
    const fetchFoodItems = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/food");
        // Filter items for the current partner and access the correct property
        const partnerItems = res.data.foodItems.filter(item => item.foodPartner === id);
        setFoodItems(partnerItems);
      } catch (err) {
        console.error("Error fetching food items:", err);
      }
    };
    fetchFoodItems();
  }, [id]);

  useEffect(() => {
    axios.get(`http://localhost:3000/api/food-partner/${id}`, {withCredentials: true})
      .then(response => {
        setProfile(response.data.foodPartner);
      })
  }, [id]);

  return (
    <div className="partner-profile-container">
      <div className="partner-profile-card">

        {/* Top Section */}
        <div className="partner-top">
          <div className="partner-logo" />

          <div className="partner-info">
            <h2 className="partner-name">{profile.name}</h2>
            <p className="partner-address">{profile.description}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="partner-stats">
          <div className="stat">
            <p className="stat-value">43</p>
            <p className="stat-label">Total Meals</p>
          </div>

          <div className="stat">
            <p className="stat-value">15K</p>
            <p className="stat-label">Customer Served</p>
          </div>
        </div>

        <div className="partner-divider" />

        {/* Video Grid */}
        <div className="partner-video-grid">
          {foodItems.map((item) => (
            <video
              key={item._id}
              src={item.video}
              className="video-box"
              muted
              loop
              onMouseEnter={(e) => e.target.play()}
              onMouseLeave={(e) => e.target.pause()}
            />
          ))}
        </div>

      </div>
    </div>
  );
}