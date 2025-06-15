import { Button } from "antd";
import { loadImageFromServer, formatAvailability } from "../../utils/common";
import { veterinarySpecialties } from "../../utils/constant";
import { useState } from "react";
import AddAppointmentModal from "../Modals/AddAppointmentModal";

const VeterinaryCard = ({
  image,
  name,
  specialty,
  rating,
  reviewsCount,
  availability,
}) => {
  const [openModal, setOpenModal] = useState(false);
  const specialtyName = veterinarySpecialties.find(
    (item) => item.value === specialty
  ).name;

  return (
    <div className="card">
      <img src={loadImageFromServer(image)} alt="Dr. Ayesha Malik" />
      <h3>{name}</h3>
      <p>Specialty: {specialtyName}</p>
      <p>
        ⭐ {rating} ({reviewsCount} reviews)
      </p>
      <p>Available: {formatAvailability(availability)}</p>
      <br />
      <Button variant="solid" onClick={() => setOpenModal(true)}>
        Book Appointment
      </Button>
      <AddAppointmentModal
        id={0}
        service={specialtyName}
        open={openModal}
        category="veterinary"
        onClose={() => setOpenModal(false)}
      />
    </div>
  );
};

export default VeterinaryCard;
