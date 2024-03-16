import React, { useState, useEffect } from "react";
import axios from "axios"; // Import Axios
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, } from '@fortawesome/free-solid-svg-icons'; 
import { faUpload } from '@fortawesome/free-solid-svg-icons'; 
import { faEllipsis } from '@fortawesome/free-solid-svg-icons'; 
import { faHeart as regHeart } from "@fortawesome/free-regular-svg-icons";
const Events = () => {
  const [events, setEvents] = useState([]);
  const [hoveredCards, setHoveredCards] = useState([]);
  const [likedCards, setLikedCards] = useState([]); // State to track liked cards
  const token = localStorage.getItem('token');
  
  useEffect(() => {
    const config = {};
  if (token) {
    config.headers = { Authorization: `Token ${token}` };
  }

    // Fetch events data from the API using Axios
    axios
      .get("http://127.0.0.1:8000/api/events/",config)
      .then((response) => {
        setEvents(response.data); 
        const initialLikedCards = response.data.map((event) => event.is_liked);
        setLikedCards(initialLikedCards);
        setHoveredCards(new Array(response.data.length).fill(false)); // Initialize the hoveredCards array
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
      });
  }, []); // Empty dependency array ensures the effect runs only once

  const handleMouseEnter = (index) => {
    setHoveredCards((prev) => {
      const newState = [...prev];
      newState[index] = true;
      return newState;
    });
  };

  const handleMouseLeave = (index) => {
    setHoveredCards((prev) => {
      const newState = [...prev];
      newState[index] = false;
      return newState;
    });
  };
  const handleLikeClick = async (index) => {
    try {
      const event = events[index];
      const isLiked = likedCards[index];
  
      if (isLiked) {
        // If the event is already liked, send a DELETE request to unlike it
        const response = await axios.delete(`http://127.0.0.1:8000/api/events/${event.id}/follow/`, {
          headers: {
            Authorization: `Token ${localStorage.getItem('token')}`
          }
        });
  
        if (response.status === 204) {
          // Update the likedCards state
          setLikedCards((prevLikedCards) => {
            const newLikedCards = [...prevLikedCards];
            newLikedCards[index] = false;
            return newLikedCards;
          });
  
          // Update the event's is_liked property
          setEvents((prevEvents) => {
            const updatedEvents = [...prevEvents];
            updatedEvents[index].is_liked = false;
            return updatedEvents;
          });
        }
      } else {
        // If the event is not liked, send a POST request to like it
        const response = await axios.post(`http://127.0.0.1:8000/api/events/${event.id}/follow/`, {}, {
          headers: {
            Authorization: `Token ${localStorage.getItem('token')}`
          }
        });
  
        if (response.status === 201 || response.status === 200) {
          // Update the likedCards state
          setLikedCards((prevLikedCards) => {
            const newLikedCards = [...prevLikedCards];
            newLikedCards[index] = true;
            return newLikedCards;
          });
  
          // Update the event's is_liked property
          setEvents((prevEvents) => {
            const updatedEvents = [...prevEvents];
            updatedEvents[index].is_liked = true;
            return updatedEvents;
          });
        }
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  
  return (
    <div className="container">
      <h2 className="mt-4 mb-4">Events</h2>
      <div className="row">
        {events.map((event, index) => (
          <div className='col-md-3 mb-4 ' key={event.id}>
            <div className="card border-0 ">
              <div 
                className="position-relative" 
                style={{ 
                  backgroundImage: `url(${event.image})`, 
                  backgroundSize: "cover", 
                  height: "200px" 
                }}
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={() => handleMouseLeave(index)}
              >
                <div 
                  className="position-absolute bottom-buttons  d-flex flex-row justify-content-between align-items-center" 
                  style={{ 
                    bottom: "10px", 
                    right: "10px", 
                    color: "white",
                    visibility: hoveredCards[index] ? "visible" : "hidden"
                  }}
                >
                  <div className="like d-flex flex-row justify-content-center align-items-center">
                    {
                      likedCards[index] ?
                      <FontAwesomeIcon icon={faHeart} className= "mr-2"                       
                    style={{ color:  'red'  }} 
                    onClick={() => handleLikeClick(index)}
                    />
                      :
                      <FontAwesomeIcon icon={regHeart} className= "mr-2"  
                      onClick={() => handleLikeClick(index)}                     
                     />
                    }
                    

                    
                  </div>
                  <div className="like d-flex flex-row justify-content-center align-items-center">
                    <FontAwesomeIcon icon={faUpload} />
                  </div>
                  <div className="like d-flex flex-row justify-content-center align-items-center">
                  <FontAwesomeIcon icon={faEllipsis} />
                  </div>
                </div>
              </div>
              <div className="card-body">
                <h5 className="card-title">{event.title}</h5>
                <p className="card-text">{event.datetime}</p>
                <p className="card-text">{event.location}</p>
                {event.type !== 'free' && <p className="card-text">From ${event.price}</p>}
                <p className="card-text">{event.organizer}</p>
                <p className="card-text">{event.type}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Events;
