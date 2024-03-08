import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
//import { supabase } from "../client";
//import { useNavigation } from "@react-navigation/native";

const Card = (props) => {
  const [count, setCount] = useState(0);
  const [nameData, setNameData] = useState(null);
  //const navigation = useNavigation();

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
    // Define your card container styles here
  },
  cardHeader: {
    // Styles for the card header
  },
  headerContent: {
    // Styles for the header content
  },
  title: {
    // Styles for the title
  },
  tagFeatured: {
    // Styles for the featured tag
  },
  author: {
    // Styles for the author
  },
  description: {
    // Styles for the description
  },
  canvas: {
    // Styles for the canvas image
  },
  buttonArea: {
    // Styles for the button area
  },
  likeButton: {
    // Styles for the like button
  },
  moreButton: {
    // Styles for the more button
  },
});
export default Card;
