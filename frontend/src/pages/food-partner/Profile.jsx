import { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/Profile.css";
import { useParams } from "react-router-dom";

export default function Profile() {
  const { id } = useParams();
  const [profile, setProfile] = useState({});
  const [foodItems, setFoodItems] = useState([]);
  

  useEffect(() => {
    const getPartner = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/food-partner/${id}`,
          { withCredentials: true }
        );
        localStorage.setItem("partnerId", res.data.foodPartner._id);
        const partnerData = res.data.foodPartner || {};
        setProfile(partnerData);
        setFoodItems(partnerData.foodItems || []);
      } catch (err) {
        console.error("Partner fetch error:", err);
      }
    };
    getPartner();
  }, [id]);

  return (
    <div className="partner-profile-container">
      <div className="partner-profile-card">

        {/* Top Section */}
        <div className="partner-top">
          <img src="https://images.unsplash.com/photo-1770419252624-e14e9f9de640?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" className="partner-logo" />

          <div className="partner-info">
            <h2 className="partner-name">{profile.name}</h2>
            <p className="partner-address">{profile.address}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="partner-stats">
          <div className="stat">
            <p className="stat-value">{foodItems.length}</p>
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
