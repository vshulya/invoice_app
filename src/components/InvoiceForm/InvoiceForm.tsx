import React, { useState, useEffect } from 'react';
import PDFFile from '../PDFFile/PDFFile';
import { PDFDownloadLink } from "@react-pdf/renderer";
import { ChangeEvent } from 'react';


interface Props {

}


const InvoiceApp: React.FC<Props> = (_props) => {
	const [invoiceLogoPreview, setInvoiceLogoPreview] = useState('');
	const [invoiceNumber, setInvoiceNumber] = useState<number>(1);
	const [invoiceDate, setInvoiceDate] = useState(new Date());
	const [invoiceDueDate, setInvoiceDueDate] = useState<Date | null>(null);
	const [senderName, setSenderName] = useState('');
	const [recipientName, setRecipientName] = useState('');
	const [invoiceItems, setInvoiceItems] = useState<{ name: string, quantity: string, price: string }[]>([{ name: '', quantity: '0', price: '0' }]);
	const [invoiceNote, setInvoiceNote] = React.useState('');


	const [subtotal, setSubtotal] = useState(0);
	const [discount, setDiscount] = useState<string>("0");
	const [tax, setTax] = useState<string>("0");
	const [shipping, setShipping] = useState<string>("0");
	const [discountType, setDiscountType] = useState<string>("percentage");
	const [total, setTotal] = useState(0);

	const [currency, setCurrency] = useState('$');

	const [showDueDate, setShowDueDate] = useState(false);
	const [showDiscount, setShowDiscount] = useState(false);
	const [showTax, setShowTax] = useState(false);
	const [showShipping, setShowShipping] = useState(false);

	const [isFormValid, setIsFormValid] = useState(false);

	const [invoiceLogoError, setInvoiceLogoError] = useState('');


	//Validation for the form
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

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (validateForm()) {
			setIsFormValid(true);
		}
	};

	//Local storage part

	const handleSaveLocaleStorage = () => {
		try {
			localStorage.setItem('senderName', JSON.stringify(senderName));
			localStorage.setItem('recipientName', JSON.stringify(recipientName));
			localStorage.setItem('invoiceItems', JSON.stringify(invoiceItems));
			localStorage.setItem('invoiceNote', JSON.stringify(invoiceNote));
			localStorage.setItem('invoiceNumber', JSON.stringify(invoiceNumber));
			localStorage.setItem('currency', JSON.stringify(currency));
			localStorage.setItem('invoiceLogoPreview', JSON.stringify(invoiceLogoPreview));

			if (showDiscount) {
				localStorage.setItem('discount', JSON.stringify(discount));
				localStorage.setItem('discountType', JSON.stringify(discountType));
			};
			if (showTax) {
				localStorage.setItem('tax', JSON.stringify(tax));
			};
			if (showShipping) {
				localStorage.setItem('shipping', JSON.stringify(shipping));
			};

		} catch (err) {
			console.error(err);
		}
	}

	useEffect(() => {
		localStorage.getItem('senderName') && setSenderName(JSON.parse(localStorage.getItem('senderName') || ''));
		localStorage.getItem('recipientName') && setRecipientName(JSON.parse(localStorage.getItem('recipientName') || ''));
		localStorage.getItem('invoiceItems') && setInvoiceItems(JSON.parse(localStorage.getItem('invoiceItems') || ''));
		localStorage.getItem('invoiceNote') && setInvoiceNote(JSON.parse(localStorage.getItem('invoiceNote') || ''));
		localStorage.getItem('invoiceNumber') && setInvoiceNumber(JSON.parse(localStorage.getItem('invoiceNumber') || ''));
		localStorage.getItem('invoiceLogoPreview') && setInvoiceLogoPreview(JSON.parse(localStorage.getItem('invoiceLogoPreview') || ''));

		const discountData = localStorage.getItem('discount');
		if (discountData !== null && discountData !== undefined) {
			setShowDiscount(true);
			localStorage.getItem('discount') && setDiscount(JSON.parse(localStorage.getItem('discount') || ''));
			localStorage.getItem('discountType') && setDiscountType(JSON.parse(localStorage.getItem('discountType') || ''));
		};

		const taxData = localStorage.getItem('tax');
		if (taxData !== null && taxData !== undefined) {
			setShowTax(true);
			localStorage.getItem('tax') && setTax(JSON.parse(localStorage.getItem('tax') || ''));
		}

		const shippingData = localStorage.getItem('shipping');
		if (shippingData !== null && shippingData !== undefined) {
			setShowShipping(true);
			localStorage.getItem('shipping') && setShipping(JSON.parse(localStorage.getItem('shipping') || ''));
		};

		localStorage.getItem('showShipping') && setShowShipping(JSON.parse(localStorage.getItem('showShipping') || ''));
	}, []);

	const handleRemoveLocalStorage = () => {
		localStorage.removeItem('senderName');
		localStorage.removeItem('recipientName');
		localStorage.removeItem('invoiceItems');
		localStorage.removeItem('invoiceNote');
		localStorage.removeItem('invoiceNumber');
		localStorage.removeItem('discount');
		localStorage.removeItem('discountType');
		localStorage.removeItem('tax');
		localStorage.removeItem('shipping');
		localStorage.removeItem('currency');
		localStorage.removeItem('invoiceLogoPreview');
	};

	//Calculation part
	useEffect(() => {
		setSubtotal(calculateSubtotal(invoiceItems));
	}, [invoiceItems]);

	useEffect(() => {
		calculateAndSetTotal(subtotal, discount, tax, shipping);
	}, [subtotal, discount, tax, shipping, discountType]);


	function calculateSubtotal(invoiceItems: { name: string, quantity: string, price: string }[]) {
		let subtotal = 0;

		for (const item of invoiceItems) {
			if (isNaN(parseFloat(item.quantity) * parseFloat(item.price))) continue;
			subtotal += parseFloat(item.quantity) * parseFloat(item.price);
		}

		return subtotal = parseFloat(subtotal.toFixed(2));;
	}


	function calculateAndSetTotal(subtotal: number, discount: string, tax: string, shipping: string) {
		if (discount === '') discount = '0';
		if (tax === '') tax = '0';
		if (shipping === '') shipping = '0';
		if (discountType === 'percentage') {
			let calculatedTotal = (subtotal * (1 - (parseFloat(discount) / 100))) + ((subtotal * (1 - (parseFloat(discount) / 100))) * (parseFloat(tax) / 100)) + parseFloat(shipping);
			calculatedTotal = parseFloat(calculatedTotal.toFixed(2));
			setTotal(calculatedTotal)
		} else if (discountType === 'flat') {
			let calculatedTotal = (subtotal - parseFloat(discount)) + ((subtotal - parseFloat(discount)) * (parseFloat(tax) / 100)) + parseFloat(shipping);
			calculatedTotal = parseFloat(calculatedTotal.toFixed(2));
			setTotal(calculatedTotal)
		}
	}

	//Changing inputs part
	const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		if (!isNaN(value as any)) {
			setDiscount(value);
		}
	};

	const handleTaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;

		if (!isNaN(value as any)) {
			setTax(value);
		}
	}

	const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		if (!isNaN(value as any)) {
			setShipping(value);
		}
	}

	const handleLogoChange = (event: ChangeEvent<HTMLInputElement>) => {
		if (event.target.files) {
			// get the selected file
			const file = event.target.files[0];

			const size = file.size / 1024 / 1024;
			console.log(size);
			if (size > 5) {
				setInvoiceLogoError("File size should be less than 5mb");
				setTimeout(() => {
					setInvoiceLogoError("");
				}, 3000);
				return;
			} else {
				setInvoiceLogoError("");
			}

			var reader = new FileReader();
			reader.onload = function (event) {
				const res = event.target?.result;
				setInvoiceLogoPreview(res?.valueOf() as string);
			}
			reader.readAsDataURL(file)

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
		setInvoiceLogoPreview('');
	};

	const handleInvoiceNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		if (value !== "" && !isNaN(value as any)) {
			setInvoiceNumber(parseInt(value, 10));
		} else {
			setInvoiceNumber(1);
		}
	};

	const handleInvoiceDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const date = new Date(e.target.value);
		if (!isNaN(date.getTime())) {
			setInvoiceDate(date);
		} else {
			setInvoiceDate(new Date());
		}
	};

	const handleInvoiceDueDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const date = new Date(e.target.value);
		if (!isNaN(date.getTime())) {
			setInvoiceDueDate(date);
		} else {
			setInvoiceDueDate(new Date());
		}
	};

	const handleSenderNameChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setSenderName(e.target.value);
	};

	const handleRecipientNameChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setRecipientName(e.target.value);
	};

	const handleAddItem = () => {
		const newItem = { name: '', quantity: '0', price: '0' };
		setInvoiceItems([...invoiceItems, newItem]);
	}

	// const handleItemChange = (index: number, field: keyof { name: string; quantity: string; price: string }, value: string) => {
	// 	const updatedItems = [...invoiceItems];
	// 	updatedItems[index][field] = value;
	// 	setInvoiceItems(updatedItems);
	// };

	const handleItemChange = (index: number, field: keyof { name: string; quantity: string; price: string }, value: string) => {
		// validate input
		const decimalWithOneDot = /^\d*\.?\d*$/;
		if (field === 'quantity' || field === 'price') {
			if (!decimalWithOneDot.test(value)) {
				return;
			}
		} else {
			// input is valid, update the state
			const updatedItems = [...invoiceItems];
			updatedItems[index][field] = value;
			setInvoiceItems(updatedItems);
		}
		const updatedItems = [...invoiceItems];
		updatedItems[index][field] = value;
		setInvoiceItems(updatedItems);
	};

	// const handleNameChange = (index: number, value: string) => {
	// 	const updatedItems = [...invoiceItems];

	// 	updatedItems[index].name = value;
	// 	setInvoiceItems(updatedItems);
	// };

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

	const toggleAddDiscount = () => {
		setShowDiscount(!showDiscount);
		setDiscount('0');
	};

	const toggleAddTax = () => {
		setShowTax(!showTax);
		setTax('0');
	}

	const toggleAddShipping = () => {
		setShowShipping(!showShipping)
		setShipping('0');
	};


	// additional labels 
	const showDueDateButton = <button type="button" onClick={handleAddDueTo}>Add Due to</button>;
	const dueDateToLabel = (<label>
		Due Date:
		{invoiceDueDate && (
			<input type="date" value={invoiceDueDate.toISOString().substr(0, 10)} onChange={handleInvoiceDueDateChange} />
		)}
	</label>);

	// Function to handle change in checked state of radio
	const handleRadioChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
		setDiscountType(event.target.value);
	}

	const showDiscountButton = <button type="button" onClick={toggleAddDiscount}>Add Discount</button>;
	const discountLabel = (<div className="add__label"><label className='add__label-label'>
		Discount:
		<label>
			<input type="radio"
				value="percentage"
				checked={discountType === "percentage"}
				onChange={handleRadioChange} />
			%
		</label>
		<label>
			<input type="radio"
				value="flat"
				checked={discountType === "flat"}
				onChange={handleRadioChange} />
			{currency}
		</label>
		<input type="string"
			value={discount}
			onChange={handleDiscountChange}
			onBlur={() => { if (isNaN(parseFloat(discount))) setDiscount('0') }} /></label>
		<label><button className="add__button outline secondary" type="button" onClick={toggleAddDiscount}>x</button></label></div>);

	const showTaxButton = <button type="button" onClick={toggleAddTax}>Add Tax</button>;
	const taxLabel = (<div className='add__label'><label className='add__label-label'>
		Tax %:
		<input type="string"
			value={tax}
			onChange={handleTaxChange}
			onBlur={() => { if (isNaN(parseFloat(tax))) setTax('0') }} /></label>
		<label><button className="add__button outline secondary" type="button" onClick={toggleAddTax}>x</button></label>
	</div>);

	const showShippingButton = <button type="button" onClick={toggleAddShipping}>Add Shipping</button>;
	const shippingLabel = (<div className='add__label'><label className='add__label-label'>
		Shipping <span>{currency}</span>:
		<input type="string"
			value={shipping}
			onChange={handleShippingChange}
			onBlur={() => { if (isNaN(parseFloat(shipping))) setShipping('0') }} /></label>
		<label><button className="add__button outline secondary" type="button" onClick={toggleAddShipping}>x</button></label>
	</div>);

	const handleFormReset = () => {
		setInvoiceNumber(1);
		setInvoiceDate(new Date());
		setInvoiceDueDate(new Date());
		setSenderName('');
		setRecipientName('');
		setInvoiceItems([{ name: '', quantity: '', price: '' }]);
		setInvoiceNote('');
		setInvoiceLogoPreview('');
		setShowDueDate(false);
		setShowDiscount(false);
		setShowTax(false);
		setShowShipping(false);
		setDiscount('0');
		setTax('0');
		setShipping('0');
		handleRemoveLocalStorage();
	};

	return (

		<main className='container'>
			<form onSubmit={handleSubmit}>
				<fieldset>
					<article>
						{/* invoice info */}
						<section className='invoice__info'>
							<div className='invoice__info-section'>
								<div className='invoice__info-subsection'>
									<div className="invoice__logo">
										<label htmlFor="invoice__logo">{!invoiceLogoPreview ?
											<div className="invoice__logo-view">
												<input type="file" id="fileInput" name="logo" accept="image/png, image/jpeg" onChange={handleLogoChange} style={{ display: 'none' }} />
												<button onClick={handleLogoAdd}>Add your logo</button>
											</div> : null}
											<span className='invoice__logo-error'>{invoiceLogoError}</span>
										</label>
										<div className="invoice__logo-preview">
											{invoiceLogoPreview && <img className="invoice__logo-preview-img" src={invoiceLogoPreview} alt="logo" />}
											<label>{invoiceLogoPreview ? <button className="remove__button outline secondary" type="button" onClick={handleLogoRemove}>x</button> : null}</label>
										</div>
									</div>
								</div>

								<div className='invoice__info-subsection'>
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
							</div>

							<div className='invoice__info-section'>
								<div className='invoice__info-subsection'>
									<label>
										From:
										<textarea
											className='invoice__info-fromto'
											style={{ overflow: 'auto', height: '200px' }}
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

								<div className='invoice__info-subsection'>
									<label>
										To:
										<textarea
											className='invoice__info-fromto'
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
						<section>
							<h3>Invoice items:</h3>
							{invoiceItems.map((item, index) => (
								<div className='invoice__items' key={index}>
									<label>
										Name:
										<textarea className='invoice__item-name'
											value={item.name} onChange={(e) => handleItemChange(index, 'name', e.target.value)}
											maxLength={200} />
									</label>
									<label>
										Quantity:
										<input type="text"
											value={item.quantity}
											pattern="^\d*\.?\d*$"
											onBlur={(e) => { if (isNaN(parseFloat(item.quantity))) handleItemChange(index, 'quantity', '0') }}
											onChange={(e) => handleItemChange(index, 'quantity', e.target.value)} />
									</label>
									<label>
										Price <span>{currency}</span>:
										<input type="text"
											value={item.price}
											pattern="^\d*\.?\d*$"
											onBlur={(e) => { if (isNaN(parseFloat(item.price))) handleItemChange(index, 'price', '0') }}
											onChange={(e) => handleItemChange(index, 'price', e.target.value)} />
									</label>
									<label>
										Amount <span>{currency}</span>:
										<input type="number" step={0.01}
											value={
												isNaN(parseFloat(item.price)) || isNaN(parseFloat(item.quantity))
													? '0'
													: (parseFloat(item.price) * parseFloat(item.quantity)).toFixed(2)
											} readOnly />
									</label>
									{/* TODO something more elegant */}
									<label className='invoice__item-remove'>Remove
										<button className='invoice__item-button' type="button" onClick={() => handleRemoveItem(index)}>Remove</button>
									</label>
								</div>
							))}

							<button type="button" onClick={handleAddItem}>Add item</button>
						</section>
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
			</form >

			{
				isFormValid ? <PDFDownloadLink
					document={
						<PDFFile
							invoiceLogo={invoiceLogoPreview}
							invoiceNumber={invoiceNumber}
							invoiceDate={invoiceDate}
							invoiceDueDate={invoiceDueDate}
							senderName={senderName}
							recipientName={recipientName}
							invoiceItems={invoiceItems}
							invoiceNote={invoiceNote}

							subtotal={subtotal}
							discount={discount}
							discountType={discountType}
							tax={tax}
							shipping={shipping}
							total={total}

							currency={currency}

						/>}>
					{({ loading }) => (loading ? <button>Loading document...</button> : <button onClick={handleSaveLocaleStorage} type="submit">Download invoice</button>)}

				</PDFDownloadLink > : <button disabled>Download invoice</button>}
			<button onClick={handleFormReset}>Reset form</button>
		</main >
	);
};

export default InvoiceApp;