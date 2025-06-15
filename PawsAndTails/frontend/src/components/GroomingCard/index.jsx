import { Button } from "antd";
import {
  formatAvailability,
  loadImageFromServer,
  getServiceName,
} from "../../utils/common";
import AddAppointmentModal from "../Modals/AddAppointmentModal";
import { useState } from "react";

const GroomingCard = ({
  image,
  title,
  services,
  price,
  rating,
  reviewsCount,
  availability,
  _id,
}) => {
  const [openModal, setOpenModal] = useState(false);
  return (
    <div className="card" style={{ width: "100%" }}>
      <img src={loadImageFromServer(image)} alt="Premium Grooming" />
      <h3>{title}</h3>
      <p>Service: {services.map((k) => getServiceName(k)).join(", ")}</p>
      <p>Price: Rs. {price}</p>
      <p>
        ⭐ {rating} ({reviewsCount} reviews)
      </p>
      <p>Available: {formatAvailability(availability)}</p>
      <br />
      <Button variant="solid" onClick={() => setOpenModal(true)}>
        Book Now
      </Button>
      <AddAppointmentModal
        id={0}
        service={title}
        open={openModal}
        category="grooming"
        onClose={() => setOpenModal(false)}
      />
    </div>
  );
};

export default GroomingCard;
