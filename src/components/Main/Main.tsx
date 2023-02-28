import React from "react";
import InvoiceForm from '../InvoiceForm/InvoiceForm';

type MainProps = {
	selectedValue: string,
	selectedLabel: string
};

function Main({ selectedValue, selectedLabel }: MainProps) {

	return (
		<main className="container">
			<InvoiceForm
				currency={selectedLabel} />
		</main>
	)
}

export default Main;