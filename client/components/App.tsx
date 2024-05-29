import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'

import '../styles/index.css'
import Header from './Header'
import Footer from './Footer'
import Globe from './Globe'
import Timeline from './Timeline'
import Filters from './Filters'
import CountrySelect from './CountrySelect'
import { getAllInventions } from '../apis/api-inventions'
import type { Invention } from '../../models/Inventions'
import type { Person } from '../../models/People'
import type { Event } from '../../models/Events'
import { getAllPeople } from '../apis/api-people'
import { getAllEvents } from '../apis/api-world-events'
import { CategoryData } from '../../models/Types'
import {
  getNewZealandEventsData,
  getNewZealandInventionsData,
  getNewZealandPeopleData,
} from '../apis/api-country'

interface FilterStatus {
  event: string
  people: boolean
}

function App() {
  const defaultStatus = {
    event: 'worldEvents',
    people: true,
  }

  const {
    data: inventionsData,
    isLoading: inventionsLoading,
    error: inventionsError,
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

  // NZ queries
  const {
    data: inventionsNZData,
    isLoading: inventionsNZLoading,
    error: inventionsNZError,
  } = useQuery<Invention[], Error>(
    ['nz-inventions'],
    getNewZealandInventionsData
  )
  const {
    data: peopleNZData,
    isLoading: peopleNZLoading,
    error: peopleNZError,
  } = useQuery<Person[], Error>(['nz-people'], getNewZealandPeopleData)
  const {
    data: eventsNZData,
    isLoading: eventsNZLoading,
    error: eventsNZError,
  } = useQuery<Event[], Error>(['nz-events'], getNewZealandEventsData)

  const [inventions, setInventions] = useState<Invention[]>([])
  const [people, setPeople] = useState<Person[]>([])
  const [worldEvents, setWorldEvents] = useState<Event[]>([])
  const [filterStatus, setFilterStatus] = useState<FilterStatus>(defaultStatus)
  const [selectedCountry, setSelectedCountry] = useState<string | null>(
    'disabledOption'
  )

  useEffect(() => {
    if (
      inventionsData &&
      peopleData &&
      worldEventsData &&
      inventionsNZData &&
      peopleNZData &&
      eventsNZData
    ) {
      if (selectedCountry === 'disabledOption') {
        setInventions(inventionsData)
        setPeople(peopleData)
        setWorldEvents(worldEventsData)
      } else if (selectedCountry === 'New Zealand') {
        setInventions(inventionsNZData)
        setPeople(peopleNZData)
        setWorldEvents(eventsNZData)
      } else {
        setInventions(filterByCountry(inventionsData, selectedCountry))
        setPeople(filterByCountry(peopleData, selectedCountry))
        setWorldEvents(filterByCountry(worldEventsData, selectedCountry))
      }
    }
  }, [
    selectedCountry,
    inventionsData,
    peopleData,
    worldEventsData,
    inventionsNZData,
    peopleNZData,
    eventsNZData,
  ])

  if (
    inventionsLoading ||
    peopleLoading ||
    worldEventsLoading ||
    inventionsNZLoading ||
    peopleNZLoading ||
    eventsNZLoading
  ) {
    return <p className="m-12 text-3xl">Loading....</p>
  }

  if (
    inventionsError ||
    peopleError ||
    worldEventsError ||
    inventionsNZError ||
    peopleNZError ||
    eventsNZError
  ) {
    return (
      <p className="m-12 text-2xl">
        There was an error:{' '}
        {inventionsError?.message ||
          peopleError?.message ||
          worldEventsError?.message}
      </p>
    )
  }

  function filterByCountry<T extends CategoryData>(
    data: T[],
    country: string
  ): T[] {
    return data.filter((item) => item.country === country)
  }

  function getDataForCategory(category: string): Event[] | Invention[] {
    switch (category) {
      case 'inventions':
        return inventions as Invention[]
      case 'worldEvents':
        return worldEvents as Event[]
      default:
        return []
    }
  }

  return (
    <div className="h-screen flex flex-col">
      <Header />
      <div className="flex w-screen mb-10 mt-[-1rem]">
        <Globe selectedCountry={selectedCountry} />
        <div className="flex w-1/2 flex-col">
          <div className="flex flex-row gap-3">
            <Filters
              setFilterStatus={setFilterStatus}
              filterStatus={filterStatus}
            />
            <CountrySelect
              inventions={inventionsData}
              people={peopleData}
              setSelectedCountry={setSelectedCountry}
              selectedCountry={selectedCountry}
            />
          </div>
          <Outlet
            context={{
              inventionsData,
              peopleData,
              worldEventsData,
              inventionsNZData,
              peopleNZData,
              eventsNZData,
              selectedCountry,
            }}
          />
        </div>
      </div>
      <Timeline
        data={getDataForCategory(filterStatus.event)}
        people={filterStatus.people ? people : []}
        filterStatus={filterStatus}
      />
      <div className="mt-auto"></div>
      <Footer />
    </div>
  )
}

export default App
