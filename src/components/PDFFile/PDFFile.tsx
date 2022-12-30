import React, { useState} from "react";
import { Document, Page, Text, Image, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
  }, 
  pageNumber: {
    position: 'absolute',
    fontSize: 12,
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: 'grey',
  },

  image: {
    height: 200,
    marginVertical: 15,
    marginHorizontal: 100,
  },
});


function PDFFile(props: {
  invoiceLogo: string;
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
      <Image style={styles.image} src={props.invoiceLogo}/>
        <Text>Invoice {props.invoiceNumber}</Text>
        <Text>From {props.senderName}</Text>
        <Text>To {props.recipientName}</Text>
        <Text
        style={styles.pageNumber}
        render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
        fixed
      />
      </Page>
    </Document>
    </>
  );
}

export default PDFFile;