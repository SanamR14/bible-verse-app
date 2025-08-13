import React from "react";
import { View, StyleSheet, Text } from "react-native";

export default function About() {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>FOR YOUR INNER MAN (FYI)</Text>
      <Text>
        FYI VISION – To bring all the people of the church together in order to
        be rooted and built strong in CHRIST to spread the gospel digitally and
        win many souls. Jesus is for all people and HE loves everyone.
      </Text>
      <Text><br></br>
        FYI MISSION – To build an application, which is suitable for all age
        groups, so that people will be able to learn about God, his mysteries,
        his plans and purpose for every mankind. People will be able to connect
        with others around the world to have a mutual fellowship.
      </Text>
      <Text><br></br>
        As the word of God says in Colossians 2:6-7 (NLT),“And now, just as you
        accepted Christ Jesus as your Lord, you must continue to follow him. Let
        your roots grow down into him, and let your lives be built on him. Then
        your faith will grow strong in the truth you were taught, and you will
        overflow with thankfulness.”<br></br><br></br>This application is dedicated to
        share the truth that nurtures and strengthens the inner self with the
        word of God.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  heading: { fontSize: 16, fontWeight: "bold", marginBottom: 12 },
});
