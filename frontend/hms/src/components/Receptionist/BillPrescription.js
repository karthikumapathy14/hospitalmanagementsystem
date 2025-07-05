import React from 'react';
import Bill from './Bill';
import ViewPrescription from './ViewPrescription';

const BillPrescription = () => {
  return (
    <div className="d-flex justify-content-center gap-4 px-4">
      <div style={{ flex: 1, minWidth: "50%" }}>
        <ViewPrescription />
      </div>
      <div style={{ flex: 1, minWidth: "50%" }}>
        <Bill />
      </div>
    </div>
  );
};

export default BillPrescription;
