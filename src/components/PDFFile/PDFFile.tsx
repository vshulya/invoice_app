import React from "react";
import { Document, Page, Text, Image, StyleSheet, View, Font } from "@react-pdf/renderer";


Font.register({
  family: 'Roboto',
  fonts: [
    {
      src: 'http://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Me5WZLCzYlKw.ttf',
    },
  ],
});

const styles = StyleSheet.create({
  page: {
    padding: 35,
    fontSize: 11,
    lineHeight: 1.5,
    fontFamily: 'Roboto',
    display: 'flex',
    flexDirection: 'column',
  },

  block: {
    marginBottom: 50,
    display: 'flex',
  },

  container: {
    display: 'flex',
    flexDirection: 'row',
  },

  columnHeader: {
    flex: 1,
  },

  image: {
    width: '100%',
    maxWidth: 50,
    resizeMode: 'contain',
  },

  columnPrice: {
    flex: 1,
  },

  title: {
    fontSize: 24,
  },

  tableRow: {
    flexDirection: 'row',
    display: 'flex',
  },

  tableCellTitle: {
    flex: 1,
    border: '1px solid grey',
    padding: 5,
    color: 'white',
    backgroundColor: 'grey',
  },

  tableCellNameTitle: {
    flex: 1,
    border: '1px solid grey',

    padding: 5,
    color: 'white',
    backgroundColor: 'grey',
  },

  tableCell: {
    flex: 1,
    border: '1px solid white',
    padding: 5,
    color: 'grey',
  },

  tableCellName: {
    flex: 1,
    border: '1px solid white',
    padding: 5,
    color: 'black',
  },

  priceBlock: {
    display: 'flex',
    flexDirection: 'column',
  },

  price: {
    maxWidth: '30%',
    width: '100%',
    flexDirection: 'column',
    alignSelf: 'flex-end',
    justifyContent: 'space-between',
  },

  notes: {
    alignSelf: 'flex-start',
    marginTop: 50,
  },

  line: {
    flex: 1,
    marginTop: 20,
    color: 'grey',
    // alignSelf: 'flex-start',
  },

  data: {
    flex: 1,
    color: 'black',
    alignSelf: 'flex-end',
  },

  lineTotal: {
    color: 'black',
    // alignSelf: 'flex-start',
  },

  lineTotalData: {
    color: 'black',
    // alignSelf: 'flex-end',
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
              </View>
              <View style={styles.columnHeader}>
                <Text style={[styles.title, { alignSelf: 'flex-end' }]}>Invoice <Text style={styles.data}>#{props.invoiceNumber}</Text></Text>
                <Text style={[styles.line, { alignSelf: 'flex-end' }]}>Date: <Text style={styles.data}>{formattedDate}</Text></Text>
                {props.invoiceDueDate ? <Text style={[styles.line, { alignSelf: 'flex-end' }]}>Due Date: <Text style={styles.data}>{props.invoiceDueDate.toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" })}</Text></Text> : null}
              </View>
            </View>
          </View>
          <View style={styles.block}>
            <View style={styles.container}>
              <View style={[styles.columnHeader, { marginRight: 10 }]}><Text style={styles.line}>From: <Text style={styles.data}>{props.senderName}</Text></Text></View>
              <View style={styles.columnHeader}><Text style={styles.line}>To: <Text style={styles.data}>{props.recipientName}</Text></Text></View>
            </View>
          </View>

          <View style={styles.block}>

              <View style={styles.tableRow}>
                <Text style={{ ...styles.tableCellNameTitle, flex: 2 }}>Name</Text>
                <Text style={styles.tableCellTitle}>Quantity</Text>
                <Text style={styles.tableCellTitle}>Price</Text>
                <Text style={styles.tableCellTitle}>Amount</Text>
            </View>
            {props.invoiceItems.map((item, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={{ ...styles.tableCellName, flex: 2 }}>{item.name}</Text>
                <Text style={styles.tableCell}><Text style={styles.data}>{item.quantity}</Text></Text>
                <Text style={styles.tableCell}><Text style={styles.data}>{item.price}</Text></Text>
                <Text style={styles.tableCell}><Text style={styles.data}>{(item.price * item.quantity).toFixed(2)}</Text></Text>
              </View>
            ))}



            <View style={styles.block}>
              <View style={styles.priceBlock}>

                <View style={styles.price}>
                  <Text style={styles.line}>Subtotal: </Text> <Text style={styles.data}>{props.subtotal}{props.currency}</Text>
                  {props.discount !== 0 && <><Text style={styles.line}>Discount: </Text><Text style={styles.data}>{props.discount}%</Text></>}
                  {props.tax !== 0 && <><Text style={styles.line}>Tax: </Text><Text style={styles.data}>{props.tax}%</Text></>}
                  {props.shipping !== 0 && <><Text style={styles.line}>Shipping: </Text><Text style={styles.data}>{props.shipping}{props.currency}</Text></>}
                  <Text style={[styles.line, styles.lineTotal]}>Total: </Text> <Text style={[styles.data, styles.lineTotalData]}>{props.total}{props.currency}</Text>
                </View>

                <View style={styles.notes}>
                  <Text style={styles.line}>Notes: <Text style={styles.data}>{props.invoiceNote}</Text></Text></View>
              </View>
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