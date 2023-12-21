import { useEffect } from "react";

export default function SplashPage() {
  useEffect(() => {
    console.log('splash page mounted')
  }, [])
  
  return <h1 style={{ color: 'black' }}>Welcome to Willow 2.0</h1>
}