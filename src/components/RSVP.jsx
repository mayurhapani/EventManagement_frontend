import { useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";

const EventRSVP = ({ eventId }) => {
  const [rsvpStatus, setRsvpStatus] = useState("");

  const handleRSVP = async (e) => {
    const status = e.target.value;
    setRsvpStatus(status);

    // Sending RSVP status to backend API
    try {
      const response = await axios.post(
        "http://your-backend-api.com/events/rsvp",
        { eventId, status }, // Sending event ID and status (Yes/No/Maybe)
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      alert(response.data.message);
    } catch (error) {
      console.error("Error updating RSVP:", error);
      alert("Failed to update RSVP");
    }
  };

  return (
    <div className="rsvp-container">
      <label htmlFor="rsvp">RSVP to the Event:</label>
      <select
        id="rsvp"
        value={rsvpStatus}
        onChange={handleRSVP}
        className="w-full p-2 outline-none border rounded-lg my-2"
      >
        <option value="">Select your response</option>
        <option value="yes">Yes, I will attend</option>
        <option value="no">No, I can&apos;t attend</option>
        <option value="maybe">Maybe</option>
      </select>
    </div>
  );
};

// PropTypes validation
EventRSVP.propTypes = {
  eventId: PropTypes.string.isRequired, // Ensure eventId is a string and required
};

export default EventRSVP;
