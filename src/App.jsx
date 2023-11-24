import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Header from './components/header'
import Home from './components/home'
import Login from './components/login';
import CreateUser from './components/createUser';
import DashboardUser from './components/dashboardUser';
import DashboardTournament from './components/dashboardTournament';
import notFoundPage from './components/notFoundPage';
import Scramble from './components/scramble'
import Round1 from './components/round1'
import Round2 from './components/round2'
import Leaderboard from './components/leaderboard'


import { AuthProvider } from './components/authContext'
import { ScoresProvider } from './components/scoresContext';

function App() {

  return (
  
      <AuthProvider>
        <ScoresProvider>

          <Router>
            <Header />
            <Routes>
              <Route exact path='/' Component={Home} />
              <Route path='/login' Component={Login} />
              <Route path='/createUser' Component={CreateUser} />
              <Route path='/dashboardUser' Component={DashboardUser} />
              <Route path='/dashboardTournament' Component={DashboardTournament} />
              <Route path='/scramble' Component={Scramble} />
              <Route path='/round1' Component={Round1} />
              <Route path='/round2' Component={Round2} />
              <Route path='/leaderboard' Component={Leaderboard} />

              <Route Component={notFoundPage} />
            </Routes>
          </Router>
          
        </ScoresProvider>
      </AuthProvider>

  )
}

export default App
