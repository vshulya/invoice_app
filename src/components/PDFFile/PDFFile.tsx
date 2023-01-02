import React from "react";
import { Document, Page, Text, Image, StyleSheet, View } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 35,
    fontSize: 14,
  },

  block: {
    paddingBottom: 50,
  },

  container: {
    display: 'flex',
    flexDirection: 'row',
    gap: 50,
    alignItems: 'flex-end',
  },

  columnHeader: {
    flex: 1,
    alignSelf: 'flex-end',
    justifySelf: 'flex-end',
  },

  columnPrice: {
    flex: 1,
  },

  title: {
fontSize: 30,
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
    maxWidth: 50,
  },

  tableRow: {
    flexDirection: 'row',
  },
  tableCell: {
    flex: 1,
    border: '1px solid black',
    padding: 5,
  },

  priceBlock: {
    display: 'flex',
    flexDirection: 'column',
  },

  price: {
    alignSelf: 'flex-end',
  },

  notes: {
    alignSelf: 'flex-start',
  },
});

function PDFFile(props: {
  invoiceLogo: string;
  invoiceNumber: number;
  invoiceDate: Date;
  invoiceDueDate: Date | null;
  senderName: string;
  recipientName: string;
  invoiceItems: { name: string, quantity: number, price: number }[];
  invoiceNote: string;
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number,
  total: number,
  currency: string
}) {

  const formattedDate = props.invoiceDate.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });


  return (
    <>
      <Document>
        <Page size="A4" orientation="portrait" style={styles.page}>
          <View style={styles.block}>
            <View style={styles.container}>
              <View style={styles.columnHeader}>
                {props.invoiceLogo ? <Image style={styles.image} src={props.invoiceLogo} /> : null}
                <Text>From: {props.senderName}</Text>
              </View>
              <View style={styles.columnHeader}>
                <Text style={styles.title}>Invoice # {props.invoiceNumber}</Text>
                <Text>Date: {formattedDate}</Text>
                {props.invoiceDueDate ? <Text>Due Date: {props.invoiceDueDate.toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" })}</Text> : null}
                <Text>To: {props.recipientName}</Text>
              </View>
            </View>
          </View>
          <View style={styles.block}>
            <View style={styles.tableRow}>
              <Text style={{ ...styles.tableCell, flex: 2 }}>Name</Text>
              <Text style={styles.tableCell}>Quantity</Text>
              <Text style={styles.tableCell}>Price</Text>
              <Text style={styles.tableCell}>Amount</Text>
            </View>
            {props.invoiceItems.map((item, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={{ ...styles.tableCell, flex: 2 }}>{item.name}</Text>
                <Text style={styles.tableCell}>{item.quantity}</Text>
                <Text style={styles.tableCell}>{item.price}</Text>
                <Text style={styles.tableCell}>{item.price * item.quantity}</Text>
              </View>
            ))}
          </View>
          <View style={styles.block}>
          <View style={styles.priceBlock}>
            <View style={styles.price}>
              <Text>Subtotal: {props.subtotal}</Text>
              {props.discount !== 0 && <Text>Discount: {props.discount}</Text>}
              {props.tax !== 0 && <Text>Tax: {props.tax}</Text>}
              {props.shipping !== 0 && <Text>Shipping: {props.shipping}</Text>}
              <Text>Total: {props.total}</Text>

            </View>
            <View style={styles.notes}>
              <Text>Notes: {props.invoiceNote}</Text></View>
          </View>
          </View>

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