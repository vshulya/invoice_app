import React, { useState, useEffect } from 'react';
import PDFFile from '../PDFFile/PDFFile';
import { PDFDownloadLink } from "@react-pdf/renderer";
import { ChangeEvent } from 'react';


interface Props {
	// props go here
}


const InvoiceApp: React.FC<Props> = (_props) => {
	const [invoiceLogo, setInvoiceLogo] = useState('');
	const [invoiceNumber, setInvoiceNumber] = useState<number>(1);
	const [invoiceDate, setInvoiceDate] = useState(new Date());
	const [invoiceDueDate, setInvoiceDueDate] = useState<Date | null>(null);
	const [senderName, setSenderName] = useState('');
	const [recipientName, setRecipientName] = useState('');
	const [invoiceItems, setInvoiceItems] = useState<{ name: string, quantity: number, price: number }[]>([{ name: '', quantity: 0, price: 0 }]);
	const [invoiceNote, setInvoiceNote] = React.useState('');


	const [subtotal, setSubtotal] = useState(0);
	const [discount, setDiscount] = useState<number>(0);
	const [tax, setTax] = useState<number>(0);
	const [shipping, setShipping] = useState<number>(0);
	const [total, setTotal] = useState(0);

	const [currency, setCurrency] = useState('$');

	const [showDueDate, setShowDueDate] = useState(false);
	const [showDiscount, setShowDiscount] = useState(false);
	const [showTax, setShowTax] = useState(false);
	const [showShipping, setShowShipping] = useState(false);

	const [isFormValid, setIsFormValid] = useState(false);



	useEffect(() => {
		setSubtotal(calculateSubtotal(invoiceItems));
	}, [invoiceItems]);

	useEffect(() => {
		// Call calculateAndSetTotal() function here
		calculateAndSetTotal(subtotal, discount, tax, shipping);
	}, [subtotal, discount, tax, shipping]);

	useEffect(() => {
		setIsFormValid(validateForm());
	}, [senderName, recipientName]);

	const validateForm = () => {
    const textarea = document.querySelector('textarea');
    if(textarea && !textarea.checkValidity()) {
        return false;
    } else {
        return senderName.trim().length > 0 && recipientName.trim().length > 0;
    }
}

const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
	e.preventDefault();
	if(validateForm()) {
		setIsFormValid(true);
	}
};

	// const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
	// 	e.preventDefault();
	// 	const textarea = e.currentTarget.querySelector('textarea');
	// 	//check if textarea is not null, then check if the textarea is valid or not
	// 	if(textarea && !textarea.checkValidity()) {
	// 		textarea.setCustomValidity('This field is required');
	// } else {
	// 		setIsFormValid(true);
	// 	}
	// };

	function calculateSubtotal(invoiceItems: { name: string, quantity: number, price: number }[]) {
		let subtotal = 0;

		for (const item of invoiceItems) {
			subtotal += item.quantity * item.price;
		}

		return subtotal = parseFloat(subtotal.toFixed(2));;
	}

	function calculateAndSetTotal(subtotal: number, discount: number, tax: number, shipping: number) {
		let calculatedTotal = (subtotal * (1 - (discount / 100))) + ((subtotal * (1 - (discount / 100))) * (tax / 100)) + shipping;
		calculatedTotal = parseFloat(calculatedTotal.toFixed(2));
		setTotal(calculatedTotal)
	}

	const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		// check if value is a valid decimal
		if (/^\d+(\.\d{1,2})?$/.test(value)) {
			//the parseFloat() function to convert the input string to a decimal number
			setDiscount(parseFloat(value));
		}
	}

	const handleTaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		// check if value is a valid decimal
		if (/^\d+(\.\d{1,2})?$/.test(value)) {
			//the parseFloat() function to convert the input string to a decimal number
			setTax(parseFloat(value));
		}
	}

	const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		// check if value is a valid decimal
		if (/^\d+(\.\d{1,2})?$/.test(value)) {
			//the parseFloat() function to convert the input string to a decimal number
			setShipping(parseFloat(value));
		}
	}

	const handleLogoChange = (event: ChangeEvent<HTMLInputElement>) => {
		if (event.target.files) {
			// get the selected file
			const file = event.target.files[0];

			// create a URL for the file
			const fileUrl = URL.createObjectURL(file);

			// update the invoiceLogo state variable with the file URL
			setInvoiceLogo(fileUrl);
		}
	}

	const handleInvoiceNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInvoiceNumber(parseInt(e.target.value, 10));
	};

	const handleInvoiceDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInvoiceDate(new Date(e.target.value));
	};

	const handleInvoiceDueDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInvoiceDueDate(new Date(e.target.value));
	};

	const handleSenderNameChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setSenderName(e.target.value);
	};

	const handleRecipientNameChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setRecipientName(e.target.value);
	};

	const handleAddItem = () => {
		const newItem = { name: '', quantity: 0, price: 0 };
		setInvoiceItems([...invoiceItems, newItem]);
	}

	const handleItemChange = (index: number, field: keyof { quantity: number; price: number }, value: string) => {
		const updatedItems = [...invoiceItems];
		updatedItems[index][field] = parseFloat(value);
		setInvoiceItems(updatedItems);
	};

	const handleNameChange = (index: number, value: string) => {
		const updatedItems = [...invoiceItems];

		updatedItems[index].name = value;
		setInvoiceItems(updatedItems);
	};

	const handleRemoveItem = (index: number) => {
		const updatedItems = [...invoiceItems];
		updatedItems.splice(index, 1);
		setInvoiceItems(updatedItems);
	};

	const handleInvoiceNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setInvoiceNote(e.target.value);
	};

	// adding additional labels
	const handleAddDueTo = () => {
		setShowDueDate(true);
		setInvoiceDueDate(new Date());
	};

	const toggleAddDiscount = () => setShowDiscount(!showDiscount);

	const toggleAddTax = () => setShowTax(!showTax);

	const toggleAddShipping = () => setShowShipping(!showShipping);

	// additional labels 
	const showDueDateButton = <button type="button" onClick={handleAddDueTo}>Add Due to</button>;
	const dueDateToLabel = (<label>
		Due Date:
		{invoiceDueDate && (
			<input type="date" value={invoiceDueDate.toISOString().substr(0, 10)} onChange={handleInvoiceDueDateChange} />
		)}
	</label>);


	const showDiscountButton = <button type="button" onClick={toggleAddDiscount}>Add Discount</button>;
	const discountLabel = (<div className="add__label"><label className='add__label-label'>
		Discount %:
		<input type="number" step="any" value={discount} onChange={handleDiscountChange} />
	</label><label><button className="add__button outline secondary" type="button" onClick={toggleAddDiscount}>x</button></label></div>);

	const showTaxButton = <button type="button" onClick={toggleAddTax}>Add Tax</button>;
	const taxLabel = (<div className='add__label'><label className='add__label-label'>
		Tax %:
		<input type="number" step="any" value={tax} onChange={handleTaxChange} /></label><label><button className="add__button outline secondary" type="button" onClick={toggleAddTax}>x</button></label>
	</div>);

	const showShippingButton = <button type="button" onClick={toggleAddShipping}>Add Shipping</button>;
	const shippingLabel = (<div className='add__label'><label className='add__label-label'>
		Shipping <span>{currency}</span>:
		<input type="number" step="any" value={shipping} onChange={handleShippingChange} /> </label><label><button className="add__button outline secondary" type="button" onClick={toggleAddShipping}>x</button>
		</label></div>);


	return (

		<main className='container'>
			<form onSubmit={handleSubmit}>
				<fieldset>
					<article>
						{/* invoice info */}
						<section className='invoice__info'>
							<div className='invoice__info-row'>
								<div>
									<div className='invoice__logo'>
										<label htmlFor="invoice__logo">Add your logo
											<div className="invoice__logo-view">
												<input type="file" name="logo" accept="image/png, image/jpeg" onChange={handleLogoChange} /></div>
										</label>
									</div>
								</div>
								<div>
									<label>
										From:
										<textarea
											id="textarea-from-input"
											rows={5}
											cols={50} value={senderName} onChange={handleSenderNameChange} required />
									</label>
								</div>
							</div>
							<div className='invoice__info-row'>
								<div>
									<label>
										Invoice number:
										<input type="text" value={invoiceNumber} onChange={handleInvoiceNumberChange} />
									</label>
									<label>
										Invoice date:
										<input type="date" value={invoiceDate.toISOString().substr(0, 10)} onChange={handleInvoiceDateChange} />
									</label>
									{showDueDate ? dueDateToLabel : showDueDateButton}
								</div>
								<div>
									<label>
										To:
										<textarea id="textarea-to-input"
											rows={5}
											cols={50} value={recipientName} onChange={handleRecipientNameChange} required />
									</label>
								</div>
							</div>
						</section>
						<br />
						<h3>Invoice items:</h3>
						{invoiceItems.map((item, index) => (
							<div className='invoice__items' key={index}>
								<label className='invoice__item'>
									Name:
									<input type="text" value={item.name} onChange={(e) => handleNameChange(index, e.target.value)} />
								</label>
								<label>
									Quantity:
									<input type="number" step="any" value={item.quantity} onChange={(e) => handleItemChange(index, 'quantity', e.target.value)} />
								</label>
								<label>
									Price <span>{currency}</span>:
									<input type="number" step="any" value={item.price} onChange={(e) => handleItemChange(index, 'price', e.target.value)} />
								</label>
								<label>
									Amount <span>{currency}</span>:
									<input type="text" value={(item.price * item.quantity).toFixed(2)} readOnly />
								</label>
								<label>
									<button className='invoice__item-button' type="button" onClick={() => handleRemoveItem(index)}>Remove</button>
								</label>
							</div>
						))}

						<button type="button" onClick={handleAddItem}>Add item</button>
						<br />
						<section className='price'>
							<div>
								<label>
									Notes
									<textarea
										id="textarea-input"
										rows={10}
										cols={50}
										value={invoiceNote}
										onChange={handleInvoiceNoteChange}
									/>
								</label>
							</div>
							<div>
								<h4>Subtotal: ${subtotal}</h4>
								{showDiscount ? discountLabel : showDiscountButton}
								{showTax ? taxLabel : showTaxButton}
								{showShipping ? shippingLabel : showShippingButton}

								<h3>Total: ${total}</h3>
							</div>
						</section>
					</article>
				</fieldset>
			</form>

			{isFormValid ? <PDFDownloadLink
				document={<PDFFile
					invoiceLogo={invoiceLogo}
					invoiceNumber={invoiceNumber}
					invoiceDate={invoiceDate}
					invoiceDueDate={invoiceDueDate}
					senderName={senderName}
					recipientName={recipientName}
					invoiceItems={invoiceItems}
					invoiceNote={invoiceNote}

					subtotal={subtotal}
					discount={discount}
					tax={tax}
					shipping={shipping}
					total={total}

					currency={currency}

				/>}>
				{({ loading }) => (loading ? <button>'Loading document...'</button> : <button type="submit">Download invoice</button>)}
				{/* todo not sure about Loading document... */}
			</PDFDownloadLink> : <button disabled>Download invoice</button>}
		</main >
	);
};

export default InvoiceApp;

