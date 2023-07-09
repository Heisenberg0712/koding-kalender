import {
  add,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isEqual,
  isSameDay,
  isSameMonth,
  isToday,
  isWithinInterval,
  parse,
  parseISO,
  startOfToday,
} from 'date-fns'
import React from 'react'
import { useState , useEffect} from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/solid'
import { DotsVerticalIcon } from '@heroicons/react/outline';
import { Menu} from '@headlessui/react';
import KontestService from './helper/kontest';



const weekdays = ['S', 'M', 'T', 'W', 'Th', 'F', 'Sa']
function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}
export default function App() {
  let today = startOfToday()
  let [selectedDay, setSelectedDay] = useState(today)
  let [currentMonth, setCurrentMonth] = useState(format(today, 'MMM-yyyy'))
  let [kontest, setKontest] = useState([]);

  let firstDayCurrentMonth = parse(currentMonth, 'MMM-yyyy', new Date())

  
  useEffect(() => {
    async function fetchKontest() {
        await KontestService.getAll().then(
            function onfulfilled(response){
                setKontest(response['data'])
            },
            function onrejected(error){
                console.log(error)
            }
        );
    }
    fetchKontest([]);
  }, [])

  useEffect(()=>{
    function checkKontest() {
        if(kontest.length>0){
            console.log(kontest)
        }
    }
    checkKontest()
  },[kontest])
  
  let days = eachDayOfInterval({
    start: firstDayCurrentMonth,
    end: endOfMonth(firstDayCurrentMonth),
  })

  function previousMonth() {
    let firstDayNextMonth = add(firstDayCurrentMonth, { months: -1 })
    setCurrentMonth(format(firstDayNextMonth, 'MMM-yyyy'))
  }
  function nextMonth() {
    let firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 })
    setCurrentMonth(format(firstDayNextMonth, 'MMM-yyyy'))
  }
  function isDateInRange(date, startDate, endDate) {
    return date >= startDate && date <= endDate;
  }
  let selectedDayContests = kontest.filter((k) =>(
    isSameDay(selectedDay, parseISO(k['start_time']))
  )
  );

  return (
    <div className="pt-20">
      <div
        className="mx-auto max-w-md px-4 md:max-w-4xl
        md:px-6"
      >
        <div className='grid grid-rows-2 divide-y'>
            <div className="md:grid md:grid-cols-2 md:divide-x md:divide-gray-200">
            <div className="md:pr-14">
                <div className="item-center flex">
                <h2 className="flex-auto font-semibold text-gray-800 ">
                    {format(firstDayCurrentMonth, 'MMMM-yyyy')}
                </h2>
                <button
                    type="button"
                    onClick={previousMonth}
                    className="-my-1.5 flex flex-none 
                            items-center justify-center 
                            p-1.5 text-gray-400 hover:text-gray-500"
                >
                    <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                </button>
                <button
                    type="button"
                    onClick={nextMonth}
                    className="-my-1.5 -mr-1.5 ml-2 flex flex-none items-center 
                            justify-center p-1.5 text-gray-400 hover:text-gray-500"
                >
                    <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                </button>
                </div>
                <div
                className="text-sx mt-10 grid grid-cols-7 text-center leading-6 
                    text-gray-500"
                >
                {weekdays.map((weekday) => (
                    <div key={weekday.toString()}>{weekday}</div>
                ))}
                </div>
                <div className="mt-2 grid grid-cols-7 text-sm">
                {days.map((day, dayIdx) => (
                    <div
                    key={day.toString()}
                    className={classNames(
                        dayIdx === 0 && colStartClasses[getDay(day)],
                        'py-1.5'
                    )}
                    >
                    <button
                        type="button"
                        onClick={() => setSelectedDay(day)}
                        className={classNames(
                        isEqual(day, selectedDay) && 'text-white',
                        !isEqual(day, selectedDay) &&
                            isToday(day) &&
                            'text-red-400',
                        !isEqual(day, selectedDay) &&
                            !isToday(day) &&
                            isSameMonth(day, firstDayCurrentMonth) &&
                            'text-pink-900',
                        !isEqual(day, selectedDay) &&
                            !isToday(day) &&
                            !isSameMonth(day, firstDayCurrentMonth) &&
                            'text-gray-400',
                        isEqual(day, selectedDay) &&
                            isToday(day) &&
                            'bg-green-500',
                        isEqual(day, selectedDay) &&
                            !isToday(day) &&
                            'bg-blue-900',
                        !isEqual(day, selectedDay) && 'hover:bg-gray-200',
                        (isEqual(day, selectedDay) || isToday(day)) &&
                            'font-semibold',
                        'mx-auto flex h-8 w-8 items-center justify-center rounded-full'
                        )}
                    >
                        <time dateTime={format(day, 'yyyy-MM-dd')}>
                        {day.getDate()}
                        </time>
                    </button>
                    <div className="mx-auto mt-1 h-1 w-1">
                        {kontest.some((k) =>
                        isSameDay(parseISO(k['start_time']), day)
                        ) && (
                        <div className="h-1 w-1 rounded-full bg-sky-500"></div>
                        )}
                    </div>
                    </div>
                ))}
                </div>
            </div>
            <section className="mt-12 md:mt-0 md:pl-14">
                <h2 className="font-semibold text-gray-900">
                Schedule for{' '}
                <time dateTime={format(selectedDay, 'yyyy-MM-dd')}>
                    {format(selectedDay, 'MMM dd, yyy')}
                </time>
                </h2>
                <ol className="mt-4 space-y-1 text-sm leading-6 text-gray-500">
                {selectedDayContests.length > 0 ? (
                    selectedDayContests.map((contest,index) => (
                    <Meeting contest={contest} key={`${contest['start_time']}${contest['duration']}${index}`} />
                    ))
                ) : (
                    <p>No contest for this date.</p>
                )}
                </ol>
            </section>
            </div>
            <div>
                    <div className="flex justify-center">
                        <span>Upcoming contest</span>
                    </div>
                    <div className='md:grid md:grid-cols-2 md:divide-x'>
                        <div className='mx-auto'>
                            Codeforces
                            <div>
                                {
                                  <UpcomingContest contest={kontest.filter((element)=>element['site']==='CodeForces')}/>
                                }
                            </div>
                        </div>
                        <div className='mx-auto'>
                            Leetcode
                            <div>
                              {
                                <UpcomingContest contest={kontest.filter((element)=>element['site']==='LeetCode')}/>
                              }
                            </div>
                        </div>
                    </div>
            </div>
        </div>
      </div>
    </div>
  )
}
function Meeting({ contest }) {
    let startDateTime = parseISO(contest['start_time']);
    let endDateTime = parseISO(contest['end_time']);
  
    return (
      <li className="flex items-center px-4 py-2 space-x-4 group rounded-xl focus-within:bg-gray-100 hover:bg-gray-100">
        <div className="flex-auto">
          <p className="text-gray-900">{contest['name']}</p>
          <p className="mt-0.5">
            <time dateTime={contest['start_time']}>
              {format(startDateTime, 'h:mm a')}
            </time>{' '}
            -{' '}
            <time dateTime={contest['end_time']}>
              {format(endDateTime, 'h:mm a')}
            </time>
          </p>
        </div>
        
      </li>
    );
  }

function UpcomingContest({contest}){  
  return (
    <ul>
      {contest.map((contestItem, index) => (
        <li key={index}>{contestItem['name']}</li>
      ))}
    </ul>
  );
}
  

let colStartClasses = [
  '',
  'col-start-2',
  'col-start-3',
  'col-start-4',
  'col-start-5',
  'col-start-6',
  'col-start-7',
]

