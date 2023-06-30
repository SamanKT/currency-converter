import { Image, StyleSheet, Text, View } from "react-native";
import React, { ReactNode } from "react";
type Type = {
  content: ReactNode;
};
const LineWithContent = ({ content }: Type) => {
  return (
    <View style={styles.container}>
      <View style={styles.lines} />
      {content}
      <View style={styles.lines} />
    </View>
  );
};

export default LineWithContent;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: "90%",
    marginVertical: 20,
    opacity: 0.8,
    alignSelf: "center",
  },
  lines: {
    backgroundColor: "black",
    height: 1,
    flex: 1,
    alignSelf: "center",
    marginHorizontal: 10,
    opacity: 0.5,
  },
  text: {
    alignSelf: "center",
    paddingHorizontal: 5,
    fontSize: 15,
  },
});
