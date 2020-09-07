import React from "react";

import "./ProfessionalCard.css";

const ProfessionalCard = ({ professional, imageUrl }) => {
  console.log("professional", professional)
  return (
    <div className="professionalCard">
      <div className="professionalCard__personal">
        <h3>{`${professional.lastname}, ${professional.firstname} ${professional.middlename}`}</h3>
        <label>{professional.address?.text}</label>
      </div>
      <div class="professionalCard__idContainer">
        <div className="professionalCard__id">
          <div class="professionalCard__entry">
            <h3>PRC ID No.</h3>
            <label>{professional.prc.idno}</label>
          </div>
          <div class="professionalCard__entry">
            <h3>Date Issue</h3>
            <label>{professional.prc.dtissued}</label>
          </div>
          <div class="professionalCard__entry">
            <h3>Valid Until</h3>
            <label>{professional.prc.dtvalid}</label>
          </div>
          <div class="professionalCard__entry">
            <h3>Place Issued</h3>
            <label>{professional.prc.placeissued}</label>
          </div>
        </div>
        <div className="professionalCard__id">
          <div class="professionalCard__entry">
            <h3>PTR No.</h3>
            <label>{professional.ptr.refno}</label>
          </div>
          <div class="professionalCard__entry">
            <h3>Date Issued</h3>
            <label>{professional.ptr.dtissued}</label>
          </div>
          <div class="professionalCard__entry">
            <h3>Place Issued</h3>
            <label>{professional.ptr.placeissued}</label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalCard;
