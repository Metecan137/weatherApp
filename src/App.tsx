import { useDispatch } from 'react-redux'
import './App.css'
import Header from './components/Header'
import { toggleDropdown } from './features/weatherSlice/weatherSlice'
import Search from './components/Search'
import Dashboard from './components/Dashboard'

function App() {
  const dispatch = useDispatch()
  const handleGlobalClick = () => {
    dispatch(toggleDropdown(null))
  }

  return (
    <div onClick={handleGlobalClick} className='min-h-screen bg-neutral-900 text-white'>
      <div className='mx-auto max-w-360 w-full px-6 md:px-16 py-8'>
        <Header />
        <Search />
        <Dashboard />
      </div>
    </div>
  )
}

export default App
