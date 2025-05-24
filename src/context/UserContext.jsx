import React, { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedUsername = localStorage.getItem("username");
        console.log("Stored username:", storedUsername);
        if (!storedUsername) {
          console.log("No username found in localStorage");
          setLoading(false);
          return;
        }

        const response = await fetch(
          `https://salesforce-hackathon-s8mr.onrender.com/User/search/${storedUsername}`
        );

        console.log("Fetch status:", response.status);

        if (!response.ok) {
          console.error("API returned error:", response.statusText);
          setUser(null);
          setLoading(false);
          return;
        }

        const data = await response.json();
        console.log("Fetched user data:", data);

        if (Array.isArray(data) && data.length > 0) {
          setUser(data[0]);
        } else {
          console.log("No user data found in response");
          setUser(null);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, loading }}>
      {children}
    </UserContext.Provider>
  );
};
