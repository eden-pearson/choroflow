import request from 'superagent'
import { Invention } from '../../models/Inventions'
import type { Person } from '../../models/People'
import type { Event } from '../../models/Events'

export async function getNewZealandInventionsData(): Promise<Invention[]> {
  const response = await request.get('/api/v1/newZealand/inventions')
  return response.body as Invention[]
}

export async function getNewZealandEventsData(): Promise<Event[]> {
  const response = await request.get('/api/v1/newZealand/events')
  return response.body as Event[]
}
export async function getNewZealandPeopleData(): Promise<Person[]> {
  const response = await request.get('/api/v1/newZealand/people')
  return response.body as Person[]
}
