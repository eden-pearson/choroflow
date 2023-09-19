import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'

import '../styles/index.css'
import Header from './Header.tsx'
import Footer from './Footer.tsx'
import Globe from './Globe.tsx'
import Timeline from './Timeline.tsx'
import Filters from './Filters.tsx'
import CountrySelect from './CountrySelect.tsx'
import { getAllInventions } from '../apis/api-inventions.ts'
import type { Invention } from '../../models/Inventions.ts'
import type { Person } from '../../models/People.ts'
import type { Event } from '../../models/Events.ts'
import { getAllPeople } from '../apis/api-people.ts'
import { getAllEvents } from '../apis/api-world-events.ts'

function App() {
  const {
    data: inventionsData,
    isLoading,
    error,
  } = useQuery<Invention[], Error>(['inventions'], getAllInventions)
  const {
    data: peopleData,
    isLoading: peopleLoading,
    error: peopleError,
  } = useQuery<Person[], Error>(['people'], getAllPeople)
  const {
    data: worldEventsData,
    isLoading: worldEventsLoading,
    error: worldEventsError,
  } = useQuery<Event[], Error>(['world-events'], getAllEvents)

  const [inventions, setInventions] = useState<Invention[]>([])
  const [people, setPeople] = useState<Person[]>([])
  const [checkboxStatus, setCheckboxStatus] = useState('inventions')
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [data, setData] = useState<Event[] | Invention[] | Person[]>([])

  useEffect(() => {
    if (inventionsData && peopleData) {
      if (selectedCountry === null) {
        setInventions(inventionsData)
        setPeople(peopleData)
      } else {
        setInventions(filterByCountry(inventionsData, selectedCountry))
        setPeople(filterByCountry(peopleData, selectedCountry))
      }
    }
  }, [selectedCountry, inventionsData, peopleData])

  useEffect(() => {
    if (checkboxStatus === 'world-event') {
      setData(worldEventsData)
      console.log(data)
    } else if (checkboxStatus === 'inventions') {
      setData(inventionsData)
      console.log(data)
    }
  }, [checkboxStatus])

  if (isLoading || peopleLoading || worldEventsLoading) {
    return <p>Loading....</p>
  }

  if (error || peopleError || worldEventsError) {
    return <p>There was an error: {error?.message}</p>
  }

  function filterByCountry(data, country) {
    return data.filter((item) => item.country === country)
  }

  return (
    <div className="h-screen bg-black bg-cover flex flex-col">
      <Header />
      <section className="main">
        <div className="flex w-screen">
          <Globe selectedCountry={selectedCountry} />
          <div className="flex w-1/2 flex-col h-[36rem]">
            <Filters
              setCheckboxStatus={setCheckboxStatus}
              checkboxStatus={checkboxStatus}
            />
            <CountrySelect
              inventions={inventionsData}
              people={peopleData}
              setSelectedCountry={setSelectedCountry}
              selectedCountry={selectedCountry}
            />
            <Outlet context={{ inventionsData, peopleData }} />
          </div>
        </div>
        <Timeline inventions={inventionsData} people={peopleData} />
      </section>
      <div className="mt-auto"></div>
      <Footer />
    </div>
  )
}

export default App
