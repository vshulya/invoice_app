import React, { useState, useEffect } from 'react';
import PDFFile from '../PDFFile/PDFFile';
import { PDFDownloadLink } from "@react-pdf/renderer";
import { ChangeEvent } from 'react';


interface Props {
	// props go here
}


const InvoiceApp: React.FC<Props> = (_props) => {
	const [invoiceLogo, setInvoiceLogo] = useState('');
	const [invoiceLogoPreview, setInvoiceLogoPreview] = useState('');
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
		localStorage.getItem('senderName') && setSenderName(JSON.parse(localStorage.getItem('senderName') || ''));
		localStorage.getItem('recipientName') && setRecipientName(JSON.parse(localStorage.getItem('recipientName') || ''));
		localStorage.getItem('invoiceItems') && setInvoiceItems(JSON.parse(localStorage.getItem('invoiceItems') || ''));
		localStorage.getItem('invoiceNote') && setInvoiceNote(JSON.parse(localStorage.getItem('invoiceNote') || ''));
		localStorage.getItem('invoiceLogo') && setInvoiceLogo(JSON.parse(localStorage.getItem('invoiceLogo') || ''));
		localStorage.getItem('invoiceNumber') && setInvoiceNumber(JSON.parse(localStorage.getItem('invoiceNumber') || ''));
	}, []);

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
		if (textarea && !textarea.checkValidity()) {
			return false;
		} else {
			return senderName.trim().length > 0 && recipientName.trim().length > 0;
		}
	}

	// const handleSaveLocaleStorage = () => {
	// 	try {
	// 		const data = {
	// 			senderName,
	// 			recipientName,
	// 			invoiceItems,
	// 			invoiceNote,
	// 			invoiceNumber,
	// 			discount: discount || null,
	// 			tax: tax || null,
	// 			shipping: shipping || null,
	// 			currency,
	// 			invoiceLogoPreview
	// 		}

	// 		const input = document.getElementById("fileInput") as HTMLInputElement;
	// 		if (input && input.files && input.files.length > 0) {
	// 			const file = input.files[0];
	// 			const reader = new FileReader();
	// 			reader.onload = () => {
	// 				localStorage.setItem("invoiceLogo", JSON.stringify(reader.result));
	// 			};
	// 			reader.readAsDataURL(file);
	// 		}

	// 	} catch (err) {
	// 		console.error(err);
	// 	}
	// }

	// useEffect(() => {
	// 	const data = JSON.parse(localStorage.getItem('data') || '{}');
	// 	setSenderName(data.senderName || '');
	// 	setRecipientName(data.recipientName || '');
	// 	setInvoiceItems(data.invoiceItems || '');
	// 	setInvoiceNote(data.invoiceNote || '');
	// 	setInvoiceNumber(data.invoiceNumber || '');
	// 	setInvoiceLogo(data.invoiceLogo || '');
	// 	setInvoiceLogoPreview(data.invoiceLogoPreview || '');
	// 	setInvoiceDate(data.invoiceDate || '');
	// 	setShowDiscount(data.showDiscount || '');
	// 	setTax(data.tax || '');
	// 	setShowTax(data.showTax || false);
	// 	setDiscount(data.discount || '');
	// 	setShipping(data.shipping || '');
	// 	setShowShipping(data.showShipping || false);
	// }, []);

	useEffect(() => {
		localStorage.getItem('senderName') && setSenderName(JSON.parse(localStorage.getItem('senderName') || ''));
		localStorage.getItem('recipientName') && setRecipientName(JSON.parse(localStorage.getItem('recipientName') || ''));
		localStorage.getItem('invoiceItems') && setInvoiceItems(JSON.parse(localStorage.getItem('invoiceItems') || ''));
		localStorage.getItem('invoiceNote') && setInvoiceNote(JSON.parse(localStorage.getItem('invoiceNote') || ''));
		localStorage.getItem('invoiceNumber') && setInvoiceNumber(JSON.parse(localStorage.getItem('invoiceNumber') || ''));
		localStorage.getItem('invoiceLogo') && setInvoiceLogo(JSON.parse(localStorage.getItem('invoiceLogo') || ''));
		localStorage.getItem('invoiceLogoPreview') && setInvoiceLogoPreview(JSON.parse(localStorage.getItem('invoiceLogoPreview') || ''));
		localStorage.getItem('invoiceDate') && setInvoiceDate(JSON.parse(localStorage.getItem('invoiceDate') || ''));
		localStorage.getItem('showDiscount') && setShowDiscount(JSON.parse(localStorage.getItem('showDiscount') || ''));

		const taxData = localStorage.getItem('tax');
		if (taxData !== null && taxData !== undefined) {
			setShowTax(true);
			localStorage.getItem('tax') && setTax(JSON.parse(localStorage.getItem('tax') || ''));
		}

		const discountData = localStorage.getItem('discount');
		if (discountData !== null && discountData !== undefined) {
			setShowDiscount(true);
			localStorage.getItem('discount') && setDiscount(JSON.parse(localStorage.getItem('discount') || ''));
		};

		const shippingData = localStorage.getItem('shipping');
		if (shippingData !== null && shippingData !== undefined) {
			setShowShipping(true);
			localStorage.getItem('shipping') && setShipping(JSON.parse(localStorage.getItem('shipping') || ''));
		};

		localStorage.getItem('showShipping') && setShowShipping(JSON.parse(localStorage.getItem('showShipping') || ''));
	}, []);

	const handleSaveLocaleStorage = () => {
		try {
			localStorage.setItem('senderName', JSON.stringify(senderName));
			localStorage.setItem('recipientName', JSON.stringify(recipientName));
			localStorage.setItem('invoiceItems', JSON.stringify(invoiceItems));
			localStorage.setItem('invoiceNote', JSON.stringify(invoiceNote));
			localStorage.setItem('invoiceNumber', JSON.stringify(invoiceNumber));
			localStorage.setItem('discount', discount ? JSON.stringify(discount) : '');
			localStorage.setItem('tax', tax ? JSON.stringify(tax) : '');
			localStorage.setItem('shipping', shipping ? JSON.stringify(shipping) : '');
			localStorage.setItem('currency', JSON.stringify(currency));
			localStorage.setItem('invoiceLogoPreview', JSON.stringify(invoiceLogoPreview));


			const input = document.getElementById("fileInput") as HTMLInputElement;
			if (input && input.files && input.files.length > 0) {
				const file = input.files[0];
				const reader = new FileReader();
				reader.onload = () => {
					localStorage.setItem("invoiceLogo", JSON.stringify(reader.result));
				};
				reader.readAsDataURL(file);
			}

		} catch (err) {
			console.error(err);
		}
	}

	const handleRemoveLocalStorage = () => {
		localStorage.removeItem('senderName');
		localStorage.removeItem('recipientName');
		localStorage.removeItem('invoiceItems');
		localStorage.removeItem('invoiceNote');
		localStorage.removeItem('invoiceNumber');
		localStorage.removeItem('discount');
		localStorage.removeItem('tax');
		localStorage.removeItem('shipping');
		localStorage.removeItem('currency');
		localStorage.removeItem('invoiceLogo');
		localStorage.removeItem('invoiceLogoPreview');
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (validateForm()) {
			setIsFormValid(true);
		}
	};


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
		if (value === "" || !isNaN(value as any)) {
			setDiscount(value === "" ? 0 : parseFloat(value));
		}
	};

	const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if ((e.key === 'Backspace' || e.key === 'Delete') && e.currentTarget.value.endsWith('0')) {
			e.currentTarget.value = e.currentTarget.value.slice(0, -1);
		}
	}

	const handleTaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		if (value === "" || !isNaN(value as any)) {
			setTax(value === "" ? 0 : parseFloat(value));
		}
	}

	const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		if (value === "" || !isNaN(value as any)) {
			setShipping(value === "" ? 0 : parseFloat(value));
		}
	}

	const handleLogoChange = (event: ChangeEvent<HTMLInputElement>) => {
		if (event.target.files) {
			// get the selected file
			const file = event.target.files[0];

			var reader = new FileReader();
			reader.onload = function (event) {
				var res = event.target?.result;
				//localStorage.setItem("invoiceLogo2", JSON.stringify(res));

				setInvoiceLogoPreview(res?.valueOf() as string);
			}
			reader.readAsDataURL(file)
			// create a URL for the file
			const fileUrl = URL.createObjectURL(file);

			// update the invoiceLogo state variable with the file URL
			setInvoiceLogo(fileUrl);
			// update the invoiceLogoPreview state variable with the file URL
		}
	}

	const handleLogoAdd = () => {
		const fileInput = document.getElementById("fileInput");
		//check if fileInput exists
		if (fileInput) {
			fileInput.click();
		}
	};

	const handleLogoRemove = () => {
		setInvoiceLogo('');
		setInvoiceLogoPreview('');
	};

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

		//setInvoiceItems(updatedItems);

		// check if value is a valid decimal
		if (/^\d+(\.\d{1,2})?$/.test(value)) {
			updatedItems[index][field] = parseFloat(value);
			//the parseFloat() function to convert the input string to a decimal number
			setInvoiceItems(updatedItems);
		};
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
		<input type="number" step="any" value={discount} onChange={handleDiscountChange} onKeyDown={handleKeyPress} /></label>
		<label><button className="add__button outline secondary" type="button" onClick={toggleAddDiscount}>x</button></label></div>);

	const showTaxButton = <button type="button" onClick={toggleAddTax}>Add Tax</button>;
	const taxLabel = (<div className='add__label'><label className='add__label-label'>
		Tax %:
		<input type="number" step="any" value={tax} onChange={handleTaxChange} onKeyDown={handleKeyPress} /></label>
		<label><button className="add__button outline secondary" type="button" onClick={toggleAddTax}>x</button></label>
	</div>);

	const showShippingButton = <button type="button" onClick={toggleAddShipping}>Add Shipping</button>;
	const shippingLabel = (<div className='add__label'><label className='add__label-label'>
		Shipping <span>{currency}</span>:
		<input type="number" step="any" value={shipping} onChange={handleShippingChange} onKeyDown={handleKeyPress} /></label>
		<label><button className="add__button outline secondary" type="button" onClick={toggleAddShipping}>x</button></label>
	</div>);

	const handleFormReset = () => {
		setInvoiceNumber(1);
		setInvoiceDate(new Date());
		setInvoiceDueDate(new Date());
		setSenderName('');
		setRecipientName('');
		setInvoiceItems([{ name: '', quantity: 0, price: 0 }]);
		setInvoiceNote('');
		setInvoiceLogo('');
		setInvoiceLogoPreview('');
		setShowDueDate(false);
		setShowDiscount(false);
		setShowTax(false);
		setShowShipping(false);
		setDiscount(0);
		setTax(0);
		setShipping(0);
		handleRemoveLocalStorage();
	};


	return (

		<main className='container'>
			<form onSubmit={handleSubmit}>
				<fieldset>
					<article>
						{/* invoice info */}
						<section className='invoice__info'>
							<div className='invoice__info-row'>
								<div>
									<div className="invoice__logo">
										<label htmlFor="invoice__logo">Add your logo
											<div className="invoice__logo-view">
												<input type="file" id="fileInput" name="logo" accept="image/png, image/jpeg" onChange={handleLogoChange} style={{ display: 'none' }} />
												<button onClick={handleLogoAdd}>Add your logo</button>
											</div>
										</label>
										<div className="invoice__logo-preview">
											{invoiceLogoPreview && <img className="invoice__logo-preview-img" src={invoiceLogoPreview} alt="logo" />}
											<label>{invoiceLogoPreview ? <button className="remove__button outline secondary" type="button" onClick={handleLogoRemove}>x</button> : null}</label>
										</div>
									</div>
								</div>
								<div>
									<label>
										From:
										<textarea style={{ overflow: 'auto', height: '200px' }}
											id="textarea-from-input"
											rows={50}
											cols={50}
											value={senderName}
											placeholder="required"
											onChange={handleSenderNameChange}
											minLength={2}
											maxLength={200}
											required />
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
										<textarea
											style={{ overflow: 'auto', height: '200px' }}
											id="textarea-to-input"
											rows={50}
											cols={50}
											value={recipientName}
											placeholder="required"
											onChange={handleRecipientNameChange}
											minLength={2}
											maxLength={200}
											required />
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
									<input type="number" step="any" value={item.quantity} onChange={(e) => handleItemChange(index, 'quantity', e.target.value)} onKeyDown={handleKeyPress} />
								</label>
								<label>
									Price <span>{currency}</span>:
									<input type="number" step="any" value={item.price} onChange={(e) => handleItemChange(index, 'price', e.target.value)} onKeyDown={handleKeyPress} />
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
				{({ loading }) => (loading ? <button>'Loading document...'</button> : <button onClick={handleSaveLocaleStorage} type="submit">Download invoice</button>)}
				{/* todo not sure about Loading document... */}
			</PDFDownloadLink> : <button disabled>Download invoice</button>}
			<button onClick={handleFormReset}>Reset form</button>
		</main >
	);
};

export default InvoiceApp;

