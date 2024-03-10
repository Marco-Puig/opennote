import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, Dimensions } from "react-native";
import Card from "../components/Card";
import { supabase } from "../client";

const ReadPosts = ({ data }) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    setPosts(data);
    fetchPosts();
  }, [data]);

  const fetchPosts = async () => {
    const { data } = await supabase
      .from("Posts")
      .select()
      .order("created_at", { ascending: false });

    setPosts(data);
  };

  const renderPost = ({ item }) => (
    <Card
      id={item.id}
      title={item.title}
      author={item.author}
      date={item.created_at}
      description={item.description}
      likes={item.likes}
      canvas={item.canvas}
      featured={item.featured}
      author_id={item.author_id}
    />
  );

  return (
    <View style={styles.readPosts}>
      {posts && posts.length > 0 ? (
        <FlatList
          data={posts}
          renderItem={renderPost}
          keyExtractor={(item, index) => index.toString()}
        />
      ) : (
        <Text style={styles.noPostsText}>No posts available.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  readPosts: {
    flex: 1, // Use flex to take up all available space
    alignItems: "center", // Center items horizontally in container
    justifyContent: "center", // Center items vertically in container
  },
  noPostsText: {
    fontSize: 20, // Larger text size for visibility
  },
});

export default ReadPosts;
