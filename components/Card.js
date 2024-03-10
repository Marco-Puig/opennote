import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Dimensions,
} from "react-native";

const Card = (props) => {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>{props.title}</Text>
          {props.featured && <Text style={styles.tagFeatured}>Featured</Text>}
          <Text style={styles.author}>{"by " + props.author}</Text>
          <Text style={styles.author}>
            {"Posted: " + props.date.slice(0, 10)}
          </Text>
          <Text style={styles.description}>{props.description}</Text>
          <Image
            style={styles.canvas}
            source={{
              uri: props.canvas,
            }}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 10,
    alignSelf: "center",
    width: "100%", // Card takes up full width of the screen
    height: Dimensions.get("window").height * 0.75, // Adjust this value as needed
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    overflow: "hidden",
  },
  headerContent: {
    alignItems: "center", // Aligns content items to the center
    padding: 10,
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
  tagFeatured: {
    fontWeight: "bold",
    color: "blue",
    marginTop: 6,
    alignSelf: "center",
  },
  author: {
    color: "gray",
    marginTop: 4,
    textAlign: "center",
  },
  description: {
    marginTop: 4,
    textAlign: "center",
  },
  canvas: {
    width: "100%", // The image will take the full width of the card
    height: undefined, // The height is calculated based on the width and aspect ratio
    aspectRatio: 1, // The aspect ratio of 1:1 makes the image a square
    alignSelf: "center",
  },
  buttonArea: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
  },
  likeButton: {
    // Style for the like button
  },
  moreButton: {
    // Style for the more options button
  },
});

export default Card;
