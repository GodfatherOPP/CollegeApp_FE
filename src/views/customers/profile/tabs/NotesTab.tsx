/* eslint-disable react-hooks/exhaustive-deps */
// ** React Imports
import { SyntheticEvent, useEffect, useRef, useState } from 'react'
import * as Yup from 'yup'
// ** MUI Imports
import Tab from '@mui/material/Tab'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
//
import { useForm } from 'react-hook-form'
// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/store'
import { useSelector } from 'react-redux'
import { getNotes } from 'src/store/general/notes'
import { yupResolver } from '@hookform/resolvers/yup'
import NoteItem from './NoteItem'
import NotePad from './NotePad'
import CreateNoteTab from './CreateNoteTab'

type Props = {
  importedId: string
}
const NotesTab = ({ importedId }: Props) => {
  const dispatch = useDispatch<AppDispatch>()
  // const { enqueueSnackbar } = useSnackbar();
  const scrollRef = useRef<HTMLDivElement>(null)
  const availableNotes: any = useSelector((state: any) => state.notes?.notes[0]?.notes || [])

  // ** State
  const [tab, setTab] = useState<string>('1')
  const [selectedNotesCategory, setSelectedNotesCategory] = useState('1')
  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setTab(newValue)
    setSelectedNotesCategory(newValue)
  }

  const groupedNotes: any = availableNotes?.reduce((result: any, obj: any) => {
    if (!result[obj.type?.categoryId]) {
      result[obj.type?.categoryId] = []
    }
    result[obj.type?.categoryId].push(obj)

    return result
  }, {})

  useEffect(() => {
    const scrollNotesToBottom = () => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight
      }
    }
    scrollNotesToBottom()
  }, [])

  useEffect(() => {
    setNoteCategoryValue('type', ['1'])
  }, [])
  useEffect(() => {
    const fetchData = async () => {
      await dispatch(getNotes({ id: importedId }))
    }
    fetchData()
  }, [importedId])

  const NotesCategorySchema = Yup.object().shape({
    type: Yup.array()
  })
  const NoteCategoryDefaultValues = { type: ['all'] }
  const noteCategoryMethods = useForm({
    resolver: yupResolver(NotesCategorySchema),
    defaultValues: NoteCategoryDefaultValues
  })
  const setNoteCategoryValue = noteCategoryMethods.setValue

  useEffect(() => {
    if (Object.keys(groupedNotes).length !== 0) {
      setNoteCategoryValue('type', ['1'])
    }
  }, [availableNotes])

  return (
    <TabContext value={tab}>
      <TabList scrollButtons variant='scrollable' onChange={handleChange} aria-label='forced scroll tabs example'>
        <Tab value='1' label='General' icon={<Icon icon='tabler:user' />} />
        <Tab value='5' label='Sms' icon={<Icon icon='la:sms' />} />
        <Tab value='8' label='Email' icon={<Icon icon='clarity:email-line' />} />
        <Tab value='7' label='Call' icon={<Icon icon='tabler:phone' />} />
        <Tab value='newNote' label='Create Note' icon={<Icon icon='ic:outline-create' />} />
        <Tab value='internalNote' label='NotePad' icon={<Icon icon='uil:notes' />} />
      </TabList>

      <TabPanel value='1'>
        <NoteItem
          title={'All Notes'}
          notes={groupedNotes[selectedNotesCategory] || []}
          showDropDown
          onChangeOptions={(type: string) => setSelectedNotesCategory(type)}
        />
      </TabPanel>
      <TabPanel value='5'>
        <NoteItem title={'SMS Notes'} notes={groupedNotes['5'] || []} />
      </TabPanel>
      <TabPanel value='8'>
        <NoteItem title={'Email Notes'} notes={groupedNotes['8'] || []} />
      </TabPanel>
      <TabPanel value='7'>
        <NoteItem title={'Call Notes'} notes={groupedNotes['7'] || []} />
      </TabPanel>
      <TabPanel value='newNote'>
        <CreateNoteTab importedId={importedId || ''} />
      </TabPanel>
      <TabPanel value='internalNote'>
        <NotePad importedId={importedId || ''} />
      </TabPanel>
    </TabContext>
  )
}

export default NotesTab
