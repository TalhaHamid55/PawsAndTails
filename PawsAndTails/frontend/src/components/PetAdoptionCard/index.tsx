import { useEffect, useState } from "react";
import { loadImageFromServer } from "../../utils/common";
import { Button, Modal } from "antd";
import { species } from "../../utils/constant";

const PetAdoptionCard = ({
  image,
  name,
  breed,
  petAge,
  petType,
  location,
  description,
  address,
  contact,
  ownerName,
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [breedName, setBreedName] = useState("");

  useEffect(() => {
    let name = breed;
    if (breed && petType) {
      const pet = species.find((item) => item.value === petType);
      const foundBreed = pet?.breeds.find((b) => b.value === breed);
      if (foundBreed) {
        name = foundBreed.name;
      }
    }
    setBreedName(name);
  }, [breed, petType]);

  return (
    <>
      <div className="pet-card">
        <img src={loadImageFromServer(image)} alt={name} />
        <h3>{name}</h3>
        <p>
          {breedName} • {petAge} • {location}
        </p>
        <Button
          variant="solid"
          color="primary"
          onClick={() => {
            setShowDetails(true);
          }}
        >
          View Details
        </Button>
      </div>
      <Modal
        title={`About ${name}`}
        closable={{ "aria-label": "Custom Close Button" }}
        open={showDetails}
        onCancel={() => setShowDetails(false)}
        footer={<></>}
      >
        <p>{description}</p>
        <p>
          <strong>Owner Name:</strong> {ownerName}
          <br />
          <strong>Address:</strong> {address}
          <br />
          <strong>Contact:</strong>
          <a href={`tel:${contact}`}>{contact}</a>
        </p>
      </Modal>
    </>
  );
};

export default PetAdoptionCard;
