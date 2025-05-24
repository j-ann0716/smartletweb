import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom' 
import './App.css'
//Web Pages
import Landing from './Webpages/Landing'
import Home from './Webpages/Home'
import Flashcard from './Webpages/Flashcard'
import Quiz from './Webpages/Quiz'
import Dashboard from './Webpages/Dashboard'
import UserProfile from './Webpages/UserProfile'
import AdminPanel from './Webpages/AdminPanel'
import FlashContent from './Components/Flashcard/FlashcardContent'
import QuizContent from './Components/Quiz/QuizContent'
import Settings from './Webpages/Settings'
//Components
import Layout from './Components/Layout'


const App = () => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const storedUser = localStorage.getItem('loggedInUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);
  
  return (
    <>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<Landing />}/>
          <Route path='/home' element={<Home />}/>
          <Route path='/flashcard' element={<Flashcard />}/>
          <Route path='/quiz' element={<Quiz />}/>
          <Route path='/dashboard' element={<Dashboard />}/>
          <Route path='/profile' element={<UserProfile />}/>
          <Route path='/settings' element={<Settings />}/>
          <Route path='/admin' element={<AdminPanel />}/>
          <Route path='/flashcard-content' element={<FlashContent />}/>
          <Route path='/quiz-content' element={<QuizContent />}/>
          
        </Route>
      </Routes>
    </>
  )
}

export default App
