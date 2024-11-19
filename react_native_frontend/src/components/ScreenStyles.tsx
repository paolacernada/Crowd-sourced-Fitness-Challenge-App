import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  toggleContainer: {
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 1,
  },
  darkContainer: {
    backgroundColor: "#121212",
  },
  lightContainer: {
    backgroundColor: "#f7f9fc",
  },
  appName: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
  },
  darkAppName: {
    color: "#b05600",
  },
  lightAppName: {
    color: "#f48c42",
  },
  darkText: {
    color: "#fff",
  },
  lightText: {
    color: "#000",
  },
  formContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: "90%",
    maxWidth: 400,
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  darkForm: {
    backgroundColor: "#333",
  },
  lightForm: {
    backgroundColor: "#fff",
  },
  setting: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 15,
    borderRadius: 8,
    fontSize: 16,
  },
  darkInput: {
    borderColor: "#666",
    color: "#fff",
  },
  lightInput: {
    borderColor: "#ccc",
    color: "#000",
  },
  button: {
    backgroundColor: "#f48c42",
    paddingVertical: 12,
    borderRadius: 30,
    alignItems: "center",
    marginBottom: 20,
  },
  darkButton: {
    backgroundColor: "#b05600",
  },
  lightButton: {
    backgroundColor: "#f48c42",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  linkText: {
    fontSize: 14,
    textAlign: "center",
  },
  challengeText: {
    borderWidth: 1,
    padding: 10,
    // marginBottom: 15,
    borderRadius: 8,
    fontSize: 14,
    textAlign: "center",
  },
  challengeItem: {
    padding: 16,
    marginBottom: 20,
    borderRadius: 12,
    borderWidth: 2,
  },
  usernameText: {
    fontSize: 16,
    marginVertical: 4,
  },
  filterContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "90%",
  },
  dropdown: {
    width: "100%",
    marginBottom: 20,
  },
  darkDropdown: {
    backgroundColor: "#333",
    borderColor: "#666",
    color: "#fff",
  },
  lightDropdown: {
    backgroundColor: "#fff",
    borderColor: "#ccc",
    color: "#000",
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  dropdownText: {
    fontSize: 16,
  },
  challengeListContainer: {
    flex: 2,
    width: "100%",
    paddingVertical: 10,
  },
  searchInput: {
    borderWidth: 1,
    padding: 8,
    marginBottom: 16,
  },
  searchResult: {
    padding: 8,
    borderBottomWidth: 1,
  },
  errorText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
    margin: 20,
  },
  labelText: {
    fontSize: 14,
    justifyContent: "space-between",
  },
  section: {
    marginBottom: 20,
    width: "100%",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "left",
  },
  scrollbar: {
    flex: 1,
  },
  darkScrollbar: {
    backgroundColor: "#303030",
  },
  lightScrollbar: {
    backgroundColor: "#e0e0e0",
  },
  darkPicker: {
    color: "#fff",
    backgroundColor: "#121212",
    borderRadius: 8,
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  lightPicker: {
    color: "#000",
    backgroundColor: "#fff",
    borderRadius: 8,
    marginVertical: 10,
    paddingHorizontal: 10,
  },
});

export default styles;
