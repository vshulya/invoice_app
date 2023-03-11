import React from "react";
import InvoiceForm from "../InvoiceForm/InvoiceForm";

type MainProps = {
  selectedLabel: string;
};

function Main({ selectedLabel }: MainProps) {
  return (
    <main className="container">
      <InvoiceForm currency={selectedLabel} />
    </main>
  );
}

export default Main;
