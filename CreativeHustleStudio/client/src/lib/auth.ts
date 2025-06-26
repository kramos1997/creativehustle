// Mock authentication utility
export const mockAuth = {
  getCurrentUser: () => ({
    id: 1,
    username: "sarah_artist",
    email: "sarah@example.com",
    tier: "free"
  }),
  
  isAuthenticated: () => true,
  
  login: async (username: string, password: string) => {
    // Mock login - always succeeds
    return mockAuth.getCurrentUser();
  },
  
  logout: () => {
    // Mock logout
    console.log("User logged out");
  }
};
