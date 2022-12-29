import React, { useState} from "react";
import { Document, Page, Text, Image, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {

  }
});


function PDFFile(props: { 
  invoiceNumber: number; 
  invoiceDate: any; 
  invoiceDueDate: any; 
  senderName: string; 
  recipientName: string; 
  invoiceItems: any; 
  invoiceNote: string; 
  subtotal: number; 
  discount: number; 
  tax: number; 
  shipping: number, 
  total: number, 
  currency: string
}) {
  
  return (
    <>
    <Document>
      <Page size="A4" style={styles.page}>
        <Text>Invoice {props.invoiceNumber}</Text>
      </Page>
    </Document>
    </>
  );
}

export default PDFFile;