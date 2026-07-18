import React, { useState } from 'react';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';

export default function App() {
  const [employeeName, setEmployeeName] = useState(null);
  return employeeName ? <HomeScreen employeeName={employeeName} onLogout={() => setEmployeeName(null)} /> : <LoginScreen onLogin={setEmployeeName} />;
}
