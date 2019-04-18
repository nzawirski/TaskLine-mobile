import { StyleSheet } from "react-native";

export const theme = {
  colors: {
    primary: "mediumpurple"
  }
};

export const styles = StyleSheet.create({
  main: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    backgroundColor: "#fff",
    color: "#89939B"
  },

  title: {
    marginBottom: 10,
    fontSize: 25,
    color: "#89939B",
    textAlign: "center",
    padding: 10
  },

  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10
  }
});
