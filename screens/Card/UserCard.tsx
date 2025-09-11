import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from "react-native";
import { User } from "../../types";

interface Props {
  user: User;
  onConnect: (user: User) => void;
  onDismiss: (user: User) => void;
  containerStyle?: ViewStyle;
}

const UserCard: React.FC<Props> = ({
  user,
  onConnect,
  onDismiss,
  containerStyle,
}) => {
  return (
    <View style={[styles.card, containerStyle]}>
      {/* Dismiss */}
      <TouchableOpacity
        style={styles.dismissBtn}
        onPress={() => onDismiss(user)}
      >
        <View style={styles.dismissCircle}>
          <Text style={styles.dismissX}>✕</Text>
        </View>
      </TouchableOpacity>

      {/* Avatar */}
      <View style={styles.avatarContainer}>
        <Image
          //   source={
          //     user.avatar_url
          //       ? { uri: user.avatar_url }
          //       : require("../assets/avatar-placeholder.png")
          //   }
          style={styles.avatar}
        />
      </View>

      {/* Info */}
      <View style={styles.info}>
        <Text numberOfLines={2} style={styles.name}>
          {user.name}
        </Text>
        {/* <Text numberOfLines={2} style={styles.headline}>
          {user.headline || ""}
        </Text> */}

        {/* Mutuals */}
        {/* {user.mutuals && user.mutuals.length > 0 && (
          <View style={styles.mutualsRow}>
            <Image
              source={
                user.mutuals[0].avatar_url
                  ? { uri: user.mutuals[0].avatar_url }
                  : require("../assets/avatar-placeholder.png")
              }
              style={styles.mutualSmall}
            />
            <Text style={styles.mutualText}>
              {user.mutuals[0].name}
              {user.mutuals.length > 1
                ? ` and ${user.mutuals.length - 1} other mutual connections`
                : " is a mutual connection"}
            </Text>
          </View>
        )} */}
      </View>

      {/* Connect Button */}
      <TouchableOpacity
        style={styles.connectBtn}
        onPress={() => onConnect(user)}
      >
        <Text style={styles.connectText}>Connect</Text>
      </TouchableOpacity>
    </View>
  );
};

export default UserCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#f8f8f8ff",
    borderRadius: 12,
    paddingTop: 12,
    paddingBottom: 14,
    paddingHorizontal: 12,
    margin: 8,
    flex: 1,
    minHeight: 260,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
    position: "relative",
  },
  dismissBtn: { position: "absolute", right: 8, top: 8, zIndex: 10 },
  dismissCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(0,0,0,0.55)",
    alignItems: "center",
    justifyContent: "center",
  },
  dismissX: { color: "#fff", fontWeight: "700" },
  avatarContainer: { alignItems: "center", marginTop: 6 },
  avatar: {
    width: 86,
    height: 86,
    borderRadius: 43,
    borderWidth: 2,
    borderColor: "#fff",
    backgroundColor: "#eee",
  },
  info: { marginTop: 8, alignItems: "center", paddingHorizontal: 6, flex: 1 },
  name: {
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
    color: "#1b4b7aff",
  },
  headline: { fontSize: 13, textAlign: "center", color: "#666", marginTop: 6 },
  mutualsRow: { flexDirection: "row", alignItems: "center", marginTop: 10 },
  mutualSmall: { width: 28, height: 28, borderRadius: 14, marginRight: 8 },
  mutualText: { color: "#666", fontSize: 12, flex: 1 },
  connectBtn: {
    marginTop: 12,
    borderWidth: 1.6,
    borderColor: "#1b4b7aff",
    paddingVertical: 8,
    borderRadius: 28,
    alignItems: "center",
  },
  connectText: { color: "#1b4b7aff", fontSize: 15, fontWeight: "600" },
});
