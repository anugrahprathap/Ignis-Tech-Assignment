import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import { faHeart, } from '@fortawesome/free-solid-svg-icons'; 
import { faUpload } from '@fortawesome/free-solid-svg-icons'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const LikedEvents = ({ token }) => {
  const [likedEvents, setLikedEvents] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/liked-events/", {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setLikedEvents(response.data);
        
      })
      .catch((error) => {
        console.error("Error fetching liked events:", error);
      });
  }, [token]);
  const handleLikeClick =async(event)=>{
    const response = await axios.delete(`http://127.0.0.1:8000/api/events/${event.id}/follow/`, {
          headers: {
            Authorization: `Token ${localStorage.getItem('token')}`
          }
        });

        setLikedEvents(prevLikedEvents => prevLikedEvents.filter(e => e.id !== event.id));
        setMessage(`Event "${event.title}" unliked successfully.`);


  }
  const handleCloseMessage = () => {
    setMessage("");
  };
  return (
    <div className="">
      <Navbar />
      <div className="container">
        {likedEvents.length?(
            <h2 className="mt-4 mb-4" style={{ fontWeight: "600" }}>
            Liked Events
          </h2>
        ):
        (
            <div className="d-flex justify-content-center flex-column align-items-center mt-12" style={{ fontWeight: "600",marginTop:'200px'}}>
                <span style={{ fontWeight: "600",fontSize:'30px',}}> Add events, share with friends!
            Easy peasy.</span>
          
            <span>No items found</span>
        </div>
        )
        }
        
        {message && (
          <div className="alert alert-info d-flex justify-content-between align-items-center">
            <span>{message}</span>
            <button type="button" className="close" style={{backfaceVisibility:'none'}} onClick={handleCloseMessage}>
              <span >&times;</span>
            </button>
          </div>
        )}        
        <div className="row">
          {likedEvents.map((event) => (
            <div className="col-md-12 mb-4" key={event.id}>
              <div className="card border-0">
                <div className="row">
                  <div className="col-md-8">
                    <div className="card-body">
                      <h5 className="card-title">{event.title}</h5>
                      <p className="card-text text-danger">{event.datetime}</p>
                      <p className="card-text">{event.location}</p>
                      {event.type !== 'free' && <p className="card-text">From ${event.price}</p>}
                      <p className="card-text">{event.organizer}</p>
                      <p className="card-text">{event.type}</p>
                    </div>
                  </div>
                  <div className="col-md-4 p-2">
                    <div
                      style={{
                        height: "100%",
                        width: "100%",
                        backgroundImage: `url(${event.image})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    >
                      <div
                        className="position-absolute bottom-buttons  d-flex flex-row justify-content-between align-items-center"
                        style={{
                          bottom: "10px",
                          right: "10px",
                          color: "white",
                        }}
                      >
                        <div className="like d-flex flex-row justify-content-center align-items-center">
                          
                           
                            <FontAwesomeIcon
                              icon={faHeart}
                              className="mr-2"
                              style={{ color: "red" }}
                              onClick={() => handleLikeClick(event)}
                            />
                          
                        </div>
                        <div className="like d-flex flex-row justify-content-center align-items-center">
                            <FontAwesomeIcon icon={faUpload} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LikedEvents;
