import React, { useState, useEffect } from 'react';
import PDFFile from '../PDFFile/PDFFile';
import {PDFDownloadLink} from "@react-pdf/renderer";


interface Props {
	// props go here
}


const InvoiceApp: React.FC<Props> = (_props) => {
	const [invoiceNumber, setInvoiceNumber] = useState<number>(1);
	const [invoiceDate, setInvoiceDate] = useState(new Date());
	const [invoiceDueDate, setInvoiceDueDate] = useState(new Date());
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



	useEffect(() => {
		setSubtotal(calculateSubtotal(invoiceItems));
	}, [invoiceItems]);

	useEffect(() => {
		// Call calculateAndSetTotal() function here
		calculateAndSetTotal(subtotal, discount, tax, shipping);
	}, [subtotal, discount, tax, shipping]);

	function calculateSubtotal(invoiceItems: { name: string, quantity: number, price: number }[]) {
		let subtotal = 0;
	
		for (const item of invoiceItems) {
			subtotal += item.quantity * item.price;
		}
	
		return subtotal;
	}

	function calculateAndSetTotal(subtotal: number, discount: number, tax: number, shipping: number) {
		const calculatedTotal = (subtotal * (1 - (discount / 100))) + ((subtotal * (1 - (discount / 100))) * (tax / 100)) + shipping;
		setTotal(calculatedTotal)
	}

	const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setDiscount(parseInt(e.target.value, 10));
	}

	const handleTaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setTax(parseInt(e.target.value, 10));
	}

	const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setShipping(parseInt(e.target.value, 10));
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

	const handleItemChange = (index: number, field: keyof { quantity: number; price: number }, value: number) => {
		const updatedItems = [...invoiceItems];

		updatedItems[index][field] = value;
		setInvoiceItems(updatedItems);
	};
	const handleNameChange = (index:number, value: string) =>
	{
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

	const handleAddDueTo = () => {
		setShowDueDate(true);
	};

	const handleAddDiscount = () => {
		setShowDiscount(true);
	};

	const handleAddTax = () => {
		setShowTax(true);
	};

	const handleAddShipping = () => {
		setShowShipping(true);
	};

	function handleDownload() {
	}

	// additional labels 
	const showDueDateButton = <button type="button" onClick={handleAddDueTo}>Add Due to</button>;
	const dueDateLabel = (<label>
		Due date:
		<input type="date" value={invoiceDueDate.toISOString().substr(0, 10)} onChange={handleInvoiceDueDateChange} />
	</label>);

	const showDiscountButton = <button type="button" onClick={handleAddDiscount}>Add Discount</button>;
	const discountLabel = (<label>
		Discount %:
		<input type="number" value={discount} onChange={handleDiscountChange} />
	</label>);

	const showTaxButton = <button type="button" onClick={handleAddTax}>Add Tax</button>;
	const taxLabel = (<label>
		Tax %:
		<input type="number" value={tax} onChange={handleTaxChange} />
	</label>);

	const showShippingButton = <button type="button" onClick={handleAddShipping}>Add Shipping</button>;
	const shippingLabel = (<label>
		Shipping <span>{currency}</span>:
		<input type="number" value={shipping} onChange={handleShippingChange} />
	</label>);


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
										<textarea 										
										id="textarea-from-input"
										rows={3}
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
									{showDueDate ? dueDateLabel : showDueDateButton}
								</div>
								<div>
									<label>
										To:
										<textarea id="textarea-to-input"
										rows={3}
										cols={50}  value={recipientName} onChange={handleRecipientNameChange} required />
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
									<input type="text" value={item.name} onChange={(e) => handleNameChange(index,  e.target.value)} />
								</label>
								<label>
									Quantity:
									<input type="number" value={item.quantity} onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value, 10))} />
								</label>
								<label>
									Price <span>{currency}</span>:
									<input type="number" value={item.price} onChange={(e) => handleItemChange(index, 'price', parseInt(e.target.value, 10))} />
								</label>
								<label>
									Amount <span>{currency}</span>:
									<input type="text" value={item.price * item.quantity} readOnly />
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
			<PDFDownloadLink
			document={<PDFFile 
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

			/> }>
				{({loading}) => (loading ? 'Loading document...' : <button>Download invoice</button>)}
			</PDFDownloadLink>
		</main >
	);
};

export default InvoiceApp;

