import React, { useState, useEffect } from "react";
import { Text, View, ActivityIndicator } from "react-native";
import { supabase } from "../src/config/supabaseClient";
import styles from "../components/ScreenStyles";

export default function Index() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase.from("users").select("*");
      if (error) {
        console.error("Error fetching users:", error);
      } else {
        setUsers(data);
      }
      setLoading(false);
    };

    fetchUsers();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>FitTogether Users:</Text>
      {users.map((user, index) => (
        <Text key={index} style={styles.subtitle}>
          {user.name}
        </Text>
      ))}
    </View>
  );
}
