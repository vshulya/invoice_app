// import React, { useState } from "react";
// import DatePicker from '../DatePicker/DatePicker'

// function InvoiceForm() {
// 	// const [isCalendarOpen, setCalendarIsOpen] = useState(false);

// 	// function handleCalendarClick(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
// 	// 	console.log('click')
// 	// 	setCalendarIsOpen(true);
// 	// };

// 	return (
// 		<main className="container">
// 			<form>
// 				<fieldset>
// 					<article>
// 						<div className="section__wrapper">
// 							<div>
// 								<section className='invoice__logo'>
// 									<label htmlFor="invoice__logo">Add your logo
// 										<div className="invoice__logo-view">
// 											<input type="file" name="logo" accept="image/png, image/jpeg" /></div>
// 									</label>
// 								</section>
// 							</div>
// 							{/* <section className="invoice__date">
// 								<h1>Invoice</h1>
// 								<label htmlFor="invoice__date">Date
// 									<input type="text" name="invoice-date" onClick={handleCalendarClick} />
// 									<DatePicker
// 										isOpen={isCalendarOpen}
// 									/>;
// 							</section> */}
// 							<div>
// 								<section className="invoice__date">
// 									<h1>Invoice</h1>
// 									<label htmlFor="invoice__number">#
// 										<input type="number" name="number" />
// 									</label>
// 									<DatePicker />
// 								</section>
// 							</div>
// 						</div>
// 						<section className='addLogo'>
// 						</section>
// 					</article>
// 				</fieldset>
// 			</form>
// 		</main >
// 	)
// }

// export default InvoiceForm;

import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';

interface Props {
	// props go here
}

const InvoiceApp: React.FC<Props> = (_props) => {
	const [invoiceNumber, setInvoiceNumber] = useState<number>(1);
	const [invoiceDate, setInvoiceDate] = useState(new Date());
	const [invoiceDueDate, setInvoiceDueDate] = useState('');
	const [senderName, setSenderName] = useState('');
	const [recipientName, setRecipientName] = useState('');
	const [invoiceItems, setInvoiceItems] = useState<{ name: number, quantity: number, price: number }[]>([{ name: 0, quantity: 0, price: 0 }]);
	const [invoiceItemAmount, setInvoiceItemAmount] = useState(0);
	const [total, setTotal] = useState(0);


	useEffect(() => {
		setTotal(calculateTotal(invoiceItems));
	}, [invoiceItems]);

	function calculateTotal(invoiceItems: { name: number, quantity: number, price: number }[]) {
		let total = 0;

		for (const item of invoiceItems) {
			total += item.quantity * item.price;
		}

		return total;
	}

	const handleInvoiceNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInvoiceNumber(parseInt(e.target.value, 10));
	};

	const handleInvoiceDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInvoiceDate(new Date(e.target.value));
	};

	const handleInvoiceDueDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInvoiceDueDate(e.target.value);
	};

	const handleSenderNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSenderName(e.target.value);
	};

	const handleRecipientNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setRecipientName(e.target.value);
	};

	const handleAddItem = () => {
		const newItem = { name: 0, quantity: 0, price: 0 };
		setInvoiceItems([...invoiceItems, newItem]);
	}

	const handleItemChange = (index: number, field: 'name' | 'quantity' | 'price', value: number) => {
		const updatedItems = [...invoiceItems];
		updatedItems[index][field] = value;
		setInvoiceItems(updatedItems);
	};

	const handleRemoveItem = (index: number) => {
		const updatedItems = [...invoiceItems];
		updatedItems.splice(index, 1);
		setInvoiceItems(updatedItems);
	};

	const handleDownload = () => {
		const doc = new jsPDF();
		doc.text(`Invoice #${invoiceNumber}`, 10, 10);
		doc.text(`Invoice date: ${invoiceDate.toDateString()}`, 10, 20);
		doc.text(`Due to: ${invoiceDueDate.toString()}`, 10, 30);
		doc.text(`Sender: ${senderName}`, 10, 40);
		doc.text(`Recipient: ${recipientName}`, 10, 50);
		doc.text('Invoice items:', 10, 60);
		let y = 70;
		for (const item of invoiceItems) {
			doc.text(`${item.name} x ${item.quantity} @ $${item.price} = $${item.quantity * item.price}`, 10, y);
			y += 10;
		}
		doc.text(`Total: $${total}`, 10, y);
		doc.save(`invoice-${invoiceNumber}.pdf`);
	};

	return (
		<main className='container'>
			<form>
				<fieldset>
					<article>
						{/* invoice info */}
						<section className='invoice__info'>
							<div className='invoice__info-row'>
								<div>
									<div className='invoice__logo'>
										<label htmlFor="invoice__logo">Add your logo
											<div className="invoice__logo-view">
												<input type="file" name="logo" accept="image/png, image/jpeg" /></div>
										</label>
									</div>
								</div>
								<div>
									<label>
										From:
										<input type="text" value={senderName} onChange={handleSenderNameChange} required />
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
									<label>
										Due date:
										<input type="date" value={invoiceDueDate} onChange={handleInvoiceDueDateChange} />
									</label>
								</div>
								<div>
									<label>
										To:
										<input type="text" value={recipientName} onChange={handleRecipientNameChange} required />
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
									{/* <input type="text" value={item.name} onChange={(e) => handleItemChange(index, 'name', e.target.value)} />	 */}
									<input type="number" value={item.name} onChange={(e) => handleItemChange(index, 'name', parseInt(e.target.value, 10))} />
								</label>
								<label>
									Quantity:
									<input type="number" value={item.quantity} onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value, 10))} />
								</label>
								<label>
									Price:
									<input type="number" value={item.price} onChange={(e) => handleItemChange(index, 'price', parseInt(e.target.value, 10))} />
								</label>
								<label>
									Amount
									<input type="text" value={item.price*item.quantity} />
								</label>
								<label>
									<button className='invoice__item-button' type="button" onClick={() => handleRemoveItem(index)}>Remove</button>
								</label>
							</div>
						))}

						<button type="button" onClick={handleAddItem}>Add item</button>
						<br />
						<h4>Subtotal: ${total}</h4>
						<h3>Tubotal: ${total}</h3>
						<button type="button" onClick={handleDownload}>Download invoice</button>

					</article>
				</fieldset>
			</form>
		</main >
	);
};

export default InvoiceApp;

